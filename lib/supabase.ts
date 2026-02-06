import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AuthSession from 'expo-auth-session';

export const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('[Supabase] Initializing client with URL:', supabaseUrl ? 'configured' : 'missing');

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export const getOAuthRedirectUrl = () => {
  const redirectUrl = AuthSession.makeRedirectUri({
    scheme: 'rork-app',
  });
  console.log('[Supabase] OAuth redirect URL:', redirectUrl);
  return redirectUrl;
};
