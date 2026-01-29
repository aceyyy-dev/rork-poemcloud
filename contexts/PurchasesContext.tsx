import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Purchases, { 
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

const ENTITLEMENT_ID = 'premium';

function getRCToken() {
  if (__DEV__ || Platform.OS === 'web') {
    return process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
  }
  return Platform.select({
    ios: process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY,
    android: process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY,
    default: process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY,
  });
}

const apiKey = getRCToken();
if (apiKey) {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey });
  console.log('[RevenueCat] Configured with API key');
} else {
  console.warn('[RevenueCat] No API key found');
}

type PurchaseResult = 'success' | 'cancelled' | 'error' | null;

export const [PurchasesProvider, usePurchases] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isConfigured] = useState(!!apiKey);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastPurchaseResult, setLastPurchaseResult] = useState<PurchaseResult>(null);
  const onSuccessCallbackRef = useRef<(() => void) | null>(null);

  const customerInfoQuery = useQuery({
    queryKey: ['customerInfo'],
    queryFn: async () => {
      if (!isConfigured) return null;
      try {
        const info = await Purchases.getCustomerInfo();
        const isPremium = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
        console.log('[RevenueCat] Customer info fetched');
        console.log('[RevenueCat] Entitlement ID:', ENTITLEMENT_ID);
        console.log('[RevenueCat] isPremium:', isPremium);
        console.log('[RevenueCat] Active subscriptions:', info.activeSubscriptions);
        return info;
      } catch (error) {
        console.error('[RevenueCat] Error fetching customer info:', error);
        return null;
      }
    },
    enabled: isConfigured,
    staleTime: 1000 * 60 * 5,
  });

  const offeringsQuery = useQuery({
    queryKey: ['offerings'],
    queryFn: async () => {
      if (!isConfigured) return null;
      try {
        const offerings = await Purchases.getOfferings();
        console.log('[RevenueCat] Offerings fetched:', offerings.current?.identifier);
        return offerings;
      } catch (error) {
        console.error('[RevenueCat] Error fetching offerings:', error);
        return null;
      }
    },
    enabled: isConfigured,
    staleTime: 1000 * 60 * 10,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (pkg: PurchasesPackage) => {
      console.log('[RevenueCat] Purchasing package:', pkg.identifier);
      const { customerInfo } = await Purchases.purchasePackage(pkg);
      return customerInfo;
    },
    onSuccess: (customerInfo) => {
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      console.log('[RevenueCat] Purchase successful');
      console.log('[RevenueCat] Purchase result: success');
      console.log('[RevenueCat] isPremium after purchase:', isPremium);
      queryClient.setQueryData(['customerInfo'], customerInfo);
      setLastPurchaseResult('success');
      if (isPremium) {
        setShowSuccessModal(true);
      }
    },
    onError: (error: any) => {
      if (error?.userCancelled) {
        console.log('[RevenueCat] Purchase result: cancelled');
        setLastPurchaseResult('cancelled');
        return;
      }
      const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      console.error('[RevenueCat] Purchase result: error');
      console.error('[RevenueCat] Purchase error:', errorMessage);
      setLastPurchaseResult('error');
      Alert.alert('Purchase Failed', 'An error occurred during purchase. Please try again.');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      console.log('[RevenueCat] Restoring purchases');
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    },
    onSuccess: (customerInfo) => {
      const isPremium = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;
      console.log('[RevenueCat] Restore successful');
      console.log('[RevenueCat] isPremium after restore:', isPremium);
      queryClient.setQueryData(['customerInfo'], customerInfo);
      if (isPremium) {
        Alert.alert('Restored!', 'Your PoemCloud+ subscription has been restored.');
      } else {
        Alert.alert('No Subscription Found', 'No active subscription was found to restore.');
      }
    },
    onError: (error: any) => {
      console.error('[RevenueCat] Restore error:', error);
      Alert.alert('Restore Failed', error.message || 'An error occurred while restoring purchases.');
    },
  });

  useEffect(() => {
    if (!isConfigured) return;

    const listener = (info: CustomerInfo) => {
      const isPremium = info.entitlements.active[ENTITLEMENT_ID] !== undefined;
      console.log('[RevenueCat] Customer info updated via listener');
      console.log('[RevenueCat] isPremium (listener):', isPremium);
      queryClient.setQueryData(['customerInfo'], info);
    };

    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [isConfigured, queryClient]);

  const isPremium = customerInfoQuery.data?.entitlements.active[ENTITLEMENT_ID] !== undefined;
  const willRenew = customerInfoQuery.data?.entitlements.active[ENTITLEMENT_ID]?.willRenew ?? false;
  const expirationDate = customerInfoQuery.data?.entitlements.active[ENTITLEMENT_ID]?.expirationDate;
  const productIdentifier = customerInfoQuery.data?.entitlements.active[ENTITLEMENT_ID]?.productIdentifier;

  const currentOffering = offeringsQuery.data?.current;

  const monthlyPackage = currentOffering?.availablePackages.find(
    (pkg) => pkg.packageType === 'MONTHLY' || pkg.identifier === '$rc_monthly'
  );

  const annualPackage = currentOffering?.availablePackages.find(
    (pkg) => pkg.packageType === 'ANNUAL' || pkg.identifier === '$rc_annual'
  );

  const purchasePackage = useCallback(async (pkg: PurchasesPackage) => {
    setLastPurchaseResult(null);
    return purchaseMutation.mutateAsync(pkg);
  }, [purchaseMutation]);

  const restorePurchases = useCallback(async () => {
    return restoreMutation.mutateAsync();
  }, [restoreMutation]);

  const refreshEntitlement = useCallback(async () => {
    console.log('[RevenueCat] Refreshing entitlement...');
    await queryClient.invalidateQueries({ queryKey: ['customerInfo'] });
  }, [queryClient]);

  const getMonthlyPrice = useCallback(() => {
    return monthlyPackage?.product.priceString || '$9.99';
  }, [monthlyPackage]);

  const getAnnualPrice = useCallback(() => {
    return annualPackage?.product.priceString || '$39.99';
  }, [annualPackage]);

  const manageSubscription = useCallback(async () => {
    try {
      if (Platform.OS === 'ios') {
        await Linking.openURL('https://apps.apple.com/account/subscriptions');
      } else if (Platform.OS === 'android') {
        await Linking.openURL('https://play.google.com/store/account/subscriptions');
      } else {
        Alert.alert('Manage Subscription', 'Please manage your subscription through your device settings.');
      }
    } catch (error) {
      console.error('[RevenueCat] Error opening subscription management:', error);
      Alert.alert('Error', 'Could not open subscription management.');
    }
  }, []);

  const hideSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
    setTimeout(() => {
      if (onSuccessCallbackRef.current) {
        onSuccessCallbackRef.current();
        onSuccessCallbackRef.current = null;
      }
    }, 100);
  }, []);

  const setOnSuccessCallback = useCallback((callback: () => void) => {
    onSuccessCallbackRef.current = callback;
  }, []);

  return {
    isConfigured,
    isPremium,
    willRenew,
    expirationDate,
    productIdentifier,
    isLoading: customerInfoQuery.isLoading || offeringsQuery.isLoading,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
    currentOffering,
    monthlyPackage,
    annualPackage,
    purchasePackage,
    restorePurchases,
    refreshEntitlement,
    getMonthlyPrice,
    getAnnualPrice,
    manageSubscription,
    customerInfo: customerInfoQuery.data,
    showSuccessModal,
    hideSuccessModal,
    setOnSuccessCallback,
    lastPurchaseResult,
    entitlementId: ENTITLEMENT_ID,
  };
});
