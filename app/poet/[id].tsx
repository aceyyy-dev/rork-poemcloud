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
import { getPoetById } from '@/mocks/poets';
import { getPoemsByPoet } from '@/mocks/poems';

export default function PoetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();

  const poet = getPoetById(id);
  const poems = poet ? getPoemsByPoet(id) : [];

  if (!poet) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.errorText, { color: colors.textMuted }]}>Poet not found</Text>
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
          <View style={[styles.avatarContainer, { backgroundColor: colors.surface }]}>
            <Text style={[styles.avatarText, { color: colors.primary }]}>
              {poet.name.charAt(0)}
            </Text>
          </View>

          <Text style={[styles.poetName, { color: colors.primary }]}>{poet.name}</Text>
          <Text style={[styles.poetCountry, { color: colors.textMuted }]}>
            {poet.country}
            {poet.birthYear && ` • ${poet.birthYear}`}
            {poet.deathYear && `–${poet.deathYear}`}
          </Text>

          {poet.bio && (
            <View style={[styles.bioCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.bioText, { color: colors.text }]}>{poet.bio}</Text>
            </View>
          )}

          <View style={styles.poemsSection}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>
              Poems ({poems.length})
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
                  <Text style={[styles.poemMood, { color: colors.textMuted }]}>
                    {poem.moods.slice(0, 2).join(', ')}
                  </Text>
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
    alignItems: 'center',
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '600',
  },
  poetName: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  poetCountry: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  bioCard: {
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  bioText: {
    fontSize: 15,
    lineHeight: 24,
  },
  poemsSection: {
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    letterSpacing: -0.3,
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
  poemMood: {
    fontSize: 13,
    textTransform: 'capitalize',
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
