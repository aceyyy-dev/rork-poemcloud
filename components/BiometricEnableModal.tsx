import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { Scan, Fingerprint } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useBiometric } from '@/contexts/BiometricContext';
import { triggerHaptic } from '@/utils/haptics';

interface Props {
  visible: boolean;
  onClose: () => void;
  onEnable: () => Promise<void>;
  userId: string;
  token: string;
}

export default function BiometricEnableModal({ visible, onClose, onEnable, userId, token }: Props) {
  const { colors } = useTheme();
  const { getBiometricTypeName, biometricType, enableBiometric } = useBiometric();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    }
  }, [visible, fadeAnim, scaleAnim]);

  const biometricName = getBiometricTypeName();
  const isFaceId = biometricType === 'face' && Platform.OS === 'ios';

  const handleEnable = async () => {
    triggerHaptic('medium');
    const success = await enableBiometric(userId, token);
    if (success) {
      triggerHaptic('success');
      await onEnable();
      onClose();
    }
  };

  const handleSkip = () => {
    triggerHaptic('light');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="none">
      <Animated.View style={[styles.overlay, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.surface,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={[styles.iconContainer, { backgroundColor: colors.accentLight }]}>
            {isFaceId ? (
              <Scan size={40} color={colors.accent} strokeWidth={1.5} />
            ) : (
              <Fingerprint size={40} color={colors.accent} strokeWidth={1.5} />
            )}
          </View>

          <Text style={[styles.title, { color: colors.primary }]}>
            Enable {biometricName}?
          </Text>

          <Text style={[styles.body, { color: colors.textMuted }]}>
            Log in faster and keep your account secure.
          </Text>

          <TouchableOpacity
            style={[styles.enableButton, { backgroundColor: colors.accent }]}
            onPress={handleEnable}
            activeOpacity={0.8}
          >
            <Text style={[styles.enableButtonText, { color: colors.textWhite }]}>
              Enable
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.skipButton}
            onPress={handleSkip}
            activeOpacity={0.7}
          >
            <Text style={[styles.skipButtonText, { color: colors.textMuted }]}>
              Not now
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  container: {
    width: '100%',
    maxWidth: 320,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 8,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  body: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  enableButton: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
  },
  enableButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  skipButton: {
    paddingVertical: 10,
  },
  skipButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
