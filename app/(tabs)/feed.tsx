import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  TextInput,
  ScrollView,
  PanResponder,
  GestureResponderEvent,
  PanResponderGestureState,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, Bookmark, Share2, Headphones, Languages, Crown, Search, X, Check, Play, Pause, ListPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { poems } from '@/mocks/poems';
import { Poem } from '@/types';
import PremiumModal from '@/components/PremiumModal';
import ListenPremiumModal from '@/components/ListenPremiumModal';
import * as Haptics from 'expo-haptics';
import { useTTS } from '@/contexts/TTSContext';
import PoemShareCard from '@/components/PoemShareCard';
import AddToPlaylistModal from '@/components/AddToPlaylistModal';


const { width, height } = Dimensions.get('window');
const CARD_PADDING = 20;
const ACTION_RAIL_WIDTH = 52;

const SUPPORTED_LANGUAGES = [
  { name: 'French', code: 'fr' },
  { name: 'Spanish', code: 'es' },
  { name: 'German', code: 'de' },
  { name: 'Italian', code: 'it' },
  { name: 'Portuguese', code: 'pt' },
  { name: 'Russian', code: 'ru' },
  { name: 'Dutch', code: 'nl' },
  { name: 'Polish', code: 'pl' },
  { name: 'Arabic', code: 'ar' },
  { name: 'Japanese', code: 'ja' },
  { name: 'Chinese', code: 'zh' },
];

