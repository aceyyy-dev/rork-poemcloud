import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Modal,
  Pressable,
} from 'react-native';
import { Headphones, X } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export default function ListenPremiumModal({ visible, onClose, onUpgrade }: Props) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]} />
      </Pressable>
      
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={[styles.iconContainer, { backgroundColor: colors.premiumLight }]}>
            <Headphones size={28} color={colors.accent} strokeWidth={1.5} />
          </View>
          
          <Text style={[styles.title, { color: colors.primary }]}>
            Listen to poems
          </Text>
          
          <Text style={[styles.description, { color: colors.textMuted }]}>
            Hear poems the way they were meant to be heard with PoemCloud+.
          </Text>

          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
            onPress={onUpgrade}
            activeOpacity={0.8}
          >
            <Text style={[styles.upgradeButtonText, { color: colors.background }]}>
              Start PoemCloud+
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.freeButton} 
            onPress={onClose}
          >
            <Text style={[styles.freeButtonText, { color: colors.text }]}>
              Continue with Free
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  overlayBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 12,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 4,
    zIndex: 1,
  },
  content: {
    alignItems: 'center',
    paddingTop: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 28,
    paddingHorizontal: 16,
  },
  upgradeButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 12,
  },
  upgradeButtonText: {
    fontSize: 17,
    fontWeight: '600',
  },
  freeButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  freeButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});
