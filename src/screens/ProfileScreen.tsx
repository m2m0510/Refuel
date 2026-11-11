/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Edit3,
  Settings as SettingsIcon,
  Award,
  Calendar,
  Ruler,
  Weight,
  Target,
  LogOut,
  Database,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateAge, formatDistance, getSportLabel } from '../lib/formatters';
import { RefuelLogo } from '../components/common/RefuelLogo';

export const ProfileScreen: React.FC = () => {
  const {
    profile,
    activities,
    setIsEditProfileOpen,
    setIsSettingsOpen,
    logout,
    isSupabaseConnected
  } = useApp();

  const athleteAge = calculateAge(profile.date_of_birth);

  // Calculate BMI
  const heightInMeters = profile.height_cm / 100;
  const bmi = (profile.weight_kg / (heightInMeters * heightInMeters)).toFixed(1);

  // Total lifetime totals
  const totalMeters = activities.reduce((sum, a) => sum + a.distance_meters, 0);
  const totalVert = activities.reduce((sum, a) => sum + a.elevation_gain_meters, 0);

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 bg-[#050505] overflow-y-auto">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <span className="font-athletic text-xl font-extrabold uppercase tracking-wide text-white">
          Athlete Profile
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="min-w-[40px] min-h-[40px] rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#292929] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors"
            aria-label="Settings"
          >
            <SettingsIcon size={18} />
          </button>
        </div>
      </div>

      {/* Athlete Header Card */}
      <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-5 relative overflow-hidden">
        <div className="flex items-start gap-4">
          {/* Avatar with photo frame */}
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-[#C6FF00]/40 bg-[#101010] shadow-[0_0_20px_rgba(198,255,0,0.15)]">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={profile.full_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="font-athletic text-2xl font-bold uppercase tracking-tight text-white">
                {profile.full_name}
              </h2>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#101010] hover:bg-[#222] border border-[#292929] text-xs font-semibold text-[#C6FF00] transition-colors"
              >
                <Edit3 size={12} />
                <span>Edit</span>
              </button>
            </div>
            <p className="text-xs text-[#8A8A8A] font-mono mt-0.5">{profile.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono uppercase bg-[#101010] border border-[#292929] px-2 py-0.5 rounded text-[#C6FF00]">
                Tier 1 Endurance
              </span>
              <span className="text-[10px] text-[#8A8A8A]">Age {athleteAge}</span>
            </div>
          </div>
        </div>

        {/* Biometric Vitals Strip (DOB, Age, Height, Weight, BMI) */}
        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-[#292929] text-center">
          <div className="bg-[#101010] rounded-xl p-2 border border-[#262626]">
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Age (DOB)</span>
            <span className="font-athletic text-base font-bold text-white block mt-0.5">
              {athleteAge} <span className="text-[10px] text-[#8A8A8A]">yrs</span>
            </span>
          </div>

          <div className="bg-[#101010] rounded-xl p-2 border border-[#262626]">
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Height</span>
            <span className="font-athletic text-base font-bold text-white block mt-0.5">
              {profile.height_cm} <span className="text-[10px] text-[#8A8A8A]">cm</span>
            </span>
          </div>

          <div className="bg-[#101010] rounded-xl p-2 border border-[#262626]">
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Weight</span>
            <span className="font-athletic text-base font-bold text-white block mt-0.5">
              {profile.weight_kg} <span className="text-[10px] text-[#8A8A8A]">kg</span>
            </span>
          </div>

          <div className="bg-[#101010] rounded-xl p-2 border border-[#262626]">
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Body Mass</span>
            <span className="font-athletic text-base font-bold text-[#C6FF00] block mt-0.5">
              {bmi} <span className="text-[10px] text-[#8A8A8A]">BMI</span>
            </span>
          </div>
        </div>
      </div>

      {/* Lifetime Cumulative Telemetry */}
      <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A] block mb-2">
          Lifetime Telemetry Record
        </span>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-[#101010] rounded-xl p-3 border border-[#292929]">
            <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Activities</span>
            <span className="font-athletic text-2xl font-extrabold text-white mt-0.5 block">
              {activities.length}
            </span>
          </div>
          <div className="bg-[#101010] rounded-xl p-3 border border-[#292929]">
            <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Total Distance</span>
            <span className="font-athletic text-2xl font-extrabold text-[#C6FF00] mt-0.5 block">
              {(totalMeters / 1000).toFixed(0)} <span className="text-xs">km</span>
            </span>
          </div>
          <div className="bg-[#101010] rounded-xl p-3 border border-[#292929]">
            <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Elevation</span>
            <span className="font-athletic text-2xl font-extrabold text-white mt-0.5 block">
              +{totalVert} <span className="text-xs">m</span>
            </span>
          </div>
        </div>
      </div>

      {/* Target Fitness Goals */}
      <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
            Active Fitness Goals
          </span>
          <Target size={14} className="text-[#C6FF00]" />
        </div>
        <div className="space-y-2">
          {profile.fitness_goals.map((goal, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-2.5 rounded-xl bg-[#101010] border border-[#262626]"
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C6FF00]" />
                <span className="text-xs font-semibold text-white">{goal}</span>
              </div>
              <span className="text-[10px] font-mono text-[#8A8A8A]">In Progress</span>
            </div>
          ))}
        </div>
      </div>

      {/* Preferred Sports */}
      <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A] block mb-2.5">
          Primary Disciplines
        </span>
        <div className="flex flex-wrap gap-2">
          {profile.preferred_sports.map((sport) => (
            <div
              key={sport}
              className="px-3 py-1.5 rounded-xl bg-[#101010] border border-[#292929] flex items-center gap-2"
            >
              <span className="w-2 h-2 rounded-full bg-[#C6FF00]" />
              <span className="text-xs font-semibold text-white">{getSportLabel(sport)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Database State Banner & Sign Out */}
      <div className="bg-[#101010] border border-[#292929] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Database size={15} className={isSupabaseConnected ? 'text-[#C6FF00]' : 'text-amber-400'} />
            <span className="font-mono text-[#8A8A8A]">
              {isSupabaseConnected ? 'Synced to Supabase PostgreSQL' : 'Local High-Speed Storage'}
            </span>
          </div>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="text-[#C6FF00] hover:underline font-semibold"
          >
            Manage
          </button>
        </div>

        <button
          onClick={logout}
          className="w-full py-2.5 rounded-xl bg-[#1A1A1A] hover:bg-[#222] border border-[#292929] text-xs font-semibold text-red-400 flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={14} />
          <span>Sign Out of REFUEL</span>
        </button>
      </div>
    </div>
  );
};
