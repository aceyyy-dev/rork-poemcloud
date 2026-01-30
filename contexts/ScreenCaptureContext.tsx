import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import * as ScreenCapture from 'expo-screen-capture';
import { usePurchases } from './PurchasesContext';

export const [ScreenCaptureProvider, useScreenCapture] = createContextHook(() => {
  const { isPremium } = usePurchases();
  const [showCaptureOverlay, setShowCaptureOverlay] = useState(false);
  const [isProtectedScreen, setIsProtectedScreen] = useState(false);
  const overlayTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (Platform.OS === 'web') return;

    const setupScreenshotListener = async () => {
      if (Platform.OS === 'ios') {
        const subscription = ScreenCapture.addScreenshotListener(() => {
          console.log('[ScreenCapture] Screenshot detected');
          if (!isPremium && isProtectedScreen) {
            console.log('[ScreenCapture] Free user on protected screen - showing overlay');
            setShowCaptureOverlay(true);
            
            if (overlayTimeoutRef.current) {
              clearTimeout(overlayTimeoutRef.current);
            }
            overlayTimeoutRef.current = setTimeout(() => {
              setShowCaptureOverlay(false);
            }, 5000);
          }
        });

        return () => {
          subscription.remove();
        };
      }
    };

    setupScreenshotListener();

    return () => {
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
    };
  }, [isPremium, isProtectedScreen]);

  useEffect(() => {
    if (Platform.OS === 'web' || Platform.OS === 'ios') return;

    const manageAndroidCapture = async () => {
      try {
        if (!isPremium && isProtectedScreen) {
          console.log('[ScreenCapture] Android: Enabling FLAG_SECURE');
          await ScreenCapture.preventScreenCaptureAsync('poem-protection');
        } else {
          console.log('[ScreenCapture] Android: Disabling FLAG_SECURE');
          await ScreenCapture.allowScreenCaptureAsync('poem-protection');
        }
      } catch (error) {
        console.log('[ScreenCapture] Android capture control error:', error);
      }
    };

    manageAndroidCapture();
  }, [isPremium, isProtectedScreen]);

  const enterProtectedScreen = useCallback(() => {
    console.log('[ScreenCapture] Entering protected screen');
    setIsProtectedScreen(true);
  }, []);

  const exitProtectedScreen = useCallback(async () => {
    console.log('[ScreenCapture] Exiting protected screen');
    setIsProtectedScreen(false);
    
    if (Platform.OS === 'android') {
      try {
        await ScreenCapture.allowScreenCaptureAsync('poem-protection');
      } catch (error) {
        console.log('[ScreenCapture] Error allowing capture on exit:', error);
      }
    }
  }, []);

  const dismissOverlay = useCallback(() => {
    setShowCaptureOverlay(false);
    if (overlayTimeoutRef.current) {
      clearTimeout(overlayTimeoutRef.current);
      overlayTimeoutRef.current = null;
    }
  }, []);

  const triggerOverlay = useCallback(() => {
    if (!isPremium && isProtectedScreen) {
      setShowCaptureOverlay(true);
      if (overlayTimeoutRef.current) {
        clearTimeout(overlayTimeoutRef.current);
      }
      overlayTimeoutRef.current = setTimeout(() => {
        setShowCaptureOverlay(false);
      }, 5000);
    }
  }, [isPremium, isProtectedScreen]);

  return {
    showCaptureOverlay,
    isProtectedScreen,
    isPremium,
    enterProtectedScreen,
    exitProtectedScreen,
    dismissOverlay,
    triggerOverlay,
  };
});
