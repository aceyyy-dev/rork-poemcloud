import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ListMusic, Trash2, Edit3, MoreHorizontal, X, ChevronLeft } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { usePlaylists } from '@/contexts/PlaylistContext';
import { poems } from '@/mocks/poems';
import { countries } from '@/mocks/countries';
import CreatePlaylistModal from '@/components/CreatePlaylistModal';

export default function PlaylistDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors, isIllustrated } = useTheme();
  const { getPlaylistById, deletePlaylist, removePoemFromPlaylist } = usePlaylists();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const playlist = getPlaylistById(id || '');

  const playlistPoems = useMemo(() => {
    if (!playlist) return [];
    return poems.filter(p => playlist.poemIds.includes(p.id));
  }, [playlist]);

  const getCountryFlag = (code: string) => {
    const country = countries.find(c => c.code === code);
    return country?.flag || '🌍';
  };

  const handleDeletePlaylist = () => {
    Alert.alert(
      'Delete Collection',
      `Are you sure you want to delete "${playlist?.title}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            }
            deletePlaylist(id || '');
            router.back();
          },
        },
      ]
    );
  };

  const handleRemovePoem = (poemId: string, poemTitle: string) => {
    Alert.alert(
      'Remove Poem',
      `Remove "${poemTitle}" from this playlist?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            if (Platform.OS !== 'web') {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }
            removePoemFromPlaylist(id || '', poemId);
          },
        },
      ]
    );
  };

  if (!playlist) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.notFoundContainer}>
            <ListMusic size={64} color={colors.border} strokeWidth={1} />
            <Text style={[styles.notFoundTitle, { color: colors.primary }]}>
              Collection not found
            </Text>
            <TouchableOpacity
              style={[styles.backButton, { backgroundColor: colors.accent }]}
              onPress={() => router.back()}
            >
              <Text style={[styles.backButtonText, { color: colors.textWhite }]}>
                Go Back
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: isIllustrated ? 'transparent' : colors.background }]}>
      {!isIllustrated && (
        <LinearGradient
          colors={[colors.gradientStart, colors.background]}
          style={styles.gradient}
        />
      )}

      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            onPress={() => router.back()}
          >
            <ChevronLeft size={24} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerBtn, { backgroundColor: colors.surface }]}
            onPress={() => setShowOptions(!showOptions)}
          >
            <MoreHorizontal size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {showOptions && (
          <View style={[styles.optionsMenu, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                setShowEditModal(true);
              }}
            >
              <Edit3 size={20} color={colors.text} />
              <Text style={[styles.optionText, { color: colors.text }]}>Edit Collection</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setShowOptions(false);
                handleDeletePlaylist();
              }}
            >
              <Trash2 size={20} color={colors.error} />
              <Text style={[styles.optionText, { color: colors.error }]}>Delete Collection</Text>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.coverSection}>
            {playlist.coverImageUrl ? (
              <Image source={{ uri: playlist.coverImageUrl }} style={styles.coverImage} />
            ) : (
              <LinearGradient
                colors={[colors.accent, colors.accentLight]}
                style={styles.coverImage}
              >
                <ListMusic size={48} color={colors.textWhite} />
              </LinearGradient>
            )}
            <Text style={[styles.playlistTitle, { color: colors.primary }]}>
              {playlist.title}
            </Text>
            <Text style={[styles.playlistMeta, { color: colors.textMuted }]}>
              {playlistPoems.length} poem{playlistPoems.length !== 1 ? 's' : ''}
            </Text>

            {(playlist.moods.length > 0 || playlist.countryCodes.length > 0) && (
              <View style={styles.tagsContainer}>
                {playlist.moods.map(mood => (
                  <View
                    key={mood}
                    style={[styles.tag, { backgroundColor: `${colors.mood[mood]}25` }]}
                  >
                    <View style={[styles.tagDot, { backgroundColor: colors.mood[mood] }]} />
                    <Text style={[styles.tagText, { color: colors.mood[mood] }]}>{mood}</Text>
                  </View>
                ))}
                {playlist.countryCodes.map(code => (
                  <View
                    key={code}
                    style={[styles.countryTag, { backgroundColor: colors.surfaceSecondary }]}
                  >
                    <Text style={styles.flagEmoji}>{getCountryFlag(code)}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {playlistPoems.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.primary }]}>
                No poems yet
              </Text>
              <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                Add poems from the For You feed using the collection button
              </Text>
            </View>
          ) : (
            <View style={styles.poemsList}>
              <Text style={[styles.sectionTitle, { color: colors.primary }]}>Poems</Text>
              {playlistPoems.map((poem, index) => (
                <TouchableOpacity
                  key={poem.id}
                  style={[styles.poemCard, { backgroundColor: colors.surface }]}
                  onPress={() => router.push(`/poem/${poem.id}`)}
                  activeOpacity={0.8}
                >
                  <View style={styles.poemIndex}>
                    <Text style={[styles.poemIndexText, { color: colors.textMuted }]}>
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.poemInfo}>
                    <Text style={[styles.poemTitle, { color: colors.primary }]} numberOfLines={1}>
                      {poem.title}
                    </Text>
                    <Text style={[styles.poemPoet, { color: colors.textMuted }]}>
                      {poem.poet.name} • {poem.country}
                    </Text>
                  </View>
                  <View style={styles.poemActions}>
                    <View style={styles.moodDots}>
                      {poem.moods.slice(0, 2).map(mood => (
                        <View
                          key={mood}
                          style={[styles.moodDot, { backgroundColor: colors.mood[mood] }]}
                        />
                      ))}
                    </View>
                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => handleRemovePoem(poem.id, poem.title)}
                    >
                      <X size={18} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>

      <CreatePlaylistModal
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onCreated={() => setShowEditModal(false)}
      />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  headerBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  optionsMenu: {
    position: 'absolute',
    top: 70,
    right: 20,
    borderRadius: 12,
    padding: 8,
    zIndex: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  coverSection: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },
  coverImage: {
    width: 140,
    height: 140,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  playlistTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  playlistMeta: {
    fontSize: 14,
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  countryTag: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  flagEmoji: {
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  poemsList: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  poemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  poemIndex: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  poemIndexText: {
    fontSize: 14,
    fontWeight: '600',
  },
  poemInfo: {
    flex: 1,
  },
  poemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  poemPoet: {
    fontSize: 13,
  },
  poemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moodDots: {
    flexDirection: 'row',
    gap: 4,
  },
  moodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  removeBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 24,
  },
  backButton: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
