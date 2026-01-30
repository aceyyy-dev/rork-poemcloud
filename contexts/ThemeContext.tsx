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

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const [themeId, setThemeId] = useState<ThemeId>('system');
  const transitionOpacity = useRef(new Animated.Value(1)).current;

  const themeQuery = useQuery({
    queryKey: ['themeSettings'],
    queryFn: async () => {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        return {
          themeId: (storedTheme as ThemeId) || 'system',
        };
      } catch (error) {
        console.log('[Theme] Error loading theme settings:', error);
        return { themeId: 'system' as ThemeId };
      }
    },
  });

  useEffect(() => {
    if (themeQuery.data) {
      setThemeId(themeQuery.data.themeId);
    }
  }, [themeQuery.data]);

  const { mutate: saveTheme } = useMutation({
    mutationFn: async (newThemeId: ThemeId) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, newThemeId);
      return newThemeId;
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

  const setTheme = useCallback((newThemeId: ThemeId) => {
    console.log('[Theme] Setting theme to:', newThemeId);
    animateTransition();
    setThemeId(newThemeId);
    saveTheme(newThemeId);
  }, [saveTheme, animateTransition]);

  const isPremiumTheme = useMemo(() => {
    return premiumThemes.some(t => t.id === themeId);
  }, [themeId]);

  const isDark = useMemo(() => {
    if (isPremiumTheme) {
      return true;
    }
    
    if (themeId === 'light') return false;
    if (themeId === 'dark') return true;
    return systemColorScheme === 'dark';
  }, [themeId, isPremiumTheme, systemColorScheme]);

  const colors: ThemeColors = useMemo(() => {
    return getThemeColors(themeId, isDark);
  }, [themeId, isDark]);

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
    setTheme,
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
