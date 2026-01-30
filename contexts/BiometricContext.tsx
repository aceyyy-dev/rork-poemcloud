import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';

const BIOMETRIC_ENABLED_KEY = 'poemcloud_biometric_enabled';
const BIOMETRIC_TOKEN_KEY = 'poemcloud_biometric_token';
const BIOMETRIC_USER_ID_KEY = 'poemcloud_biometric_user_id';

export type BiometricType = 'face' | 'fingerprint' | 'iris' | 'none';

interface BiometricState {
  isAvailable: boolean;
  isEnrolled: boolean;
  biometricType: BiometricType;
  isEnabled: boolean;
  storedUserId: string | null;
}

export const [BiometricProvider, useBiometric] = createContextHook(() => {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    isEnrolled: false,
    biometricType: 'none',
    isEnabled: false,
    storedUserId: null,
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkBiometricStatus = useCallback(async () => {
    try {
      if (Platform.OS === 'web') {
        setState(prev => ({ ...prev, isAvailable: false, isEnrolled: false }));
        setIsLoading(false);
        return;
      }

      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      let biometricType: BiometricType = 'none';
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricType = 'face';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricType = 'fingerprint';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.IRIS)) {
        biometricType = 'iris';
      }

      const enabledStr = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY);
      const isEnabled = enabledStr === 'true';

      let storedUserId: string | null = null;
      try {
        storedUserId = await SecureStore.getItemAsync(BIOMETRIC_USER_ID_KEY);
      } catch {
        storedUserId = null;
      }

      console.log('[Biometric] Status check:', {
        compatible,
        enrolled,
        biometricType,
        isEnabled,
        storedUserId: storedUserId ? 'exists' : 'none',
      });

      setState({
        isAvailable: compatible,
        isEnrolled: enrolled,
        biometricType,
        isEnabled,
        storedUserId,
      });
    } catch (error) {
      console.error('[Biometric] Error checking status:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkBiometricStatus();
  }, [checkBiometricStatus]);

  const getBiometricTypeName = useCallback((): string => {
    if (Platform.OS === 'ios') {
      return state.biometricType === 'face' ? 'Face ID' : 'Touch ID';
    }
    return 'Biometric';
  }, [state.biometricType]);

  const enableBiometric = useCallback(async (userId: string, token: string): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        console.log('[Biometric] Not available on web');
        return false;
      }

      if (!state.isAvailable || !state.isEnrolled) {
        console.log('[Biometric] Not available or not enrolled');
        return false;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Confirm to enable ${getBiometricTypeName()}`,
        cancelLabel: 'Cancel',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        console.log('[Biometric] Authentication failed during enable:', result.error);
        return false;
      }

      await SecureStore.setItemAsync(BIOMETRIC_TOKEN_KEY, token);
      await SecureStore.setItemAsync(BIOMETRIC_USER_ID_KEY, userId);
      await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true');

      setState(prev => ({ ...prev, isEnabled: true, storedUserId: userId }));
      console.log('[Biometric] Enabled successfully for user:', userId);
      return true;
    } catch (error) {
      console.error('[Biometric] Error enabling:', error);
      return false;
    }
  }, [state.isAvailable, state.isEnrolled, getBiometricTypeName]);

  const disableBiometric = useCallback(async (): Promise<void> => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
        await SecureStore.deleteItemAsync(BIOMETRIC_USER_ID_KEY);
      }
      await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
      setState(prev => ({ ...prev, isEnabled: false, storedUserId: null }));
      console.log('[Biometric] Disabled successfully');
    } catch (error) {
      console.error('[Biometric] Error disabling:', error);
    }
  }, []);

  const authenticateWithBiometric = useCallback(async (): Promise<{ success: boolean; token?: string; userId?: string }> => {
    try {
      if (Platform.OS === 'web') {
        return { success: false };
      }

      if (!state.isEnabled) {
        console.log('[Biometric] Not enabled');
        return { success: false };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Log in with ${getBiometricTypeName()}`,
        cancelLabel: 'Use Password',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        console.log('[Biometric] Authentication failed:', result.error);
        return { success: false };
      }

      const token = await SecureStore.getItemAsync(BIOMETRIC_TOKEN_KEY);
      const userId = await SecureStore.getItemAsync(BIOMETRIC_USER_ID_KEY);

      if (!token || !userId) {
        console.log('[Biometric] No stored credentials found');
        await disableBiometric();
        return { success: false };
      }

      console.log('[Biometric] Authentication successful');
      return { success: true, token, userId };
    } catch (error) {
      console.error('[Biometric] Authentication error:', error);
      return { success: false };
    }
  }, [state.isEnabled, getBiometricTypeName, disableBiometric]);

  const clearStoredCredentials = useCallback(async (): Promise<void> => {
    try {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
        await SecureStore.deleteItemAsync(BIOMETRIC_USER_ID_KEY);
      }
      setState(prev => ({ ...prev, storedUserId: null }));
      console.log('[Biometric] Credentials cleared');
    } catch (error) {
      console.error('[Biometric] Error clearing credentials:', error);
    }
  }, []);

  const canShowBiometricLogin = state.isEnabled && state.storedUserId !== null && state.isAvailable && state.isEnrolled;

  return {
    isAvailable: state.isAvailable,
    isEnrolled: state.isEnrolled,
    biometricType: state.biometricType,
    isEnabled: state.isEnabled,
    storedUserId: state.storedUserId,
    isLoading,
    canShowBiometricLogin,
    getBiometricTypeName,
    enableBiometric,
    disableBiometric,
    authenticateWithBiometric,
    clearStoredCredentials,
    checkBiometricStatus,
  };
});
