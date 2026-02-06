import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';
import { Platform } from 'react-native';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

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
    console.log('[Auth] Sign in with Apple via Supabase');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'apple',
    });

    if (error) {
      console.error('[Auth] Apple sign in error:', error.message);
      throw new Error(error.message);
    }

    console.log('[Auth] Apple OAuth initiated');
    return null as unknown as AuthUser;
  }, []);

  const signInWithGoogle = useCallback(async () => {
    console.log('[Auth] Sign in with Google via Supabase');
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('[Auth] Google sign in error:', error.message);
      throw new Error(error.message);
    }

    console.log('[Auth] Google OAuth initiated');
    return null as unknown as AuthUser;
  }, []);

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
