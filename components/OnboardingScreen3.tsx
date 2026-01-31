import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Headphones, Languages, Heart, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { triggerHaptic } from '@/utils/haptics';

const { width } = Dimensions.get('window');

interface Props {
  onNext: () => void;
  onBack: () => void;
}

const cards = [
  {
    icon: Headphones,
    title: 'Listen to poems read aloud',
    subtitle: 'Professional text-to-speech narration.',
  },
  {
    icon: Languages,
    title: 'Understand poetry across cultures',
    subtitle: 'Side-by-side translations.',
  },
  {
    icon: Heart,
    title: 'Discover poems by how you feel',
    subtitle: 'Not popularity. Emotion.',
  },
];

export default function OnboardingScreen3({ onNext, onBack }: Props) {
  const { colors } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const autoScrollTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();

    autoScrollTimer.current = setInterval(() => {
      setActiveIndex(prev => {
        const next = (prev + 1) % cards.length;
        scrollViewRef.current?.scrollTo({
          x: next * (width - 60),
          animated: true,
        });
        return next;
      });
    }, 3500);

    return () => {
      if (autoScrollTimer.current) {
        clearInterval(autoScrollTimer.current);
      }
    };
  }, []);

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (width - 60));
    if (index !== activeIndex && index >= 0 && index < cards.length) {
      setActiveIndex(index);
    }
  };

  const handleScrollBegin = () => {
    if (autoScrollTimer.current) {
      clearInterval(autoScrollTimer.current);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <LinearGradient
        colors={[colors.gradientStart, colors.gradientMid, colors.background]}
        style={styles.gradient}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => { triggerHaptic('light'); onBack(); }} style={styles.backButton}>
              <ChevronLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.progressContainer}>
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
              <View style={[styles.progressDot, styles.progressDotActive, { backgroundColor: colors.primary }]} />
              <View style={[styles.progressDot, { backgroundColor: colors.border }]} />
            </View>
            <View style={styles.backButton} />
          </View>

          <View style={styles.cardsSection}>
            <ScrollView
              ref={scrollViewRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
              onScroll={handleScroll}
              onScrollBeginDrag={handleScrollBegin}
              scrollEventThrottle={16}
              decelerationRate="fast"
              snapToInterval={width - 60}
            >
              {cards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <View key={index} style={styles.cardWrapper}>
                    <LinearGradient
                      colors={[colors.surfaceSecondary, colors.surface]}
                      style={[styles.card, { borderColor: colors.borderLight }]}
                    >
                      <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
                        <Icon size={32} color={colors.accent} strokeWidth={1.5} />
                      </View>
                      <Text style={[styles.cardTitle, { color: colors.primary }]}>{card.title}</Text>
                      <Text style={[styles.cardSubtitle, { color: colors.textLight }]}>{card.subtitle}</Text>
                    </LinearGradient>
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.dotsContainer}>
              {cards.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    { backgroundColor: colors.border },
                    index === activeIndex && { backgroundColor: colors.primary },
                  ]}
                />
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primary }]}
              onPress={() => { triggerHaptic('medium'); onNext(); }}
              activeOpacity={0.8}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>Continue</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
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
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  progressDotActive: {
    width: 24,
  },
  cardsSection: {
    flex: 1,
    justifyContent: 'center',
  },
  cardsContainer: {
    paddingHorizontal: 30,
  },
  cardWrapper: {
    width: width - 60,
    paddingHorizontal: 10,
  },
  card: {
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
  },
  iconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  cardSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 20,
    paddingTop: 16,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});
