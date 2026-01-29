import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Check } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

const { width } = Dimensions.get('window');

interface Props {
  visible: boolean;
  onComplete: () => void;
}

export default function SubscriptionSuccessModal({ visible, onComplete }: Props) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible) {
      triggerHaptic('success');

      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      checkScale.setValue(0);
      glowAnim.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 60,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.sequence([
          Animated.spring(checkScale, {
            toValue: 1,
            friction: 5,
            tension: 80,
            useNativeDriver: true,
          }),
          Animated.loop(
            Animated.sequence([
              Animated.timing(glowAnim, {
                toValue: 1,
                duration: 1200,
                useNativeDriver: true,
              }),
              Animated.timing(glowAnim, {
                toValue: 0,
                duration: 1200,
                useNativeDriver: true,
              }),
            ])
          ),
        ]).start();
      });

      timerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.95,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start(() => {
          setTimeout(() => {
            onComplete();
          }, 50);
        });
      }, 3000);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);
      checkScale.setValue(0);
      glowAnim.setValue(0);
    }
  }, [visible, fadeAnim, scaleAnim, checkScale, glowAnim, onComplete]);

  if (!visible) return null;

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Modal visible={visible} transparent animationType="none">
      {Platform.OS === 'web' ? (
        <View style={[styles.webBlur, { backgroundColor: 'rgba(0,0,0,0.6)' }]}>
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
                  styles.glowRing,
                  {
                    backgroundColor: colors.accent,
                    opacity: glowOpacity,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.checkContainer,
                  {
                    backgroundColor: colors.accent,
                    transform: [{ scale: checkScale }],
                  },
                ]}
              >
                <Check size={36} color="#FFFFFF" strokeWidth={3} />
              </Animated.View>

              <Text style={[styles.title, { color: colors.primary }]}>
                Welcome to PoemCloud+
              </Text>
              <Text style={[styles.subtitle, { color: colors.textLight }]}>
                Explore poetry without limits.
              </Text>
            </View>
          </Animated.View>
        </View>
      ) : (
        <BlurView intensity={100} tint="dark" style={styles.blur}>
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
                  styles.glowRing,
                  {
                    backgroundColor: colors.accent,
                    opacity: glowOpacity,
                  },
                ]}
              />
              <Animated.View
                style={[
                  styles.checkContainer,
                  {
                    backgroundColor: colors.accent,
                    transform: [{ scale: checkScale }],
                  },
                ]}
              >
                <Check size={36} color="#FFFFFF" strokeWidth={3} />
              </Animated.View>

              <Text style={[styles.title, { color: colors.primary }]}>
                Welcome to PoemCloud+
              </Text>
              <Text style={[styles.subtitle, { color: colors.textLight }]}>
                Explore poetry without limits.
              </Text>
            </View>
          </Animated.View>
        </BlurView>
      )}
    </Modal>
  );
}

const styles = StyleSheet.create({
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webBlur: {
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
    paddingHorizontal: 48,
    paddingVertical: 40,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 28,
    elevation: 12,
    maxWidth: width - 60,
  },
  glowRing: {
    position: 'absolute',
    top: 28,
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  checkContainer: {
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
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
});
