import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Search, Heart, Bookmark, Share2, Headphones, Crown, Cloud, TrendingUp, Pause } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { usePurchases } from '@/contexts/PurchasesContext';
import { poems, getTodaysPoem, getPoemsByMood } from '@/mocks/poems';
import { Poem, Mood } from '@/types';
import Onboarding from '@/components/Onboarding';
import PremiumModal from '@/components/PremiumModal';
import ListenPremiumModal from '@/components/ListenPremiumModal';
import PoemShareCard from '@/components/PoemShareCard';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useTTS } from '@/contexts/TTSContext';
import { useScreenCapture } from '@/contexts/ScreenCaptureContext';
import ScreenCaptureOverlay from '@/components/ScreenCaptureOverlay';

export default function HomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { preferences, completeOnboarding, isLiked, isBookmarked, toggleLike, toggleBookmark } = useUser();
  const { isPremium } = usePurchases();
  const { toggleSpeech, isSpeakingPoem, progress, getRemainingTime } = useTTS();
  const { enterProtectedScreen, exitProtectedScreen } = useScreenCapture();
  const [refreshing, setRefreshing] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showListenModal, setShowListenModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [todaysPoem, setTodaysPoem] = useState<Poem>(getTodaysPoem());
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const likeScale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (preferences.hasCompletedOnboarding) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }).start();
    }
  }, [preferences.hasCompletedOnboarding]);

  useEffect(() => {
    if (preferences.hasCompletedOnboarding) {
      enterProtectedScreen();
      return () => {
        exitProtectedScreen();
      };
    }
  }, [preferences.hasCompletedOnboarding, enterProtectedScreen, exitProtectedScreen]);

  const handleOnboardingComplete = (prefs: {
    moods: Mood[];
    countries: string[];
    isPremium: boolean;
  }) => {
    completeOnboarding(prefs);
  };

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setTodaysPoem(getTodaysPoem());
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.spring(likeScale, { toValue: 1.3, friction: 3, useNativeDriver: true }),
      Animated.spring(likeScale, { toValue: 1, friction: 3, useNativeDriver: true }),
    ]).start();
    toggleLike(todaysPoem.id);
  };

  const handleBookmark = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const success = toggleBookmark(todaysPoem.id);
    if (!success) {
      setShowPremiumModal(true);
    }
  };

  const handleListen = () => {
    if (!isPremium) {
      setShowListenModal(true);
      return;
    }
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    toggleSpeech(todaysPoem.id, todaysPoem.text);
  };

  const isPlayingToday = isSpeakingPoem(todaysPoem.id);

  if (!preferences.hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const trendingPoems = poems.slice(0, 4);
  const moodPoems = preferences.moods.length > 0 
    ? getPoemsByMood(preferences.moods[0]).slice(0, 3)
    : getPoemsByMood('calm').slice(0, 3);

  const liked = isLiked(todaysPoem.id);
  const bookmarked = isBookmarked(todaysPoem.id);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.background]}
        locations={[0, 0.3, 1]}
        style={styles.gradient}
      />
      
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.logoIcon, { backgroundColor: colors.surface }]}>
                <Cloud size={24} color={colors.accent} strokeWidth={1.5} />
              </View>
              <View>
                <Text style={[styles.greeting, { color: colors.textMuted }]}>Good {getTimeOfDay()}</Text>
                <Text style={[styles.appName, { color: colors.primary }]}>PoemCloud</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity 
                style={[styles.searchButton, { backgroundColor: colors.surface }]}
                onPress={() => router.push('/(tabs)/browse')}
              >
                <Search size={22} color={colors.primary} strokeWidth={1.5} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
            }
          >
            <View style={styles.section}>
              <View style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>TODAY'S POEM</Text>
                <Text style={[styles.dateText, { color: colors.textMuted }]}>{getFormattedDate()}</Text>
              </View>
              <TouchableOpacity
                style={[styles.heroCard, { backgroundColor: colors.surface }]}
                activeOpacity={0.95}
                onPress={() => router.push(`/poem/${todaysPoem.id}`)}
              >
                <View style={styles.heroContent}>
                  <Text style={[styles.heroTitle, { color: colors.primary }]}>{todaysPoem.title}</Text>
                  <Text style={[styles.heroPoet, { color: colors.text }]}>{todaysPoem.poet.name}</Text>
                  <Text style={[styles.heroCountry, { color: colors.textMuted }]}>{todaysPoem.country}</Text>
                  
                  <Text style={[styles.heroExcerpt, { color: colors.text }]} numberOfLines={6}>
                    {todaysPoem.text}
                  </Text>
                </View>

                <View style={[styles.heroActions, { borderTopColor: colors.borderLight }]}>
                  <TouchableOpacity onPress={handleLike} style={styles.heroAction}>
                    <Animated.View style={{ transform: [{ scale: likeScale }] }}>
                      <Heart
                        size={22}
                        color={liked ? '#e85d75' : colors.textLight}
                        fill={liked ? '#e85d75' : 'transparent'}
                        strokeWidth={1.5}
                      />
                    </Animated.View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleBookmark} style={styles.heroAction}>
                    <Bookmark
                      size={22}
                      color={bookmarked ? colors.accent : colors.textLight}
                      fill={bookmarked ? colors.accent : 'transparent'}
                      strokeWidth={1.5}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.heroAction} onPress={() => setShowShareModal(true)}>
                    <Share2 size={22} color={colors.textLight} strokeWidth={1.5} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.heroAction}
                    onPress={handleListen}
                  >
                    <View style={styles.premiumIcon}>
                      {isPlayingToday ? (
                        <Pause size={22} color={colors.accent} strokeWidth={1.5} />
                      ) : (
                        <>
                          <Headphones size={22} color={isPremium ? colors.textLight : colors.accent} strokeWidth={1.5} />
                          {!isPremium && <Crown size={10} color={colors.accent} style={styles.crownBadge} />}
                        </>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

                {isPlayingToday && (
                  <View style={[styles.heroAudioPlayer, { backgroundColor: colors.surfaceSecondary }]}>
                    <TouchableOpacity onPress={handleListen} style={styles.heroAudioControl}>
                      <Pause size={18} color={colors.accent} />
                    </TouchableOpacity>
                    <View style={styles.heroAudioMiddle}>
                      <View style={[styles.heroAudioProgress, { backgroundColor: colors.border }]}>
                        <View style={[styles.heroAudioProgressFill, { backgroundColor: colors.accent, width: `${Math.round(progress * 100)}%` }]} />
                      </View>
                    </View>
                    <Text style={[styles.heroAudioTime, { color: colors.textMuted }]}>{getRemainingTime()}</Text>
                  </View>
                )}
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <TrendingUp size={18} color={colors.primary} strokeWidth={1.5} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>Trending today</Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScroll}
              >
                {trendingPoems.map((poem) => (
                  <TouchableOpacity
                    key={poem.id}
                    style={[styles.trendingCard, { backgroundColor: colors.surface }]}
                    onPress={() => router.push(`/poem/${poem.id}`)}
                    activeOpacity={0.8}
                  >
                    <Text style={[styles.trendingTitle, { color: colors.primary }]} numberOfLines={2}>{poem.title}</Text>
                    <Text style={[styles.trendingPoet, { color: colors.textMuted }]}>{poem.poet.name}</Text>
                    <View style={styles.trendingMood}>
                      <View style={[styles.moodDot, { backgroundColor: colors.mood[poem.moods[0]] }]} />
                      <Text style={[styles.moodText, { color: colors.textMuted }]}>{poem.moods[0]}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <View style={[styles.moodDot, { backgroundColor: colors.mood[preferences.moods[0] || 'calm'] }]} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  {preferences.moods.length > 0 
                    ? `Poems for ${preferences.moods[0]}`
                    : 'Poems for calm'
                  }
                </Text>
              </View>
              {moodPoems.map((poem) => (
                <TouchableOpacity
                  key={poem.id}
                  style={[styles.listCard, { backgroundColor: colors.surface }]}
                  onPress={() => router.push(`/poem/${poem.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.listContent}>
                    <Text style={[styles.listTitle, { color: colors.primary }]}>{poem.title}</Text>
                    <Text style={[styles.listPoet, { color: colors.textMuted }]}>{poem.poet.name} • {poem.country}</Text>
                  </View>
                  <View style={styles.listMoodTag}>
                    <View style={[styles.moodDot, { backgroundColor: colors.mood[preferences.moods[0] || 'calm'] }]} />
                    <Text style={[styles.moodText, { color: colors.textMuted }]}>{preferences.moods[0] || 'calm'}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>

      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onSubscribe={() => {
          setShowPremiumModal(false);
        }}
      />

      <ListenPremiumModal
        visible={showListenModal}
        onClose={() => setShowListenModal(false)}
        onUpgrade={() => {
          setShowListenModal(false);
          setShowPremiumModal(true);
        }}
      />

      <PoemShareCard
        poem={todaysPoem}
        visible={showShareModal}
        onClose={() => setShowShareModal(false)}
      />

      <ScreenCaptureOverlay onUpgrade={() => setShowPremiumModal(true)} />
    </View>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

function getFormattedDate(): string {
  const date = new Date();
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  greeting: {
    fontSize: 13,
    marginBottom: 2,
  },
  appName: {
    fontSize: 22,
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
  scrollContent: {
    paddingBottom: 24,
  },
  section: {
    marginBottom: 28,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  heroCard: {
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  heroContent: {
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  heroPoet: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  heroCountry: {
    fontSize: 14,
    marginBottom: 16,
  },
  heroExcerpt: {
    fontSize: 16,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  heroActions: {
    flexDirection: 'row',
    gap: 24,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  heroAudioPlayer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 10,
  },
  heroAudioControl: {
    padding: 4,
  },
  heroAudioMiddle: {
    flex: 1,
  },
  heroAudioProgress: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  heroAudioProgressFill: {
    height: '100%',
    borderRadius: 2,
  },
  heroAudioTime: {
    fontSize: 12,
    fontWeight: '500' as const,
    minWidth: 36,
  },
  heroAction: {
    padding: 4,
  },
  premiumIcon: {
    position: 'relative',
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  horizontalScroll: {
    paddingLeft: 20,
    paddingRight: 8,
    gap: 12,
  },
  trendingCard: {
    width: 160,
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  trendingTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 20,
  },
  trendingPoet: {
    fontSize: 13,
    marginBottom: 12,
  },
  trendingMood: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  moodText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  listContent: {
    flex: 1,
  },
  listTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  listPoet: {
    fontSize: 13,
  },
  listMoodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
});
