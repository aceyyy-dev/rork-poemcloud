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
  ActionSheetIOS,
  Alert,
} from 'react-native';
import { X, Camera, Check, ImageIcon, AlertCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { usePlaylists } from '@/contexts/PlaylistContext';
import { Mood } from '@/types';
import { countries } from '@/mocks/countries';
import ImageCropperModal from './ImageCropperModal';

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
  const [tempImageUri, setTempImageUri] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const showImageSourcePicker = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Choose from Photos', 'Choose from Files'],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handlePickFromGallery();
          } else if (buttonIndex === 2) {
            handlePickFromFiles();
          }
        }
      );
    } else {
      Alert.alert(
        'Select Image',
        'Choose where to pick your cover image from',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Photos', onPress: handlePickFromGallery },
          { text: 'Files', onPress: handlePickFromFiles },
        ]
      );
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('[CreatePlaylist] Image selected from gallery:', result.assets[0].uri);
        setTempImageUri(result.assets[0].uri);
        setShowCropper(true);
      }
    } catch (error) {
      console.log('[CreatePlaylist] Gallery picker error:', error);
    }
  };

  const handlePickFromFiles = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        console.log('[CreatePlaylist] Image selected from files:', result.assets[0].uri);
        setTempImageUri(result.assets[0].uri);
        setShowCropper(true);
      }
    } catch (error) {
      console.log('[CreatePlaylist] Document picker error:', error);
    }
  };

  const handleCropComplete = (croppedUri: string) => {
    console.log('[CreatePlaylist] Crop complete:', croppedUri);
    setCoverImageUrl(croppedUri);
    setShowCropper(false);
    setTempImageUri(null);
    setShowValidation(false);
  };

  const handleCropCancel = () => {
    setShowCropper(false);
    setTempImageUri(null);
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

  const isValid = title.trim().length > 0 && coverImageUrl;

  const handleCreate = () => {
    setShowValidation(true);
    
    if (!title.trim() || !coverImageUrl) {
      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }
      return;
    }

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
    setShowValidation(false);
    
    onCreated?.(newPlaylist.id);
    onClose();
  };

  const handleClose = () => {
    setTitle('');
    setCoverImageUrl(undefined);
    setSelectedMoods([]);
    setSelectedCountries([]);
    setShowCountryPicker(false);
    setShowValidation(false);
    setTempImageUri(null);
    setShowCropper(false);
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
              New Collection
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
            <View style={styles.coverSection}>
              <TouchableOpacity
                style={[
                  styles.coverPicker,
                  { backgroundColor: colors.surfaceSecondary },
                  showValidation && !coverImageUrl && styles.coverPickerError,
                ]}
                onPress={showImageSourcePicker}
                activeOpacity={0.8}
              >
                {coverImageUrl ? (
                  <Image source={{ uri: coverImageUrl }} style={styles.coverImage} />
                ) : (
                  <LinearGradient
                    colors={[colors.accent, colors.accentLight]}
                    style={styles.coverPlaceholder}
                  >
                    <ImageIcon size={32} color={colors.textWhite} />
                    <Text style={[styles.coverText, { color: colors.textWhite }]}>
                      Add Cover
                    </Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
              {coverImageUrl && (
                <TouchableOpacity
                  style={[styles.changeImageBtn, { backgroundColor: colors.surfaceSecondary }]}
                  onPress={showImageSourcePicker}
                >
                  <Camera size={16} color={colors.accent} />
                  <Text style={[styles.changeImageText, { color: colors.accent }]}>Change</Text>
                </TouchableOpacity>
              )}
              {showValidation && !coverImageUrl && (
                <View style={styles.errorRow}>
                  <AlertCircle size={14} color={colors.error || '#EF4444'} />
                  <Text style={[styles.errorText, { color: colors.error || '#EF4444' }]}>
                    Cover image is required
                  </Text>
                </View>
              )}
              <Text style={[styles.requiredLabel, { color: colors.textMuted }]}>
                Required
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.primary }]}>Name</Text>
                <Text style={[styles.requiredBadge, { color: colors.textMuted }]}>Required</Text>
              </View>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colors.surfaceSecondary,
                    color: colors.text,
                    borderColor: showValidation && !title.trim() ? (colors.error || '#EF4444') : colors.border,
                  },
                ]}
                placeholder="My Collection"
                placeholderTextColor={colors.textMuted}
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  if (showValidation && text.trim()) {
                    setShowValidation(false);
                  }
                }}
                maxLength={50}
              />
              {showValidation && !title.trim() && (
                <View style={styles.errorRow}>
                  <AlertCircle size={14} color={colors.error || '#EF4444'} />
                  <Text style={[styles.errorText, { color: colors.error || '#EF4444' }]}>
                    Name is required
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.primary }]}>Mood Tags</Text>
                <Text style={[styles.optionalBadge, { color: colors.textMuted }]}>Optional</Text>
              </View>
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
              <View style={styles.labelRow}>
                <Text style={[styles.label, { color: colors.primary }]}>Country Tags</Text>
                <Text style={[styles.optionalBadge, { color: colors.textMuted }]}>Optional</Text>
              </View>
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
                { backgroundColor: isValid ? colors.accent : colors.border },
              ]}
              onPress={handleCreate}
            >
              <Text style={[styles.createBtnText, { color: colors.textWhite }]}>
                Create Collection
              </Text>
            </TouchableOpacity>
            {!isValid && (
              <Text style={[styles.footerHint, { color: colors.textMuted }]}>
                Add a name and cover image to create
              </Text>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {tempImageUri && (
        <ImageCropperModal
          visible={showCropper}
          imageUri={tempImageUri}
          onClose={handleCropCancel}
          onCropComplete={handleCropComplete}
        />
      )}
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
  coverSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  coverPicker: {
    width: 120,
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
  },
  coverPickerError: {
    borderWidth: 2,
    borderColor: '#EF4444',
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
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginTop: 10,
  },
  changeImageText: {
    fontSize: 13,
    fontWeight: '500',
  },
  requiredLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  requiredBadge: {
    fontSize: 12,
    fontWeight: '500',
  },
  optionalBadge: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
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
  footerHint: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 10,
  },
});
