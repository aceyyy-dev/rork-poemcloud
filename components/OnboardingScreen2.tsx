import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Mood } from '@/types';
import { countries } from '@/mocks/countries';
import { triggerHaptic } from '@/utils/haptics';

interface Props {
  onNext: (preferences: {
    moods: Mood[];
    countries: string[];
  }) => void;
  onBack: () => void;
}

const moods: { value: Mood; label: string }[] = [
  { value: 'calm', label: 'Calm' },
  { value: 'sad', label: 'Sad' },
  { value: 'love', label: 'Love' },
  { value: 'hope', label: 'Hope' },
  { value: 'melancholy', label: 'Melancholy' },
  { value: 'healing', label: 'Healing' },
  { value: 'longing', label: 'Longing' },
  { value: 'joy', label: 'Joy' },
  { value: 'reflection', label: 'Reflection' },
];

const MIN_MOODS = 3;
const MAX_MOODS = 6;
const MIN_COUNTRIES = 1;

export default function OnboardingScreen2({ onNext, onBack }: Props) {
  const { colors } = useTheme();
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectAllCountries, setSelectAllCountries] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const toggleMood = (mood: Mood) => {
    triggerHaptic('light');
    if (selectedMoods.includes(mood)) {
      setSelectedMoods(prev => prev.filter(m => m !== mood));
    } else if (selectedMoods.length < MAX_MOODS) {
      setSelectedMoods(prev => [...prev, mood]);
    }
  };

  const toggleCountry = (code: string) => {
    triggerHaptic('light');
    if (selectAllCountries) {
      setSelectAllCountries(false);
      setSelectedCountries([code]);
    } else if (selectedCountries.includes(code)) {
      setSelectedCountries(prev => prev.filter(c => c !== code));
    } else {
      setSelectedCountries(prev => [...prev, code]);
    }
  };

  const handleSelectAll = () => {
    triggerHaptic('medium');
    setSelectAllCountries(true);
    setSelectedCountries([]);
  };

  const handleContinue = () => {
    triggerHaptic('medium');
    onNext({
      moods: selectedMoods,
      countries: selectAllCountries ? ['ALL'] : selectedCountries,
    });
  };

  const canContinue = selectedMoods.length >= MIN_MOODS && (selectAllCountries || selectedCountries.length >= MIN_COUNTRIES);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.background]}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => { triggerHaptic('light'); onBack(); }} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
              <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: colors.primary }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
            </View>
            <View style={styles.backButton} />
          </View>
          <Text style={[styles.progressText, { color: colors.textMuted }]}>Almost ready</Text>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.section}>
              <Text style={[styles.question, { color: colors.primary }]}>
                Choose your top moods
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Pick at least {MIN_MOODS} — this shapes your For You feed
              </Text>
              <View style={styles.chipsContainer}>
                {moods.map(mood => {
                  const isSelected = selectedMoods.includes(mood.value);
                  const moodColor = colors.mood[mood.value] || colors.accent;
                  return (
                    <TouchableOpacity
                      key={mood.value}
                      style={[
                        styles.chip,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        isSelected && { backgroundColor: moodColor, borderColor: moodColor },
                      ]}
                      onPress={() => toggleMood(mood.value)}
                      activeOpacity={0.7}
                    >
                      <View
                        style={[
                          styles.moodDot,
                          { backgroundColor: isSelected ? colors.textWhite : moodColor },
                        ]}
                      />
                      <Text
                        style={[
                          styles.chipText,
                          { color: colors.text },
                          isSelected && { color: colors.textWhite },
                        ]}
                      >
                        {mood.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <Text style={[styles.countText, { color: colors.textMuted }]}>
                {selectedMoods.length}/{MAX_MOODS} selected
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={[styles.question, { color: colors.primary }]}>
                Poetry {"you're"} drawn to
              </Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                Choose at least one — or explore them all
              </Text>
              
              <TouchableOpacity
                style={[
                  styles.allCountriesButton,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                  selectAllCountries && { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={handleSelectAll}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.allCountriesText,
                    { color: colors.text },
                    selectAllCountries && { color: colors.background },
                  ]}
                >
                  All countries
                </Text>
                {selectAllCountries && (
                  <Check size={18} color={colors.background} />
                )}
              </TouchableOpacity>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.countriesScroll}
              >
                {countries.map(country => {
                  const isSelected = selectedCountries.includes(country.code);
                  return (
                    <TouchableOpacity
                      key={country.code}
                      style={[
                        styles.countryCard,
                        { backgroundColor: colors.surface, borderColor: colors.border },
                        isSelected && { backgroundColor: colors.primary, borderColor: colors.primary },
                      ]}
                      onPress={() => toggleCountry(country.code)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.countryFlag}>{country.flag}</Text>
                      <Text
                        style={[
                          styles.countryName,
                          { color: colors.text },
                          isSelected && { color: colors.background },
                        ]}
                        numberOfLines={1}
                      >
                        {country.name}
                      </Text>
                      {isSelected && (
                        <View style={[styles.countryCheck, { backgroundColor: 'rgba(0,0,0,0.15)' }]}>
                          <Check size={12} color={colors.background} />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: colors.primary },
                !canContinue && { opacity: 0.5 },
              ]}
              onPress={handleContinue}
              activeOpacity={0.8}
              disabled={!canContinue}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </SafeAreaView>
    </View>
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
  progressText: {
    fontSize: 14,
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 32,
  },
  question: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    borderWidth: 1,
  },
  moodDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  chipText: {
    fontSize: 15,
    fontWeight: '500',
  },
  countText: {
    fontSize: 13,
    marginTop: 12,
    textAlign: 'center',
  },
  allCountriesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  allCountriesText: {
    fontSize: 16,
    fontWeight: '600',
  },
  countriesScroll: {
    gap: 12,
    paddingVertical: 4,
  },
  countryCard: {
    width: 100,
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    position: 'relative',
  },
  countryFlag: {
    fontSize: 28,
    marginBottom: 8,
  },
  countryName: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  countryCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
