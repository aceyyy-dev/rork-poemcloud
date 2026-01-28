import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

const AUTH_STORAGE_KEY = 'poemcloud_auth';

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

  const authQuery = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const parsed: AuthState = JSON.parse(stored);
        return parsed;
      }
      return { user: null, token: null };
    },
  });

  useEffect(() => {
    if (authQuery.data) {
      setAuthState(authQuery.data);
    }
  }, [authQuery.data]);

  const saveAuthMutation = useMutation({
    mutationFn: async (state: AuthState) => {
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
      return state;
    },
    onSuccess: (state) => {
      setAuthState(state);
      queryClient.setQueryData(['auth'], state);
    },
  });

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    console.log('[Auth] Sign in with email:', email);
    const mockUser: AuthUser = {
      id: `user_${Date.now()}`,
      email,
      name: email.split('@')[0],
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
    const token = `token_${Date.now()}`;
    await saveAuthMutation.mutateAsync({ user: mockUser, token });
    return mockUser;
  }, [saveAuthMutation.mutateAsync]);

  const signUpWithEmail = useCallback(async (email: string, password: string, name?: string) => {
    console.log('[Auth] Sign up with email:', email);
    const mockUser: AuthUser = {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split('@')[0],
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
    const token = `token_${Date.now()}`;
    await saveAuthMutation.mutateAsync({ user: mockUser, token });
    return mockUser;
  }, [saveAuthMutation.mutateAsync]);

  const signInWithApple = useCallback(async () => {
    console.log('[Auth] Sign in with Apple');
    const mockUser: AuthUser = {
      id: `user_apple_${Date.now()}`,
      email: 'user@appleid.apple.com',
      name: 'Apple User',
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
    const token = `token_${Date.now()}`;
    await saveAuthMutation.mutateAsync({ user: mockUser, token });
    return mockUser;
  }, [saveAuthMutation.mutateAsync]);

  const signInWithGoogle = useCallback(async () => {
    console.log('[Auth] Sign in with Google');
    const mockUser: AuthUser = {
      id: `user_google_${Date.now()}`,
      email: 'user@gmail.com',
      name: 'Google User',
      isPremium: false,
      createdAt: new Date().toISOString(),
    };
    const token = `token_${Date.now()}`;
    await saveAuthMutation.mutateAsync({ user: mockUser, token });
    return mockUser;
  }, [saveAuthMutation.mutateAsync]);

  const signOut = useCallback(async () => {
    console.log('[Auth] Sign out');
    await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    setAuthState({ user: null, token: null });
    queryClient.setQueryData(['auth'], { user: null, token: null });
  }, [queryClient]);

  const updateUserPremiumStatus = useCallback(async (isPremium: boolean) => {
    if (!authState.user) return;
    const updatedUser = { ...authState.user, isPremium };
    const updatedState = { ...authState, user: updatedUser };
    await saveAuthMutation.mutateAsync(updatedState);
  }, [authState, saveAuthMutation.mutateAsync]);

  return {
    user: authState.user,
    token: authState.token,
    isLoggedIn: !!authState.user,
    isLoading: authQuery.isLoading,
    signInWithEmail,
    signUpWithEmail,
    signInWithApple,
    signInWithGoogle,
    signOut,
    updateUserPremiumStatus,
  };
});
