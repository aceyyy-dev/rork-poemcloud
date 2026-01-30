import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect, useRef } from 'react';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface TTSState {
  currentPoemId: string | null;
  currentPoemTitle: string | null;
  isSpeaking: boolean;
  isPaused: boolean;
  progress: number;
  duration: number;
  elapsed: number;
  isPlayerVisible: boolean;
}

export const [TTSProvider, useTTS] = createContextHook(() => {
  const [state, setState] = useState<TTSState>({
    currentPoemId: null,
    currentPoemTitle: null,
    isSpeaking: false,
    isPaused: false,
    progress: 0,
    duration: 0,
    elapsed: 0,
    isPlayerVisible: false,
  });
  const pausedAtRef = useRef<number>(0);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number>(0);
  const estimatedDurationRef = useRef<number>(0);
  const currentTextRef = useRef<string>('');
  const hasInitializedAudioRef = useRef(false);

  useEffect(() => {
    const initializeAudio = async () => {
      if (hasInitializedAudioRef.current) return;
      hasInitializedAudioRef.current = true;

      try {
        await Audio.setAudioModeAsync({
          playsInSilentModeIOS: true,
          staysActiveInBackground: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        console.log('[TTS] Audio mode configured for background playback');
      } catch (error) {
        console.log('[TTS] Error setting audio mode:', error);
      }
    };

    initializeAudio();
  }, []);

  const stopProgressTracking = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
  }, []);

  const startProgressTracking = useCallback((duration: number) => {
    stopProgressTracking();
    startTimeRef.current = Date.now();
    estimatedDurationRef.current = duration;
    
    progressIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const progress = Math.min(elapsed / duration, 1);
      setState(prev => ({
        ...prev,
        progress,
        elapsed: Math.floor(elapsed),
      }));
      
      if (progress >= 1) {
        stopProgressTracking();
      }
    }, 100);
  }, [stopProgressTracking]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (state.currentPoemId && state.isSpeaking && !state.isPaused) {
        const speaking = await Speech.isSpeakingAsync();
        if (!speaking) {
          stopProgressTracking();
          setState(prev => ({ 
            ...prev, 
            isSpeaking: false, 
            isPaused: false,
            progress: 1, 
            elapsed: prev.duration,
            isPlayerVisible: false,
          }));
          console.log('[TTS] Speech naturally completed');
        }
      }
    }, 500);

    return () => clearInterval(interval);
  }, [state.currentPoemId, state.isSpeaking, state.isPaused, stopProgressTracking]);

  const dismissPlayer = useCallback(() => {
    stopProgressTracking();
    Speech.stop();
    pausedAtRef.current = 0;
    currentTextRef.current = '';
    setState({
      currentPoemId: null,
      currentPoemTitle: null,
      isSpeaking: false,
      isPaused: false,
      progress: 0,
      duration: 0,
      elapsed: 0,
      isPlayerVisible: false,
    });
    console.log('[TTS] Player dismissed');
  }, [stopProgressTracking]);

  const stopSpeaking = useCallback(async () => {
    try {
      stopProgressTracking();
      await Speech.stop();
      pausedAtRef.current = 0;
      currentTextRef.current = '';
      setState({
        currentPoemId: null,
        currentPoemTitle: null,
        isSpeaking: false,
        isPaused: false,
        progress: 0,
        duration: 0,
        elapsed: 0,
        isPlayerVisible: false,
      });
      console.log('[TTS] Stopped speaking');
    } catch (error) {
      console.log('[TTS] Error stopping speech:', error);
    }
  }, [stopProgressTracking]);

  const pauseSpeaking = useCallback(async () => {
    try {
      stopProgressTracking();
      await Speech.stop();
      pausedAtRef.current = state.elapsed;
      setState(prev => ({ 
        ...prev, 
        isSpeaking: false, 
        isPaused: true,
        isPlayerVisible: true,
      }));
      console.log('[TTS] Paused at:', state.elapsed);
    } catch (error) {
      console.log('[TTS] Error pausing speech:', error);
    }
  }, [stopProgressTracking, state.elapsed]);

  const speak = useCallback(async (poemId: string, text: string, poemTitle?: string) => {
    try {
      const isSpeaking = await Speech.isSpeakingAsync();
      if (isSpeaking) {
        stopProgressTracking();
        await Speech.stop();
      }

      const cleanText = text
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ', ')
        .trim();

      currentTextRef.current = cleanText;

      const wordCount = cleanText.split(/\s+/).length;
      const wordsPerSecond = Platform.OS === 'ios' ? 2.2 : 2.0;
      const estimatedDuration = Math.max(wordCount / wordsPerSecond, 5);

      setState({
        currentPoemId: poemId,
        currentPoemTitle: poemTitle || null,
        isSpeaking: true,
        isPaused: false,
        progress: 0,
        duration: estimatedDuration,
        elapsed: 0,
        isPlayerVisible: true,
      });
      pausedAtRef.current = 0;
      startProgressTracking(estimatedDuration);
      console.log('[TTS] Starting speech for poem:', poemId, 'estimated duration:', estimatedDuration);

      Speech.speak(cleanText, {
        language: 'en-US',
        pitch: 1.0,
        rate: Platform.OS === 'ios' ? 0.92 : 0.88,
        onDone: () => {
          console.log('[TTS] Speech completed');
          stopProgressTracking();
          setState(prev => ({ 
            ...prev, 
            isSpeaking: false, 
            isPaused: false,
            progress: 1, 
            elapsed: prev.duration,
            isPlayerVisible: false,
          }));
        },
        onStopped: () => {
          console.log('[TTS] Speech stopped by user');
        },
        onError: (error) => {
          console.log('[TTS] Speech error:', error);
          stopProgressTracking();
          setState({
            currentPoemId: null,
            currentPoemTitle: null,
            isSpeaking: false,
            isPaused: false,
            progress: 0,
            duration: 0,
            elapsed: 0,
            isPlayerVisible: false,
          });
        },
      });
    } catch (error) {
      console.log('[TTS] Error starting speech:', error);
      stopProgressTracking();
      setState({
        currentPoemId: null,
        currentPoemTitle: null,
        isSpeaking: false,
        isPaused: false,
        progress: 0,
        duration: 0,
        elapsed: 0,
        isPlayerVisible: false,
      });
    }
  }, [startProgressTracking, stopProgressTracking]);

  const resumeSpeaking = useCallback(async (poemId: string, text: string) => {
    try {
      const cleanText = text
        .replace(/\n{2,}/g, '. ')
        .replace(/\n/g, ', ')
        .trim();

      const wordsArray = cleanText.split(/\s+/);
      const skipWords = Math.floor((pausedAtRef.current / state.duration) * wordsArray.length);
      const remainingText = wordsArray.slice(skipWords).join(' ');

      setState(prev => ({ ...prev, isSpeaking: true, isPaused: false, isPlayerVisible: true }));
      startTimeRef.current = Date.now() - (pausedAtRef.current * 1000);
      
      progressIntervalRef.current = setInterval(() => {
        const elapsed = (Date.now() - startTimeRef.current) / 1000;
        const progress = Math.min(elapsed / state.duration, 1);
        setState(prev => ({
          ...prev,
          progress,
          elapsed: Math.floor(elapsed),
        }));
        
        if (progress >= 1) {
          stopProgressTracking();
        }
      }, 100);

      console.log('[TTS] Resuming from:', pausedAtRef.current, 'seconds');

      Speech.speak(remainingText, {
        language: 'en-US',
        pitch: 1.0,
        rate: Platform.OS === 'ios' ? 0.92 : 0.88,
        onDone: () => {
          console.log('[TTS] Speech completed after resume');
          stopProgressTracking();
          setState(prev => ({ 
            ...prev, 
            isSpeaking: false, 
            isPaused: false,
            progress: 1, 
            elapsed: prev.duration,
            isPlayerVisible: false,
          }));
        },
        onStopped: () => {
          console.log('[TTS] Speech stopped after resume');
        },
        onError: (error) => {
          console.log('[TTS] Speech error after resume:', error);
          stopProgressTracking();
          setState({
            currentPoemId: null,
            currentPoemTitle: null,
            isSpeaking: false,
            isPaused: false,
            progress: 0,
            duration: 0,
            elapsed: 0,
            isPlayerVisible: false,
          });
        },
      });
    } catch (error) {
      console.log('[TTS] Error resuming speech:', error);
    }
  }, [state.duration, stopProgressTracking]);

  const toggleSpeech = useCallback(async (poemId: string, text: string, poemTitle?: string) => {
    if (state.currentPoemId === poemId) {
      if (state.isSpeaking) {
        await pauseSpeaking();
      } else if (state.isPaused) {
        await resumeSpeaking(poemId, text);
      } else {
        await speak(poemId, text, poemTitle);
      }
    } else {
      await speak(poemId, text, poemTitle);
    }
  }, [state.currentPoemId, state.isSpeaking, state.isPaused, speak, pauseSpeaking, resumeSpeaking]);

  const isSpeakingPoem = useCallback((poemId: string) => {
    return state.isSpeaking && state.currentPoemId === poemId;
  }, [state.isSpeaking, state.currentPoemId]);

  const hasActiveAudio = useCallback((poemId: string) => {
    return state.currentPoemId === poemId && state.isPlayerVisible;
  }, [state.currentPoemId, state.isPlayerVisible]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const getRemainingTime = useCallback(() => {
    const remaining = Math.max(state.duration - state.elapsed, 0);
    return formatTime(remaining);
  }, [state.duration, state.elapsed, formatTime]);

  const getElapsedTime = useCallback(() => {
    return formatTime(state.elapsed);
  }, [state.elapsed, formatTime]);

  const seekTo = useCallback((position: number) => {
    const newElapsed = position * state.duration;
    startTimeRef.current = Date.now() - (newElapsed * 1000);
    pausedAtRef.current = newElapsed;
    setState(prev => ({
      ...prev,
      progress: position,
      elapsed: Math.floor(newElapsed),
    }));
    console.log('[TTS] Seeked to position:', position, 'elapsed:', newElapsed);
  }, [state.duration]);

  return {
    currentPoemId: state.currentPoemId,
    currentPoemTitle: state.currentPoemTitle,
    isSpeaking: state.isSpeaking,
    isPaused: state.isPaused,
    progress: state.progress,
    duration: state.duration,
    elapsed: state.elapsed,
    isPlayerVisible: state.isPlayerVisible,
    speak,
    stopSpeaking,
    pauseSpeaking,
    resumeSpeaking,
    toggleSpeech,
    isSpeakingPoem,
    hasActiveAudio,
    formatTime,
    getRemainingTime,
    getElapsedTime,
    seekTo,
    dismissPlayer,
  };
});
