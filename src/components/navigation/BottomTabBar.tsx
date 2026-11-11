/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, Compass, Plus, Calendar, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NavTab } from '../../types';

export const BottomTabBar: React.FC = () => {
  const { activeTab, setActiveTab, setIsRecordSelectOpen } = useApp();

  const handleTabClick = (tab: NavTab) => {
    if (tab === 'record') {
      setIsRecordSelectOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="relative z-30 shrink-0 w-full bg-[#101010]/95 backdrop-blur-xl border-t border-[#292929] px-2 pb-safe pt-1">
      <div className="max-w-md mx-auto flex items-center justify-between h-16 relative">
        {/* TAB 1: HOME */}
        <button
          onClick={() => handleTabClick('home')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-all group"
          aria-label="Home"
        >
          <div className="relative">
            <Home
              size={22}
              className={`transition-colors ${
                activeTab === 'home' ? 'text-[#C6FF00]' : 'text-[#8A8A8A] group-hover:text-white'
              }`}
              strokeWidth={activeTab === 'home' ? 2.5 : 2}
            />
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-1 transition-colors ${
              activeTab === 'home' ? 'text-[#C6FF00]' : 'text-[#8A8A8A]'
            }`}
          >
            Home
          </span>
        </button>

        {/* TAB 2: EXPLORE */}
        <button
          onClick={() => handleTabClick('explore')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-all group"
          aria-label="Explore"
        >
          <div className="relative">
            <Compass
              size={22}
              className={`transition-colors ${
                activeTab === 'explore' ? 'text-[#C6FF00]' : 'text-[#8A8A8A] group-hover:text-white'
              }`}
              strokeWidth={activeTab === 'explore' ? 2.5 : 2}
            />
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-1 transition-colors ${
              activeTab === 'explore' ? 'text-[#C6FF00]' : 'text-[#8A8A8A]'
            }`}
          >
            Explore
          </span>
        </button>

        {/* TAB 3: RECORD (PROMINENT LIME GREEN BUTTON) */}
        <div className="flex-1 flex items-center justify-center">
          <button
            onClick={() => handleTabClick('record')}
            className="group relative -top-4 flex flex-col items-center justify-center focus:outline-none"
            aria-label="Record Activity"
          >
            <div className="w-14 h-14 rounded-full bg-[#C6FF00] hover:bg-[#b5eb00] text-black flex items-center justify-center shadow-[0_0_20px_rgba(198,255,0,0.4)] active:scale-95 transition-all duration-200">
              <Plus size={28} strokeWidth={3} className="text-black group-hover:rotate-90 transition-transform duration-300" />
            </div>
            <span className="text-[10px] font-extrabold tracking-wider uppercase text-[#C6FF00] mt-0.5">
              Record
            </span>
          </button>
        </div>

        {/* TAB 4: TRAINING */}
        <button
          onClick={() => handleTabClick('training')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-all group"
          aria-label="Training Planner"
        >
          <div className="relative">
            <Calendar
              size={22}
              className={`transition-colors ${
                activeTab === 'training' ? 'text-[#C6FF00]' : 'text-[#8A8A8A] group-hover:text-white'
              }`}
              strokeWidth={activeTab === 'training' ? 2.5 : 2}
            />
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-1 transition-colors ${
              activeTab === 'training' ? 'text-[#C6FF00]' : 'text-[#8A8A8A]'
            }`}
          >
            Training
          </span>
        </button>

        {/* TAB 5: PROFILE */}
        <button
          onClick={() => handleTabClick('profile')}
          className="flex-1 flex flex-col items-center justify-center min-h-[44px] min-w-[44px] transition-all group"
          aria-label="Profile"
        >
          <div className="relative">
            <User
              size={22}
              className={`transition-colors ${
                activeTab === 'profile' ? 'text-[#C6FF00]' : 'text-[#8A8A8A] group-hover:text-white'
              }`}
              strokeWidth={activeTab === 'profile' ? 2.5 : 2}
            />
          </div>
          <span
            className={`text-[10px] font-semibold tracking-wider uppercase mt-1 transition-colors ${
              activeTab === 'profile' ? 'text-[#C6FF00]' : 'text-[#8A8A8A]'
            }`}
          >
            Profile
          </span>
        </button>
      </div>
    </div>
  );
};
