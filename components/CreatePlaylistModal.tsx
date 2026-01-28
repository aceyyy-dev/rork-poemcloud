import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { X, Camera, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { usePlaylists } from '@/contexts/PlaylistContext';
import { Mood } from '@/types';
import { countries } from '@/mocks/countries';

const MOODS: Mood[] = ['calm', 'sad', 'love', 'hope', 'melancholy', 'healing', 'longing', 'joy', 'reflection'];

interface CreatePlaylistModalProps {
  visible: boolean;
  onClose: () => void;
  onCreated?: (playlistId: string) => void;
  initialPoemId?: string;
}

export default function CreatePlaylistModal({
  visible,
  onClose,
  onCreated,
  initialPoemId,
}: CreatePlaylistModalProps) {
  const { colors } = useTheme();
  const { createPlaylist } = usePlaylists();
  const [title, setTitle] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState<string | undefined>();
  const [selectedMoods, setSelectedMoods] = useState<Mood[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setCoverImageUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.log('[CreatePlaylist] Image picker error:', error);
    }
  };

  const toggleMood = (mood: Mood) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedMoods(prev =>
      prev.includes(mood) ? prev.filter(m => m !== mood) : [...prev, mood]
    );
  };

  const toggleCountry = (code: string) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    setSelectedCountries(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const handleCreate = () => {
    if (!title.trim()) return;

    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }

    const newPlaylist = createPlaylist(
      title.trim(),
      coverImageUrl,
      selectedMoods,
      selectedCountries,
      initialPoemId
    );

    setTitle('');
    setCoverImageUrl(undefined);
    setSelectedMoods([]);
    setSelectedCountries([]);
    
    onCreated?.(newPlaylist.id);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setCoverImageUrl(undefined);
    setSelectedMoods([]);
    setSelectedCountries([]);
    setShowCountryPicker(false);
    onClose();
  };

  const selectedCountryObjects = countries.filter(c => selectedCountries.includes(c.code));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { color: colors.primary }]}>
              New Playlist
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeBtn}>
              <X size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.content}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <TouchableOpacity
              style={[styles.coverPicker, { backgroundColor: colors.surfaceSecondary }]}
              onPress={handlePickImage}
              activeOpacity={0.8}
            >
              {coverImageUrl ? (
                <Image source={{ uri: coverImageUrl }} style={styles.coverImage} />
              ) : (
                <LinearGradient
                  colors={[colors.accent, colors.accentLight]}
                  style={styles.coverPlaceholder}
                >
                  <Camera size={32} color={colors.textWhite} />
                  <Text style={[styles.coverText, { color: colors.textWhite }]}>
                    Add Cover
                  </Text>
                </LinearGradient>
              )}
            </TouchableOpacity>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.primary }]}>Title</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceSecondary,
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="My Playlist"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={setTitle}
                maxLength={50}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.primary }]}>Mood Tags</Text>
              <View style={styles.tagsContainer}>
                {MOODS.map(mood => (
                  <TouchableOpacity
                    key={mood}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: selectedMoods.includes(mood)
                          ? colors.mood[mood]
                          : colors.surfaceSecondary,
                        borderColor: colors.mood[mood],
                      },
                    ]}
                    onPress={() => toggleMood(mood)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        {
                          color: selectedMoods.includes(mood)
                            ? colors.textWhite
                            : colors.mood[mood],
                        },
                      ]}
                    >
                      {mood}
                    </Text>
                    {selectedMoods.includes(mood) && (
                      <Check size={14} color={colors.textWhite} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.primary }]}>Country Tags</Text>
              {selectedCountryObjects.length > 0 && (
                <View style={styles.selectedCountries}>
                  {selectedCountryObjects.map(country => (
                    <TouchableOpacity
                      key={country.code}
                      style={[styles.countryChip, { backgroundColor: colors.accentLight }]}
                      onPress={() => toggleCountry(country.code)}
                    >
                      <Text style={styles.countryFlag}>{country.flag}</Text>
                      <Text style={[styles.countryChipText, { color: colors.accent }]}>
                        {country.name}
                      </Text>
                      <X size={14} color={colors.accent} />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
              <TouchableOpacity
                style={[
                  styles.countryPickerBtn,
                  { backgroundColor: colors.surfaceSecondary, borderColor: colors.border },
                ]}
                onPress={() => setShowCountryPicker(!showCountryPicker)}
              >
                <Text style={[styles.countryPickerBtnText, { color: colors.textMuted }]}>
                  {showCountryPicker ? 'Hide countries' : 'Select countries...'}
                </Text>
              </TouchableOpacity>
              {showCountryPicker && (
                <View style={[styles.countryList, { backgroundColor: colors.surfaceSecondary }]}>
                  {countries.slice(0, 20).map(country => (
                    <TouchableOpacity
                      key={country.code}
                      style={[
                        styles.countryItem,
                        selectedCountries.includes(country.code) && {
                          backgroundColor: colors.accentLight,
                        },
                      ]}
                      onPress={() => toggleCountry(country.code)}
                    >
                      <Text style={styles.countryFlag}>{country.flag}</Text>
                      <Text style={[styles.countryName, { color: colors.text }]}>
                        {country.name}
                      </Text>
                      {selectedCountries.includes(country.code) && (
                        <Check size={16} color={colors.accent} />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border }]}>
            <TouchableOpacity
              style={[
                styles.createBtn,
                { backgroundColor: title.trim() ? colors.accent : colors.border },
              ]}
              onPress={handleCreate}
              disabled={!title.trim()}
            >
              <Text style={[styles.createBtnText, { color: colors.textWhite }]}>
                Create Playlist
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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
    maxHeight: '90%',
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  coverPicker: {
    width: 120,
    height: 120,
    borderRadius: 16,
    alignSelf: 'center',
    marginBottom: 24,
    overflow: 'hidden',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  coverText: {
    fontSize: 13,
    fontWeight: '500',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  selectedCountries: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  countryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  countryChipText: {
    fontSize: 13,
    fontWeight: '500',
  },
  countryFlag: {
    fontSize: 18,
  },
  countryPickerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  countryPickerBtnText: {
    fontSize: 15,
  },
  countryList: {
    marginTop: 10,
    borderRadius: 12,
    maxHeight: 200,
    overflow: 'hidden',
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  countryName: {
    flex: 1,
    fontSize: 15,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
  },
  createBtn: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  createBtnText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
