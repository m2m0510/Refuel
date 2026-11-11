/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { ReactNode } from 'react';
import { Smartphone, Maximize2, Database, Wifi } from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface DeviceFrameProps {
  children: ReactNode;
}

export const DeviceFrame: React.FC<DeviceFrameProps> = ({ children }) => {
  const { viewMode, setViewMode, isSupabaseConnected, setIsSettingsOpen } = useApp();

  return (
    <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-start p-0 md:py-6 md:px-4">
      {/* Top Utility Control Bar (Outside the phone frame on desktop) */}
      <header className="w-full max-w-4xl hidden md:flex items-center justify-between py-2 px-4 mb-3 border-b border-[#292929] text-xs">
        <div className="flex items-center gap-3">
          <span className="font-athletic font-extrabold text-sm tracking-wider text-white">
            REFUEL <span className="text-[#C6FF00]">MOBILE PREVIEW</span>
          </span>
          <span className="text-[#8A8A8A]">·</span>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1A1A1A] hover:bg-[#222222] border border-[#292929] text-[#8A8A8A] hover:text-white transition-colors"
          >
            <Database size={13} className={isSupabaseConnected ? 'text-[#C6FF00]' : 'text-amber-400'} />
            <span className="font-mono text-[11px]">
              {isSupabaseConnected ? 'Supabase Connected' : 'Local SQLite/Store Active'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-[#1A1A1A] border border-[#292929] rounded-lg">
            <button
              onClick={() => setViewMode('device')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'device'
                  ? 'bg-[#292929] text-[#C6FF00] shadow-sm'
                  : 'text-[#8A8A8A] hover:text-white'
              }`}
            >
              <Smartphone size={13} />
              <span>Mobile Frame</span>
            </button>
            <button
              onClick={() => setViewMode('fullscreen')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-semibold transition-all ${
                viewMode === 'fullscreen'
                  ? 'bg-[#292929] text-[#C6FF00] shadow-sm'
                  : 'text-[#8A8A8A] hover:text-white'
              }`}
            >
              <Maximize2 size={13} />
              <span>Full Screen</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Chassis or Fullscreen Container */}
      <div
        className={`w-full transition-all duration-300 relative flex flex-col ${
          viewMode === 'device'
            ? 'max-w-[420px] h-[915px] max-h-[96vh] rounded-[48px] border-[10px] border-[#222222] shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_20px_rgba(198,255,0,0.08)] overflow-hidden bg-[#050505]'
            : 'max-w-2xl min-h-screen md:min-h-[900px] border-x border-[#292929] bg-[#050505]'
        }`}
      >
        {/* Mobile Device Status Bar (Time, Dynamic Island, Network, Battery) */}
        <div className="shrink-0 h-11 px-7 pt-2 flex items-center justify-between text-white text-[13px] font-semibold select-none z-40 bg-[#050505]">
          <span className="font-mono-numbers tracking-tight">9:41</span>

          {/* Dynamic Island Pill */}
          {viewMode === 'device' && (
            <div className="w-24 h-5 bg-black rounded-full border border-[#1f1f1f] flex items-center justify-center gap-1.5 px-2">
              <div className="w-2 h-2 rounded-full bg-[#111111]" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#0d2818]" />
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-white">
            <Wifi size={13} />
            <span className="text-[10px] font-bold">5G</span>
            {/* Battery Icon */}
            <div className="w-5 h-2.5 rounded-[3px] border border-white/70 p-[1px] flex items-center">
              <div className="h-full w-4 bg-[#C6FF00] rounded-[1px]" />
            </div>
          </div>
        </div>

        {/* Inner Scrollable Screen Content */}
        <div className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden relative">
          {children}
        </div>

        {/* Home Indicator Bar (for iOS Device Simulation) */}
        {viewMode === 'device' && (
          <div className="h-4 w-full bg-[#101010] flex items-center justify-center pb-1">
            <div className="w-32 h-1 bg-white/30 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );
};
