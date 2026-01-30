import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Lock, Crown, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useScreenCapture } from '@/contexts/ScreenCaptureContext';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface Props {
  onUpgrade: () => void;
}

export default function ScreenCaptureOverlay({ onUpgrade }: Props) {
  const { colors } = useTheme();
  const { showCaptureOverlay, dismissOverlay } = useScreenCapture();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (showCaptureOverlay) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 100,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.9,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showCaptureOverlay]);

  const handleUpgrade = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
    dismissOverlay();
    onUpgrade();
  };

  const handleDismiss = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    dismissOverlay();
  };

  if (!showCaptureOverlay) return null;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {Platform.OS === 'ios' ? (
        <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill} />
      ) : (
        <View style={[StyleSheet.absoluteFill, styles.androidBlur]} />
      )}
      
      <Animated.View 
        style={[
          styles.content,
          { 
            backgroundColor: colors.surface,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <TouchableOpacity style={styles.closeButton} onPress={handleDismiss}>
          <X size={20} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={[styles.iconCircle, { backgroundColor: `${colors.accent}15` }]}>
          <Lock size={32} color={colors.accent} strokeWidth={1.5} />
        </View>

        <Text style={[styles.title, { color: colors.primary }]}>
          Share poems beautifully
        </Text>
        
        <Text style={[styles.subtitle, { color: colors.textMuted }]}>
          Unlock PoemCloud+ to share aesthetic poem cards made for sharing.
        </Text>

        <TouchableOpacity
          style={[styles.upgradeButton, { backgroundColor: colors.accent }]}
          onPress={handleUpgrade}
          activeOpacity={0.8}
        >
          <Crown size={18} color="#fff" strokeWidth={1.5} />
          <Text style={styles.upgradeButtonText}>Start PoemCloud+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.notNowButton}
          onPress={handleDismiss}
          activeOpacity={0.7}
        >
          <Text style={[styles.notNowText, { color: colors.textMuted }]}>Not now</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  androidBlur: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  content: {
    width: width - 48,
    maxWidth: 340,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  upgradeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  notNowButton: {
    paddingVertical: 10,
  },
  notNowText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
