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
  const scaleAnim = useRef(new Animated.Value(0.98)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hapticFiredRef = useRef(false);
  const isAnimatingRef = useRef(false);

  useEffect(() => {
    if (visible && !isAnimatingRef.current) {
      isAnimatingRef.current = true;
      
      if (!hapticFiredRef.current) {
        hapticFiredRef.current = true;
        triggerHaptic('success');
      }

      fadeAnim.setValue(0);
      scaleAnim.setValue(0.98);
      checkScale.setValue(0);

      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => {
        Animated.spring(checkScale, {
          toValue: 1,
          friction: 4,
          tension: 50,
          useNativeDriver: true,
        }).start();
      });

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 400,
            useNativeDriver: true,
          }),
        ]).start(() => {
          isAnimatingRef.current = false;
          hapticFiredRef.current = false;
          onComplete();
        });
      }, 4000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.98);
      checkScale.setValue(0);
      isAnimatingRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const renderContent = () => (
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
        <View style={[styles.glowRing, { backgroundColor: colors.accent, opacity: 0.15 }]} />
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
  );

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <View style={styles.modalContainer} pointerEvents="box-only">
        {Platform.OS === 'web' ? (
          <View style={[styles.webBlur, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
            {renderContent()}
          </View>
        ) : (
          <BlurView intensity={50} tint="dark" style={styles.blur}>
            <View style={styles.darkOverlay} />
            {renderContent()}
          </BlurView>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
  },
  blur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  darkOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
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
    shadowOpacity: 0.2,
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
