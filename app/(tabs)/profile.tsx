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
import { getCountryByCode } from '@/mocks/countries';
import {
  Crown,
  BookOpen,
  Flame,
  Globe,
  Heart,
  Settings,
  ChevronRight,
  Sparkles,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/contexts/ThemeContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { poems } from '@/mocks/poems';
import PremiumModal from '@/components/PremiumModal';
import AuthModal from '@/components/AuthModal';

import { triggerHaptic } from '@/utils/haptics';

export default function ProfileScreen() {
  const router = useRouter();
  const { colors, isIllustrated } = useTheme();
  const { preferences, stats, setPremium } = useUser();
  const { isLoggedIn } = useAuth();
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');

  const likedPoems = poems.filter(p => preferences.likedPoemIds.includes(p.id));
  const readPoems = poems.filter(p => preferences.readPoemIds.includes(p.id));

  const getTopMoods = () => {
    const moodCounts: Record<string, number> = {};
    const interactedPoemIds = [
      ...preferences.readPoemIds,
      ...preferences.likedPoemIds,
      ...preferences.bookmarkedPoemIds,
    ];

    const uniquePoemIds = [...new Set(interactedPoemIds)];

    uniquePoemIds.forEach((poemId) => {
      const poem = poems.find((p) => p.id === poemId);
      if (!poem) return;

      const weight = preferences.likedPoemIds.includes(poemId)
        ? 3
        : preferences.bookmarkedPoemIds.includes(poemId)
          ? 2
          : 1;

      poem.moods.forEach((mood) => {
        moodCounts[mood] = (moodCounts[mood] || 0) + weight;
      });
    });

    return Object.entries(moodCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood], index) => ({ mood, rank: index + 1 }));
  };

  const getTopRegions = () => {
    const regionCounts: Record<string, number> = {};
    const interactedPoemIds = [
      ...preferences.readPoemIds,
      ...preferences.likedPoemIds,
      ...preferences.bookmarkedPoemIds,
    ];

    const uniquePoemIds = [...new Set(interactedPoemIds)];

    uniquePoemIds.forEach((poemId) => {
      const poem = poems.find((p) => p.id === poemId);
      if (!poem?.countryCode) return;

      const weight = preferences.likedPoemIds.includes(poemId)
        ? 3
        : preferences.bookmarkedPoemIds.includes(poemId)
          ? 2
          : 1;

      regionCounts[poem.countryCode] = (regionCounts[poem.countryCode] || 0) + weight;
    });

    return Object.entries(regionCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code], index) => ({ code, rank: index + 1 }));
  };

  const topMoods = getTopMoods();
  const topRegions = getTopRegions();

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
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Profile</Text>
          <TouchableOpacity
            style={[styles.settingsButton, { backgroundColor: colors.surface }]}
            onPress={() => { triggerHaptic('light'); router.push('/settings'); }}
          >
            <Settings size={22} color={colors.primary} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          {!isLoggedIn && (
            <View style={[styles.authCard, { backgroundColor: colors.surface }]}>
              <Text style={[styles.authCardTitle, { color: colors.primary }]}>Save your progress</Text>
              <Text style={[styles.authCardSubtitle, { color: colors.textMuted }]}>
                Sync bookmarks, preferences, and PoemCloud+ across devices.
              </Text>
              <View style={styles.authCardButtons}>
                <TouchableOpacity
                  style={[styles.authCardButton, styles.authCardButtonPrimary, { backgroundColor: colors.primary }]}
                  onPress={() => {
                    triggerHaptic('light');
                    setAuthMode('signup');
                    setShowAuthModal(true);
                  }}
                >
                  <Text style={[styles.authCardButtonText, { color: colors.background }]}>Sign up</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.authCardButton, { backgroundColor: colors.background, borderWidth: 1, borderColor: colors.border }]}
                  onPress={() => {
                    triggerHaptic('light');
                    setAuthMode('login');
                    setShowAuthModal(true);
                  }}
                >
                  <Text style={[styles.authCardButtonText, { color: colors.primary }]}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {!preferences.isPremium ? (
            <TouchableOpacity
              style={styles.premiumBanner}
              onPress={() => { triggerHaptic('medium'); setShowPremiumModal(true); }}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={[colors.accent, '#3a7a8a']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.premiumGradient}
              />
              <View style={styles.premiumContent}>
                <View style={styles.premiumIcon}>
                  <Crown size={20} color={colors.textWhite} />
                </View>
                <View style={styles.premiumText}>
                  <Text style={[styles.premiumTitle, { color: colors.textWhite }]}>Upgrade to PoemCloud+</Text>
                  <Text style={styles.premiumSubtitle}>
                    Audio, translations, unlimited saves
                  </Text>
                </View>
                <ChevronRight size={20} color={colors.textWhite} />
              </View>
            </TouchableOpacity>
          ) : (
            <View style={[styles.memberBadge, { backgroundColor: colors.premiumLight }]}>
              <Crown size={20} color={colors.accent} />
              <Text style={[styles.memberBadgeText, { color: colors.accent }]}>PoemCloud+ Member</Text>
            </View>
          )}

          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <BookOpen size={24} color={colors.primary} strokeWidth={1.5} />
              <Text style={[styles.statValue, { color: colors.primary }]}>{readPoems.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Poems Read</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Heart size={24} color="#e85d75" strokeWidth={1.5} />
              <Text style={[styles.statValue, { color: colors.primary }]}>{likedPoems.length}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Liked</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: colors.surface }]}>
              <Flame size={24} color="#ff9f43" strokeWidth={1.5} />
              <Text style={[styles.statValue, { color: colors.primary }]}>{stats.currentStreak}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>Day Streak</Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color={colors.primary} strokeWidth={1.5} />
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>About You</Text>
            </View>
            
            <View style={[styles.profileCard, { backgroundColor: colors.surface }]} testID="profileAboutYouCard">
              {topMoods.length > 0 ? (
                <>
                  <View style={styles.profileRow}>
                    <Text style={[styles.profileLabel, { color: colors.textMuted }]}>Top moods</Text>
                    <View style={styles.analyticsRow}>
                      {topMoods.map((item) => (
                        <View key={item.mood} style={styles.analyticsItem}>
                          <Text style={[styles.analyticsRank, { color: colors.accent }]}>#{item.rank}</Text>
                          <View style={[styles.analyticsMoodDot, { backgroundColor: colors.mood[item.mood as keyof typeof colors.mood] }]} />
                          <Text style={[styles.analyticsText, { color: colors.textMuted }]}>
                            {item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}
                          </Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  <View style={styles.profileRow}>
                    <Text style={[styles.profileLabel, { color: colors.textMuted }]}>Favorite regions</Text>
                    {topRegions.length > 0 ? (
                      <View style={styles.analyticsRow}>
                        {topRegions.map((item) => {
                          const country = getCountryByCode(item.code);
                          return (
                            <View key={item.code} style={styles.analyticsItem}>
                              <Text style={[styles.analyticsRank, { color: colors.accent }]}>#{item.rank}</Text>
                              <Text style={styles.analyticsFlag}>{country?.flag ?? '🌍'}</Text>
                              <Text style={[styles.analyticsText, { color: colors.textMuted }]}>
                                {country?.name ?? item.code}
                              </Text>
                            </View>
                          );
                        })}
                      </View>
                    ) : (
                      <Text style={[styles.profileValue, { color: colors.textMuted }]}>Read poems to discover</Text>
                    )}
                  </View>

                  {preferences.isPremium && (
                    <View style={[styles.insightBox, { backgroundColor: colors.premiumLight }]}>
                      <Text style={[styles.insightText, { color: colors.primary }]}>
                        You&apos;re drawn to {topMoods[0]?.mood}
                        {topRegions[0]?.code
                          ? ` poetry from ${getCountryByCode(topRegions[0].code)?.name ?? topRegions[0].code}`
                          : ' poetry'}.
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <View style={styles.emptyProfile}>
                  <Text style={[styles.emptyText, { color: colors.textMuted }]}>
                    Like or bookmark poems to discover your poetry profile
                  </Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.primary }]}>Preferences</Text>
            
            <View style={[styles.preferencesList, { backgroundColor: colors.surface }]}>
              <View style={[styles.preferenceItem, { borderBottomColor: colors.borderLight }]}>
                <Heart size={20} color={colors.textLight} strokeWidth={1.5} />
                <View style={styles.preferenceContent}>
                  <Text style={[styles.preferenceLabel, { color: colors.primary }]}>Moods</Text>
                  <Text style={[styles.preferenceValue, { color: colors.textMuted }]}>
                    {preferences.moods.length > 0 ? preferences.moods.join(', ') : 'Not set'}
                  </Text>
                </View>
              </View>

              <View style={styles.preferenceItem}>
                <Globe size={20} color={colors.textLight} strokeWidth={1.5} />
                <View style={styles.preferenceContent}>
                  <Text style={[styles.preferenceLabel, { color: colors.primary }]}>Countries</Text>
                  <Text style={[styles.preferenceValue, { color: colors.textMuted }]}>
                    {preferences.countries.includes('ALL') 
                      ? 'All countries' 
                      : preferences.countries.length > 0 
                        ? `${preferences.countries.length} selected`
                        : 'Not set'
                    }
                  </Text>
                </View>
              </View>
            </View>
          </View>
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

      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
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
  settingsButton: {
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  premiumBanner: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  premiumGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  premiumContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  premiumIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  premiumText: {
    flex: 1,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  premiumSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.85)',
  },
  memberBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  memberBadgeText: {
    fontSize: 15,
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  profileRow: {
    marginBottom: 16,
  },
  profileLabel: {
    fontSize: 13,
    marginBottom: 8,
  },
  analyticsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  analyticsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  analyticsRank: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  analyticsMoodDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  analyticsText: {
    fontSize: 13,
    fontWeight: '600',
  },
  analyticsFlag: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  profileValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  insightBox: {
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
  },
  insightText: {
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  emptyProfile: {
    paddingVertical: 12,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  preferencesList: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  preferenceContent: {
    flex: 1,
    marginLeft: 14,
  },
  preferenceLabel: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  preferenceValue: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
  authCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  authCardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 6,
  },
  authCardSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  authCardButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  authCardButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  authCardButtonPrimary: {},
  authCardButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
