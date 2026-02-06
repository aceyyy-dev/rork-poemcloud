import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import * as WebBrowser from 'expo-web-browser';
import * as AppleAuthentication from 'expo-apple-authentication';

import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { supabase, getOAuthRedirectUrl } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

WebBrowser.maybeCompleteAuthSession();

const BIOMETRIC_TOKEN_KEY = 'poemcloud_biometric_token';
const BIOMETRIC_USER_ID_KEY = 'poemcloud_biometric_user_id';
const BIOMETRIC_ENABLED_KEY = 'poemcloud_biometric_enabled';
const PREMIUM_STATUS_KEY = 'poemcloud_premium_status';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  isPremium: boolean;
  createdAt: string;
}

function mapSupabaseUser(user: User, isPremium: boolean = false): AuthUser {
  return {
    id: user.id,
    email: user.email || '',
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split('@')[0],
    isPremium,
    createdAt: user.created_at,
  };
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPremiumLocal, setIsPremiumLocal] = useState(false);

  useEffect(() => {
    const loadPremiumStatus = async () => {
      try {
        const stored = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
        if (stored === 'true') {
          setIsPremiumLocal(true);
        }
      } catch (error) {
        console.error('[Auth] Error loading premium status:', error);
      }
    };
    loadPremiumStatus();
  }, []);

  useEffect(() => {
    console.log('[Auth] Setting up Supabase auth listener...');
    
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('[Auth] Initial session:', currentSession?.user?.id || 'none');
      setSession(currentSession);
      if (currentSession?.user) {
        setUser(mapSupabaseUser(currentSession.user, isPremiumLocal));
      }
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      console.log('[Auth] Auth state changed:', _event, newSession?.user?.id || 'none');
      setSession(newSession);
      if (newSession?.user) {
        setUser(mapSupabaseUser(newSession.user, isPremiumLocal));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isPremiumLocal]);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Attempting Supabase sign in with email:', email);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase().trim(),
      password,
    });

    if (error) {
      console.error('[Auth] Sign in error:', error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Sign in failed');
    }

    console.log('[Auth] Sign in successful:', data.user.id);
    const authUser = mapSupabaseUser(data.user, isPremiumLocal);
    setUser(authUser);
    return authUser;
  }, [isPremiumLocal]);

  const signUpWithEmail = useCallback(async (email: string, password: string, name?: string) => {
    console.log('[Auth] Attempting Supabase sign up with email:', email);
    
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase().trim(),
      password,
      options: {
        data: {
          name: name || email.split('@')[0],
          full_name: name || email.split('@')[0],
        },
      },
    });

    if (error) {
      console.error('[Auth] Sign up error:', error.message);
      throw new Error(error.message);
    }

    if (!data.user) {
      throw new Error('Sign up failed');
    }

    console.log('[Auth] Sign up successful:', data.user.id);
    const authUser = mapSupabaseUser(data.user, false);
    setUser(authUser);
    return authUser;
  }, []);

  const signInWithApple = useCallback(async () => {
    console.log('[Auth] Starting Apple NATIVE sign in...');
    
    if (Platform.OS === 'web') {
      throw new Error('Apple Sign In is not available on web');
    }
    
    try {
      console.log('[Auth] Requesting Apple credentials via native API...');
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      console.log('[Auth] Apple native credential received, user:', credential.user);

      if (!credential.identityToken) {
        console.error('[Auth] No identityToken in Apple credential');
        throw new Error('No identity token returned from Apple');
      }

      console.log('[Auth] Signing in to Supabase with Apple ID token...');
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken,
      });

      if (error) {
        console.error('[Auth] Supabase signInWithIdToken error:', error.message);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Apple sign in failed - no user returned');
      }

      console.log('[Auth] Apple NATIVE sign in successful:', data.user.id);
      const authUser = mapSupabaseUser(data.user, isPremiumLocal);
      setUser(authUser);
      return authUser;
    } catch (error: any) {
      if (error.code === 'ERR_REQUEST_CANCELED') {
        console.log('[Auth] Apple sign in was cancelled by user');
        throw new Error('Sign in was cancelled');
      }
      console.error('[Auth] Apple NATIVE sign in error:', error);
      throw error;
    }
  }, [isPremiumLocal]);

  const signInWithGoogle = useCallback(async () => {
    console.log('[Auth] Sign in with Google via Supabase');
    
    try {
      const redirectUrl = getOAuthRedirectUrl();
      console.log('[Auth] Google OAuth redirect URL:', redirectUrl);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        console.error('[Auth] Google sign in error:', error.message);
        throw new Error(error.message);
      }

      if (!data.url) {
        throw new Error('No OAuth URL returned');
      }

      console.log('[Auth] Opening Google OAuth URL...');
      
      const result = await WebBrowser.openAuthSessionAsync(
        data.url,
        redirectUrl,
        { showInRecents: true }
      );

      console.log('[Auth] Google OAuth result type:', result.type);

      if (result.type === 'success' && result.url) {
        console.log('[Auth] Google OAuth success, processing URL...');
        const url = new URL(result.url);
        const params = new URLSearchParams(url.hash.substring(1));
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');

        if (accessToken) {
          const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (sessionError) {
            console.error('[Auth] Session error:', sessionError.message);
            throw new Error(sessionError.message);
          }

          if (sessionData.user) {
            console.log('[Auth] Google sign in successful:', sessionData.user.id);
            const authUser = mapSupabaseUser(sessionData.user, isPremiumLocal);
            setUser(authUser);
            return authUser;
          }
        }
      }

      if (result.type === 'cancel') {
        throw new Error('Sign in was cancelled');
      }

      throw new Error('Google sign in failed');
    } catch (error: any) {
      console.error('[Auth] Google OAuth error:', error);
      throw error;
    }
  }, [isPremiumLocal]);

  const signOut = useCallback(async () => {
    console.log('[Auth] Signing out from Supabase');
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('[Auth] Sign out error:', error.message);
    }

    if (Platform.OS !== 'web') {
      await SecureStore.deleteItemAsync(BIOMETRIC_TOKEN_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_USER_ID_KEY);
    }
    await AsyncStorage.removeItem(BIOMETRIC_ENABLED_KEY);
    
    setUser(null);
    setSession(null);
    queryClient.setQueryData(['auth'], { user: null, token: null });
  }, [queryClient]);

  const signInWithBiometric = useCallback(async (userId: string, token: string) => {
    console.log('[Auth] Sign in with biometric, userId:', userId);
    
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession?.user && currentSession.user.id === userId) {
      const authUser = mapSupabaseUser(currentSession.user, isPremiumLocal);
      setUser(authUser);
      return authUser;
    }
    
    console.log('[Auth] No matching Supabase session for biometric user');
    throw new Error('Biometric session expired. Please sign in again.');
  }, [isPremiumLocal]);

  const updateUserPremiumStatus = useCallback(async (isPremium: boolean) => {
    console.log('[Auth] Updating premium status to:', isPremium);
    
    setIsPremiumLocal(isPremium);
    await AsyncStorage.setItem(PREMIUM_STATUS_KEY, isPremium ? 'true' : 'false');
    
    if (user) {
      setUser({ ...user, isPremium });
    }
  }, [user]);

  return {
    user,
    token: session?.access_token || null,
    isLoggedIn: !!user,
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
