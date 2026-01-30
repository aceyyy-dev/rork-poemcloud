import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useColorScheme, Animated } from 'react-native';
import { 
  ThemeColors, 
  ThemeId, 
  getThemeColors,
  premiumThemes,
  freeThemes,
} from '@/constants/colors';

const THEME_STORAGE_KEY = 'poemcloud_theme';
const APPEARANCE_STORAGE_KEY = 'poemcloud_appearance';

type AppearanceMode = 'light' | 'dark' | 'system';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const [themeId, setThemeId] = useState<ThemeId>('system');
  const [appearanceMode, setAppearanceMode] = useState<AppearanceMode>('system');
  const transitionOpacity = useRef(new Animated.Value(1)).current;

  const themeQuery = useQuery({
    queryKey: ['themeSettings'],
    queryFn: async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const storedAppearance = await AsyncStorage.getItem(APPEARANCE_STORAGE_KEY);
        
        return {
          themeId: (storedTheme as ThemeId) || 'system',
          appearanceMode: (storedAppearance as AppearanceMode) || 'system',
        };
      } catch (error) {
        console.log('[Theme] Error loading theme settings:', error);
        return { themeId: 'system' as ThemeId, appearanceMode: 'system' as AppearanceMode };
      }
    },
  });

  useEffect(() => {
    if (themeQuery.data) {
      setThemeId(themeQuery.data.themeId);
      setAppearanceMode(themeQuery.data.appearanceMode);
    }
  }, [themeQuery.data]);

  const saveThemeMutation = useMutation({
    mutationFn: async (newThemeId: ThemeId) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeId);
      return newThemeId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themeSettings'] });
    },
  });

  const saveAppearanceMutation = useMutation({
    mutationFn: async (mode: AppearanceMode) => {
      await AsyncStorage.setItem(APPEARANCE_STORAGE_KEY, mode);
      return mode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['themeSettings'] });
    },
  });

  const animateTransition = useCallback(() => {
    Animated.sequence([
      Animated.timing(transitionOpacity, {
        toValue: 0.97,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(transitionOpacity, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
  }, [transitionOpacity]);

  const saveTheme = saveThemeMutation.mutate;
  const saveAppearance = saveAppearanceMutation.mutate;

  const setTheme = useCallback((newThemeId: ThemeId) => {
    console.log('[Theme] Setting theme to:', newThemeId);
    animateTransition();
    
    if (newThemeId === 'light' || newThemeId === 'dark' || newThemeId === 'system') {
      setThemeId(newThemeId);
      setAppearanceMode(newThemeId);
      saveTheme(newThemeId);
      saveAppearance(newThemeId);
    } else {
      setThemeId(newThemeId);
      saveTheme(newThemeId);
    }
  }, [saveTheme, saveAppearance, animateTransition]);

  const setAppearance = useCallback((mode: AppearanceMode) => {
    console.log('[Theme] Setting appearance to:', mode);
    animateTransition();
    setAppearanceMode(mode);
    saveAppearance(mode);
  }, [saveAppearance, animateTransition]);

  const isDark = useMemo(() => {
    if (themeId === 'light') return false;
    if (themeId === 'dark') return true;
    if (themeId === 'system') {
      return systemColorScheme === 'dark';
    }
    
    if (appearanceMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return appearanceMode === 'dark';
  }, [themeId, appearanceMode, systemColorScheme]);

  const colors: ThemeColors = useMemo(() => {
    return getThemeColors(themeId, isDark);
  }, [themeId, isDark]);

  const isPremiumTheme = useMemo(() => {
    return premiumThemes.some(t => t.id === themeId);
  }, [themeId]);

  const currentThemeName = useMemo(() => {
    if (themeId === 'light') return 'Light';
    if (themeId === 'dark') return 'Dark';
    if (themeId === 'system') return 'System';
    const premium = premiumThemes.find(t => t.id === themeId);
    return premium?.name || 'System';
  }, [themeId]);

  const resetToFreeTheme = useCallback(() => {
    console.log('[Theme] Resetting to free theme');
    setTheme('system');
  }, [setTheme]);

  return {
    themeId,
    appearanceMode,
    setTheme,
    setAppearance,
    isDark,
    colors,
    isLoading: themeQuery.isLoading,
    isPremiumTheme,
    currentThemeName,
    resetToFreeTheme,
    premiumThemes,
    freeThemes,
    transitionOpacity,
  };
});
