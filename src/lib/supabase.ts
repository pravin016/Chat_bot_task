import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';
import { ENV } from '../config/env';

if (!ENV.supabaseUrl || !ENV.supabaseAnonKey) {
  // Keep app booting even when env is missing.
  console.warn('Supabase env vars are missing. Auth features will not work.');
}

// On Expo Web, `expo-router` can render during SSR (Node) where `window` doesn't exist.
// Supabase/Auth initializes at import-time and AsyncStorage touches `window`, so we must
// avoid `createClient` during SSR on web.
const isSSRWeb = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase = isSSRWeb
  ? (null as any)
  : createClient(ENV.supabaseUrl, ENV.supabaseAnonKey, {
      auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
      },
    });
