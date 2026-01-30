import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback, useMemo } from 'react';

const WALLPAPER_STORAGE_KEY = 'poemcloud_wallpaper';

export type WallpaperId = 'none' | 'morning-light' | 'golden-dusk' | 'blue-hour';

export type WallpaperDefinition = {
  id: WallpaperId;
  name: string;
  imageUrl: string;
  lightOverlay: string;
  darkOverlay: string;
};

export const wallpapers: WallpaperDefinition[] = [
  {
    id: 'morning-light',
    name: 'Morning Light',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/q3i73qdzouovfn2ocd581',
    lightOverlay: 'rgba(255, 255, 255, 0.35)',
    darkOverlay: 'rgba(13, 26, 36, 0.55)',
  },
  {
    id: 'golden-dusk',
    name: 'Golden Dusk',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/npbdzlqetwcden1e1rr5w',
    lightOverlay: 'rgba(255, 250, 245, 0.40)',
    darkOverlay: 'rgba(13, 26, 36, 0.50)',
  },
  {
    id: 'blue-hour',
    name: 'Blue Hour',
    imageUrl: 'https://pub-e001eb4506b145aa938b5d3badbff6a5.r2.dev/attachments/r1rliyesdxtm38f72neip',
    lightOverlay: 'rgba(255, 255, 255, 0.45)',
    darkOverlay: 'rgba(13, 20, 30, 0.45)',
  },
];

export const [WallpaperProvider, useWallpaper] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [wallpaperId, setWallpaperId] = useState<WallpaperId>('none');

  const wallpaperQuery = useQuery({
    queryKey: ['wallpaperSettings'],
    queryFn: async () => {
      try {
        const stored = await AsyncStorage.getItem(WALLPAPER_STORAGE_KEY);
        console.log('[Wallpaper] Loaded wallpaper setting:', stored);
        return {
          wallpaperId: (stored as WallpaperId) || 'none',
        };
      } catch (error) {
        console.log('[Wallpaper] Error loading wallpaper settings:', error);
        return { wallpaperId: 'none' as WallpaperId };
      }
    },
  });

  useEffect(() => {
    if (wallpaperQuery.data) {
      setWallpaperId(wallpaperQuery.data.wallpaperId);
    }
  }, [wallpaperQuery.data]);

  const { mutate: saveWallpaper } = useMutation({
    mutationFn: async (newWallpaperId: WallpaperId) => {
      console.log('[Wallpaper] Saving wallpaper:', newWallpaperId);
      await AsyncStorage.setItem(WALLPAPER_STORAGE_KEY, newWallpaperId);
      return newWallpaperId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallpaperSettings'] });
    },
  });

  const setWallpaper = useCallback((newWallpaperId: WallpaperId) => {
    console.log('[Wallpaper] Setting wallpaper to:', newWallpaperId);
    setWallpaperId(newWallpaperId);
    saveWallpaper(newWallpaperId);
  }, [saveWallpaper]);

  const currentWallpaper = useMemo(() => {
    if (wallpaperId === 'none') return null;
    return wallpapers.find(w => w.id === wallpaperId) || null;
  }, [wallpaperId]);

  const hasWallpaper = wallpaperId !== 'none';

  const clearWallpaper = useCallback(() => {
    setWallpaper('none');
  }, [setWallpaper]);

  return {
    wallpaperId,
    setWallpaper,
    currentWallpaper,
    hasWallpaper,
    clearWallpaper,
    wallpapers,
    isLoading: wallpaperQuery.isLoading,
  };
});
