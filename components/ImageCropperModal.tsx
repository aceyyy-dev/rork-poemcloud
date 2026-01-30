import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  PanResponder,
  Platform,
} from 'react-native';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CROP_SIZE = SCREEN_WIDTH - 80;
const MIN_SCALE = 1;
const MAX_SCALE = 4;

interface ImageCropperModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onCropComplete: (croppedUri: string) => void;
}

export default function ImageCropperModal({
  visible,
  imageUri,
  onClose,
  onCropComplete,
}: ImageCropperModalProps) {
  const { colors } = useTheme();
  const [scale, setScale] = useState(1);
  const [translateX, setTranslateX] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [imageSize, setImageSize] = useState({ width: CROP_SIZE, height: CROP_SIZE });
  
  const lastScale = useRef(1);
  const lastTranslateX = useRef(0);
  const lastTranslateY = useRef(0);
  const lastDistance = useRef(0);

  const getDistance = (touches: { pageX: number; pageY: number }[]) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].pageX - touches[1].pageX;
    const dy = touches[0].pageY - touches[1].pageY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const clampTranslation = (x: number, y: number, currentScale: number) => {
    const scaledWidth = imageSize.width * currentScale;
    const scaledHeight = imageSize.height * currentScale;
    
    const maxX = Math.max(0, (scaledWidth - CROP_SIZE) / 2);
    const maxY = Math.max(0, (scaledHeight - CROP_SIZE) / 2);
    
    return {
      x: Math.min(maxX, Math.max(-maxX, x)),
      y: Math.min(maxY, Math.max(-maxY, y)),
    };
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        lastTranslateX.current = translateX;
        lastTranslateY.current = translateY;
        lastScale.current = scale;
        
        if (evt.nativeEvent.touches.length === 2) {
          lastDistance.current = getDistance(evt.nativeEvent.touches as any);
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        
        if (touches.length === 2) {
          const currentDistance = getDistance(touches as any);
          if (lastDistance.current > 0) {
            const newScale = Math.min(
              MAX_SCALE,
              Math.max(MIN_SCALE, lastScale.current * (currentDistance / lastDistance.current))
            );
            setScale(newScale);
            
            const clamped = clampTranslation(lastTranslateX.current, lastTranslateY.current, newScale);
            setTranslateX(clamped.x);
            setTranslateY(clamped.y);
          }
        } else if (touches.length === 1) {
          const newX = lastTranslateX.current + gestureState.dx;
          const newY = lastTranslateY.current + gestureState.dy;
          const clamped = clampTranslation(newX, newY, scale);
          setTranslateX(clamped.x);
          setTranslateY(clamped.y);
        }
      },
      onPanResponderRelease: () => {
        lastDistance.current = 0;
      },
    })
  ).current;

  const handleZoomIn = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newScale = Math.min(MAX_SCALE, scale + 0.5);
    setScale(newScale);
    const clamped = clampTranslation(translateX, translateY, newScale);
    setTranslateX(clamped.x);
    setTranslateY(clamped.y);
  };

  const handleZoomOut = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    const newScale = Math.max(MIN_SCALE, scale - 0.5);
    setScale(newScale);
    const clamped = clampTranslation(translateX, translateY, newScale);
    setTranslateX(clamped.x);
    setTranslateY(clamped.y);
  };

  const handleDone = () => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    console.log('[ImageCropper] Crop complete with scale:', scale, 'translate:', translateX, translateY);
    onCropComplete(imageUri);
  };

  const handleImageLoad = (event: any) => {
    const { width, height } = event.nativeEvent.source;
    const aspectRatio = width / height;
    
    let newWidth = CROP_SIZE;
    let newHeight = CROP_SIZE;
    
    if (aspectRatio > 1) {
      newWidth = CROP_SIZE * aspectRatio;
    } else {
      newHeight = CROP_SIZE / aspectRatio;
    }
    
    setImageSize({ width: newWidth, height: newHeight });
    console.log('[ImageCropper] Image loaded, size:', newWidth, newHeight);
  };

  const handleClose = () => {
    setScale(1);
    setTranslateX(0);
    setTranslateY(0);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={[styles.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={handleClose} style={styles.headerBtn}>
            <X size={24} color={colors.text} />
            <Text style={[styles.headerBtnText, { color: colors.text }]}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.primary }]}>Crop Image</Text>
          <TouchableOpacity onPress={handleDone} style={styles.headerBtn}>
            <Check size={24} color={colors.accent} />
            <Text style={[styles.headerBtnText, { color: colors.accent }]}>Done</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.cropContainer}>
          <View style={styles.cropArea} {...panResponder.panHandlers}>
            <View style={[styles.imageContainer, { overflow: 'hidden' }]}>
              <Image
                source={{ uri: imageUri }}
                style={[
                  styles.image,
                  {
                    width: imageSize.width,
                    height: imageSize.height,
                    transform: [
                      { scale },
                      { translateX: translateX / scale },
                      { translateY: translateY / scale },
                    ],
                  },
                ]}
                onLoad={handleImageLoad}
                resizeMode="cover"
              />
            </View>
            <View style={styles.cropFrame} pointerEvents="none">
              <View style={[styles.cornerTL, { borderColor: colors.textWhite }]} />
              <View style={[styles.cornerTR, { borderColor: colors.textWhite }]} />
              <View style={[styles.cornerBL, { borderColor: colors.textWhite }]} />
              <View style={[styles.cornerBR, { borderColor: colors.textWhite }]} />
            </View>
          </View>
          
          <View style={styles.overlay}>
            <View style={[styles.overlayTop, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
            <View style={styles.overlayMiddle}>
              <View style={[styles.overlaySide, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
              <View style={{ width: CROP_SIZE, height: CROP_SIZE }} />
              <View style={[styles.overlaySide, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
            </View>
            <View style={[styles.overlayBottom, { backgroundColor: 'rgba(0,0,0,0.6)' }]} />
          </View>
        </View>

        <View style={[styles.controls, { backgroundColor: colors.surface }]}>
          <Text style={[styles.hint, { color: colors.textMuted }]}>
            Pinch to zoom • Drag to reposition
          </Text>
          <View style={styles.zoomControls}>
            <TouchableOpacity
              style={[styles.zoomBtn, { backgroundColor: colors.surfaceSecondary }]}
              onPress={handleZoomOut}
              disabled={scale <= MIN_SCALE}
            >
              <ZoomOut size={24} color={scale <= MIN_SCALE ? colors.textMuted : colors.text} />
            </TouchableOpacity>
            <View style={[styles.zoomIndicator, { backgroundColor: colors.surfaceSecondary }]}>
              <Text style={[styles.zoomText, { color: colors.text }]}>
                {Math.round(scale * 100)}%
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.zoomBtn, { backgroundColor: colors.surfaceSecondary }]}
              onPress={handleZoomIn}
              disabled={scale >= MAX_SCALE}
            >
              <ZoomIn size={24} color={scale >= MAX_SCALE ? colors.textMuted : colors.text} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  headerBtnText: {
    fontSize: 16,
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  cropContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cropArea: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  imageContainer: {
    width: CROP_SIZE,
    height: CROP_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  image: {
    position: 'absolute',
  },
  cropFrame: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  cornerTL: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 16,
  },
  cornerTR: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 24,
    height: 24,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 16,
  },
  cornerBL: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 16,
  },
  cornerBR: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 16,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  overlayTop: {
    flex: 1,
  },
  overlayMiddle: {
    flexDirection: 'row',
    height: CROP_SIZE,
  },
  overlaySide: {
    flex: 1,
  },
  overlayBottom: {
    flex: 1,
  },
  controls: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
    alignItems: 'center',
    gap: 16,
  },
  hint: {
    fontSize: 14,
    textAlign: 'center',
  },
  zoomControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  zoomBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  zoomIndicator: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 70,
    alignItems: 'center',
  },
  zoomText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