export default function FeedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { preferences, isLiked, isBookmarked, toggleLike, toggleBookmark, setPremium, markAsRead } = useUser();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState<string>();
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [selectedPoemForTranslate, setSelectedPoemForTranslate] = useState<string | null>(null);
  const [translatedPoems, setTranslatedPoems] = useState<Record<string, { language: string; text: string }>>({});
  const [showTranslation, setShowTranslation] = useState<Record<string, boolean>>({});
  const [languageSearch, setLanguageSearch] = useState('');
  const [showListenModal, setShowListenModal] = useState(false);
  const { stopSpeaking, toggleSpeech, isSpeakingPoem, hasActiveAudio, isPaused, progress, getRemainingTime, seekTo, duration } = useTTS();
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePoem, setSharePoem] = useState<Poem | null>(null);
  const [translationCache, setTranslationCache] = useState<Record<string, string>>({});
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [playlistPoem, setPlaylistPoem] = useState<Poem | null>(null);

  const ITEM_HEIGHT = height - insets.top - insets.bottom - 120;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 50 }).current;

  const onViewableItemsChangedRef = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      const index = viewableItems[0].index;
      setCurrentIndex(index);
      markAsRead(viewableItems[0].item.id);
      stopSpeaking();
    }
  });

  const sortedPoems = useMemo(() => {
    let sorted = [...poems];
    if (preferences.moods.length > 0) {
      sorted.sort((a, b) => {
        const aMatch = a.moods.some(m => preferences.moods.includes(m));
        const bMatch = b.moods.some(m => preferences.moods.includes(m));
        if (aMatch && !bMatch) return -1;
        if (!aMatch && bMatch) return 1;
        return 0;
      });
    }
    return sorted;
  }, [preferences.moods]);

  const handlePremiumAction = (feature: string) => {
    if (!preferences.isPremium) {
      setPremiumFeature(feature);
      setShowPremiumModal(true);
    }
  };

  const handleTranslate = (poemId: string) => {
    if (!preferences.isPremium) {
      handlePremiumAction('Translations');
      return;
    }
    setSelectedPoemForTranslate(poemId);
    setShowLanguagePicker(true);
  };

  const [isTranslating, setIsTranslating] = useState(false);

  const handleSelectLanguage = (languageName: string, languageCode: string) => {
    if (!selectedPoemForTranslate) return;

    const poem = sortedPoems.find(p => p.id === selectedPoemForTranslate);
    if (!poem) return;

    setTranslationError(null);
    setShowLanguagePicker(false);
    setLanguageSearch('');

    const cacheKey = `${selectedPoemForTranslate}-${languageCode}`;
    if (translationCache[cacheKey]) {
      console.log('[Translation] Using cached translation:', languageName);
      setTranslatedPoems(prev => ({
        ...prev,
        [selectedPoemForTranslate]: {
          language: languageName,
          text: translationCache[cacheKey],
        },
      }));
      setShowTranslation(prev => ({ ...prev, [selectedPoemForTranslate]: true }));
      setSelectedPoemForTranslate(null);
      return;
    }

    console.log('[Translation] Translation feature not available');
    setTranslationError('Translation feature is currently unavailable.');
    setSelectedPoemForTranslate(null);
  };

  const handleShare = useCallback((poem: Poem) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSharePoem(poem);
    setShowShareModal(true);
  }, []);

  const handleAddToPlaylist = useCallback((poem: Poem) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setPlaylistPoem(poem);
    setShowPlaylistModal(true);
  }, []);

  const handleListen = useCallback((poemId: string, poemText: string) => {
    if (!preferences.isPremium) {
      setShowListenModal(true);
      return;
    }
    toggleSpeech(poemId, poemText);
  }, [preferences.isPremium, toggleSpeech]);

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.name.toLowerCase().includes(languageSearch.toLowerCase())
  );

  const handleSearchPress = () => {
    router.push('/(tabs)/browse');
  };

  const renderItem = useCallback(({ item: poem }: { item: Poem }) => (
    <FeedItem
      poem={poem}
      itemHeight={ITEM_HEIGHT}
      isLiked={isLiked(poem.id)}
      isBookmarked={isBookmarked(poem.id)}
      isPremium={preferences.isPremium}
      translatedText={translatedPoems[poem.id]}
      showTranslation={showTranslation[poem.id]}
      isPlaying={isSpeakingPoem(poem.id)}
      showAudioUI={hasActiveAudio(poem.id)}
      isAudioPaused={isPaused}
      progress={progress}
      remainingTime={getRemainingTime()}
      duration={duration}
      onSeek={seekTo}
      onLike={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        toggleLike(poem.id);
      }}
      onBookmark={() => {
        if (Platform.OS !== 'web') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        const success = toggleBookmark(poem.id);
        if (!success) {
          setShowPremiumModal(true);
        }
      }}
      onShare={() => handleShare(poem)}
      onListen={() => handleListen(poem.id, poem.text)}
      onTranslate={() => handleTranslate(poem.id)}
      onToggleTranslation={() => {
        setShowTranslation(prev => ({ ...prev, [poem.id]: !prev[poem.id] }));
      }}
      onAddToPlaylist={() => handleAddToPlaylist(poem)}
      onPress={() => router.push(`/poem/${poem.id}`)}
      onPoetPress={() => router.push(`/poet/${poem.poetId}`)}
      colors={colors}
    />
  ), [isLiked, isBookmarked, preferences.isPremium, toggleLike, toggleBookmark, router, colors, translatedPoems, showTranslation, isSpeakingPoem, hasActiveAudio, isPaused, ITEM_HEIGHT, handleListen, progress, getRemainingTime, handleAddToPlaylist]);

  const getItemLayout = useCallback((_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), [ITEM_HEIGHT]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.background]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>For You</Text>
          <TouchableOpacity 
            style={[styles.searchButton, { backgroundColor: colors.surface }]}
            onPress={handleSearchPress}
          >
            <Search size={22} color={colors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <FlatList
          data={sortedPoems}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="start"
          decelerationRate="fast"
          onViewableItemsChanged={onViewableItemsChangedRef.current}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={getItemLayout}
        />
      </SafeAreaView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={() => {
          setPremium(true);
          setShowPremiumModal(false);
        }}
        feature={premiumFeature}
      />

      <ListenPremiumModal
        visible={showListenModal}
        onClose={() => setShowListenModal(false)}
        onUpgrade={() => {
          setShowListenModal(false);
          setShowPremiumModal(true);
        }}
      />

      <Modal
        visible={showLanguagePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLanguagePicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.languagePickerContainer, { backgroundColor: colors.surface }]}>
            <View style={styles.languagePickerHeader}>
              <Text style={[styles.languagePickerTitle, { color: colors.primary }]}>
                Translate to
              </Text>
              <TouchableOpacity onPress={() => setShowLanguagePicker(false)}>
                <X size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
            
            <View style={[styles.searchContainer, { backgroundColor: colors.surfaceSecondary, borderColor: colors.border }]}>
              <Search size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search languages..."
                placeholderTextColor={colors.textMuted}
                value={languageSearch}
                onChangeText={setLanguageSearch}
              />
            </View>

            <ScrollView style={styles.languageList} showsVerticalScrollIndicator={false}>
              {isTranslating && (
                <View style={styles.loadingContainer}>
                  <Text style={[styles.loadingText, { color: colors.textMuted }]}>Translating...</Text>
                </View>
              )}
              {filteredLanguages.map(language => (
                <TouchableOpacity
                  key={language.code}
                  style={[styles.languageItem, { borderBottomColor: colors.borderLight }]}
                  onPress={() => handleSelectLanguage(language.name, language.code)}
                  disabled={isTranslating}
                >
                  <Text style={[styles.languageText, { color: colors.text, opacity: isTranslating ? 0.5 : 1 }]}>{language.name}</Text>
                  <Check size={20} color={colors.accent} style={{ opacity: 0 }} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {sharePoem && (
        <PoemShareCard
          poem={sharePoem}
          visible={showShareModal}
          onClose={() => {
            setShowShareModal(false);
            setSharePoem(null);
          }}
        />
      )}

      {playlistPoem && (
        <AddToPlaylistModal
          visible={showPlaylistModal}
          onClose={() => {
            setShowPlaylistModal(false);
            setPlaylistPoem(null);
          }}
          poem={playlistPoem}
          onShowPremium={() => {
            setShowPlaylistModal(false);
            setPlaylistPoem(null);
            setShowPremiumModal(true);
          }}
        />
      )}
    </View>
  );
}

interface FeedItemProps {
  poem: Poem;
  itemHeight: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isPremium: boolean;
  translatedText?: { language: string; text: string; isAIGenerated?: boolean };
  showTranslation?: boolean;
  isPlaying: boolean;
  showAudioUI: boolean;
  isAudioPaused: boolean;
  progress: number;
  remainingTime: string;
  duration: number;
  onSeek: (position: number) => void;
  onLike: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onListen: () => void;
  onTranslate: () => void;
  onToggleTranslation: () => void;
  onAddToPlaylist: () => void;
  onPress: () => void;
  onPoetPress: () => void;
  colors: any;
}

const FeedItem = React.memo(function FeedItem({
  poem,
  itemHeight,
  isLiked,
  isBookmarked,
  isPremium,
  translatedText,
  showTranslation,
  isPlaying,
  showAudioUI,
  isAudioPaused,
  progress,
  remainingTime,
  duration,
  onSeek,
  onLike,
  onBookmark,
  onShare,
  onListen,
  onTranslate,
  onToggleTranslation,
  onAddToPlaylist,
  onPress,
  onPoetPress,
  colors,
}: FeedItemProps) {
  const likeScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;
  const progressBarWidth = useRef(0);
  const isDragging = useRef(false);
  const [localProgress, setLocalProgress] = useState(progress);

  React.useEffect(() => {
    if (!isDragging.current) {
      setLocalProgress(progress);
    }
  }, [progress]);

  const handleProgressBarLayout = (event: any) => {
    progressBarWidth.current = event.nativeEvent.layout.width;
  };

  const panResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt: GestureResponderEvent) => {
      isDragging.current = true;
      const locationX = evt.nativeEvent.locationX;
      const newProgress = Math.max(0, Math.min(1, locationX / progressBarWidth.current));
      setLocalProgress(newProgress);
    },
    onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
      const locationX = evt.nativeEvent.locationX;
      const newProgress = Math.max(0, Math.min(1, locationX / progressBarWidth.current));
      setLocalProgress(newProgress);
    },
    onPanResponderRelease: (evt: GestureResponderEvent) => {
      isDragging.current = false;
      const locationX = evt.nativeEvent.locationX;
      const newProgress = Math.max(0, Math.min(1, locationX / progressBarWidth.current));
      onSeek(newProgress);
    },
  }), [onSeek]);

  const animateLike = () => {
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.4, friction: 3, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    onLike();
  };

  const animateBookmark = () => {
    Animated.sequence([
      Animated.spring(bookmarkScale, { toValue: 1.4, friction: 3, useNativeDriver: true }),
      Animated.spring(bookmarkScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    onBookmark();
  };

  const displayText = showTranslation && translatedText 
    ? translatedText.text 
    : poem.text;
  
  const MAX_LINES = 11;
  const lines = displayText.split('\n');
  const totalLines = lines.length;
  const isLongPoem = totalLines > MAX_LINES;
  const truncatedLines = isLongPoem ? lines.slice(0, MAX_LINES) : lines;
  const truncatedText = truncatedLines.join('\n');
  const showContinueReading = isLongPoem;

  const getPoetYears = () => {
    const { birthYear, deathYear } = poem.poet;
    if (!birthYear) return '';
    if (deathYear) return `${birthYear}–${deathYear}`;
    return `${birthYear}–present`;
  };
  const poetYears = getPoetYears();

  const progressPercent = `${Math.round(localProgress * 100)}%`;

  return (
    <View style={[styles.feedItem, { height: itemHeight }]}>
      <TouchableOpacity
        style={[styles.feedContent, { backgroundColor: colors.surface }]}
        activeOpacity={0.95}
        onPress={onPress}
      >
        <TouchableOpacity onPress={onPoetPress} activeOpacity={0.7}>
          <View style={styles.poetHeader}>
            <Text style={[styles.poetName, { color: colors.primary }]}>{poem.poet.name}</Text>
            {poetYears ? (
              <Text style={[styles.poetYears, { color: colors.textMuted }]}>{poetYears}</Text>
            ) : null}
          </View>
        </TouchableOpacity>
        <Text style={[styles.countryLabel, { color: colors.textMuted }]}>
          {poem.country}
          {poem.originalLanguage !== 'English' && ` • ${poem.originalLanguage}`}
        </Text>

        <View style={styles.poemContent}>
          <Text style={[styles.poemTitle, { color: colors.primary }]}>{poem.title}</Text>
          
          {showTranslation && translatedText && (
            <TouchableOpacity 
              style={[styles.translationBadge, { backgroundColor: colors.accentLight }]}
              onPress={onToggleTranslation}
            >
              <Text style={[styles.translationBadgeText, { color: colors.accent }]}>
                {translatedText.isAIGenerated 
                  ? `${translatedText.language} (AI generated) • Tap for English`
                  : `${translatedText.language} • Tap for English`}
              </Text>
            </TouchableOpacity>
          )}
          
          <View style={styles.poemTextContainer}>
            <Text style={[styles.poemText, { color: colors.text }]} numberOfLines={MAX_LINES * 2}>
              {truncatedText}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSection}>
          {showContinueReading && (
            <Text style={[styles.continueReading, { color: colors.accent }]}>Continue reading...</Text>
          )}
          <View style={styles.moodContainer}>
            {poem.moods.slice(0, 2).map(mood => (
              <View
                key={mood}
                style={[styles.moodTag, { backgroundColor: `${colors.mood[mood]}20` }]}
              >
                <View style={[styles.moodDot, { backgroundColor: colors.mood[mood] }]} />
                <Text style={[styles.moodLabel, { color: colors.mood[mood] }]}>{mood}</Text>
              </View>
            ))}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionsContainer}>
        <View style={styles.actionsRail}>
          <TouchableOpacity onPress={animateLike} style={styles.actionBtn}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Heart
                size={26}
                color={isLiked ? '#e85d75' : colors.textLight}
                fill={isLiked ? '#e85d75' : 'transparent'}
                strokeWidth={1.5}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={animateBookmark} style={styles.actionBtn}>
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <Bookmark
                size={26}
                color={isBookmarked ? colors.accent : colors.textLight}
                fill={isBookmarked ? colors.accent : 'transparent'}
                strokeWidth={1.5}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onShare} style={styles.actionBtn}>
            <Share2 size={26} color={colors.textLight} strokeWidth={1.5} />
          </TouchableOpacity>

          <TouchableOpacity onPress={onTranslate} style={styles.actionBtn}>
            <View style={styles.premiumAction}>
              <Languages
                size={26}
                color={isPremium ? colors.textLight : colors.accent}
                strokeWidth={1.5}
              />
              {!isPremium && <Crown size={10} color={colors.accent} style={styles.crownIcon} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onListen} style={styles.actionBtn}>
            <View style={styles.premiumAction}>
              {isPlaying ? (
                <Pause size={26} color={colors.accent} strokeWidth={1.5} />
              ) : (
                <Headphones
                  size={26}
                  color={isPremium ? colors.textLight : colors.accent}
                  strokeWidth={1.5}
                />
              )}
              {!isPremium && !isPlaying && <Crown size={10} color={colors.accent} style={styles.crownIcon} />}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onAddToPlaylist} style={styles.actionBtn}>
            <View style={styles.premiumAction}>
              <ListPlus
                size={26}
                color={isPremium ? colors.textLight : colors.accent}
                strokeWidth={1.5}
              />
              {!isPremium && <Crown size={10} color={colors.accent} style={styles.crownIcon} />}
            </View>
          </TouchableOpacity>
        </View>

        {showAudioUI && (
          <View style={[styles.floatingAudioPlayer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <TouchableOpacity onPress={onListen} style={styles.audioPlayPause}>
              {isPlaying ? (
                <Pause size={18} color={colors.accent} />
              ) : (
                <Play size={18} color={colors.accent} />
              )}
            </TouchableOpacity>
            <View 
              style={styles.audioProgressContainer}
              onLayout={handleProgressBarLayout}
              {...panResponder.panHandlers}
            >
              <View style={[styles.audioProgressTrack, { backgroundColor: colors.border }]}>
                <View style={[styles.audioProgressFill, { backgroundColor: colors.accent, width: progressPercent }]} />
                <View style={[styles.audioProgressThumb, { backgroundColor: colors.accent, left: progressPercent }]} />
              </View>
            </View>
            <Text style={[styles.audioTimeSmall, { color: colors.textMuted }]}>{localProgress >= 1 ? '0:00' : remainingTime}</Text>
          </View>
        )}
      </View>
    </View>
  );
});

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  feedItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  feedContent: {
    flex: 1,
    borderRadius: 20,
    padding: CARD_PADDING,
    marginRight: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  poetHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  poetName: {
    fontSize: 15,
    fontWeight: '600',
  },
  poetYears: {
    fontSize: 13,
    fontWeight: '400',
  },
  countryLabel: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 14,
  },
  poemContent: {
    flex: 1,
    overflow: 'hidden',
  },
  poemTextContainer: {
    flex: 1,
    overflow: 'hidden',
  },
  bottomSection: {
    paddingTop: 12,
    minHeight: 60,
  },
  poemTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 14,
    letterSpacing: -0.3,
  },
  translationBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 12,
  },
  translationBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  poemText: {
    fontSize: 15,
    lineHeight: 24,
    letterSpacing: 0.1,
    fontWeight: '400' as const,
  },
  continueReading: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 10,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  moodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moodLabel: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  actionsContainer: {
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingVertical: 12,
    paddingBottom: 16,
    width: ACTION_RAIL_WIDTH,
  },
  floatingAudioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
    width: 160,
    marginLeft: -108,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    gap: 8,
  },
  audioPlayPause: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioTimeSmall: {
    fontSize: 11,
    fontWeight: '600' as const,
    minWidth: 32,
    textAlign: 'right' as const,
  },
  audioProgressContainer: {
    flex: 1,
    height: 24,
    justifyContent: 'center',
  },
  audioProgressTrack: {
    height: 4,
    borderRadius: 2,
    width: '100%',
    position: 'relative' as const,
  },
  audioProgressFill: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute' as const,
    left: 0,
    top: 0,
  },
  audioProgressThumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute' as const,
    top: -3,
    marginLeft: -5,
  },
  actionsRail: {
    justifyContent: 'flex-end',
    gap: 10,
    width: ACTION_RAIL_WIDTH,
  },
  actionBtn: {
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  premiumAction: {
    position: 'relative',
  },
  crownIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  languagePickerContainer: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    paddingBottom: 40,
    maxHeight: '70%',
  },
  languagePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  languagePickerTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  languageList: {
    paddingHorizontal: 20,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  languageText: {
    fontSize: 16,
  },
  loadingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 14,
    fontStyle: 'italic' as const,
  },
});
