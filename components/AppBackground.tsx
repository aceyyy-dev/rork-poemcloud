import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { useWallpaper } from '@/contexts/WallpaperContext';
import { useTheme } from '@/contexts/ThemeContext';

type AppBackgroundProps = {
  children: React.ReactNode;
};

export default function AppBackground({ children }: AppBackgroundProps) {
  const { currentWallpaper, hasWallpaper } = useWallpaper();
  const { colors, isDark } = useTheme();

  if (!hasWallpaper || !currentWallpaper) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {children}
      </View>
    );
  }

  const overlayColor = isDark ? currentWallpaper.darkOverlay : currentWallpaper.lightOverlay;

  return (
    <View style={styles.container}>
      <View style={styles.wallpaperContainer} pointerEvents="none">
        <Image
          source={{ uri: currentWallpaper.imageUrl }}
          style={styles.wallpaperImage}
          resizeMode="cover"
        />
        <View style={[styles.overlay, { backgroundColor: overlayColor }]} />
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wallpaperContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  wallpaperImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
  },
});
