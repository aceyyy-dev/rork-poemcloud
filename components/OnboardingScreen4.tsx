import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Crown, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import SubscriptionSuccessModal from '@/components/SubscriptionSuccessModal';
import { triggerHaptic } from '@/utils/haptics';

interface Props {
  onSubscribe: () => void;
  onSkip: () => void;
  onBack: () => void;
}

export default function OnboardingScreen4({ onSubscribe, onSkip, onBack }: Props) {
  const { colors } = useTheme();
  const { 
    monthlyPackage, 
    annualPackage, 
    purchasePackage, 
    isPurchasing,
    getMonthlyPrice,
    getAnnualPrice,
    showSuccessModal,
    hideSuccessModal,
  } = usePurchases();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  const features = [
    'Audio narrations',
    'Side-by-side translations',
    'Unlimited bookmarks',
    'Offline reading',
  ];

  const handleSubscribe = async () => {
    triggerHaptic('medium');
    const pkg = selectedPlan === 'yearly' ? annualPackage : monthlyPackage;
    if (!pkg) {
      console.log('[Onboarding] No package available, completing onboarding');
      onSubscribe();
      return;
    }
    try {
      console.log('[Onboarding] Starting purchase...');
      await purchasePackage(pkg);
      console.log('[Onboarding] Purchase successful');
    } catch (error: any) {
      console.log('[Onboarding] Purchase error:', error);
      if (error.userCancelled) {
        console.log('[Onboarding] Purchase cancelled by user');
        return;
      } else {
        console.error('[Onboarding] Purchase failed with error:', error);
        triggerHaptic('error');
      }
    }
  };

  const handleSuccessComplete = () => {
    hideSuccessModal();
    onSubscribe();
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.background]}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
          ]}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => { triggerHaptic('light'); onBack(); }} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
              <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.backButton} />
          </View>

          <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleSection}>
              <View style={[styles.crownContainer, { backgroundColor: colors.premiumLight }]}>
                <Crown size={28} color={colors.accent} strokeWidth={1.5} />
              </View>
              <Text style={[styles.title, { color: colors.primary }]}>
                Unlock the Full Experience
              </Text>
              <Text style={[styles.subtitle, { color: colors.textLight }]}>
                Unlimited access to audio, translations, and more.
              </Text>
            </View>

            <View style={styles.features}>
              {features.map((feature, index) => (
                <View key={index} style={styles.featureRow}>
                  <View style={[styles.checkContainer, { backgroundColor: colors.accent }]}>
                    <Check size={14} color={colors.textWhite} strokeWidth={2.5} />
                  </View>
                  <Text style={[styles.featureText, { color: colors.text }]}>{feature}</Text>
                </View>
              ))}
            </View>

            <View style={styles.plans}>
              <TouchableOpacity
                style={[
                  styles.planCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedPlan === 'yearly' && { borderColor: colors.primary, backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() => { triggerHaptic('light'); setSelectedPlan('yearly'); }}
                activeOpacity={0.8}
              >
                <View style={[styles.planBadge, { backgroundColor: colors.accent }]}>
                  <Text style={[styles.planBadgeText, { color: colors.textWhite }]}>Best Value</Text>
                </View>
                <View style={styles.planContent}>
                  <Text style={[styles.planName, { color: colors.primary }]}>Yearly</Text>
                  <Text style={[styles.planPrice, { color: colors.primary }]}>{getAnnualPrice()}</Text>
                  <Text style={[styles.planPeriod, { color: colors.textMuted }]}>per year</Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: colors.border },
                    selectedPlan === 'yearly' && { borderColor: colors.primary },
                  ]}
                >
                  {selectedPlan === 'yearly' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.planCard,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedPlan === 'monthly' && { borderColor: colors.primary, backgroundColor: colors.surfaceSecondary },
                ]}
                onPress={() => { triggerHaptic('light'); setSelectedPlan('monthly'); }}
                activeOpacity={0.8}
              >
                <View style={styles.planContent}>
                  <Text style={[styles.planName, { color: colors.primary }]}>Monthly</Text>
                  <Text style={[styles.planPrice, { color: colors.primary }]}>{getMonthlyPrice()}</Text>
                  <Text style={[styles.planPeriod, { color: colors.textMuted }]}>per month</Text>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: colors.border },
                    selectedPlan === 'monthly' && { borderColor: colors.primary },
                  ]}
                >
                  {selectedPlan === 'monthly' && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </TouchableOpacity>
            </View>

            <Text style={[styles.anchor, { color: colors.textMuted }]}>
              Monthly is $119/year — save $80 with yearly
            </Text>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.subscribeButton, { backgroundColor: colors.primary }]}
              onPress={handleSubscribe}
              activeOpacity={0.8}
              disabled={isPurchasing}
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
              style={styles.skipButton}
              onPress={() => { triggerHaptic('light'); onSkip(); }}
              activeOpacity={0.7}
            >
              <Text style={[styles.skipButtonText, { color: colors.text }]}>
                Continue with Free Plan
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
      </View>
      
      <SubscriptionSuccessModal 
        visible={showSuccessModal}
        onComplete={handleSuccessComplete}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 4,
  },
  crownContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  features: {
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  checkContainer: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: 15,
    flex: 1,
  },
  plans: {
    gap: 10,
    marginBottom: 10,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    position: 'relative',
    overflow: 'hidden',
  },
  planBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderBottomLeftRadius: 8,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  planContent: {
    flex: 1,
  },
  planName: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
  },
  planPeriod: {
    fontSize: 13,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  anchor: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 8,
  },
  footer: {
    gap: 10,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  subscribeButton: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  subscribeButtonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
