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
import { 
  X, 
  Headphones, 
  Languages, 
  FolderPlus, 
  BookMarked, 
  Palette, 
  Sparkles,
  BookOpen,
} from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

export type FeatureType = 
  | 'listen' 
  | 'translate' 
  | 'collection' 
  | 'curated' 
  | 'bookmark' 
  | 'theme';

interface FeatureConfig {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  buttonText: string;
}

const featureConfigs: Record<FeatureType, FeatureConfig> = {
  listen: {
    icon: Headphones,
    title: 'Listen to Poems',
    description: 'Enjoy poems read aloud with professional text-to-speech narration. Perfect for immersive reading.',
    buttonText: 'Unlock Audio',
  },
  translate: {
    icon: Languages,
    title: 'Translate Poems',
    description: 'Experience poetry in over 50 languages with AI-powered translations side-by-side.',
    buttonText: 'Unlock Translations',
  },
  collection: {
    icon: FolderPlus,
    title: 'Create Collections',
    description: 'Organize your favorite poems into custom collections with personalized covers and tags.',
    buttonText: 'Unlock Collections',
  },
  curated: {
    icon: BookOpen,
    title: 'Curated Collections',
    description: 'Access exclusive hand-picked collections curated by poetry experts around the world.',
    buttonText: 'Unlock Curated',
  },
  bookmark: {
    icon: BookMarked,
    title: 'Unlimited Bookmarks',
    description: 'You\'ve reached your free bookmark limit. Upgrade to save unlimited poems to your library.',
    buttonText: 'Unlock Unlimited',
  },
  theme: {
    icon: Palette,
    title: 'Premium Themes',
    description: 'Personalize your reading experience with beautiful color themes designed for poetry lovers.',
    buttonText: 'Unlock Themes',
  },
};

interface Props {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  feature: FeatureType;
}

export default function FeaturePremiumModal({ visible, onClose, onUpgrade, feature }: Props) {
  const { colors } = useTheme();
  const slideAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const iconScale = useRef(new Animated.Value(0.5)).current;

  const config = featureConfigs[feature];
  const IconComponent = config.icon;

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
        Animated.spring(iconScale, {
          toValue: 1,
          friction: 5,
          tension: 100,
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
      iconScale.setValue(0.5);
    }
  }, [visible, slideAnim, fadeAnim, iconScale]);

  const handleUpgrade = () => {
    triggerHaptic('medium');
    onUpgrade();
  };

  const handleClose = () => {
    triggerHaptic('light');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
    >
      <Pressable style={styles.overlay} onPress={handleClose}>
        <Animated.View style={[styles.overlayBg, { opacity: fadeAnim }]} />
      </Pressable>
      
      <Animated.View
        style={[
          styles.container,
          { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] },
        ]}
      >
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <X size={24} color={colors.textMuted} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.iconContainer, 
              { backgroundColor: colors.premiumLight, transform: [{ scale: iconScale }] }
            ]}
          >
            <IconComponent size={32} color={colors.accent} strokeWidth={1.5} />
          </Animated.View>
          
          <Text style={[styles.title, { color: colors.primary }]}>
            {config.title}
          </Text>
          
          <Text style={[styles.description, { color: colors.textMuted }]}>
            {config.description}
          </Text>

          <View style={[styles.premiumBadge, { backgroundColor: colors.accentLight }]}>
            <Sparkles size={14} color={colors.accent} />
            <Text style={[styles.premiumBadgeText, { color: colors.accent }]}>
              PoemCloud+ Feature
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.upgradeButton, { backgroundColor: colors.primary }]}
            onPress={handleUpgrade}
            activeOpacity={0.8}
          >
            <Text style={[styles.upgradeButtonText, { color: colors.background }]}>
              {config.buttonText}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.freeButton} 
            onPress={handleClose}
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
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  premiumBadgeText: {
    fontSize: 13,
    fontWeight: '600',
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
