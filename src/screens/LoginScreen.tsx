/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RefuelLogo } from '../components/common/RefuelLogo';

export const LoginScreen: React.FC = () => {
  const { setCurrentScreen, login } = useApp();
  const [email, setEmail] = useState('alex.rivera@refuel.app');
  const [password, setPassword] = useState('••••••••••••');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please provide both email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      // Authenticate
      await login(email);
    } catch {
      setErrorMessage('Invalid credentials. Please verify or use Quick Demo Login.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('alex.rivera@refuel.app');
    setPassword('demorunner2026');
    login('alex.rivera@refuel.app');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#050505] select-none">
      {/* Top Header */}
      <div className="pt-4 flex items-center justify-between">
        <RefuelLogo size="sm" />
        <button
          onClick={() => setCurrentScreen('register')}
          className="text-xs font-semibold uppercase tracking-wider text-[#C6FF00] hover:underline"
        >
          Sign Up
        </button>
      </div>

      {/* Main Form Body */}
      <div className="my-auto py-4">
        <div className="mb-6">
          <span className="text-xs font-mono uppercase tracking-widest text-[#8A8A8A] block">
            Athlete Authentication
          </span>
          <h2 className="font-athletic text-3xl font-extrabold uppercase tracking-wide text-white mt-1">
            Sign In to REFUEL
          </h2>
          <p className="text-xs text-[#8A8A8A] mt-1">
            Access your cloud-synced training logs, biometrics, and telemetry.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-300 text-xs">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
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
                className="w-full h-12 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00] focus:ring-1 focus:ring-[#C6FF00] transition-colors font-sans"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-mono font-medium text-[#8A8A8A]">
                Security Passcode
              </label>
              <button
                type="button"
                onClick={() => setCurrentScreen('forgot_password')}
                className="text-[11px] text-[#8A8A8A] hover:text-[#C6FF00] transition-colors"
              >
                Forgot?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 text-[#8A8A8A]" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="w-full h-12 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-4 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00] focus:ring-1 focus:ring-[#C6FF00] transition-colors font-sans"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 mt-2 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(198,255,0,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <span className="text-sm font-sans font-bold">Verifying Athlete...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={18} strokeWidth={2.5} />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Bypass Button */}
        <div className="mt-5 pt-4 border-t border-[#292929]/70 text-center">
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 px-4 rounded-xl bg-[#101010] hover:bg-[#181818] border border-[#292929] flex items-center justify-center gap-2 text-xs font-semibold text-white transition-all group"
          >
            <Zap size={14} className="text-[#C6FF00] group-hover:scale-110 transition-transform" />
            <span>Instant Demo Sign-In (Alex Rivera, Elite)</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center pb-2">
        <p className="text-[11px] text-[#8A8A8A]">
          Protected by Supabase Auth with Row Level Security (RLS).
        </p>
      </div>
    </div>
  );
};
