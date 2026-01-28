import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback } from 'react';
import { Platform, Alert, Linking } from 'react-native';
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query';
import Purchases, { 
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';

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

export const [PurchasesProvider, usePurchases] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [isConfigured] = useState(!!apiKey);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const customerInfoQuery = useQuery({
    queryKey: ['customerInfo'],
    queryFn: async () => {
      if (!isConfigured) return null;
      try {
        const info = await Purchases.getCustomerInfo();
        console.log('[RevenueCat] Customer info fetched:', info.activeSubscriptions);
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
      console.log('[RevenueCat] Purchase successful');
      queryClient.setQueryData(['customerInfo'], customerInfo);
      const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
      if (isPremium) {
        setShowSuccessModal(true);
      }
    },
    onError: (error: any) => {
      if (error?.userCancelled) {
        console.log('[RevenueCat] Purchase cancelled by user');
        return;
      }
      const errorMessage = error?.message || (typeof error === 'object' ? JSON.stringify(error) : String(error));
      console.error('[RevenueCat] Purchase error:', errorMessage);
      Alert.alert('Purchase Failed', errorMessage || 'An error occurred during purchase.');
    },
  });

  const restoreMutation = useMutation({
    mutationFn: async () => {
      console.log('[RevenueCat] Restoring purchases');
      const customerInfo = await Purchases.restorePurchases();
      return customerInfo;
    },
    onSuccess: (customerInfo) => {
      console.log('[RevenueCat] Restore successful');
      queryClient.setQueryData(['customerInfo'], customerInfo);
      const isPremium = customerInfo.entitlements.active['premium'] !== undefined;
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
      console.log('[RevenueCat] Customer info updated');
      queryClient.setQueryData(['customerInfo'], info);
    };

    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [isConfigured, queryClient]);

  const isPremium = customerInfoQuery.data?.entitlements.active['premium'] !== undefined;
  const willRenew = customerInfoQuery.data?.entitlements.active['premium']?.willRenew ?? false;
  const expirationDate = customerInfoQuery.data?.entitlements.active['premium']?.expirationDate;
  const productIdentifier = customerInfoQuery.data?.entitlements.active['premium']?.productIdentifier;

  const currentOffering = offeringsQuery.data?.current;

  const monthlyPackage = currentOffering?.availablePackages.find(
    (pkg) => pkg.packageType === 'MONTHLY' || pkg.identifier === '$rc_monthly'
  );

  const annualPackage = currentOffering?.availablePackages.find(
    (pkg) => pkg.packageType === 'ANNUAL' || pkg.identifier === '$rc_annual'
  );

  const purchasePackage = useCallback(async (pkg: PurchasesPackage) => {
    return purchaseMutation.mutateAsync(pkg);
  }, [purchaseMutation.mutateAsync]);

  const restorePurchases = useCallback(async () => {
    return restoreMutation.mutateAsync();
  }, [restoreMutation.mutateAsync]);

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
    getMonthlyPrice,
    getAnnualPrice,
    manageSubscription,
    customerInfo: customerInfoQuery.data,
    showSuccessModal,
    hideSuccessModal,
  };
});
