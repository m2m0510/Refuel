/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, Mail, Lock, ArrowRight, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RefuelLogo } from '../components/common/RefuelLogo';
import { SportType } from '../types';

export const RegisterScreen: React.FC = () => {
  const { setCurrentScreen, registerAthlete } = useApp();
  const [fullName, setFullName] = useState('Jordan Taylor');
  const [email, setEmail] = useState('jordan.taylor@athlete.io');
  const [password, setPassword] = useState('sub3hoursmarathon');
  const [selectedSports, setSelectedSports] = useState<SportType[]>([
    'road_running',
    'trail_running',
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const toggleSport = (sport: SportType) => {
    if (selectedSports.includes(sport)) {
      if (selectedSports.length > 1) {
        setSelectedSports(selectedSports.filter((s) => s !== sport));
      }
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all athlete registration fields.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await registerAthlete(fullName, email);
    } catch {
      setError('Failed to create athlete account. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#050505] overflow-y-auto select-none">
      {/* Top Header */}
      <div className="pt-2 flex items-center justify-between">
        <RefuelLogo size="sm" />
        <button
          onClick={() => setCurrentScreen('login')}
          className="text-xs uppercase tracking-wider font-semibold text-[#8A8A8A] hover:text-white"
        >
          Have Account? <span className="text-[#C6FF00]">Sign In</span>
        </button>
      </div>

      {/* Main Registration Form */}
      <div className="my-auto py-4">
        <div className="mb-5">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A8A] block">
            Athlete Registration
          </span>
          <h2 className="font-athletic text-3xl font-extrabold uppercase tracking-wide text-white mt-1">
            Build Your Performance Profile
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Calibrate your aerobic pacing and weekly training schedule.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-mono font-medium text-[#8A8A8A]">
              Full Name
            </label>
            <div className="relative flex items-center">
              <User size={16} className="absolute left-3.5 text-[#8A8A8A]" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="Alex Rivera"
                className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-mono font-medium text-[#8A8A8A]">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 text-[#8A8A8A]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="athlete@domain.com"
                className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-mono font-medium text-[#8A8A8A]">
              Passcode
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-[#8A8A8A]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          {/* Primary Disciplines */}
          <div className="space-y-2 pt-1">
            <label className="text-xs uppercase font-mono font-medium text-[#8A8A8A] block">
              Primary Sports
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'road_running' as SportType, label: 'Road Run' },
                { id: 'trail_running' as SportType, label: 'Trail Run' },
                { id: 'outdoor_cycling' as SportType, label: 'Cycling' },
              ].map((sport) => {
                const isSelected = selectedSports.includes(sport.id);
                return (
                  <button
                    key={sport.id}
                    type="button"
                    onClick={() => toggleSport(sport.id)}
                    className={`py-2 px-2 rounded-xl text-xs font-semibold border flex items-center justify-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-[#C6FF00]/15 border-[#C6FF00] text-white'
                        : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A] hover:text-white'
                    }`}
                  >
                    {isSelected && <Check size={12} className="text-[#C6FF00]" />}
                    <span>{sport.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 mt-4 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(198,255,0,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="text-sm font-sans font-bold">Creating Profile...</span>
            ) : (
              <>
                <span>Register Athlete</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>
      </div>

      <div className="text-center pb-2">
        <p className="text-[11px] text-[#8A8A8A]">
          By registering, you initialize your private Supabase profile schema.
        </p>
      </div>
    </div>
  );
};
