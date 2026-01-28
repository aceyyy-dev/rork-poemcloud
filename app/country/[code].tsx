import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { getCountryByCode } from '@/mocks/countries';
import { getPoemsByCountry } from '@/mocks/poems';
import { poets } from '@/mocks/poets';

export default function CountryDetailScreen() {
  const { code } = useLocalSearchParams<{ code: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const country = getCountryByCode(code);
  const poems = getPoemsByCountry(code);
  const countryPoets = poets.filter(p => p.countryCode === code);

  if (!country) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.errorText, { color: colors.textMuted }]}>Country not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.background]}
        locations={[0, 0.3, 1]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.flag}>{country.flag}</Text>
          <Text style={[styles.countryName, { color: colors.primary }]}>{country.name}</Text>
          <Text style={[styles.countryStats, { color: colors.textMuted }]}>
            {countryPoets.length} poets • {poems.length} poems
          </Text>

          {countryPoets.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Featured Poets</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.poetsScroll}
              >
                {countryPoets.map((poet) => (
                  <TouchableOpacity
                    key={poet.id}
                    style={[styles.poetCard, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/poet/${poet.id}`)}
                    activeOpacity={0.8}
                  >
                    <View style={[styles.poetAvatar, { backgroundColor: colors.surfaceSecondary }]}>
                      <Text style={[styles.poetInitial, { color: colors.primary }]}>
                        {poet.name.charAt(0)}
                      </Text>
                    </View>
                    <Text style={[styles.poetName, { color: colors.primary }]} numberOfLines={1}>
                      {poet.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Popular Poems ({poems.length})
            </Text>
            {poems.map((poem) => (
              <TouchableOpacity
                key={poem.id}
                style={[styles.poemCard, { backgroundColor: colors.surface }]}
                onPress={() => router.push(`/poem/${poem.id}`)}
                activeOpacity={0.8}
              >
                <View style={styles.poemInfo}>
                  <Text style={[styles.poemTitle, { color: colors.primary }]}>{poem.title}</Text>
                  <Text style={[styles.poemPoet, { color: colors.textMuted }]}>{poem.poet.name}</Text>
                </View>
                <View style={styles.poemMoods}>
                  {poem.moods.slice(0, 2).map(mood => (
                    <View
                      key={mood}
                      style={[styles.moodDot, { backgroundColor: colors.mood[mood] }]}
                    />
                  ))}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
  header: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  flag: {
    fontSize: 64,
    textAlign: 'center',
    marginBottom: 16,
  },
  countryName: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  countryStats: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 32,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  poetsScroll: {
    gap: 12,
  },
  poetCard: {
    width: 100,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  poetAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  poetInitial: {
    fontSize: 20,
    fontWeight: '600',
  },
  poetName: {
    fontSize: 13,
    fontWeight: '500',
    textAlign: 'center',
  },
  poemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  poemInfo: {
    flex: 1,
  },
  poemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  poemPoet: {
    fontSize: 13,
  },
  poemMoods: {
    flexDirection: 'row',
    gap: 4,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});
