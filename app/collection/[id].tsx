import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { getCollectionById } from '@/mocks/collections';
import { getPoemById } from '@/mocks/poems';

export default function CollectionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isIllustrated } = useTheme();

  const collection = getCollectionById(id);
  const poems = collection ? collection.poemIds.map(getPoemById).filter(Boolean) : [];

  if (!collection) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.errorText, { color: colors.textMuted }]}>Collection not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isIllustrated ? 'transparent' : colors.background }]}>
      <View style={styles.heroContainer}>
        <Image
          source={{ uri: collection.coverImageUrl }}
          style={styles.heroImage}
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.6)', colors.background]}
          locations={[0, 0.5, 1]}
          style={styles.heroGradient}
        />
      </View>
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.backButton, { backgroundColor: 'rgba(255,255,255,0.9)' }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleSection}>
          <Text style={[styles.collectionTitle, { color: colors.primary }]}>{collection.title}</Text>
          <Text style={[styles.collectionDesc, { color: colors.textMuted }]}>{collection.description}</Text>
          <Text style={[styles.poemCount, { color: colors.textLight }]}>
            {poems.length} poems
          </Text>
        </View>

        <View style={styles.poemsSection}>
          {poems.map((poem, index) => poem && (
            <TouchableOpacity
              key={poem.id}
              style={[styles.poemCard, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/poem/${poem.id}`)}
              activeOpacity={0.8}
            >
              <View style={[styles.poemNumber, { backgroundColor: colors.surfaceSecondary }]}>
                <Text style={[styles.poemNumberText, { color: colors.textMuted }]}>{index + 1}</Text>
              </View>
              <View style={styles.poemInfo}>
                <Text style={[styles.poemTitle, { color: colors.primary }]}>{poem.title}</Text>
                <Text style={[styles.poemPoet, { color: colors.textMuted }]}>
                  {poem.poet.name} • {poem.country}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
  },
  heroImage: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: 'cover',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
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
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  content: {
    flex: 1,
    marginTop: 200,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 24,
  },
  collectionTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  collectionDesc: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 8,
  },
  poemCount: {
    fontSize: 14,
  },
  poemsSection: {
    gap: 8,
  },
  poemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  poemNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  poemNumberText: {
    fontSize: 14,
    fontWeight: '600',
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
