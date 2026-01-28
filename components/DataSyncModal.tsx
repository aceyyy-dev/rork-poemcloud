import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Cloud, Smartphone, Merge, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  visible: boolean;
  onChoice: (choice: 'merge' | 'device' | 'cloud') => void;
  onBack?: () => void;
  onCancel: () => void;
  localBookmarkCount: number;
  localLikeCount: number;
}

export default function DataSyncModal({ visible, onChoice, onBack, onCancel, localBookmarkCount, localLikeCount }: Props) {
  const { colors } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleChoice = async (choice: 'merge' | 'device' | 'cloud') => {
    setIsProcessing(true);
    setTimeout(() => {
      onChoice(choice);
      setIsProcessing(false);
    }, 800);
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: colors.surface }]}>
          {onBack && (
            <TouchableOpacity style={styles.backButton} onPress={onBack}>
              <ChevronLeft size={20} color={colors.textMuted} strokeWidth={2} />
            </TouchableOpacity>
          )}
          <Text style={[styles.title, { color: colors.primary }]}>Sync your data?</Text>
          <Text style={[styles.subtitle, { color: colors.textMuted }]}>
            You have {localBookmarkCount} bookmarks and {localLikeCount} likes on this device.
          </Text>

          <View style={styles.options}>
            <TouchableOpacity
              style={[styles.option, { backgroundColor: colors.background, borderColor: colors.accent }]}
              onPress={() => handleChoice('merge')}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.premiumLight }]}>
                <Merge size={24} color={colors.accent} strokeWidth={1.5} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.primary }]}>Merge</Text>
              <Text style={[styles.optionDesc, { color: colors.textMuted }]}>
                Combine local data with cloud (recommended)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, { backgroundColor: colors.background }]}
              onPress={() => handleChoice('device')}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.surfaceSecondary }]}>
                <Smartphone size={24} color={colors.textLight} strokeWidth={1.5} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.primary }]}>Use device data</Text>
              <Text style={[styles.optionDesc, { color: colors.textMuted }]}>
                Keep local data and overwrite cloud
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, { backgroundColor: colors.background }]}
              onPress={() => handleChoice('cloud')}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <View style={[styles.optionIcon, { backgroundColor: colors.surfaceSecondary }]}>
                <Cloud size={24} color={colors.textLight} strokeWidth={1.5} />
              </View>
              <Text style={[styles.optionTitle, { color: colors.primary }]}>Use cloud data</Text>
              <Text style={[styles.optionDesc, { color: colors.textMuted }]}>
                Download from cloud and replace local
              </Text>
            </TouchableOpacity>
          </View>

          {isProcessing && (
            <View style={styles.loading}>
              <ActivityIndicator color={colors.accent} />
              <Text style={[styles.loadingText, { color: colors.textMuted }]}>Syncing...</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 24,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  options: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  optionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionDesc: {
    fontSize: 14,
    lineHeight: 20,
  },
  loading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.05)',
  },
  loadingText: {
    fontSize: 14,
  },
});
