import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Modal,
  TextInput,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  X,
  Heart,
  Bookmark,
  Share2,
  Headphones,
  Languages,
  Crown,
  Pause,
  Search,
  Play,
  XCircle,
  Copy,
  Check,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import { getPoemById } from '@/mocks/poems';

import PremiumModal from '@/components/PremiumModal';
import ListenPremiumModal from '@/components/ListenPremiumModal';
import FeaturePremiumModal from '@/components/FeaturePremiumModal';
import * as Haptics from 'expo-haptics';
import { useTTS } from '@/contexts/TTSContext';
import PoemShareCard from '@/components/PoemShareCard';
import { useScreenCapture } from '@/contexts/ScreenCaptureContext';
import ScreenCaptureOverlay from '@/components/ScreenCaptureOverlay';
import { translateWithAI, SUPPORTED_LANGUAGES } from '@/utils/translation';
import * as Clipboard from 'expo-clipboard';



export default function PoemDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { isLiked, isBookmarked, toggleLike, toggleBookmark, markAsRead } = useUser();
  const { isPremium } = usePurchases();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumFeature] = useState<string>();
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [translationLanguage, setTranslationLanguage] = useState<string | null>(null);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);
  const [showListenModal, setShowListenModal] = useState(false);
  const [showTranslateModal, setShowTranslateModal] = useState(false);
  const { toggleSpeech, isSpeakingPoem, stopSpeaking, progress, getRemainingTime, getElapsedTime, seekTo, hasActiveAudio, dismissPlayer, isCompleted, duration } = useTTS();
  const { enterProtectedScreen, exitProtectedScreen } = useScreenCapture();
  const [languageSearch, setLanguageSearch] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(true);
  const translationCacheRef = useRef<Record<string, string>>({});
  const [translationError, setTranslationError] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [copiedPoem, setCopiedPoem] = useState(false);
  const [copiedContext, setCopiedContext] = useState(false);
  
  const likeScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  const poem = getPoemById(id);

  React.useEffect(() => {
    if (poem) {
      markAsRead(poem.id);
    }
  }, [poem?.id, markAsRead, poem]);

  React.useEffect(() => {
    enterProtectedScreen();
    return () => {
      exitProtectedScreen();
    };
  }, [enterProtectedScreen, exitProtectedScreen]);

  React.useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [stopSpeaking]);

  if (!poem) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <Text style={[styles.errorText, { color: colors.textMuted }]}>Poem not found</Text>
        </SafeAreaView>
      </View>
    );
  }

  const liked = isLiked(poem.id);
  const bookmarked = isBookmarked(poem.id);

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    toggleLike(poem.id);
  };

  const handleBookmark = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.spring(bookmarkScale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
      Animated.spring(bookmarkScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    const success = toggleBookmark(poem.id);
    if (!success) {
      setShowPremiumModal(true);
    }
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  const handleTranslate = () => {
    if (!isPremium) {
      setShowTranslateModal(true);
      return;
    }
    setShowLanguagePicker(true);
  };



  const handleSelectLanguage = async (languageLabel: string, languageCode: string) => {
    if (!poem) return;

    setTranslationError(null);
    setShowLanguagePicker(false);
    setLanguageSearch('');

    const isOriginal = languageLabel === poem.originalLanguage && poem.translatedText;
    setIsAIGenerated(!isOriginal);

    if (isOriginal && poem.translatedText) {
      setTranslationLanguage(languageLabel);
      setTranslatedText(poem.translatedText);
      setShowTranslation(true);
      return;
    }

    const cacheKey = `${poem.id}:${languageCode}`;
    if (translationCacheRef.current[cacheKey]) {
      console.log('[Translation] Cache hit:', languageLabel);
      setTranslationLanguage(languageLabel);
      setTranslatedText(translationCacheRef.current[cacheKey]);
      setShowTranslation(true);
      return;
    }

    console.log('[Translation] Cache miss, calling AI for:', languageLabel);
    setIsTranslating(true);

    try {
      const result = await translateWithAI(poem.text, languageLabel);
      translationCacheRef.current[cacheKey] = result;
      setTranslationLanguage(languageLabel);
      setTranslatedText(result);
      setShowTranslation(true);
      console.log('[Translation] Success');
    } catch (error) {
      console.error('[Translation] Failed:', error);
      setTranslationError('Translation unavailable right now. Try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleListen = () => {
    if (!isPremium) {
      setShowListenModal(true);
      return;
    }
    if (poem) {
      toggleSpeech(poem.id, poem.text);
    }
  };

  const isPlaying = poem ? isSpeakingPoem(poem.id) : false;
  const showAudioUI = poem ? hasActiveAudio(poem.id) : false;

  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang =>
    lang.label.toLowerCase().includes(languageSearch.toLowerCase())
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.background]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <X size={22} color={colors.primary} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleTranslate}
            >
              <Languages size={20} color={isPremium ? colors.primary : colors.accent} strokeWidth={1.5} />
              {!isPremium && <Crown size={10} color={colors.accent} style={styles.crownBadge} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.surface }]}
              onPress={handleListen}
            >
              {isPlaying ? (
                <Pause size={20} color={colors.accent} strokeWidth={1.5} />
              ) : (
                <>
                  <Headphones size={20} color={isPremium ? colors.primary : colors.accent} strokeWidth={1.5} />
                  {!isPremium && <Crown size={10} color={colors.accent} style={styles.crownBadge} />}
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            onPress={() => router.push(`/poet/${poem.poetId}`)}
            activeOpacity={0.7}
          >
            <Text style={[styles.poetName, { color: colors.primary }]}>{poem.poet.name}</Text>
          </TouchableOpacity>
          <Text style={[styles.countryLabel, { color: colors.textMuted }]}>
            {poem.country}
            {poem.originalLanguage !== 'English' && ` • ${poem.originalLanguage}`}
          </Text>

          <Text style={[styles.poemTitle, { color: colors.primary }]}>{poem.title}</Text>

          {translationError && (
            <View style={[styles.errorBanner, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.errorText, { color: colors.textMuted }]}>{translationError}</Text>
            </View>
          )}

          {showTranslation && translatedText && (
            <View>
              <View style={styles.translationToggleContainer}>
                <TouchableOpacity
                  style={[
                    styles.translationPill,
                    !showTranslation && { backgroundColor: colors.accent },
                    showTranslation && { backgroundColor: colors.surfaceSecondary },
                  ]}
                  onPress={() => setShowTranslation(false)}
                >
                  <Text
                    style={[
                      styles.translationPillText,
                      !showTranslation && { color: '#fff' },
                      showTranslation && { color: colors.textMuted },
                    ]}
                  >
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.translationPill,
                    showTranslation && { backgroundColor: colors.accent },
                    !showTranslation && { backgroundColor: colors.surfaceSecondary },
                  ]}
                  onPress={() => setShowTranslation(true)}
                >
                  <Text
                    style={[
                      styles.translationPillText,
                      showTranslation && { color: '#fff' },
                      !showTranslation && { color: colors.textMuted },
                    ]}
                  >
                    {translationLanguage} {isAIGenerated && '(AI)'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View style={styles.poemTextContainer}>
            <Text style={[styles.poemText, { color: colors.text }]}>
              {showTranslation && translatedText ? translatedText : poem.text}
            </Text>
            <TouchableOpacity
              style={[styles.copyButton, { backgroundColor: colors.surfaceSecondary }]}
              onPress={async () => {
                const textToCopy = showTranslation && translatedText ? translatedText : poem.text;
                await Clipboard.setStringAsync(textToCopy);
                setCopiedPoem(true);
                if (Platform.OS !== 'web') {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }
                setTimeout(() => setCopiedPoem(false), 2000);
              }}
            >
              {copiedPoem ? (
                <Check size={16} color={colors.accent} />
              ) : (
                <Copy size={16} color={colors.textMuted} />
              )}
              <Text style={[styles.copyButtonText, { color: copiedPoem ? colors.accent : colors.textMuted }]}>
                {copiedPoem ? 'Copied!' : 'Copy poem'}
              </Text>
            </TouchableOpacity>
          </View>

          {showAudioUI && (
            <AudioPlayerInline
              progress={progress}
              remainingTime={getRemainingTime()}
              elapsedTime={getElapsedTime()}
              duration={duration}
              isPlaying={isPlaying}
              isCompleted={isCompleted}
              onToggle={handleListen}
              onSeek={seekTo}
              onDismiss={dismissPlayer}
              colors={colors}
            />
          )}

          <View style={styles.moodContainer}>
            {poem.moods.map(mood => (
              <View
                key={mood}
                style={[styles.moodTag, { backgroundColor: `${colors.mood[mood]}20` }]}
              >
                <View style={[styles.moodDot, { backgroundColor: colors.mood[mood] }]} />
                <Text style={[styles.moodLabel, { color: colors.mood[mood] }]}>{mood}</Text>
              </View>
            ))}
          </View>

          {poem.culturalContext && (
            <View style={[styles.contextCard, { backgroundColor: colors.surfaceSecondary }]}>
              <View style={styles.contextHeader}>
                <Text style={[styles.contextTitle, { color: colors.primary }]}>Cultural Context</Text>
                <TouchableOpacity
                  style={[styles.contextCopyButton, { backgroundColor: colors.surface }]}
                  onPress={async () => {
                    await Clipboard.setStringAsync(poem.culturalContext || '');
                    setCopiedContext(true);
                    if (Platform.OS !== 'web') {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    }
                    setTimeout(() => setCopiedContext(false), 2000);
                  }}
                >
                  {copiedContext ? (
                    <Check size={14} color={colors.accent} />
                  ) : (
                    <Copy size={14} color={colors.textMuted} />
                  )}
                </TouchableOpacity>
              </View>
              <Text style={[styles.contextText, { color: colors.text }]}>{poem.culturalContext}</Text>
            </View>
          )}
        </ScrollView>

        <View style={[styles.bottomBar, { backgroundColor: colors.surface, borderTopColor: colors.borderLight }]}>
          <TouchableOpacity onPress={handleLike} style={styles.bottomAction}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Heart
                size={24}
                color={liked ? '#e85d75' : colors.textLight}
                fill={liked ? '#e85d75' : 'transparent'}
                strokeWidth={1.5}
              />
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleBookmark} style={styles.bottomAction}>
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <Bookmark
                size={24}
                color={bookmarked ? colors.accent : colors.textLight}
                fill={bookmarked ? colors.accent : 'transparent'}
                strokeWidth={1.5}
              />
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity onPress={handleShare} style={styles.bottomAction}>
            <Share2 size={24} color={colors.textLight} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={() => {
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

      <FeaturePremiumModal
        visible={showTranslateModal}
        onClose={() => setShowTranslateModal(false)}
        onUpgrade={() => {
          setShowTranslateModal(false);
          setShowPremiumModal(true);
        }}
        feature="translate"
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
                  onPress={() => handleSelectLanguage(language.label, language.code)}
                  disabled={isTranslating}
                >
                  <Text style={[styles.languageText, { color: colors.text, opacity: isTranslating ? 0.5 : 1 }]}>{language.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {poem && (
        <PoemShareCard
          poem={poem}
          visible={showShareModal}
          onClose={() => setShowShareModal(false)}
        />
      )}

      <ScreenCaptureOverlay onUpgrade={() => setShowPremiumModal(true)} />
    </View>
  );
}

interface AudioPlayerInlineProps {
  progress: number;
  remainingTime: string;
  elapsedTime: string;
  duration: number;
  isPlaying: boolean;
  isCompleted: boolean;
  onToggle: () => void;
  onSeek: (position: number) => void;
  onDismiss: () => void;
  colors: any;
}

function AudioPlayerInline({ progress, remainingTime, elapsedTime, duration, isPlaying, isCompleted, onToggle, onSeek, onDismiss, colors }: AudioPlayerInlineProps) {
  const progressBarWidth = React.useRef(0);
  const [localProgress, setLocalProgress] = React.useState(progress);
  const isDragging = React.useRef(false);

  React.useEffect(() => {
    if (!isDragging.current) {
      setLocalProgress(progress);
    }
  }, [progress]);

  const handleLayout = (event: any) => {
    progressBarWidth.current = event.nativeEvent.layout.width;
  };

  const panResponder = React.useMemo(() => 
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        isDragging.current = true;
        const locationX = evt.nativeEvent.locationX;
        const newProgress = Math.max(0, Math.min(1, locationX / progressBarWidth.current));
        setLocalProgress(newProgress);
      },
      onPanResponderMove: (evt) => {
        const locationX = evt.nativeEvent.locationX;
        const newProgress = Math.max(0, Math.min(1, locationX / progressBarWidth.current));
        setLocalProgress(newProgress);
      },
      onPanResponderRelease: (evt) => {
        isDragging.current = false;
        const locationX = evt.nativeEvent.locationX;
        const newProgress = Math.max(0, Math.min(1, locationX / progressBarWidth.current));
        onSeek(newProgress);
      },
    }), [onSeek]);

  const progressPercent = `${Math.round(localProgress * 100)}%`;

  return (
    <View style={[styles.audioPlayer, { backgroundColor: colors.surfaceSecondary }]}>
      <TouchableOpacity onPress={onToggle} style={styles.audioPlayButton}>
        {isPlaying ? (
          <Pause size={24} color={colors.accent} />
        ) : (
          <Play size={24} color={colors.accent} />
        )}
      </TouchableOpacity>
      <View style={styles.audioInfo}>
        <View 
          style={styles.audioProgressWrapper}
          onLayout={handleLayout}
          {...panResponder.panHandlers}
        >
          <View style={[styles.audioProgress, { backgroundColor: colors.border }]}>
            <View style={[styles.audioProgressFill, { backgroundColor: colors.accent, width: progressPercent }]} />
            <View style={[styles.audioThumb, { backgroundColor: colors.accent, left: progressPercent }]} />
          </View>
        </View>
        <View style={styles.audioTimeRow}>
          <Text style={[styles.audioStatusText, { color: colors.textMuted }]}>
            {isCompleted ? 'Finished' : isPlaying ? 'Playing' : 'Paused'}
          </Text>
          <Text style={[styles.audioTime, { color: colors.textMuted }]}>
            {elapsedTime} / {Math.floor(duration / 60)}:{Math.floor(duration % 60).toString().padStart(2, '0')}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={onDismiss} style={styles.audioDismissButton}>
        <XCircle size={20} color={colors.textMuted} />
      </TouchableOpacity>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
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
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  crownBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  poetName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  countryLabel: {
    fontSize: 14,
    marginBottom: 24,
  },
  poemTitle: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 24,
    letterSpacing: -0.5,
    lineHeight: 36,
  },
  viewingLabel: {
    fontSize: 11,
    marginBottom: 6,
    fontStyle: 'italic' as const,
  },
  translationToggle: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    marginBottom: 16,
  },
  translationToggleText: {
    fontSize: 13,
    fontWeight: '500',
  },
  poemText: {
    fontSize: 18,
    lineHeight: 32,
    letterSpacing: 0.2,
  },
  audioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
    gap: 14,
  },
  audioPlayButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(74, 144, 164, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioInfo: {
    flex: 1,
    gap: 8,
  },
  audioProgressWrapper: {
    height: 24,
    justifyContent: 'center',
  },
  audioProgress: {
    height: 4,
    borderRadius: 2,
    position: 'relative' as const,
  },
  audioProgressFill: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute' as const,
    left: 0,
    top: 0,
  },
  audioThumb: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: 'absolute' as const,
    top: -5,
    marginLeft: -7,
  },
  audioTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  audioStatusText: {
    fontSize: 12,
    fontWeight: '500' as const,
  },
  audioTime: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  audioDismissButton: {
    padding: 8,
    marginLeft: 8,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 24,
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  contextCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },
  contextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  contextTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  contextCopyButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contextText: {
    fontSize: 15,
    lineHeight: 24,
  },
  poemTextContainer: {
    marginBottom: 24,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 16,
  },
  copyButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  bottomAction: {
    padding: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
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
  errorBanner: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  translationToggleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  translationPill: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
  },
  translationPillText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
