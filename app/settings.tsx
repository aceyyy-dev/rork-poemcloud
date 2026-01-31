import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  ActivityIndicator,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  X,
  Heart,
  Globe,
  Crown,
  Image,
  HelpCircle,
  Info,
  ChevronRight,
  Bell,
  Check,
  FileText,
  LogOut,
  Trash2,
  Palette,
  Scan,
  Fingerprint,
  Mail,
  Smartphone,
  Send,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useWallpaper, wallpapers, WallpaperId } from '@/contexts/WallpaperContext';
import { useUser } from '@/contexts/UserContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import { useAuth } from '@/contexts/AuthContext';
import { useBiometric } from '@/contexts/BiometricContext';
import { countries } from '@/mocks/countries';
import { Mood } from '@/types';
import { premiumColorThemes, ThemeId } from '@/constants/colors';
import PremiumModal from '@/components/PremiumModal';
import FeaturePremiumModal from '@/components/FeaturePremiumModal';
import { triggerHaptic } from '@/utils/haptics';
import { useNotifications } from '@/contexts/NotificationContext';

const MOODS: Mood[] = ['calm', 'sad', 'love', 'hope', 'melancholy', 'healing', 'longing', 'joy', 'reflection'];
const MIN_MOODS = 3;
const MAX_MOODS = 6;

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, themeId, setTheme, isDark, currentThemeName, isPremiumTheme } = useTheme();
  const { wallpaperId, setWallpaper, currentWallpaper } = useWallpaper();
  const { preferences, updatePreferences } = useUser();
  const { isPremium, restorePurchases, isRestoring, manageSubscription, willRenew, expirationDate } = usePurchases();
  const { isLoggedIn, user, signOut, token } = useAuth();
  const { 
    isAvailable: biometricAvailable, 
    isEnrolled: biometricEnrolled, 
    isEnabled: biometricEnabled,
    getBiometricTypeName,
    biometricType,
    enableBiometric,
    disableBiometric,
  } = useBiometric();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showThemeFeatureModal, setShowThemeFeatureModal] = useState(false);
  const [showMoodsModal, setShowMoodsModal] = useState(false);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showWallpaperModal, setShowWallpaperModal] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>(preferences.moods);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(preferences.countries);
  const [isBiometricToggling, setIsBiometricToggling] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [tempEmail, setTempEmail] = useState('');
  const [tempPhone, setTempPhone] = useState('');

  const {
    preferences: notifPrefs,
    toggleDailyPush,
    toggleDailyEmail,
    toggleDailySms,
    setEmailAddress,
    setPhoneNumber,
    smsAvailable,
    emailAvailable,
    sendDailyPoemEmail,
    sendDailyPoemSms,
  } = useNotifications();

  const biometricName = getBiometricTypeName();
  const isFaceId = biometricType === 'face' && Platform.OS === 'ios';
  const canShowBiometricSetting = biometricAvailable && biometricEnrolled && isLoggedIn && Platform.OS !== 'web';

  const handleBiometricToggle = async (value: boolean) => {
    if (isBiometricToggling) return;
    setIsBiometricToggling(true);
    triggerHaptic('light');
    
    try {
      if (value && user && token) {
        const success = await enableBiometric(user.id, token);
        if (success) {
          triggerHaptic('success');
          Alert.alert('Enabled', `${biometricName} login is now enabled.`);
        }
      } else {
        await disableBiometric();
        Alert.alert('Disabled', `${biometricName} login has been disabled.`);
      }
    } catch (error) {
      console.error('[Settings] Biometric toggle error:', error);
    } finally {
      setIsBiometricToggling(false);
    }
  };

  const toggleMood = (mood: Mood) => {
    triggerHaptic('light');
    if (selectedMoods.includes(mood)) {
      if (selectedMoods.length > MIN_MOODS) {
        setSelectedMoods(selectedMoods.filter(m => m !== mood));
      }
    } else if (selectedMoods.length < MAX_MOODS) {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const toggleCountry = (code: string) => {
    triggerHaptic('light');
    if (code === 'ALL') {
      setSelectedCountries(['ALL']);
    } else {
      const filtered = selectedCountries.filter(c => c !== 'ALL');
      if (filtered.includes(code)) {
        if (filtered.length > 1) {
          setSelectedCountries(filtered.filter(c => c !== code));
        }
      } else {
        setSelectedCountries([...filtered, code]);
      }
    }
  };

  const saveMoods = () => {
    if (selectedMoods.length >= MIN_MOODS) {
      updatePreferences({ moods: selectedMoods });
      setShowMoodsModal(false);
    }
  };

  const saveCountries = () => {
    if (selectedCountries.length >= 1) {
      updatePreferences({ countries: selectedCountries });
      setShowCountriesModal(false);
    }
  };

  const openMoodsModal = () => {
    setSelectedMoods(preferences.moods.length > 0 ? preferences.moods : []);
    setShowMoodsModal(true);
  };

  const openCountriesModal = () => {
    setSelectedCountries(preferences.countries.length > 0 ? preferences.countries : []);
    setShowCountriesModal(true);
  };

  const handleThemeSelect = (newThemeId: ThemeId) => {
    const isPremiumColorTheme = premiumColorThemes.some(t => t.id === newThemeId);
    
    if (isPremiumColorTheme && !isPremium) {
      triggerHaptic('medium');
      setShowThemeModal(false);
      setTimeout(() => setShowThemeFeatureModal(true), 300);
      return;
    }
    
    triggerHaptic('light');
    setTheme(newThemeId);
  };

  const handleWallpaperSelect = (newWallpaperId: WallpaperId) => {
    if (!isPremium) {
      triggerHaptic('medium');
      setShowWallpaperModal(false);
      setTimeout(() => setShowPremiumModal(true), 300);
      return;
    }
    
    triggerHaptic('light');
    setWallpaper(newWallpaperId);
  };

  const getWallpaperName = () => {
    if (wallpaperId === 'none') return 'None';
    return currentWallpaper?.name || 'None';
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Settings</Text>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surface }]}
            onPress={() => { triggerHaptic('light'); router.back(); }}
          >
            <X size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>APPEARANCE</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <TouchableOpacity 
                style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}
                onPress={() => { triggerHaptic('light'); setShowThemeModal(true); }}
              >
                <View style={styles.settingLeft}>
                  <Palette size={20} color={colors.textLight} strokeWidth={1.5} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.primary }]}>Theme</Text>
                    <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                      {currentThemeName}
                      {isPremiumTheme && ' ✦'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => { 
                  triggerHaptic('light'); 
                  if (!isPremium) {
                    setShowPremiumModal(true);
                  } else {
                    setShowWallpaperModal(true);
                  }
                }}
              >
                <View style={styles.settingLeft}>
                  <Image size={20} color={colors.textLight} strokeWidth={1.5} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.primary }]}>Background</Text>
                    <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                      {getWallpaperName()}
                      {wallpaperId !== 'none' && ' ✦'}
                    </Text>
                  </View>
                </View>
                {!isPremium ? (
                  <Crown size={18} color={colors.accent} />
                ) : (
                  <ChevronRight size={20} color={colors.textMuted} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>PREFERENCES</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <TouchableOpacity 
                style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}
                onPress={openMoodsModal}
              >
                <View style={styles.settingLeft}>
                  <Heart size={20} color={colors.textLight} strokeWidth={1.5} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.primary }]}>Moods</Text>
                    <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                      {preferences.moods.length > 0 ? preferences.moods.slice(0, 3).join(', ') : 'Not set'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}
                onPress={openCountriesModal}
              >
                <View style={styles.settingLeft}>
                  <Globe size={20} color={colors.textLight} strokeWidth={1.5} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.primary }]}>Countries</Text>
                    <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                      {preferences.countries.includes('ALL') 
                        ? 'All countries' 
                        : preferences.countries.length > 0 
                          ? `${preferences.countries.length} selected`
                          : 'Not set'
                      }
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => {
                  triggerHaptic('light');
                  setTempEmail(notifPrefs.emailAddress);
                  setTempPhone(notifPrefs.phoneNumber);
                  setShowNotificationModal(true);
                }}
              >
                <View style={styles.settingLeft}>
                  <Bell size={20} color={colors.textLight} strokeWidth={1.5} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.primary }]}>Daily Poem Delivery</Text>
                    <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                      {notifPrefs.dailyPushEnabled || notifPrefs.dailyEmailEnabled || notifPrefs.dailySmsEnabled
                        ? 'Enabled'
                        : 'Not configured'}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>


          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SUBSCRIPTION</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={[styles.subscriptionRow, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.subscriptionInfo}>
                  <Crown
                    size={24}
                    color={isPremium ? colors.accent : colors.textMuted}
                    strokeWidth={1.5}
                  />
                  <View style={styles.subscriptionText}>
                    <Text style={[styles.subscriptionLabel, { color: colors.primary }]}>
                      {isPremium ? 'PoemCloud+' : 'Free Plan'}
                    </Text>
                    <Text style={[styles.subscriptionValue, { color: colors.textMuted }]}>
                      {isPremium 
                        ? 'All features unlocked'
                        : 'Limited features'
                      }
                    </Text>
                  </View>
                </View>
              </View>
              
              {!isPremium && (
                <TouchableOpacity
                  style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
                  onPress={() => { triggerHaptic('medium'); setShowPremiumModal(true); }}
                >
                  <Text style={[styles.upgradeButtonText, { color: colors.textWhite }]}>
                    Upgrade to PoemCloud+
                  </Text>
                </TouchableOpacity>
              )}

              {isPremium && (
                <TouchableOpacity 
                  style={styles.manageButton}
                  onPress={manageSubscription}
                >
                  <Text style={[styles.manageButtonText, { color: colors.accent }]}>
                    Manage Subscription
                  </Text>
                  {!willRenew && expirationDate && (
                    <Text style={[styles.subscriptionNote, { color: colors.textMuted }]}>
                      Active until {new Date(expirationDate).toLocaleDateString()}
                    </Text>
                  )}
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.restoreButton}
                onPress={restorePurchases}
                disabled={isRestoring}
              >
                {isRestoring ? (
                  <ActivityIndicator size="small" color={colors.textMuted} />
                ) : (
                  <Text style={[styles.restoreButtonText, { color: colors.textMuted }]}>
                    Restore Purchases
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SUPPORT</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <TouchableOpacity 
                style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}
                onPress={() => router.push('/help-faq')}
              >
                <View style={styles.settingLeft}>
                  <HelpCircle size={20} color={colors.textLight} strokeWidth={1.5} />
                  <Text style={[styles.settingLabel, { color: colors.primary }]}>Help & FAQ</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}
                onPress={() => router.push('/about')}
              >
                <View style={styles.settingLeft}>
                  <Info size={20} color={colors.textLight} strokeWidth={1.5} />
                  <Text style={[styles.settingLabel, { color: colors.primary }]}>About</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.settingRow}
                onPress={() => router.push('/terms')}
              >
                <View style={styles.settingLeft}>
                  <FileText size={20} color={colors.textLight} strokeWidth={1.5} />
                  <Text style={[styles.settingLabel, { color: colors.primary }]}>Terms of Service</Text>
                </View>
                <ChevronRight size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {isLoggedIn && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>ACCOUNT</Text>
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                {canShowBiometricSetting && (
                  <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
                    <View style={styles.settingLeft}>
                      {isFaceId ? (
                        <Scan size={20} color={colors.textLight} strokeWidth={1.5} />
                      ) : (
                        <Fingerprint size={20} color={colors.textLight} strokeWidth={1.5} />
                      )}
                      <View style={styles.settingText}>
                        <Text style={[styles.settingLabel, { color: colors.primary }]}>
                          {biometricName} Login
                        </Text>
                        <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                          Quick sign in with {biometricName}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={biometricEnabled}
                      onValueChange={handleBiometricToggle}
                      trackColor={{ false: colors.border, true: colors.accent }}
                      thumbColor={colors.textWhite}
                      disabled={isBiometricToggling}
                    />
                  </View>
                )}

                {!biometricEnrolled && biometricAvailable && isLoggedIn && Platform.OS !== 'web' && (
                  <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
                    <View style={styles.settingLeft}>
                      {isFaceId ? (
                        <Scan size={20} color={colors.textMuted} strokeWidth={1.5} />
                      ) : (
                        <Fingerprint size={20} color={colors.textMuted} strokeWidth={1.5} />
                      )}
                      <View style={styles.settingText}>
                        <Text style={[styles.settingLabel, { color: colors.textMuted }]}>
                          {biometricName} Login
                        </Text>
                        <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                          Set up {biometricName} in device settings
                        </Text>
                      </View>
                    </View>
                  </View>
                )}

                <TouchableOpacity 
                  style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}
                  onPress={() => {
                    Alert.alert(
                      'Sign Out',
                      'Are you sure you want to sign out?',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Sign Out',
                          style: 'destructive',
                          onPress: async () => {
                            await signOut();
                          },
                        },
                      ]
                    );
                  }}
                >
                  <View style={styles.settingLeft}>
                    <LogOut size={20} color={colors.textLight} strokeWidth={1.5} />
                    <Text style={[styles.settingLabel, { color: colors.primary }]}>Sign Out</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textMuted} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.settingRow}
                  onPress={() => {
                    Alert.alert(
                      'Delete Account',
                      'This action cannot be undone. All your data will be permanently deleted.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            console.log('[Settings] Deleting account:', user?.id);
                            await signOut();
                            Alert.alert('Account Deleted', 'Your account has been deleted.');
                          },
                        },
                      ]
                    );
                  }}
                >
                  <View style={styles.settingLeft}>
                    <Trash2 size={20} color="#EF4444" strokeWidth={1.5} />
                    <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Delete Account</Text>
                  </View>
                  <ChevronRight size={20} color={colors.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          )}

          <Text style={[styles.version, { color: colors.textMuted }]}>
            PoemCloud v1.0.0
          </Text>
        </ScrollView>
      </SafeAreaView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={() => {
          setShowPremiumModal(false);
        }}
      />

      <FeaturePremiumModal
        visible={showThemeFeatureModal}
        onClose={() => setShowThemeFeatureModal(false)}
        onUpgrade={() => {
          setShowThemeFeatureModal(false);
          setShowPremiumModal(true);
        }}
        feature="theme"
      />

      <Modal
        visible={showThemeModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowThemeModal(false)}>
                <X size={24} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Choose Theme</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.themeScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.themeSectionLabel, { color: colors.textMuted }]}>FREE THEMES</Text>
              <View style={styles.themeGrid}>
                {[
                  { id: 'light' as ThemeId, name: 'Light', colors: { bg: '#f5f9fc', card: '#ffffff', accent: '#4a90a4' } },
                  { id: 'dark' as ThemeId, name: 'Dark', colors: { bg: '#0d1a24', card: '#162836', accent: '#6ab0c9' } },
                  { id: 'system' as ThemeId, name: 'System', colors: { bg: isDark ? '#0d1a24' : '#f5f9fc', card: isDark ? '#162836' : '#ffffff', accent: isDark ? '#6ab0c9' : '#4a90a4' } },
                ].map((theme) => {
                  const isSelected = themeId === theme.id;
                  return (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.themeCard,
                        { borderColor: isSelected ? colors.accent : colors.border },
                        isSelected && styles.themeCardSelected,
                      ]}
                      onPress={() => handleThemeSelect(theme.id)}
                    >
                      <View style={[styles.themePreview, { backgroundColor: theme.colors.bg }]}>
                        <View style={[styles.themePreviewCard, { backgroundColor: theme.colors.card }]}>
                          <View style={[styles.themePreviewLine, { backgroundColor: theme.colors.accent }]} />
                          <View style={[styles.themePreviewLineShort, { backgroundColor: theme.colors.accent, opacity: 0.5 }]} />
                        </View>
                      </View>
                      <View style={styles.themeInfo}>
                        <Text style={[styles.themeName, { color: colors.primary }]}>{theme.name}</Text>
                        {isSelected && <Check size={16} color={colors.accent} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.premiumThemesHeader}>
                <Text style={[styles.themeSectionLabel, { color: colors.textMuted }]}>POEMCLOUD+ COLOR THEMES</Text>
                {!isPremium && (
                  <View style={[styles.premiumBadge, { backgroundColor: colors.accentLight }]}>
                    <Crown size={12} color={colors.accent} />
                    <Text style={[styles.premiumBadgeText, { color: colors.accent }]}>Premium</Text>
                  </View>
                )}
              </View>

              <View style={styles.themeGrid}>
                {premiumColorThemes.map((theme) => {
                  const isSelected = themeId === theme.id;
                  const previewColors = theme.previewColors;
                  const isLocked = !isPremium;
                  
                  return (
                    <TouchableOpacity
                      key={theme.id}
                      style={[
                        styles.themeCard,
                        { borderColor: isSelected ? colors.accent : colors.border },
                        isSelected && styles.themeCardSelected,
                      ]}
                      onPress={() => handleThemeSelect(theme.id)}
                    >
                      <View style={[styles.themePreview, { backgroundColor: previewColors.bg }]}>
                        <View style={[styles.themePreviewCard, { backgroundColor: previewColors.card }]}>
                          <View style={[styles.themePreviewLine, { backgroundColor: previewColors.accent }]} />
                          <View style={[styles.themePreviewLineShort, { backgroundColor: previewColors.accent, opacity: 0.5 }]} />
                        </View>
                        {isLocked && (
                          <View style={styles.lockedOverlay}>
                            <Crown size={18} color={colors.accent} />
                          </View>
                        )}
                      </View>
                      <View style={styles.themeInfo}>
                        <Text style={[styles.themeName, { color: colors.primary }]}>{theme.name}</Text>
                        {isSelected && <Check size={16} color={colors.accent} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        visible={showMoodsModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowMoodsModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowMoodsModal(false)}>
                <X size={24} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Choose Moods</Text>
              <TouchableOpacity onPress={saveMoods} disabled={selectedMoods.length < MIN_MOODS}>
                <Check size={24} color={selectedMoods.length >= MIN_MOODS ? colors.accent : colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
              Select {MIN_MOODS}-{MAX_MOODS} moods that resonate with you
            </Text>
            <Text style={[styles.selectionCount, { color: colors.accent }]}>
              {selectedMoods.length} selected
            </Text>

            <View style={styles.moodsGrid}>
              {MOODS.map((mood) => {
                const isSelected = selectedMoods.includes(mood);
                return (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.moodChip,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isSelected && { backgroundColor: colors.mood[mood], borderColor: colors.mood[mood] },
                    ]}
                    onPress={() => toggleMood(mood)}
                  >
                    <Text
                      style={[
                        styles.moodChipText,
                        { color: colors.textMuted },
                        isSelected && { color: '#ffffff', fontWeight: '600' as const },
                      ]}
                    >
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        visible={showCountriesModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCountriesModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowCountriesModal(false)}>
                <X size={24} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Choose Countries</Text>
              <TouchableOpacity onPress={saveCountries} disabled={selectedCountries.length < 1}>
                <Check size={24} color={selectedCountries.length >= 1 ? colors.accent : colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <Text style={[styles.modalSubtitle, { color: colors.textMuted }]}>
              Select at least 1 country or region
            </Text>

            <ScrollView style={styles.countriesScroll} showsVerticalScrollIndicator={false}>
              <TouchableOpacity
                style={[
                  styles.countryOption,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectedCountries.includes('ALL') && { backgroundColor: colors.accentLight, borderColor: colors.accent },
                ]}
                onPress={() => toggleCountry('ALL')}
              >
                <Text style={styles.countryFlag}>🌍</Text>
                <Text style={[
                  styles.countryName,
                  { color: colors.primary },
                  selectedCountries.includes('ALL') && { fontWeight: '600' as const },
                ]}>
                  All Countries
                </Text>
                {selectedCountries.includes('ALL') && (
                  <Check size={20} color={colors.accent} />
                )}
              </TouchableOpacity>

              {countries.map((country) => {
                const isSelected = selectedCountries.includes(country.code);
                return (
                  <TouchableOpacity
                    key={country.code}
                    style={[
                      styles.countryOption,
                      { backgroundColor: colors.surface, borderColor: colors.border },
                      isSelected && { backgroundColor: colors.accentLight, borderColor: colors.accent },
                    ]}
                    onPress={() => toggleCountry(country.code)}
                  >
                    <Text style={styles.countryFlag}>{country.flag}</Text>
                    <Text style={[
                      styles.countryName,
                      { color: colors.primary },
                      isSelected && { fontWeight: '600' as const },
                    ]}>
                      {country.name}
                    </Text>
                    {isSelected && (
                      <Check size={20} color={colors.accent} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        visible={showWallpaperModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowWallpaperModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowWallpaperModal(false)}>
                <X size={24} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Background</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.themeScroll} showsVerticalScrollIndicator={false}>
              <View style={styles.premiumThemesHeader}>
                <Text style={[styles.themeSectionLabel, { color: colors.textMuted }]}>POEMCLOUD+ WALLPAPERS</Text>
                <View style={[styles.premiumBadge, { backgroundColor: colors.accentLight }]}>
                  <Crown size={12} color={colors.accent} />
                  <Text style={[styles.premiumBadgeText, { color: colors.accent }]}>Premium</Text>
                </View>
              </View>
              <Text style={[styles.wallpaperSubtitle, { color: colors.textMuted }]}>
                Calm backgrounds designed for immersive reading
              </Text>

              <TouchableOpacity
                style={[
                  styles.wallpaperOption,
                  { backgroundColor: colors.surface, borderColor: wallpaperId === 'none' ? colors.accent : colors.border },
                  wallpaperId === 'none' && styles.wallpaperOptionSelected,
                ]}
                onPress={() => handleWallpaperSelect('none')}
              >
                <View style={[styles.wallpaperPreviewNone, { backgroundColor: colors.surfaceSecondary }]}>
                  <Text style={[styles.wallpaperNoneText, { color: colors.textMuted }]}>None</Text>
                </View>
                <View style={styles.wallpaperInfo}>
                  <Text style={[styles.wallpaperName, { color: colors.primary }]}>No Background</Text>
                  <Text style={[styles.wallpaperDesc, { color: colors.textMuted }]}>Use solid theme colors</Text>
                </View>
                {wallpaperId === 'none' && <Check size={20} color={colors.accent} />}
              </TouchableOpacity>

              {wallpapers.map((wp) => {
                const isSelected = wallpaperId === wp.id;
                return (
                  <TouchableOpacity
                    key={wp.id}
                    style={[
                      styles.wallpaperOption,
                      { backgroundColor: colors.surface, borderColor: isSelected ? colors.accent : colors.border },
                      isSelected && styles.wallpaperOptionSelected,
                    ]}
                    onPress={() => handleWallpaperSelect(wp.id)}
                  >
                    <View style={styles.wallpaperPreviewContainer}>
                      <View style={styles.wallpaperPreviewImage}>
                        <View 
                          style={[
                            styles.wallpaperPreviewBg, 
                            { backgroundColor: colors.surfaceSecondary }
                          ]} 
                        />
                        {/* Using a colored placeholder since we can't load images in preview */}
                        <View 
                          style={[
                            StyleSheet.absoluteFill, 
                            { 
                              backgroundColor: wp.id === 'morning-light' ? '#faf0e6' : 
                                              wp.id === 'golden-dusk' ? '#e8a070' : '#4a5a7a',
                              borderRadius: 8,
                            }
                          ]} 
                        />
                      </View>
                    </View>
                    <View style={styles.wallpaperInfo}>
                      <Text style={[styles.wallpaperName, { color: colors.primary }]}>{wp.name}</Text>
                      <Text style={[styles.wallpaperDesc, { color: colors.textMuted }]}>Illustrated wallpaper</Text>
                    </View>
                    {isSelected && <Check size={20} color={colors.accent} />}
                  </TouchableOpacity>
                );
              })}

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>

      <Modal
        visible={showNotificationModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowNotificationModal(false)}
      >
        <View style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <SafeAreaView style={styles.modalSafeArea} edges={['top', 'bottom']}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setShowNotificationModal(false)}>
                <X size={24} color={colors.primary} />
              </TouchableOpacity>
              <Text style={[styles.modalTitle, { color: colors.primary }]}>Daily Poem Delivery</Text>
              <TouchableOpacity onPress={() => {
                setEmailAddress(tempEmail);
                setPhoneNumber(tempPhone);
                setShowNotificationModal(false);
              }}>
                <Check size={24} color={colors.accent} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.themeScroll} showsVerticalScrollIndicator={false}>
              <Text style={[styles.notifDescription, { color: colors.textMuted }]}>
                Get a beautiful poem delivered to you every day
              </Text>

              <Text style={[styles.themeSectionLabel, { color: colors.textMuted }]}>DELIVERY METHODS</Text>
              
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
                  <View style={styles.settingLeft}>
                    <Bell size={20} color={colors.textLight} strokeWidth={1.5} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: colors.primary }]}>Push Notifications</Text>
                      <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                        Receive in-app notifications
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={notifPrefs.dailyPushEnabled}
                    onValueChange={toggleDailyPush}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor={colors.textWhite}
                  />
                </View>

                <View style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}>
                  <View style={styles.settingLeft}>
                    <Mail size={20} color={colors.textLight} strokeWidth={1.5} />
                    <View style={styles.settingText}>
                      <Text style={[styles.settingLabel, { color: colors.primary }]}>Email</Text>
                      <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                        {emailAvailable ? 'Receive poems via email' : 'Email not available'}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={notifPrefs.dailyEmailEnabled}
                    onValueChange={toggleDailyEmail}
                    trackColor={{ false: colors.border, true: colors.accent }}
                    thumbColor={colors.textWhite}
                    disabled={!emailAvailable}
                  />
                </View>

                {Platform.OS !== 'web' && (
                  <View style={styles.settingRow}>
                    <View style={styles.settingLeft}>
                      <Smartphone size={20} color={colors.textLight} strokeWidth={1.5} />
                      <View style={styles.settingText}>
                        <Text style={[styles.settingLabel, { color: colors.primary }]}>SMS</Text>
                        <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                          {smsAvailable ? 'Receive poems via text' : 'SMS not available'}
                        </Text>
                      </View>
                    </View>
                    <Switch
                      value={notifPrefs.dailySmsEnabled}
                      onValueChange={toggleDailySms}
                      trackColor={{ false: colors.border, true: colors.accent }}
                      thumbColor={colors.textWhite}
                      disabled={!smsAvailable}
                    />
                  </View>
                )}
              </View>

              {(notifPrefs.dailyEmailEnabled || notifPrefs.dailySmsEnabled) && (
                <>
                  <Text style={[styles.themeSectionLabel, { color: colors.textMuted, marginTop: 24 }]}>CONTACT INFO</Text>
                  
                  <View style={[styles.card, { backgroundColor: colors.surface }]}>
                    {notifPrefs.dailyEmailEnabled && (
                      <View style={[styles.inputRow, { borderBottomColor: colors.borderLight }]}>
                        <Mail size={20} color={colors.textMuted} />
                        <TextInput
                          style={[styles.input, { color: colors.text }]}
                          placeholder="Enter your email"
                          placeholderTextColor={colors.textMuted}
                          value={tempEmail}
                          onChangeText={setTempEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </View>
                    )}
                    
                    {notifPrefs.dailySmsEnabled && Platform.OS !== 'web' && (
                      <View style={styles.inputRow}>
                        <Smartphone size={20} color={colors.textMuted} />
                        <TextInput
                          style={[styles.input, { color: colors.text }]}
                          placeholder="Enter your phone number"
                          placeholderTextColor={colors.textMuted}
                          value={tempPhone}
                          onChangeText={setTempPhone}
                          keyboardType="phone-pad"
                        />
                      </View>
                    )}
                  </View>
                </>
              )}

              <Text style={[styles.themeSectionLabel, { color: colors.textMuted, marginTop: 24 }]}>TEST DELIVERY</Text>
              <View style={[styles.card, { backgroundColor: colors.surface }]}>
                {emailAvailable && notifPrefs.emailAddress && (
                  <TouchableOpacity 
                    style={[styles.settingRow, { borderBottomColor: colors.borderLight }]}
                    onPress={() => {
                      triggerHaptic('light');
                      sendDailyPoemEmail();
                    }}
                  >
                    <View style={styles.settingLeft}>
                      <Send size={20} color={colors.accent} strokeWidth={1.5} />
                      <Text style={[styles.settingLabel, { color: colors.accent }]}>Send Test Email</Text>
                    </View>
                    <ChevronRight size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                )}
                
                {smsAvailable && notifPrefs.phoneNumber && Platform.OS !== 'web' && (
                  <TouchableOpacity 
                    style={styles.settingRow}
                    onPress={() => {
                      triggerHaptic('light');
                      sendDailyPoemSms();
                    }}
                  >
                    <View style={styles.settingLeft}>
                      <Send size={20} color={colors.accent} strokeWidth={1.5} />
                      <Text style={[styles.settingLabel, { color: colors.accent }]}>Send Test SMS</Text>
                    </View>
                    <ChevronRight size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                )}

                {!notifPrefs.emailAddress && !notifPrefs.phoneNumber && (
                  <View style={styles.settingRow}>
                    <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                      Add email or phone number to test delivery
                    </Text>
                  </View>
                )}
              </View>

              <View style={{ height: 40 }} />
            </ScrollView>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  card: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 13,
    marginTop: 2,
  },
  subscriptionRow: {
    padding: 16,
    borderBottomWidth: 1,
  },
  subscriptionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  subscriptionText: {
    flex: 1,
  },
  subscriptionLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  subscriptionValue: {
    fontSize: 13,
    marginTop: 2,
  },
  upgradeButton: {
    margin: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  upgradeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  manageButton: {
    padding: 16,
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  subscriptionNote: {
    fontSize: 12,
    marginTop: 4,
  },
  restoreButton: {
    padding: 16,
    paddingTop: 8,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontSize: 14,
  },
  version: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
  },
  modalSafeArea: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSubtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  selectionCount: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
  },
  moodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  moodChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1.5,
  },
  moodChipText: {
    fontSize: 15,
  },
  countriesScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  countryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    marginBottom: 8,
    gap: 12,
  },
  countryFlag: {
    fontSize: 24,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
  },
  themeScroll: {
    flex: 1,
    paddingHorizontal: 20,
  },
  themeSectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginTop: 8,
  },
  premiumThemesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 4,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  premiumBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  themeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeCard: {
    width: '47%',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  themeCardSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  themePreview: {
    height: 80,
    padding: 12,
    justifyContent: 'center',
  },
  themePreviewCard: {
    borderRadius: 8,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  themePreviewLine: {
    height: 6,
    width: '70%',
    borderRadius: 3,
    marginBottom: 6,
  },
  themePreviewLineShort: {
    height: 4,
    width: '50%',
    borderRadius: 2,
  },
  lockedOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  themeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  themeName: {
    fontSize: 14,
    fontWeight: '500',
  },
  wallpaperSubtitle: {
    fontSize: 13,
    marginBottom: 16,
  },
  wallpaperOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 12,
    gap: 14,
  },
  wallpaperOptionSelected: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  wallpaperPreviewContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
  },
  wallpaperPreviewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  wallpaperPreviewBg: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
  },
  wallpaperPreviewNone: {
    width: 60,
    height: 60,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  wallpaperNoneText: {
    fontSize: 11,
    fontWeight: '500',
  },
  wallpaperInfo: {
    flex: 1,
  },
  wallpaperName: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  wallpaperDesc: {
    fontSize: 12,
  },
  notifDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
    borderBottomWidth: 1,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  analyticsRow: {
    flexDirection: 'column',
    gap: 6,
    marginTop: 6,
  },
  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  analyticsRank: {
    fontSize: 12,
    fontWeight: '700',
    minWidth: 20,
  },
  analyticsMoodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  analyticsFlag: {
    fontSize: 16,
  },
  analyticsText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
