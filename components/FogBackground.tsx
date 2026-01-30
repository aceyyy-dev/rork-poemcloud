import React, { useEffect, useRef, useMemo } from 'react';
import { View, StyleSheet, Animated, Dimensions, Platform, AccessibilityInfo } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FOG_SIZE = Math.max(SCREEN_WIDTH, SCREEN_HEIGHT) * 1.5;

interface FogLayerProps {
  size: number;
  color: string;
  opacity: number;
  translateX: Animated.AnimatedInterpolation<number>;
  translateY: Animated.AnimatedInterpolation<number>;
  scale: Animated.AnimatedInterpolation<number>;
  blur: number;
}

function FogLayer({ size, color, opacity, translateX, translateY, scale, blur }: FogLayerProps) {
  return (
    <Animated.View
      style={[
        styles.fogLayer,
        {
          width: size,
          height: size,
          backgroundColor: color,
          opacity,
          borderRadius: size / 2,
          transform: [
            { translateX },
            { translateY },
            { scale },
          ],
        },
      ]}
    />
  );
}

export default function FogBackground() {
  const { isDark } = useTheme();
  const reduceMotionRef = useRef(false);
  
  const layer1Anim = useRef(new Animated.Value(0)).current;
  const layer2Anim = useRef(new Animated.Value(0)).current;
  const layer3Anim = useRef(new Animated.Value(0)).current;
  const breatheAnim = useRef(new Animated.Value(0)).current;

  const fogConfig = useMemo(() => {
    if (isDark) {
      return {
        layer1Color: 'rgba(70, 90, 120, 1)',
        layer2Color: 'rgba(50, 70, 100, 1)',
        layer3Color: 'rgba(60, 80, 110, 1)',
        layer1Opacity: 0.08,
        layer2Opacity: 0.06,
        layer3Opacity: 0.05,
      };
    }
    return {
      layer1Color: 'rgba(180, 200, 220, 1)',
      layer2Color: 'rgba(160, 180, 210, 1)',
      layer3Color: 'rgba(170, 190, 215, 1)',
      layer1Opacity: 0.05,
      layer2Opacity: 0.04,
      layer3Opacity: 0.03,
    };
  }, [isDark]);

  useEffect(() => {
    const checkReduceMotion = async () => {
      if (Platform.OS === 'web') {
        const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)');
        reduceMotionRef.current = mediaQuery?.matches ?? false;
      } else {
        reduceMotionRef.current = await AccessibilityInfo.isReduceMotionEnabled();
      }
      startAnimations();
    };

    const startAnimations = () => {
      if (reduceMotionRef.current) {
        Animated.timing(breatheAnim, {
          toValue: 1,
          duration: 30000,
          useNativeDriver: true,
        }).start();
        return;
      }

      Animated.loop(
        Animated.timing(layer1Anim, {
          toValue: 1,
          duration: 45000,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(layer2Anim, {
          toValue: 1,
          duration: 55000,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.timing(layer3Anim, {
          toValue: 1,
          duration: 35000,
          useNativeDriver: true,
        })
      ).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(breatheAnim, {
            toValue: 1,
            duration: 25000,
            useNativeDriver: true,
          }),
          Animated.timing(breatheAnim, {
            toValue: 0,
            duration: 25000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    checkReduceMotion();

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (isEnabled) => {
        reduceMotionRef.current = isEnabled;
        layer1Anim.stopAnimation();
        layer2Anim.stopAnimation();
        layer3Anim.stopAnimation();
        breatheAnim.stopAnimation();
        layer1Anim.setValue(0);
        layer2Anim.setValue(0);
        layer3Anim.setValue(0);
        breatheAnim.setValue(0);
        startAnimations();
      }
    );

    return () => {
      subscription.remove();
      layer1Anim.stopAnimation();
      layer2Anim.stopAnimation();
      layer3Anim.stopAnimation();
      breatheAnim.stopAnimation();
    };
  }, [layer1Anim, layer2Anim, layer3Anim, breatheAnim]);

  const layer1TranslateX = layer1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-FOG_SIZE * 0.3, FOG_SIZE * 0.2, -FOG_SIZE * 0.3],
  });

  const layer1TranslateY = layer1Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-FOG_SIZE * 0.2, -FOG_SIZE * 0.1, -FOG_SIZE * 0.2],
  });

  const layer2TranslateX = layer2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [FOG_SIZE * 0.1, -FOG_SIZE * 0.15, FOG_SIZE * 0.1],
  });

  const layer2TranslateY = layer2Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [FOG_SIZE * 0.05, FOG_SIZE * 0.15, FOG_SIZE * 0.05],
  });

  const layer3TranslateX = layer3Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [-FOG_SIZE * 0.1, FOG_SIZE * 0.1, -FOG_SIZE * 0.1],
  });

  const layer3TranslateY = layer3Anim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [FOG_SIZE * 0.1, -FOG_SIZE * 0.05, FOG_SIZE * 0.1],
  });

  const breatheScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.03],
  });

  const staticScale = breatheAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1],
  });

  return (
    <View style={styles.container} pointerEvents="none">
      <FogLayer
        size={FOG_SIZE}
        color={fogConfig.layer1Color}
        opacity={fogConfig.layer1Opacity}
        translateX={layer1TranslateX}
        translateY={layer1TranslateY}
        scale={staticScale}
        blur={80}
      />
      <FogLayer
        size={FOG_SIZE * 0.9}
        color={fogConfig.layer2Color}
        opacity={fogConfig.layer2Opacity}
        translateX={layer2TranslateX}
        translateY={layer2TranslateY}
        scale={breatheScale}
        blur={100}
      />
      <FogLayer
        size={FOG_SIZE * 0.8}
        color={fogConfig.layer3Color}
        opacity={fogConfig.layer3Opacity}
        translateX={layer3TranslateX}
        translateY={layer3TranslateY}
        scale={staticScale}
        blur={120}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  fogLayer: {
    position: 'absolute',
    top: -SCREEN_HEIGHT * 0.3,
    left: -SCREEN_WIDTH * 0.3,
  },
});
