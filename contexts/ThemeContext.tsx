import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, ThemeColors } from '@/constants/colors';

const THEME_STORAGE_KEY = 'poemcloud_theme';

type ThemeMode = 'light' | 'dark' | 'system';

export const [ThemeProvider, useTheme] = createContextHook(() => {
  const systemColorScheme = useColorScheme();
  const queryClient = useQueryClient();
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');

  const themeQuery = useQuery({
    queryKey: ['theme'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      return (stored as ThemeMode) || 'system';
    },
  });

  useEffect(() => {
    if (themeQuery.data) {
      setThemeMode(themeQuery.data);
    }
  }, [themeQuery.data]);

  const saveMutation = useMutation({
    mutationFn: async (mode: ThemeMode) => {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      return mode;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['theme'] });
    },
  });

  const setTheme = useCallback((mode: ThemeMode) => {
    setThemeMode(mode);
    saveMutation.mutate(mode);
  }, [saveMutation]);

  const isDark = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark';
    }
    return themeMode === 'dark';
  }, [themeMode, systemColorScheme]);

  const colors: ThemeColors = useMemo(() => {
    return isDark ? darkTheme : lightTheme;
  }, [isDark]);

  return {
    themeMode,
    setTheme,
    isDark,
    colors,
    isLoading: themeQuery.isLoading,
  };
});
