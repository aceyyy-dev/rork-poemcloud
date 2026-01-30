import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Crown, Bookmark, Heart, Cloud, BookOpen, Globe, ListMusic, Plus, MoreHorizontal } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { usePlaylists } from '@/contexts/PlaylistContext';
import { collectionCategories } from '@/mocks/collections';
import { poems } from '@/mocks/poems';
import { countries } from '@/mocks/countries';
import { Collection, Playlist } from '@/types';
import PremiumModal from '@/components/PremiumModal';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';
import { triggerHaptic } from '@/utils/haptics';

type Tab = 'curated' | 'saved' | 'collections';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_LARGE_WIDTH = 180;
const CARD_SMALL_WIDTH = 140;
const CARD_LARGE_HEIGHT = 200;
const CARD_SMALL_HEIGHT = 160;
const CARD_GAP = 12;
const PADDING_LEFT = 20;

export default function CollectionsScreen() {
  const router = useRouter();
  const { colors, isIllustrated } = useTheme();
  const { preferences, setPremium, bookmarkCount, maxFreeBookmarks } = useUser();
  const { playlists } = usePlaylists();
  const [activeTab, setActiveTab] = useState<Tab>('curated');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCreatePlaylistModal, setShowCreatePlaylistModal] = useState(false);

  const savedPoems = poems.filter(p => preferences.bookmarkedPoemIds.includes(p.id));

  const handleCollectionPress = (collection: Collection) => {
    if (collection.isPremium && !preferences.isPremium) {
      setShowPremiumModal(true);
    } else {
      router.push(`/collection/${collection.id}`);
    }
  };

  const handlePlaylistPress = (playlist: Playlist) => {
    router.push(`/playlist/${playlist.id}`);
  };

  const handleCreateCollection = () => {
    triggerHaptic('light');
    if (!preferences.isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setShowCreatePlaylistModal(true);
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

  const getCountryFlag = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country?.flag || '🌍';
  };

  const AnimatedCollectionCard = ({ collection, index, scrollX }: { collection: Collection; index: number; scrollX: Animated.Value }) => {
    const inputRange = [
      (index - 1) * (CARD_SMALL_WIDTH + CARD_GAP),
      index * (CARD_SMALL_WIDTH + CARD_GAP),
      (index + 1) * (CARD_SMALL_WIDTH + CARD_GAP),
    ];

    const scale = scrollX.interpolate({
      inputRange,
      outputRange: [0.85, 1, 0.85],
      extrapolate: 'clamp',
    });

    const cardWidth = scrollX.interpolate({
      inputRange,
      outputRange: [CARD_SMALL_WIDTH, CARD_LARGE_WIDTH, CARD_SMALL_WIDTH],
      extrapolate: 'clamp',
    });

    const cardHeight = scrollX.interpolate({
      inputRange,
      outputRange: [CARD_SMALL_HEIGHT, CARD_LARGE_HEIGHT, CARD_SMALL_HEIGHT],
      extrapolate: 'clamp',
    });

    return (
      <View style={styles.cardContainer}>
        <Animated.View
          style={[
            styles.collectionCardWrapper,
            {
              width: cardWidth,
              height: cardHeight,
              transform: [{ scale }],
            },
          ]}
        >
          <TouchableOpacity
            style={styles.collectionCard}
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
        </Animated.View>
      </View>
    );
  };

  const AnimatedHorizontalList = ({ collections }: { collections: Collection[] }) => {
    const scrollX = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef<any>(null);
    const currentIndexRef = useRef(0);
    const lastCardPadding = SCREEN_WIDTH - CARD_LARGE_WIDTH - PADDING_LEFT - CARD_GAP;
    const cardInterval = CARD_SMALL_WIDTH + CARD_GAP;

    const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const nearestIndex = Math.round(offsetX / cardInterval);
      const clampedIndex = Math.max(
        0,
        Math.min(
          collections.length - 1,
          Math.max(currentIndexRef.current - 1, Math.min(currentIndexRef.current + 1, nearestIndex))
        )
      );

      if (clampedIndex !== nearestIndex && scrollViewRef.current) {
        scrollViewRef.current.scrollTo({
          x: clampedIndex * cardInterval,
          animated: true,
        });
      }
      currentIndexRef.current = clampedIndex;
    };

    return (
      <Animated.ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.horizontalScroll, { paddingRight: lastCardPadding }]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={handleScrollEnd}
        scrollEventThrottle={16}
        decelerationRate="fast"
        snapToInterval={cardInterval}
        snapToAlignment="start"
        disableIntervalMomentum={true}
      >
        {collections.map((collection, index) => (
          <AnimatedCollectionCard
            key={collection.id}
            collection={collection}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </Animated.ScrollView>
    );
  };

  const renderPlaylistCard = (playlist: Playlist) => (
    <TouchableOpacity
      key={playlist.id}
      style={[styles.playlistCard, { backgroundColor: colors.surface }]}
      onPress={() => handlePlaylistPress(playlist)}
      activeOpacity={0.8}
    >
      {playlist.coverImageUrl ? (
        <Image source={{ uri: playlist.coverImageUrl }} style={styles.playlistCover} />
      ) : (
        <LinearGradient
          colors={[colors.accent, colors.accentLight]}
          style={styles.playlistCover}
        >
          <ListMusic size={28} color={colors.textWhite} />
        </LinearGradient>
      )}
      <View style={styles.playlistContent}>
        <Text style={[styles.playlistTitle, { color: colors.primary }]} numberOfLines={1}>
          {playlist.title}
        </Text>
        <Text style={[styles.playlistMeta, { color: colors.textMuted }]}>
          {playlist.poemIds.length} poem{playlist.poemIds.length !== 1 ? 's' : ''}
        </Text>
        {(playlist.moods.length > 0 || playlist.countryCodes.length > 0) && (
          <View style={styles.playlistTags}>
            {playlist.moods.slice(0, 2).map(mood => (
              <View
                key={mood}
                style={[styles.moodDot, { backgroundColor: colors.mood[mood] }]}
              />
            ))}
            {playlist.countryCodes.slice(0, 2).map(code => (
              <Text key={code} style={styles.flagEmoji}>{getCountryFlag(code)}</Text>
            ))}
          </View>
        )}
      </View>
      <MoreHorizontal size={20} color={colors.textMuted} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isIllustrated ? 'transparent' : colors.background }]}>
      {!isIllustrated && (
        <LinearGradient
          colors={[colors.gradientStart, colors.background]}
          style={styles.gradient}
        />
      )}
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Library</Text>
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeTab === 'curated' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => { triggerHaptic('light'); setActiveTab('curated'); }}
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
            onPress={() => { triggerHaptic('light'); setActiveTab('saved'); }}
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
          <TouchableOpacity
            style={[
              styles.tab,
              { backgroundColor: colors.surface, borderColor: colors.border },
              activeTab === 'collections' && { backgroundColor: colors.primary, borderColor: colors.primary },
            ]}
            onPress={() => { triggerHaptic('light'); setActiveTab('collections'); }}
          >
            <View style={styles.tabWithBadge}>
              <Text
                style={[
                  styles.tabText,
                  { color: colors.textMuted },
                  activeTab === 'collections' && { color: colors.background },
                ]}
              >
                Collections
              </Text>
              {!preferences.isPremium && (
                <Crown
                  size={14}
                  color={activeTab === 'collections' ? colors.background : colors.accent}
                />
              )}
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
                  <AnimatedHorizontalList collections={category.collections} />
                </View>
              ))}
            </>
          ) : activeTab === 'saved' ? (
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
                    onPress={() => { triggerHaptic('medium'); setShowPremiumModal(true); }}
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
          ) : (
            <>
              {!preferences.isPremium && (
                <View style={[styles.premiumBanner, { backgroundColor: colors.premiumLight }]}>
                  <View style={styles.premiumBannerContent}>
                    <Crown size={24} color={colors.accent} />
                    <View style={styles.premiumBannerText}>
                      <Text style={[styles.premiumBannerTitle, { color: colors.primary }]}>
                        Premium Feature
                      </Text>
                      <Text style={[styles.premiumBannerSubtitle, { color: colors.textMuted }]}>
                        Create unlimited collections with custom covers and tags
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={[styles.unlockButton, { backgroundColor: colors.accent }]}
                    onPress={() => { triggerHaptic('medium'); setShowPremiumModal(true); }}
                  >
                    <Text style={[styles.unlockButtonText, { color: colors.textWhite }]}>
                      Unlock
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity
                style={[styles.createPlaylistBtn, { borderColor: colors.accent }]}
                onPress={handleCreateCollection}
                activeOpacity={0.8}
              >
                <View style={[styles.createPlaylistIcon, { backgroundColor: colors.accentLight }]}>
                  <Plus size={24} color={colors.accent} />
                </View>
                <Text style={[styles.createPlaylistText, { color: colors.accent }]}>
                  Create New Collection
                </Text>
              </TouchableOpacity>

              {playlists.length === 0 ? (
                <View style={styles.emptyState}>
                  <ListMusic size={48} color={colors.border} strokeWidth={1} />
                  <Text style={[styles.emptyTitle, { color: colors.primary }]}>
                    No collections yet
                  </Text>
                  <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                    Create your first collection to organize your favorite poems
                  </Text>
                </View>
              ) : (
                <View style={styles.playlistsContainer}>
                  {playlists.map(playlist => renderPlaylistCard(playlist))}
                </View>
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
        feature="Collections"
      />

      <CreatePlaylistModal
        visible={showCreatePlaylistModal}
        onClose={() => setShowCreatePlaylistModal(false)}
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
    gap: 6,
  },
  tabText: {
    fontSize: 14,
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
    paddingLeft: PADDING_LEFT,
    height: CARD_LARGE_HEIGHT + 20,
    alignItems: 'center',
  },
  cardContainer: {
    width: CARD_SMALL_WIDTH + CARD_GAP,
    height: CARD_LARGE_HEIGHT + 20,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  collectionCardWrapper: {
  },
  collectionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'space-between',
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
  premiumBanner: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  premiumBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  premiumBannerText: {
    flex: 1,
  },
  premiumBannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  premiumBannerSubtitle: {
    fontSize: 13,
    lineHeight: 18,
  },
  unlockButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  unlockButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  createPlaylistBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginHorizontal: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  createPlaylistIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPlaylistText: {
    fontSize: 16,
    fontWeight: '600',
  },
  playlistsContainer: {
    paddingHorizontal: 20,
    gap: 10,
  },
  playlistCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  playlistCover: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistContent: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  playlistMeta: {
    fontSize: 13,
    marginBottom: 4,
  },
  playlistTags: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  flagEmoji: {
    fontSize: 14,
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
