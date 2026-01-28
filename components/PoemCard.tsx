import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { Heart, Bookmark, Share2, Headphones, Languages, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/colors';
import { Poem } from '@/types';
import { useUser } from '@/contexts/UserContext';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

const { height } = Dimensions.get('window');

interface Props {
  poem: Poem;
  onPress?: () => void;
  onPremiumPress?: () => void;
  showActions?: boolean;
  fullScreen?: boolean;
}

export default function PoemCard({
  poem,
  onPress,
  onPremiumPress,
  showActions = true,
  fullScreen = false,
}: Props) {
  const { isLiked, isBookmarked, toggleLike, toggleBookmark, preferences } = useUser();
  const liked = isLiked(poem.id);
  const bookmarked = isBookmarked(poem.id);
  const likeScale = useRef(new Animated.Value(1)).current;
  const bookmarkScale = useRef(new Animated.Value(1)).current;

  const handleLike = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.spring(likeScale, {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(likeScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    toggleLike(poem.id);
  };

  const handleBookmark = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    Animated.sequence([
      Animated.spring(bookmarkScale, {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(bookmarkScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    const success = toggleBookmark(poem.id);
    if (!success && onPremiumPress) {
      onPremiumPress();
    }
  };

  const handleShare = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handlePremiumAction = () => {
    if (!preferences.isPremium && onPremiumPress) {
      onPremiumPress();
    }
  };

  const truncatedText = poem.text.length > 600 
    ? poem.text.substring(0, 600) + '...'
    : poem.text;

  return (
    <TouchableOpacity
      style={[styles.container, fullScreen && styles.fullScreen]}
      onPress={onPress}
      activeOpacity={0.95}
      disabled={!onPress}
    >
      <View style={styles.header}>
        <View style={styles.poetInfo}>
          <Text style={styles.poetName}>{poem.poet.name}</Text>
          <Text style={styles.countryText}>
            {poem.country}
            {poem.originalLanguage !== 'English' && ` • ${poem.originalLanguage}`}
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>{poem.title}</Text>
        <Text style={styles.poemText}>{truncatedText}</Text>
        {poem.text.length > 600 && (
          <Text style={styles.readMore}>Continue reading...</Text>
        )}
      </View>

      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity onPress={handleLike} style={styles.actionButton}>
            <Animated.View style={{ transform: [{ scale: likeScale }] }}>
              <Heart
                size={24}
                color={liked ? '#e85d75' : Colors.textLight}
                fill={liked ? '#e85d75' : 'transparent'}
                strokeWidth={1.5}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleBookmark} style={styles.actionButton}>
            <Animated.View style={{ transform: [{ scale: bookmarkScale }] }}>
              <Bookmark
                size={24}
                color={bookmarked ? Colors.accent : Colors.textLight}
                fill={bookmarked ? Colors.accent : 'transparent'}
                strokeWidth={1.5}
              />
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
            <Share2 size={24} color={Colors.textLight} strokeWidth={1.5} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePremiumAction}
            style={styles.actionButton}
          >
            <View style={styles.premiumAction}>
              <Headphones
                size={24}
                color={preferences.isPremium ? Colors.textLight : Colors.accent}
                strokeWidth={1.5}
              />
              {!preferences.isPremium && (
                <Crown size={10} color={Colors.accent} style={styles.crownIcon} />
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handlePremiumAction}
            style={styles.actionButton}
          >
            <View style={styles.premiumAction}>
              <Languages
                size={24}
                color={preferences.isPremium ? Colors.textLight : Colors.accent}
                strokeWidth={1.5}
              />
              {!preferences.isPremium && (
                <Crown size={10} color={Colors.accent} style={styles.crownIcon} />
              )}
            </View>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.moodTags}>
          {poem.moods.slice(0, 2).map(mood => (
            <View
              key={mood}
              style={[styles.moodTag, { backgroundColor: `${Colors.mood[mood]}30` }]}
            >
              <View style={[styles.moodDot, { backgroundColor: Colors.mood[mood] }]} />
              <Text style={[styles.moodText, { color: Colors.mood[mood] }]}>
                {mood}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  fullScreen: {
    flex: 1,
    marginHorizontal: 0,
    marginVertical: 0,
    borderRadius: 0,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 16,
  },
  poetInfo: {
    gap: 2,
  },
  poetName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  countryText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  content: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  poemText: {
    fontSize: 16,
    color: Colors.text,
    lineHeight: 28,
    letterSpacing: 0.2,
  },
  readMore: {
    fontSize: 14,
    color: Colors.accent,
    marginTop: 12,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionButton: {
    padding: 4,
  },
  premiumAction: {
    position: 'relative',
  },
  crownIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodTags: {
    flexDirection: 'row',
    gap: 8,
  },
  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  moodDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  moodText: {
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
});
