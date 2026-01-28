import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { X, Plus, Check, ListMusic, Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { usePlaylists } from '@/contexts/PlaylistContext';
import { useUser } from '@/contexts/UserContext';
import { Poem } from '@/types';
import CreatePlaylistModal from './CreatePlaylistModal';

interface AddToPlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  poem: Poem;
  onShowPremium: () => void;
}

export default function AddToPlaylistModal({
  visible,
  onClose,
  poem,
  onShowPremium,
}: AddToPlaylistModalProps) {
  const { colors } = useTheme();
  const { playlists, addPoemToMultiplePlaylists, isPoemInPlaylist, getPlaylistsContainingPoem } = usePlaylists();
  const { preferences } = useUser();
  const [selectedPlaylistIds, setSelectedPlaylistIds] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const initialSelectedIds = useMemo(() => {
    return getPlaylistsContainingPoem(poem.id).map(p => p.id);
  }, [poem.id, getPlaylistsContainingPoem]);

  React.useEffect(() => {
    if (visible) {
      setSelectedPlaylistIds(initialSelectedIds);
    }
  }, [visible, initialSelectedIds]);

  const togglePlaylist = (playlistId: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedPlaylistIds(prev =>
      prev.includes(playlistId)
        ? prev.filter(id => id !== playlistId)
        : [...prev, playlistId]
    );
  };

  const handleSave = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    
    const newSelections = selectedPlaylistIds.filter(id => !initialSelectedIds.includes(id));
    if (newSelections.length > 0) {
      addPoemToMultiplePlaylists(poem.id, newSelections);
    }
    
    onClose();
  };

  const handleCreateNew = () => {
    if (!preferences.isPremium) {
      onShowPremium();
      return;
    }
    setShowCreateModal(true);
  };

  const handlePlaylistCreated = (playlistId: string) => {
    setSelectedPlaylistIds(prev => [...prev, playlistId]);
  };

  const hasChanges = useMemo(() => {
    const newSelections = selectedPlaylistIds.filter(id => !initialSelectedIds.includes(id));
    return newSelections.length > 0;
  }, [selectedPlaylistIds, initialSelectedIds]);

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={[styles.container, { backgroundColor: colors.surface }]}>
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.primary }]}>
                Add to Playlist
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <X size={24} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            <View style={[styles.poemPreview, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.poemTitle, { color: colors.primary }]} numberOfLines={1}>
                {poem.title}
              </Text>
              <Text style={[styles.poemPoet, { color: colors.textMuted }]}>
                {poem.poet.name}
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.createNewBtn, { borderColor: colors.accent }]}
              onPress={handleCreateNew}
              activeOpacity={0.8}
            >
              <View style={[styles.createNewIcon, { backgroundColor: colors.accentLight }]}>
                <Plus size={20} color={colors.accent} />
              </View>
              <Text style={[styles.createNewText, { color: colors.accent }]}>
                Create New Playlist
              </Text>
              {!preferences.isPremium && (
                <Crown size={16} color={colors.accent} />
              )}
            </TouchableOpacity>

            {playlists.length === 0 ? (
              <View style={styles.emptyState}>
                <ListMusic size={48} color={colors.border} strokeWidth={1} />
                <Text style={[styles.emptyTitle, { color: colors.primary }]}>
                  No playlists yet
                </Text>
                <Text style={[styles.emptySubtitle, { color: colors.textMuted }]}>
                  Create your first playlist to start organizing poems
                </Text>
              </View>
            ) : (
              <ScrollView
                style={styles.playlistList}
                contentContainerStyle={styles.playlistListContent}
                showsVerticalScrollIndicator={false}
              >
                {playlists.map(playlist => {
                  const isSelected = selectedPlaylistIds.includes(playlist.id);
                  const wasAlreadyAdded = initialSelectedIds.includes(playlist.id);
                  
                  return (
                    <TouchableOpacity
                      key={playlist.id}
                      style={[
                        styles.playlistItem,
                        { backgroundColor: colors.surfaceSecondary },
                        isSelected && { borderColor: colors.accent, borderWidth: 2 },
                      ]}
                      onPress={() => togglePlaylist(playlist.id)}
                      activeOpacity={0.8}
                    >
                      {playlist.coverImageUrl ? (
                        <Image
                          source={{ uri: playlist.coverImageUrl }}
                          style={styles.playlistCover}
                        />
                      ) : (
                        <LinearGradient
                          colors={[colors.accent, colors.accentLight]}
                          style={styles.playlistCover}
                        >
                          <ListMusic size={20} color={colors.textWhite} />
                        </LinearGradient>
                      )}
                      <View style={styles.playlistInfo}>
                        <Text style={[styles.playlistTitle, { color: colors.primary }]} numberOfLines={1}>
                          {playlist.title}
                        </Text>
                        <Text style={[styles.playlistCount, { color: colors.textMuted }]}>
                          {playlist.poemIds.length} poem{playlist.poemIds.length !== 1 ? 's' : ''}
                          {wasAlreadyAdded && ' • Already added'}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.checkbox,
                          { borderColor: colors.border },
                          isSelected && { backgroundColor: colors.accent, borderColor: colors.accent },
                        ]}
                      >
                        {isSelected && <Check size={14} color={colors.textWhite} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  { backgroundColor: hasChanges ? colors.accent : colors.border },
                ]}
                onPress={handleSave}
                disabled={!hasChanges && playlists.length > 0}
              >
                <Text style={[styles.saveBtnText, { color: colors.textWhite }]}>
                  {playlists.length === 0 ? 'Done' : hasChanges ? 'Add to Selected' : 'Done'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <CreatePlaylistModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handlePlaylistCreated}
        initialPoemId={poem.id}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  poemPreview: {
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 12,
    marginBottom: 16,
  },
  poemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  poemPoet: {
    fontSize: 13,
  },
  createNewBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginHorizontal: 20,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderStyle: 'dashed',
    marginBottom: 16,
  },
  createNewIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createNewText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  playlistList: {
    flex: 1,
  },
  playlistListContent: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 10,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 14,
    gap: 12,
  },
  playlistCover: {
    width: 50,
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  playlistCount: {
    fontSize: 13,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  saveBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
