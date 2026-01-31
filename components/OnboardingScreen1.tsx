import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Cloud } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

const { width, height } = Dimensions.get('window');

interface Props {
  onNext: () => void;
}

export default function OnboardingScreen1({ onNext }: Props) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const subtextFade = useRef(new Animated.Value(0)).current;
  const quoteFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;
  const cloudAnim1 = useRef(new Animated.Value(0)).current;
  const cloudAnim2 = useRef(new Animated.Value(0)).current;
  const cloudAnim3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(subtextFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(quoteFade, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudAnim1, {
          toValue: 1,
          duration: 8000,
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim1, {
          toValue: 0,
          duration: 8000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudAnim2, {
          toValue: 1,
          duration: 10000,
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim2, {
          toValue: 0,
          duration: 10000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(cloudAnim3, {
          toValue: 1,
          duration: 12000,
          useNativeDriver: true,
        }),
        Animated.timing(cloudAnim3, {
          toValue: 0,
          duration: 12000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const cloud1Transform = cloudAnim1.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });

  const cloud2Transform = cloudAnim2.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const cloud3Transform = cloudAnim3.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 25],
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.gradientEnd, colors.background]}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      />
      
      <Animated.View
        style={[
          styles.cloud,
          styles.cloud1,
          { backgroundColor: colors.cloud1, transform: [{ translateY: cloud1Transform }] },
        ]}
      />
      <Animated.View
        style={[
          styles.cloud,
          styles.cloud2,
          { backgroundColor: colors.cloud2, transform: [{ translateX: cloud2Transform }] },
        ]}
      />
      <Animated.View
        style={[
          styles.cloud,
          styles.cloud3,
          { backgroundColor: colors.cloud3, transform: [{ translateY: cloud3Transform }] },
        ]}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.content}>
          <Animated.View style={[styles.logoContainer, { opacity: fadeAnim }]}>
            <View style={[styles.logoIcon, { backgroundColor: colors.surface }]}>
              <Cloud size={32} color={colors.accent} strokeWidth={1.5} />
            </View>
            <Text style={[styles.logoText, { color: colors.primary }]}>PoemCloud</Text>
          </Animated.View>

          <View style={styles.mainContent}>
            <Animated.Text style={[styles.title, { opacity: fadeAnim, color: colors.primary }]}>
              Discover poetry from{'\n'}every corner of the world.
            </Animated.Text>

            <Animated.View style={[styles.quoteContainer, { opacity: quoteFade }]}>
              <Text style={[styles.quote, { color: colors.textLight }]}>
                {'"'}Poetry is the clear expression{`\n`}of mixed feelings.{"\""}
              </Text>
              <Text style={[styles.quoteAuthor, { color: colors.textMuted }]}>— W.H. Auden</Text>
            </Animated.View>
          </View>

          <Animated.View style={[styles.buttonContainer, { opacity: buttonFade }]}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => {
                triggerHaptic('medium');
                onNext();
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Begin</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </SafeAreaView>
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
  cloud: {
    position: 'absolute',
    borderRadius: 100,
    opacity: 0.6,
  },
  cloud1: {
    width: 200,
    height: 80,
    top: height * 0.08,
    left: -50,
  },
  cloud2: {
    width: 150,
    height: 60,
    top: height * 0.18,
    right: -30,
  },
  cloud3: {
    width: 180,
    height: 70,
    bottom: height * 0.12,
    right: -40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingTop: 40,
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    textAlign: 'center',
    lineHeight: 44,
    letterSpacing: -0.5,
    marginBottom: 40,
  },
  quoteContainer: {
    alignItems: 'center',
  },
  quote: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  quoteAuthor: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    paddingBottom: 20,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
