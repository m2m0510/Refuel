/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Database,
  Copy,
  Check,
  Smartphone,
  ShieldCheck,
  RotateCcw,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  Code2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { testSupabaseConnection, updateSupabaseCredentials, clearSupabaseCredentials } from '../lib/supabase';

export const SettingsScreen: React.FC = () => {
  const {
    isSupabaseConnected,
    supabaseMessage,
    checkConnection,
    resetAllData,
    profile,
  } = useApp();

  const [supabaseUrl, setSupabaseUrl] = useState(() => {
    return localStorage.getItem('refuel_supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
  });
  const [supabaseKey, setSupabaseKey] = useState(() => {
    return localStorage.getItem('refuel_supabase_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  });

  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'database' | 'native_expo' | 'apps'>('database');

  const handleSaveAndTest = async () => {
    setIsTesting(true);
    setTestResult(null);

    updateSupabaseCredentials(supabaseUrl, supabaseKey);
    const res = await testSupabaseConnection();
    setTestResult(res);
    await checkConnection();
    setIsTesting(false);
  };

  const handleClear = async () => {
    clearSupabaseCredentials();
    setSupabaseUrl('');
    setSupabaseKey('');
    setTestResult(null);
    await checkConnection();
  };

  const handleCopySql = () => {
    const sqlScript = `-- REFUEL Core Migration: Execute in Supabase SQL Editor
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  date_of_birth date,
  height_cm numeric(5,1) default 180.0,
  weight_kg numeric(5,1) default 75.0,
  avatar_url text,
  fitness_goals text[] default array['Marathon Sub 3:15', 'VO2 Max > 55'],
  preferred_sports text[] default array['road_running', 'trail_running', 'outdoor_cycling'],
  created_at timestamptz default now() not null
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  sport_type text not null,
  distance_meters numeric(10,2) default 0 not null,
  duration_seconds integer not null default 0,
  elevation_gain_meters numeric(8,2) default 0 not null,
  calories integer default 0 not null,
  avg_heart_rate integer,
  started_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.activities enable row level security;

create policy "Users manage own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users manage own activities" on public.activities for all using (auth.uid() = user_id);`;

    navigator.clipboard.writeText(sqlScript);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 bg-[#050505] overflow-y-auto">
      {/* Header */}
      <div className="pt-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
          Engine Architecture
        </span>
        <h2 className="font-athletic text-2xl font-extrabold uppercase tracking-wide text-white">
          System Settings
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-2xl border border-[#292929]">
        <button
          onClick={() => setActiveTab('database')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'database'
              ? 'bg-[#292929] text-[#C6FF00]'
              : 'text-[#8A8A8A] hover:text-white'
          }`}
        >
          Supabase DB
        </button>
        <button
          onClick={() => setActiveTab('native_expo')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'native_expo'
              ? 'bg-[#292929] text-[#C6FF00]'
              : 'text-[#8A8A8A] hover:text-white'
          }`}
        >
          Expo / Native
        </button>
        <button
          onClick={() => setActiveTab('apps')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'apps'
              ? 'bg-[#292929] text-[#C6FF00]'
              : 'text-[#8A8A8A] hover:text-white'
          }`}
        >
          Connected Apps
        </button>
      </div>

      {/* TAB 1: SUPABASE CONFIGURATION */}
      {activeTab === 'database' && (
        <div className="space-y-4">
          {/* Status banner */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono uppercase text-[#8A8A8A]">PostgreSQL Status</span>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                  isSupabaseConnected
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                    : 'bg-amber-950/60 border border-amber-800 text-amber-400'
                }`}
              >
                {isSupabaseConnected ? 'Online & Authenticated' : 'Local Fallback Active'}
              </span>
            </div>
            <p className="text-xs text-[#8A8A8A] mt-2 leading-relaxed">
              {supabaseMessage}
            </p>
          </div>

          {/* Credentials Inputs */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A] block">
              Supabase Project API Credentials
            </span>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8A8A8A]">Project URL (VITE_SUPABASE_URL)</label>
              <input
                type="text"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                placeholder="https://xyzcompany.supabase.co"
                className="w-full h-10 bg-[#101010] border border-[#292929] rounded-xl px-3 text-xs text-white font-mono focus:outline-none focus:border-[#C6FF00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8A8A8A]">Anon Public Key (VITE_SUPABASE_ANON_KEY)</label>
              <input
                type="password"
                value={supabaseKey}
                onChange={(e) => setForgetAnonKey(e.target.value, setSupabaseKey)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                className="w-full h-10 bg-[#101010] border border-[#292929] rounded-xl px-3 text-xs text-white font-mono focus:outline-none focus:border-[#C6FF00]"
              />
            </div>

            {testResult && (
              <div
                className={`p-3 rounded-xl text-xs border ${
                  testResult.success
                    ? 'bg-emerald-950/30 border-emerald-800 text-emerald-300'
                    : 'bg-red-950/30 border-red-800 text-red-300'
                }`}
              >
                {testResult.message}
              </div>
            )}

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleSaveAndTest}
                disabled={isTesting}
                className="flex-1 h-11 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-sm font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
              >
                <Database size={16} />
                <span>{isTesting ? 'Verifying...' : 'Save & Connect'}</span>
              </button>
              <button
                onClick={handleClear}
                className="h-11 px-3 rounded-xl bg-[#101010] hover:bg-[#222] border border-[#292929] text-xs font-semibold text-[#8A8A8A]"
              >
                Clear
              </button>
            </div>
          </div>

          {/* SQL Migration Exporter */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
                PostgreSQL SQL Migration
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#101010] hover:bg-[#222] border border-[#292929] text-xs text-[#C6FF00] font-semibold transition-colors"
              >
                {copiedSql ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSql ? 'Copied SQL!' : 'Copy Migration'}</span>
              </button>
            </div>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              Full migration schema is written to <span className="font-mono text-white">/supabase/migrations/20261111_refuel_core.sql</span>. Includes profiles, activities, GPS points, splits, training sessions, and Row Level Security.
            </p>
          </div>
        </div>
      )}

      {/* TAB 2: EXPO / NATIVE RUN INSTRUCTIONS */}
      {activeTab === 'native_expo' && (
        <div className="space-y-4">
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Smartphone size={18} className="text-[#C6FF00]" />
              <h3 className="font-athletic text-lg font-bold uppercase text-white">
                React Native & Expo Architecture
              </h3>
            </div>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              REFUEL is architected for cross-platform iOS & Android execution with Expo SDK, React Native Reanimated, and Supabase.
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-[#8A8A8A] block">
                1. Local Run via Expo CLI
              </span>
              <pre className="bg-[#101010] border border-[#292929] rounded-xl p-3 text-[11px] font-mono text-[#C6FF00] overflow-x-auto">
{`# Install Expo Dependencies
npx expo install react-native-reanimated react-native-svg

# Run on iOS Simulator (macOS)
npx expo run:ios

# Run on Android Emulator / Physical Device
npx expo run:android

# Run Web Preview Container
npm run dev`}
              </pre>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[10px] font-mono uppercase text-[#8A8A8A] block">
                2. Environment Variables (.env)
              </span>
              <pre className="bg-[#101010] border border-[#292929] rounded-xl p-3 text-[11px] font-mono text-white overflow-x-auto">
{`EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONNECTED APPS */}
      {activeTab === 'apps' && (
        <div className="space-y-3">
          {[
            { name: 'Apple Health', status: 'Connected', sub: 'VO2 Max, Resting HR & Sleep sync' },
            { name: 'Strava', status: 'Authorized', sub: 'Segments, GPS polylines & Kudos' },
            { name: 'Garmin Connect', status: 'Ready', sub: 'Running Dynamics & Training Load' },
            { name: 'Wahoo Fitness', status: 'Pair', sub: 'Power meter & smart trainer' },
          ].map((app, i) => (
            <div
              key={i}
              className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4 flex items-center justify-between"
            >
              <div>
                <h4 className="font-bold text-white text-sm">{app.name}</h4>
                <p className="text-xs text-[#8A8A8A]">{app.sub}</p>
              </div>
              <span
                className={`text-[10px] font-mono font-bold uppercase px-2 py-1 rounded ${
                  app.status === 'Connected' || app.status === 'Authorized'
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                    : 'bg-[#101010] border border-[#292929] text-[#8A8A8A]'
                }`}
              >
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Reset Data Danger Zone */}
      <div className="pt-4 border-t border-[#292929]">
        <button
          onClick={resetAllData}
          className="w-full py-2.5 rounded-xl bg-transparent hover:bg-red-950/20 border border-red-900/40 text-xs font-semibold text-red-400 flex items-center justify-center gap-2 transition-colors"
        >
          <RotateCcw size={14} />
          <span>Reset Sample Database to Default</span>
        </button>
      </div>
    </div>
  );
};

function setForgetAnonKey(val: string, setter: (s: string) => void) {
  setter(val);
}
