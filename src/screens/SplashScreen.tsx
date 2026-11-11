/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ArrowRight, Zap, Shield, Activity } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RefuelLogo } from '../components/common/RefuelLogo';

export const SplashScreen: React.FC = () => {
  const { setCurrentScreen, isAuthenticated } = useApp();

  // Auto transition option or manual start
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        setCurrentScreen('main');
      }
    }, 2800);
    return () => clearTimeout(timer);
  }, [isAuthenticated, setCurrentScreen]);

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#050505] relative overflow-hidden select-none">
      {/* Background Kinetic Lines */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="blade-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C6FF00" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <line x1="-100" y1="200" x2="600" y2="900" stroke="url(#blade-grad)" strokeWidth="2" />
          <line x1="-50" y1="100" x2="650" y2="800" stroke="url(#blade-grad)" strokeWidth="1" />
          <line x1="0" y1="50" x2="700" y2="750" stroke="url(#blade-grad)" strokeWidth="3" />
        </svg>
      </div>

      {/* Top Tagline */}
      <div className="pt-8 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#C6FF00] animate-ping" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#8A8A8A]">
            Phase 1 · Engine V2.4
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A]">
          <Shield size={13} className="text-[#C6FF00]" />
          <span>Biometric Matrix</span>
        </div>
      </div>

      {/* Center Hero Lockup */}
      <div className="flex flex-col items-center justify-center my-auto z-10 text-center px-4">
        <RefuelLogo size="xl" showSubtitle={false} className="mb-4" />
        
        <p className="font-athletic text-2xl uppercase tracking-wider text-white font-bold">
          High Performance Engine
        </p>
        <p className="text-sm text-[#8A8A8A] max-w-xs mt-2 leading-relaxed">
          Next-generation telemetry for endurance athletes. Road, Trail & Cycling precision.
        </p>

        {/* Dynamic Telemetry Metric Pills */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-xs mt-8">
          <div className="bg-[#101010] border border-[#292929] rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-[#8A8A8A] block uppercase font-mono">Pacing</span>
            <span className="font-athletic text-base font-bold text-white tracking-wide">3:55<span className="text-[10px] text-[#8A8A8A]">/km</span></span>
          </div>
          <div className="bg-[#101010] border border-[#292929] rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-[#8A8A8A] block uppercase font-mono">VO2 Max</span>
            <span className="font-athletic text-base font-bold text-[#C6FF00] tracking-wide">54.8</span>
          </div>
          <div className="bg-[#101010] border border-[#292929] rounded-xl p-2.5 text-center">
            <span className="text-[10px] text-[#8A8A8A] block uppercase font-mono">Rest HR</span>
            <span className="font-athletic text-base font-bold text-white tracking-wide">48 <span className="text-[10px] text-[#8A8A8A]">bpm</span></span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Actions */}
      <div className="flex flex-col gap-3 pb-4 z-10">
        <button
          onClick={() => setCurrentScreen('onboarding')}
          className="w-full h-13 rounded-2xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(198,255,0,0.35)] active:scale-[0.98] transition-all"
        >
          <span>Launch Experience</span>
          <ArrowRight size={20} strokeWidth={2.5} />
        </button>

        <div className="flex items-center justify-between px-2 pt-1">
          <button
            onClick={() => setCurrentScreen('login')}
            className="text-xs text-[#8A8A8A] hover:text-white transition-colors"
          >
            Existing Athlete? <span className="text-white font-medium underline underline-offset-2">Sign In</span>
          </button>
          <button
            onClick={() => setCurrentScreen('main')}
            className="text-xs text-[#C6FF00] hover:underline"
          >
            Quick Demo Tour →
          </button>
        </div>
      </div>
    </div>
  );
};
