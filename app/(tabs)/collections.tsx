import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crown, Bookmark, Heart, Cloud, BookOpen, Globe } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { collectionCategories } from '@/mocks/collections';
import { poems } from '@/mocks/poems';
import { Collection } from '@/types';
import PremiumModal from '@/components/PremiumModal';

type Tab = 'curated' | 'saved';

export default function CollectionsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { preferences, setPremium, bookmarkCount, maxFreeBookmarks } = useUser();
  const [activeTab, setActiveTab] = useState<Tab>('curated');
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const savedPoems = poems.filter(p => preferences.bookmarkedPoemIds.includes(p.id));

  const handleCollectionPress = (collection: Collection) => {
    if (collection.isPremium && !preferences.isPremium) {
      setShowPremiumModal(true);
    } else {
      router.push(`/collection/${collection.id}`);
    }
  };

  const getCategoryIcon = (categoryId: string) => {
    switch (categoryId) {
      case 'emotions':
        return <Heart size={18} color={colors.accent} strokeWidth={1.5} />;
      case 'moments':
        return <Cloud size={18} color={colors.accent} strokeWidth={1.5} />;
      case 'length':
        return <BookOpen size={18} color={colors.accent} strokeWidth={1.5} />;
      case 'cultures':
        return <Globe size={18} color={colors.accent} strokeWidth={1.5} />;
      default:
        return null;
    }
  };

  const renderCollectionCard = (collection: Collection, isLarge: boolean = false) => (
    <TouchableOpacity
      key={collection.id}
      style={[
        styles.collectionCard,
        isLarge ? styles.collectionCardLarge : styles.collectionCardSmall,
      ]}
      onPress={() => handleCollectionPress(collection)}
      activeOpacity={0.8}
    >
      <LinearGradient
        colors={collection.coverGradient ? [...collection.coverGradient] : [colors.accent, colors.primary]}
        style={styles.collectionGradient}
      />
      <View style={styles.collectionIconContainer}>
        <Text style={styles.collectionIcon}>{collection.coverIcon || '📖'}</Text>
      </View>
      {collection.isPremium && !preferences.isPremium && (
        <View style={[styles.premiumBadge, { backgroundColor: 'rgba(255,255,255,0.9)' }]}>
          <Crown size={12} color={colors.accent} />
        </View>
      )}
      <View style={styles.collectionInfo}>
        <Text style={styles.collectionTitle} numberOfLines={2}>{collection.title}</Text>
        <Text style={styles.collectionCount}>
          {collection.poemCount} poems
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.background]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Collections</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeTab === 'curated' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab('curated')}
          >
            <Text
              style={[
                styles.tabText,
                { color: colors.textMuted },
                activeTab === 'curated' && { color: colors.background },
              ]}
            >
              Curated
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeTab === 'saved' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => setActiveTab('saved')}
          >
            <View style={styles.tabWithBadge}>
              <Text
                style={[
                  styles.tabText,
                  { color: colors.textMuted },
                  activeTab === 'saved' && { color: colors.background },
                ]}
              >
                Saved
              </Text>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: colors.border },
                  activeTab === 'saved' && { backgroundColor: 'rgba(255,255,255,0.2)' },
                ]}
              >
                <Text
                  style={[
                    styles.badgeText,
                    { color: colors.textMuted },
                    activeTab === 'saved' && { color: colors.background },
                  ]}
                >
                  {bookmarkCount}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {activeTab === 'curated' ? (
            <>
              {collectionCategories.map((category) => (
                <View key={category.id} style={styles.categorySection}>
                  <View style={styles.categoryTitleRow}>
                    {getCategoryIcon(category.id)}
                    <Text style={[styles.categoryTitle, { color: colors.primary }]}>
                      {category.title}
                    </Text>
                  </View>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.horizontalScroll}
                  >
                    {category.collections.map((collection, index) => (
                      renderCollectionCard(collection, index === 0)
                    ))}
                  </ScrollView>
                </View>
              ))}
            </>
          ) : (
            <>
              {!preferences.isPremium && (
                <View style={[styles.limitBanner, { backgroundColor: colors.premiumLight }]}>
                  <View style={styles.limitInfo}>
                    <Bookmark size={18} color={colors.accent} />
                    <Text style={[styles.limitText, { color: colors.primary }]}>
                      {bookmarkCount}/{maxFreeBookmarks} saved
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
                    onPress={() => setShowPremiumModal(true)}
                  >
                    <Crown size={14} color={colors.textWhite} />
                    <Text style={[styles.upgradeText, { color: colors.textWhite }]}>Unlimited</Text>
                  </TouchableOpacity>
                </View>
              )}

              {savedPoems.length === 0 ? (
                <View style={styles.emptyState}>
                  <Bookmark size={48} color={colors.border} strokeWidth={1} />
                  <Text style={[styles.emptyTitle, { color: colors.primary }]}>No saved poems yet</Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                    Tap the bookmark icon on any poem to save it here
                  </Text>
                </View>
              ) : (
                savedPoems.map((poem) => (
                  <TouchableOpacity
                    key={poem.id}
                    style={[styles.savedCard, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/poem/${poem.id}`)}
                    activeOpacity={0.8}
                  >
                    <View style={styles.savedContent}>
                      <Text style={[styles.savedTitle, { color: colors.primary }]}>{poem.title}</Text>
                      <Text style={[styles.savedPoet, { color: colors.textMuted }]}>
                        {poem.poet.name} • {poem.country}
                      </Text>
                    </View>
                    <View style={styles.savedMoods}>
                      {poem.moods.slice(0, 2).map(mood => (
                        <View
                          key={mood}
                          style={[styles.moodDot, { backgroundColor: colors.mood[mood] }]}
                        />
                      ))}
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={() => {
          setPremium(true);
          setShowPremiumModal(false);
        }}
        feature="Unlimited bookmarks"
      />
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
  },
  tabWithBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  categorySection: {
    marginBottom: 24,
  },
  categoryTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 20,
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 12,
  },
  collectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
  },
  collectionCardLarge: {
    width: 180,
    height: 200,
  },
  collectionCardSmall: {
    width: 140,
    height: 160,
  },
  collectionGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  collectionIconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
  },
  collectionIcon: {
    fontSize: 48,
  },
  premiumBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  collectionInfo: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
  },
  collectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  collectionCount: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  limitBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  limitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  limitText: {
    fontSize: 14,
    fontWeight: '500',
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  upgradeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  savedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  savedContent: {
    flex: 1,
  },
  savedTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  savedPoet: {
    fontSize: 13,
  },
  savedMoods: {
    flexDirection: 'row',
    gap: 4,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
