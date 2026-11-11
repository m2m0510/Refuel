/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Activity, HealthMetrics, TrainingSession, UserProfile } from '../types';

// Check environment variables first, then localStorage config
const getStoredConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('refuel_supabase_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('refuel_supabase_key') : null;

  const url = (localUrl || envUrl || '').trim();
  const key = (localKey || envKey || '').trim();

  const isConfigured = Boolean(
    url && 
    key && 
    url.startsWith('https://') && 
    !url.includes('your-project') &&
    key.length > 20
  );

  return { url, key, isConfigured };
};

let currentClient: SupabaseClient | null = null;

export const getSupabaseClient = (): { client: SupabaseClient | null; isConfigured: boolean } => {
  const { url, key, isConfigured } = getStoredConfig();

  if (!isConfigured) {
    return { client: null, isConfigured: false };
  }

  if (!currentClient) {
    try {
      currentClient = createClient(url, key, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
        },
      });
    } catch (err) {
      console.warn('Failed to initialize Supabase client:', err);
      return { client: null, isConfigured: false };
    }
  }

  return { client: currentClient, isConfigured: true };
};

export const updateSupabaseCredentials = (url: string, key: string): boolean => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refuel_supabase_url', url.trim());
    localStorage.setItem('refuel_supabase_key', key.trim());
    currentClient = null; // Reset so next call recreates with new creds
    const { isConfigured } = getStoredConfig();
    return isConfigured;
  }
  return false;
};

export const clearSupabaseCredentials = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('refuel_supabase_url');
    localStorage.removeItem('refuel_supabase_key');
    currentClient = null;
  }
};

export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string }> => {
  const { client, isConfigured } = getSupabaseClient();
  if (!isConfigured || !client) {
    return { 
      success: false, 
      message: 'Supabase URL and Anon Key are missing or invalid.' 
    };
  }

  try {
    const { error } = await client.from('profiles').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      // If table doesn't exist yet, it will return a specific error code
      if (error.message.includes('relation "public.profiles" does not exist')) {
        return {
          success: true,
          message: 'Connected to Supabase! (Database tables not yet created - run the provided SQL migration).',
        };
      }
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Successfully verified connection to Supabase database!' };
  } catch (err: unknown) {
    return { 
      success: false, 
      message: err instanceof Error ? err.message : 'Unknown network failure while connecting to Supabase.' 
    };
  }
};
