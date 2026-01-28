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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  X,
  Sun,
  Moon,
  Smartphone,
  Heart,
  Globe,
  Crown,
  HelpCircle,
  Info,
  ChevronRight,
  Bell,
  Check,
  FileText,
  LogOut,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import { useAuth } from '@/contexts/AuthContext';
import { countries } from '@/mocks/countries';
import { Mood } from '@/types';
import PremiumModal from '@/components/PremiumModal';

const MOODS: Mood[] = ['calm', 'sad', 'love', 'hope', 'melancholy', 'healing', 'longing', 'joy', 'reflection'];
const MIN_MOODS = 3;
const MAX_MOODS = 6;

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, themeMode, setTheme } = useTheme();
  const { preferences, updatePreferences, setPremium } = useUser();
  const { restorePurchases, isRestoring, manageSubscription, willRenew, expirationDate } = usePurchases();
  const { isLoggedIn, user, signOut } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showMoodsModal, setShowMoodsModal] = useState(false);
  const [showCountriesModal, setShowCountriesModal] = useState(false);
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>(preferences.moods);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(preferences.countries);
  const [dailyNotification, setDailyNotification] = useState(true);

  const toggleMood = (mood: Mood) => {
    if (selectedMoods.includes(mood)) {
      if (selectedMoods.length > MIN_MOODS) {
        setSelectedMoods(selectedMoods.filter(m => m !== mood));
      }
    } else if (selectedMoods.length < MAX_MOODS) {
      setSelectedMoods([...selectedMoods, mood]);
    }
  };

  const toggleCountry = (code: string) => {
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

  const themeOptions = [
    { value: 'light' as const, label: 'Light', icon: Sun },
    { value: 'dark' as const, label: 'Dark', icon: Moon },
    { value: 'system' as const, label: 'System', icon: Smartphone },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Settings</Text>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
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
              <Text style={[styles.cardLabel, { color: colors.primary }]}>Theme</Text>
              <View style={styles.themeOptions}>
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = themeMode === option.value;
                  return (
                    <TouchableOpacity
                      key={option.value}
                      style={[
                        styles.themeOption,
                        { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                        isSelected && { borderColor: colors.accent, backgroundColor: colors.accentLight },
                      ]}
                      onPress={() => setTheme(option.value)}
                    >
                      <Icon
                        size={20}
                        color={isSelected ? colors.accent : colors.textMuted}
                        strokeWidth={1.5}
                      />
                      <Text
                        style={[
                          styles.themeOptionText,
                          { color: colors.textMuted },
                          isSelected && { color: colors.accent, fontWeight: '600' },
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
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

              <View style={styles.settingRow}>
                <View style={styles.settingLeft}>
                  <Bell size={20} color={colors.textLight} strokeWidth={1.5} />
                  <View style={styles.settingText}>
                    <Text style={[styles.settingLabel, { color: colors.primary }]}>Daily Poem Notification</Text>
                    <Text style={[styles.settingValue, { color: colors.textMuted }]}>
                      Receive a poem each morning
                    </Text>
                  </View>
                </View>
                <Switch
                  value={dailyNotification}
                  onValueChange={setDailyNotification}
                  trackColor={{ false: colors.border, true: colors.accent }}
                  thumbColor={colors.textWhite}
                />
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.textMuted }]}>SUBSCRIPTION</Text>
            <View style={[styles.card, { backgroundColor: colors.surface }]}>
              <View style={[styles.subscriptionRow, { borderBottomColor: colors.borderLight }]}>
                <View style={styles.subscriptionInfo}>
                  <Crown
                    size={24}
                    color={preferences.isPremium ? colors.accent : colors.textMuted}
                    strokeWidth={1.5}
                  />
                  <View style={styles.subscriptionText}>
                    <Text style={[styles.subscriptionLabel, { color: colors.primary }]}>
                      {preferences.isPremium ? 'PoemCloud+' : 'Free Plan'}
                    </Text>
                    <Text style={[styles.subscriptionValue, { color: colors.textMuted }]}>
                      {preferences.isPremium 
                        ? 'All features unlocked'
                        : 'Limited features'
                      }
                    </Text>
                  </View>
                </View>
              </View>
              
              {!preferences.isPremium && (
                <TouchableOpacity
                  style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
                  onPress={() => setShowPremiumModal(true)}
                >
                  <Text style={[styles.upgradeButtonText, { color: colors.textWhite }]}>
                    Upgrade to PoemCloud+
                  </Text>
                </TouchableOpacity>
              )}

              {preferences.isPremium && (
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
          setPremium(true);
          setShowPremiumModal(false);
        }}
      />

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
                        isSelected && { color: '#ffffff', fontWeight: '600' },
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
                  selectedCountries.includes('ALL') && { fontWeight: '600' },
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
                      isSelected && { fontWeight: '600' },
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
  cardLabel: {
    fontSize: 15,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 12,
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1.5,
  },
  themeOptionText: {
    fontSize: 14,
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
});
