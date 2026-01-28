import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Download, Check, Cloud } from 'lucide-react-native';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { useTheme } from '@/contexts/ThemeContext';
import { Poem } from '@/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

type ShareFormat = 'story' | 'square' | 'portrait';

interface FormatConfig {
  width: number;
  height: number;
  label: string;
  ratio: string;
}

const FORMATS: Record<ShareFormat, FormatConfig> = {
  story: { width: 1080, height: 1920, label: 'Story', ratio: '9:16' },
  square: { width: 1080, height: 1080, label: 'Square', ratio: '1:1' },
  portrait: { width: 1080, height: 1350, label: 'Portrait', ratio: '4:5' },
};

interface Props {
  poem: Poem;
  visible: boolean;
  onClose: () => void;
}

export default function PoemShareCard({ poem, visible, onClose }: Props) {
  const { colors, isDark } = useTheme();
  const [selectedFormat, setSelectedFormat] = useState<ShareFormat>('story');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);
  const cardRef = useRef<View>(null);

  const getExcerpt = useCallback((text: string, maxLines: number = 6) => {
    const lines = text.split('\n').filter(line => line.trim());
    const selectedLines = lines.slice(0, maxLines);
    let excerpt = selectedLines.join('\n');
    
    if (excerpt.length > 280) {
      excerpt = excerpt.substring(0, 277);
      const lastSpace = excerpt.lastIndexOf(' ');
      if (lastSpace > 200) {
        excerpt = excerpt.substring(0, lastSpace);
      }
      excerpt += '...';
    } else if (lines.length > maxLines) {
      excerpt += '\n...';
    }
    
    return excerpt;
  }, []);

  const getCardColors = useCallback(() => {
    if (isDark) {
      return {
        background: ['#1a2634', '#0d1721'] as const,
        text: '#e8f1f8',
        textMuted: '#8ba3b5',
        accent: '#6ab0c9',
        watermark: 'rgba(255,255,255,0.15)',
        mood: colors.mood,
      };
    }
    return {
      background: ['#e8f4fc', '#cee5f2'] as const,
      text: '#1a3a4a',
      textMuted: '#5a7a8a',
      accent: '#4a90a4',
      watermark: 'rgba(0,0,0,0.08)',
      mood: colors.mood,
    };
  }, [isDark, colors.mood]);

  const handleShare = async () => {
    if (!cardRef.current) return;
    
    setIsSharing(true);
    try {
      const format = FORMATS[selectedFormat];
      const scale = format.width / (SCREEN_WIDTH - 40);
      
      const uri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
        result: 'tmpfile',
      });

      console.log('[Share] Captured image:', uri);

      if (Platform.OS === 'web') {
        const link = document.createElement('a');
        link.href = uri;
        link.download = `poemcloud-${poem.title.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.click();
        setShareSuccess(true);
        setTimeout(() => setShareSuccess(false), 2000);
      } else {
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: 'Share Poem',
          });
          setShareSuccess(true);
          setTimeout(() => setShareSuccess(false), 2000);
        } else {
          console.log('[Share] Sharing not available');
        }
      }
    } catch (error) {
      console.log('[Share] Error:', error);
    } finally {
      setIsSharing(false);
    }
  };

  const cardColors = getCardColors();
  const format = FORMATS[selectedFormat];
  const previewScale = (SCREEN_WIDTH - 80) / format.width;
  const previewHeight = format.height * previewScale;
  const maxPreviewHeight = 400;
  const finalPreviewScale = previewHeight > maxPreviewHeight 
    ? maxPreviewHeight / format.height 
    : previewScale;
  const finalPreviewWidth = format.width * finalPreviewScale;
  const finalPreviewHeight = format.height * finalPreviewScale;

  const excerpt = getExcerpt(poem.text, selectedFormat === 'square' ? 4 : 6);
  const fontSize = selectedFormat === 'square' ? 16 : 18;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.primary }]}>Share Poem</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={24} color={colors.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.formatPicker}>
            {(Object.keys(FORMATS) as ShareFormat[]).map((fmt) => (
              <TouchableOpacity
                key={fmt}
                style={[
                  styles.formatBtn,
                  { borderColor: selectedFormat === fmt ? colors.accent : colors.border },
                  selectedFormat === fmt && { backgroundColor: `${colors.accent}15` },
                ]}
                onPress={() => setSelectedFormat(fmt)}
              >
                <Text style={[
                  styles.formatLabel,
                  { color: selectedFormat === fmt ? colors.accent : colors.text }
                ]}>
                  {FORMATS[fmt].label}
                </Text>
                <Text style={[styles.formatRatio, { color: colors.textMuted }]}>
                  {FORMATS[fmt].ratio}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.previewContainer}>
            <View
              ref={cardRef}
              collapsable={false}
              style={[
                styles.shareCard,
                {
                  width: finalPreviewWidth,
                  height: finalPreviewHeight,
                },
              ]}
            >
              <LinearGradient
                colors={cardColors.background}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              />
              
              <View style={styles.cardContent}>
                <View style={styles.watermark}>
                  <View style={[styles.logoCircle, { backgroundColor: cardColors.accent }]}>
                    <Cloud size={16} color="#fff" strokeWidth={1.5} />
                  </View>
                  <Text style={[styles.watermarkText, { color: cardColors.text }]}>PoemCloud</Text>
                </View>

                <View style={styles.poemSection}>
                  <Text style={[
                    styles.poemExcerpt,
                    { color: cardColors.text, fontSize: fontSize * finalPreviewScale * 2.5, lineHeight: fontSize * finalPreviewScale * 4 }
                  ]}>
                    {excerpt}
                  </Text>
                </View>

                <View style={styles.cardFooter}>
                  <Text style={[styles.poemTitleCard, { color: cardColors.text }]}>
                    {poem.title}
                  </Text>
                  <Text style={[styles.poetNameCard, { color: cardColors.textMuted }]}>
                    — {poem.poet.name}
                  </Text>
                  
                  <View style={styles.tagsRow}>
                    <View style={[styles.tag, { backgroundColor: `${cardColors.accent}30` }]}>
                      <Text style={[styles.tagText, { color: cardColors.accent }]}>{poem.country}</Text>
                    </View>
                    {poem.moods.slice(0, 2).map(mood => {
                      const moodColor = cardColors.mood[mood] || cardColors.accent;
                      return (
                        <View key={mood} style={[styles.tag, { backgroundColor: `${moodColor}30` }]}>
                          <Text style={[styles.tagText, { color: moodColor }]}>{mood}</Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.shareBtn, { backgroundColor: colors.accent }]}
            onPress={handleShare}
            disabled={isSharing}
          >
            {isSharing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : shareSuccess ? (
              <>
                <Check size={20} color="#fff" />
                <Text style={styles.shareBtnText}>Shared!</Text>
              </>
            ) : (
              <>
                <Download size={20} color="#fff" />
                <Text style={styles.shareBtnText}>Share Image</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  container: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingBottom: 40,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  closeBtn: {
    padding: 4,
  },
  formatPicker: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formatBtn: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  formatLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  formatRatio: {
    fontSize: 11,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  shareCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardContent: {
    flex: 1,
    padding: 20,
    justifyContent: 'space-between',
  },
  watermark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 14,
    fontWeight: '700',
  },
  watermarkText: {
    fontSize: 12,
    fontWeight: '500',
  },
  poemSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  poemExcerpt: {
    fontStyle: 'italic',
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  cardFooter: {
    alignItems: 'center',
  },
  poemTitleCard: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    textAlign: 'center',
  },
  poetNameCard: {
    fontSize: 12,
    marginBottom: 12,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  tagText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  shareBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
  },
  shareBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
