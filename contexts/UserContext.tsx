import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { UserPreferences, ReadingStats } from '@/types';
import { usePurchases } from '@/contexts/PurchasesContext';
import { useAuth } from '@/contexts/AuthContext';

const STORAGE_KEY = 'poemcloud_user';
const MAX_FREE_BOOKMARKS = 20;

const defaultPreferences: UserPreferences = {
  moods: [],
  countries: [],
  hasCompletedOnboarding: false,
  isPremium: false,
  bookmarkedPoemIds: [],
  likedPoemIds: [],
  readPoemIds: [],
};

const defaultStats: ReadingStats = {
  totalPoemsRead: 0,
  currentStreak: 0,
  longestStreak: 0,
  favoritePoets: [],
  favoriteMoods: [],
  favoriteCountries: [],
};

export const [UserProvider, useUser] = createContextHook(() => {
  // IMPORTANT: Hook order must remain stable - do not reorder or add conditional hooks
  // 1. Context hooks
  const queryClient = useQueryClient();
  const purchasesContext = usePurchases();
  const authContext = useAuth();
  
  // Extract values after hooks to avoid issues
  const rcIsPremium = purchasesContext?.isPremium;
  const authUser = authContext?.user;
  const updateUserPremiumStatus = authContext?.updateUserPremiumStatus;
  
  // 2. State hooks
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [stats, setStats] = useState<ReadingStats>(defaultStats);

  const preferencesQuery = useQuery({
    queryKey: ['userPreferences'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          preferences: { ...defaultPreferences, ...parsed.preferences },
          stats: { ...defaultStats, ...parsed.stats },
        };
      }
      return { preferences: defaultPreferences, stats: defaultStats };
    },
  });

  useEffect(() => {
    if (preferencesQuery.data) {
      setPreferences(preferencesQuery.data.preferences);
      setStats(preferencesQuery.data.stats);
    }
  }, [preferencesQuery.data]);

  const { mutate: saveData } = useMutation({
    mutationFn: async (data: { preferences: UserPreferences; stats: ReadingStats }) => {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPreferences'] });
    },
  });

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...updates };
      setStats(currentStats => {
        saveData({ preferences: updated, stats: currentStats });
        return currentStats;
      });
      return updated;
    });
  }, [saveData]);

  const completeOnboarding = useCallback((prefs: Partial<UserPreferences>) => {
    setPreferences(prev => {
      const updated = { ...prev, ...prefs, hasCompletedOnboarding: true };
      setStats(currentStats => {
        saveData({ preferences: updated, stats: currentStats });
        return currentStats;
      });
      return updated;
    });
  }, [saveData]);

  const toggleBookmark = useCallback((poemId: string): boolean => {
    let shouldContinue = true;
    
    setPreferences(prev => {
      const isBookmarked = prev.bookmarkedPoemIds.includes(poemId);
      
      if (!isBookmarked && !prev.isPremium && prev.bookmarkedPoemIds.length >= MAX_FREE_BOOKMARKS) {
        shouldContinue = false;
        return prev;
      }

      const updated = isBookmarked
        ? prev.bookmarkedPoemIds.filter(id => id !== poemId)
        : [...prev.bookmarkedPoemIds, poemId];
      
      const newPrefs = { ...prev, bookmarkedPoemIds: updated };
      setStats(currentStats => {
        saveData({ preferences: newPrefs, stats: currentStats });
        return currentStats;
      });
      return newPrefs;
    });
    
    return shouldContinue;
  }, [saveData]);

  const toggleLike = useCallback((poemId: string) => {
    setPreferences(prev => {
      const isLiked = prev.likedPoemIds.includes(poemId);
      const updated = isLiked
        ? prev.likedPoemIds.filter(id => id !== poemId)
        : [...prev.likedPoemIds, poemId];
      
      const newPrefs = { ...prev, likedPoemIds: updated };
      setStats(currentStats => {
        saveData({ preferences: newPrefs, stats: currentStats });
        return currentStats;
      });
      return newPrefs;
    });
  }, [saveData]);

  const markAsRead = useCallback((poemId: string) => {
    setPreferences(prev => {
      if (prev.readPoemIds.includes(poemId)) {
        return prev;
      }
      
      const updated = [...prev.readPoemIds, poemId];
      const newPrefs = { ...prev, readPoemIds: updated };
      
      setStats(prevStats => {
        const newStats = { ...prevStats, totalPoemsRead: prevStats.totalPoemsRead + 1 };
        saveData({ preferences: newPrefs, stats: newStats });
        return newStats;
      });
      
      return newPrefs;
    });
  }, [saveData]);

  const setPremium = useCallback((isPremium: boolean) => {
    setPreferences(prev => {
      const updated = { ...prev, isPremium };
      setStats(currentStats => {
        saveData({ preferences: updated, stats: currentStats });
        return currentStats;
      });
      return updated;
    });
  }, [saveData]);

  useEffect(() => {
    if (rcIsPremium !== undefined && rcIsPremium !== preferences.isPremium) {
      console.log('[UserContext] Syncing premium status from RevenueCat:', rcIsPremium);
      setPreferences(prev => {
        const updated = { ...prev, isPremium: rcIsPremium };
        setStats(currentStats => {
          saveData({ preferences: updated, stats: currentStats });
          return currentStats;
        });
        return updated;
      });
      if (authUser && rcIsPremium !== authUser.isPremium) {
        updateUserPremiumStatus(rcIsPremium);
      }
    }
  }, [rcIsPremium, authUser, preferences.isPremium, saveData, updateUserPremiumStatus]);

  const isBookmarked = useCallback((poemId: string) => {
    return preferences.bookmarkedPoemIds.includes(poemId);
  }, [preferences.bookmarkedPoemIds]);

  const isLiked = useCallback((poemId: string) => {
    return preferences.likedPoemIds.includes(poemId);
  }, [preferences.likedPoemIds]);

  const canBookmark = useCallback(() => {
    return preferences.isPremium || preferences.bookmarkedPoemIds.length < MAX_FREE_BOOKMARKS;
  }, [preferences.isPremium, preferences.bookmarkedPoemIds.length]);

  const bookmarkCount = preferences.bookmarkedPoemIds.length;

  return {
    preferences,
    stats,
    isLoading: preferencesQuery.isLoading,
    updatePreferences,
    completeOnboarding,
    toggleBookmark,
    toggleLike,
    markAsRead,
    setPremium,
    isBookmarked,
    isLiked,
    canBookmark,
    bookmarkCount,
    maxFreeBookmarks: MAX_FREE_BOOKMARKS,
  };
});
