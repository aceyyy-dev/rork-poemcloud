import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { trpcClient } from '@/lib/trpc';

const AUTH_STORAGE_KEY = 'poemcloud_auth';
const BIOMETRIC_TOKEN_KEY = 'poemcloud_biometric_token';
const BIOMETRIC_USER_ID_KEY = 'poemcloud_biometric_user_id';
const BIOMETRIC_ENABLED_KEY = 'poemcloud_biometric_enabled';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isPremium: boolean;
  createdAt: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [authState, setAuthState] = useState<AuthState>({ user: null, token: null });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      try {
        console.log('[Auth] Loading stored auth state...');
        const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const parsed: AuthState = JSON.parse(stored);
          console.log('[Auth] Found stored auth:', parsed.user?.id);
          setAuthState(parsed);
        } else {
          console.log('[Auth] No stored auth found');
        }
      } catch (error) {
        console.error('[Auth] Error loading auth:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAuth();
  }, []);

  const saveAuthState = useCallback(async (state: AuthState) => {
    console.log('[Auth] Saving auth state:', state.user?.id);
    await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
    setAuthState(state);
    queryClient.setQueryData(['auth'], state);
  }, [queryClient]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Attempting sign in with email:', email);
    try {
      const result = await trpcClient.auth.login.mutate({ email, password });
      console.log('[Auth] Sign in successful:', result.user.id);
      
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        isPremium: result.user.isPremium,
        createdAt: result.user.createdAt,
      };
      
      await saveAuthState({ user: authUser, token: result.token });
      return authUser;
    } catch (error: any) {
      console.error('[Auth] Sign in error:', error);
      throw new Error(error.message || 'Invalid email or password');
    }
  }, [saveAuthState]);

  const signUpWithEmail = useCallback(async (email: string, password: string, name?: string) => {
    console.log('[Auth] Attempting sign up with email:', email);
    try {
      const result = await trpcClient.auth.signup.mutate({ email, password, name });
      console.log('[Auth] Sign up successful:', result.user.id);
      
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        isPremium: result.user.isPremium,
        createdAt: result.user.createdAt,
      };
      
      await saveAuthState({ user: authUser, token: result.token });
      return authUser;
    } catch (error: any) {
      console.error('[Auth] Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  }, [saveAuthState]);

  const signInWithApple = useCallback(async () => {
    console.log('[Auth] Sign in with Apple (demo mode)');
    const demoEmail = `apple_${Date.now()}@demo.poemcloud.app`;
    try {
      const result = await trpcClient.auth.signup.mutate({ 
        email: demoEmail, 
        password: 'apple_demo_password_secure',
        name: 'Apple User'
      });
      
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        isPremium: result.user.isPremium,
        createdAt: result.user.createdAt,
      };
      
      await saveAuthState({ user: authUser, token: result.token });
      return authUser;
    } catch (error: any) {
      console.error('[Auth] Apple sign in error:', error);
      throw new Error('Apple sign in failed');
    }
  }, [saveAuthState]);

  const signInWithGoogle = useCallback(async () => {
    console.log('[Auth] Sign in with Google (demo mode)');
    const demoEmail = `google_${Date.now()}@demo.poemcloud.app`;
    try {
      const result = await trpcClient.auth.signup.mutate({ 
        email: demoEmail, 
        password: 'google_demo_password_secure',
        name: 'Google User'
      });
      
      const authUser: AuthUser = {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name,
        isPremium: result.user.isPremium,
        createdAt: result.user.createdAt,
      };
      
      await saveAuthState({ user: authUser, token: result.token });
      return authUser;
    } catch (error: any) {
      console.error('[Auth] Google sign in error:', error);
      throw new Error('Google sign in failed');
    }
  }, [saveAuthState]);

  const signOut = useCallback(async () => {
    console.log('[Auth] Signing out');
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_USER_ID_KEY);
    }
    await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    setAuthState({ user: null, token: null });
    queryClient.setQueryData(['auth'], { user: null, token: null });
  }, [queryClient]);

  const signInWithBiometric = useCallback(async (userId: string, token: string) => {
    console.log('[Auth] Sign in with biometric, userId:', userId);
    const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const parsed: AuthState = JSON.parse(stored);
      if (parsed.user && parsed.user.id === userId) {
        setAuthState(parsed);
        queryClient.setQueryData(['auth'], parsed);
        return parsed.user;
      }
    }
    const mockUser: AuthUser = {
      id: userId,
      email: 'biometric@user.com',
      name: 'User',
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
    await saveAuthState({ user: mockUser, token });
    return mockUser;
  }, [saveAuthState, queryClient]);

  const updateUserPremiumStatus = useCallback(async (isPremium: boolean) => {
    if (!authState.user) return;
    console.log('[Auth] Updating premium status to:', isPremium);
    
    try {
      await trpcClient.auth.updatePremiumStatus.mutate({
        userId: authState.user.id,
        isPremium,
      });
    } catch {
      console.log('[Auth] Backend premium update failed, updating locally');
    }
    
    const updatedUser = { ...authState.user, isPremium };
    const updatedState = { ...authState, user: updatedUser };
    await saveAuthState(updatedState);
  }, [authState, saveAuthState]);

  return {
    user: authState.user,
    token: authState.token,
    isLoggedIn: !!authState.user,
    isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithApple,
    signInWithGoogle,
    signInWithBiometric,
    signOut,
    updateUserPremiumStatus,
  };
});
