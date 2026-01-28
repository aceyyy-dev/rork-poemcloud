import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { Crown, X, Check, Sparkles } from 'lucide-react-native';
import { PurchasesPackage } from 'react-native-purchases';
import { useTheme } from '@/contexts/ThemeContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import SubscriptionSuccessModal from '@/components/SubscriptionSuccessModal';

interface Props {
  visible: boolean;
  onClose: () => void;
  onSubscribe: () => void;
  feature?: string;
}

export default function PremiumModal({ visible, onClose, onSubscribe, feature }: Props) {
  const { colors } = useTheme();
  const { 
    annualPackage, 
    monthlyPackage,
    purchasePackage, 
    isPurchasing,
    getAnnualPrice,
    getMonthlyPrice,
    restorePurchases,
    isRestoring,
    showSuccessModal,
    hideSuccessModal,
  } = usePurchases();
  const [selectedPlan, setSelectedPlan] = useState<'annual' | 'monthly'>('annual');
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const features = [
    'Listen to poems with audio narrations',
    'Side-by-side translations',
    'Unlimited bookmarks',
    'Offline reading',
  ];

  const selectedPackage: PurchasesPackage | undefined = selectedPlan === 'annual' ? annualPackage : monthlyPackage;

  const calculateSavings = () => {
    if (!monthlyPackage || !annualPackage) return null;
    const monthlyPrice = monthlyPackage.product.price;
    const annualPrice = annualPackage.product.price;
    const yearlyMonthlyTotal = monthlyPrice * 12;
    const savings = yearlyMonthlyTotal - annualPrice;
    const percentSaved = Math.round((savings / yearlyMonthlyTotal) * 100);
    return { savings: savings.toFixed(2), percent: percentSaved };
  };

  const savingsInfo = calculateSavings();

  const handleSubscribe = async () => {
    if (!selectedPackage) {
      console.log('[PremiumModal] No package available');
      onSubscribe();
      onClose();
      return;
    }
    try {
      console.log('[PremiumModal] Starting purchase...');
      await purchasePackage(selectedPackage);
      console.log('[PremiumModal] Purchase successful');
    } catch (error: any) {
      console.log('[PremiumModal] Purchase error:', error);
      if (error.userCancelled) {
        console.log('[PremiumModal] Purchase cancelled by user');
      } else {
        console.error('[PremiumModal] Purchase failed with error:', error);
      }
    }
  };

  const handleSuccessComplete = () => {
    hideSuccessModal();
    onSubscribe();
    onClose();
  };

  const handleRestore = async () => {
    try {
      await restorePurchases();
      onClose();
    } catch {
      console.log('[PremiumModal] Restore failed');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]} />
      </Pressable>
      
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={[styles.crownContainer, { backgroundColor: colors.premiumLight }]}>
            <Crown size={24} color={colors.accent} strokeWidth={1.5} />
          </View>
          <Text style={[styles.title, { color: colors.primary }]}>Unlock PoemCloud+</Text>
          {feature && (
            <Text style={[styles.featureText, { color: colors.textMuted }]}>
              {feature} is a premium feature
            </Text>
          )}
        </View>

        <View style={styles.features}>
          {features.map((feat, index) => (
            <View key={index} style={styles.featureRow}>
              <View style={[styles.checkContainer, { backgroundColor: colors.accent }]}>
                <Check size={12} color={colors.textWhite} strokeWidth={2.5} />
              </View>
              <Text style={[styles.featureLabel, { color: colors.text }]}>{feat}</Text>
            </View>
          ))}
        </View>

        <View style={styles.planSelector}>
          <TouchableOpacity
            style={[
              styles.planOption,
              { 
                borderColor: selectedPlan === 'annual' ? colors.accent : colors.border,
                backgroundColor: selectedPlan === 'annual' ? colors.premiumLight : 'transparent',
              },
            ]}
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.7}
          >
            {savingsInfo && (
              <View style={[styles.savingsBadge, { backgroundColor: colors.accent }]}>
                <Sparkles size={10} color={colors.textWhite} />
                <Text style={[styles.savingsBadgeText, { color: colors.textWhite }]}>Save {savingsInfo.percent}%</Text>
              </View>
            )}
            <View style={styles.planDetails}>
              <Text style={[styles.planName, { color: colors.primary }]}>Annual</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>{getAnnualPrice()}/year</Text>
              {monthlyPackage && annualPackage && (
                <Text style={[styles.planSubtext, { color: colors.textMuted }]}>
                  {annualPackage.product.currencyCode} {(annualPackage.product.price / 12).toFixed(2)}/month
                </Text>
              )}
            </View>
            <View style={[
              styles.radioOuter,
              { borderColor: selectedPlan === 'annual' ? colors.accent : colors.border }
            ]}>
              {selectedPlan === 'annual' && (
                <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.planOption,
              { 
                borderColor: selectedPlan === 'monthly' ? colors.accent : colors.border,
                backgroundColor: selectedPlan === 'monthly' ? colors.premiumLight : 'transparent',
              },
            ]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.7}
          >
            <View style={styles.planDetails}>
              <Text style={[styles.planName, { color: colors.primary }]}>Monthly</Text>
              <Text style={[styles.planPrice, { color: colors.text }]}>{getMonthlyPrice()}/month</Text>
            </View>
            <View style={[
              styles.radioOuter,
              { borderColor: selectedPlan === 'monthly' ? colors.accent : colors.border }
            ]}>
              {selectedPlan === 'monthly' && (
                <View style={[styles.radioInner, { backgroundColor: colors.accent }]} />
              )}
            </View>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
          disabled={isPurchasing || isRestoring}
        >
          {isPurchasing ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={[styles.subscribeButtonText, { color: colors.background }]}>
              Start PoemCloud+
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.laterButton} 
          onPress={onClose}
          disabled={isPurchasing || isRestoring}
        >
          <Text style={[styles.laterButtonText, { color: colors.text }]}>Maybe later</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.restoreButton} 
          onPress={handleRestore}
          disabled={isPurchasing || isRestoring}
        >
          {isRestoring ? (
            <ActivityIndicator size="small" color={colors.textMuted} />
          ) : (
            <Text style={[styles.restoreButtonText, { color: colors.textMuted }]}>Restore Purchases</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
      
      <SubscriptionSuccessModal 
        visible={showSuccessModal}
        onComplete={handleSuccessComplete}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  crownContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 15,
    textAlign: 'center',
  },
  features: {
    marginBottom: 24,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  checkContainer: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureLabel: {
    fontSize: 15,
  },
  planSelector: {
    gap: 12,
    marginBottom: 20,
  },
  planOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    position: 'relative',
  },
  planDetails: {
    flex: 1,
  },
  planName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  planPrice: {
    fontSize: 15,
    fontWeight: '500',
  },
  planSubtext: {
    fontSize: 13,
    marginTop: 2,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  savingsBadge: {
    position: 'absolute',
    top: -10,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  savingsBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  laterButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  laterButtonText: {
    fontSize: 15,
  },
  restoreButton: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 13,
  },
});
