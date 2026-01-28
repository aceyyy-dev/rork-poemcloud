import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Crown, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

const { width, height } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onComplete: () => void;
}

export default function SubscriptionSuccessModal({ visible, onComplete }: Props) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const crownRotate = useRef(new Animated.Value(0)).current;
  const sparkleAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;
  const animationsRef = useRef<Animated.CompositeAnimation[]>([]);

  useEffect(() => {
    if (visible) {
      triggerHaptic('success');
      animationsRef.current = [];

      const mainAnim = Animated.sequence([
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 8,
            tension: 40,
            useNativeDriver: true,
          }),
        ]),
        Animated.loop(
          Animated.sequence([
            Animated.timing(crownRotate, {
              toValue: 1,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(crownRotate, {
              toValue: 0,
              duration: 0,
              useNativeDriver: true,
            }),
          ])
        ),
      ]);
      mainAnim.start();
      animationsRef.current.push(mainAnim);

      sparkleAnimations.forEach((anim, index) => {
        const sparkleAnim = Animated.loop(
          Animated.sequence([
            Animated.delay(index * 200),
            Animated.timing(anim, {
              toValue: 1,
              duration: 1000,
              useNativeDriver: true,
            }),
            Animated.timing(anim, {
              toValue: 0,
              duration: 1000,
              useNativeDriver: true,
            }),
          ])
        );
        sparkleAnim.start();
        animationsRef.current.push(sparkleAnim);
      });

      const timer = setTimeout(() => {
        animationsRef.current.forEach(anim => anim.stop());
        animationsRef.current = [];

        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          fadeAnim.setValue(0);
          scaleAnim.setValue(0.5);
          crownRotate.setValue(0);
          sparkleAnimations.forEach(anim => anim.setValue(0));
          onComplete();
        });
      }, 2500);

      return () => {
        clearTimeout(timer);
        animationsRef.current.forEach(anim => anim.stop());
        animationsRef.current = [];
      };
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.5);
      crownRotate.setValue(0);
      sparkleAnimations.forEach(anim => anim.setValue(0));
    }
  }, [visible]);

  if (!visible) return null;

  const crownSpin = crownRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const sparklePositions = [
    { top: height * 0.3, left: width * 0.2 },
    { top: height * 0.35, right: width * 0.2 },
    { top: height * 0.45, left: width * 0.15 },
    { top: height * 0.45, right: width * 0.15 },
    { top: height * 0.55, left: width * 0.25 },
    { top: height * 0.55, right: width * 0.25 },
  ];

  return (
    <Modal visible={visible} transparent animationType="none">
      <BlurView intensity={80} style={styles.blur}>
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.content, { backgroundColor: colors.surface }]}>
            <Animated.View
              style={[
                styles.crownContainer,
                {
                  backgroundColor: colors.premiumLight,
                  transform: [{ rotate: crownSpin }],
                },
              ]}
            >
              <Crown size={48} color={colors.accent} strokeWidth={1.5} />
            </Animated.View>

            <Text style={[styles.title, { color: colors.primary }]}>
              Welcome to PoemCloud+
            </Text>
            <Text style={[styles.subtitle, { color: colors.textLight }]}>
              All premium features unlocked
            </Text>
          </View>

          {sparkleAnimations.map((anim, index) => {
            const sparkleOpacity = anim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0, 1, 0],
            });
            const sparkleScale = anim.interpolate({
              inputRange: [0, 0.5, 1],
              outputRange: [0.5, 1.2, 0.5],
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.sparkle,
                  sparklePositions[index],
                  {
                    opacity: sparkleOpacity,
                    transform: [{ scale: sparkleScale }],
                  },
                ]}
              >
                <Sparkles size={24} color={colors.accent} strokeWidth={2} />
              </Animated.View>
            );
          })}
        </Animated.View>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 32,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  crownContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
  },
  sparkle: {
    position: 'absolute',
  },
});
