/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Play, Radio, MapPin, Zap, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SportType } from '../../types';

export const RecordSelectModal: React.FC = () => {
  const { isRecordSelectOpen, setIsRecordSelectOpen, setIsLiveRecording, setLiveSport } = useApp();

  if (!isRecordSelectOpen) return null;

  const sports: { id: SportType; title: string; desc: string; iconLabel: string }[] = [
    {
      id: 'road_running',
      title: 'Road Running',
      desc: 'GPS pace tracking, split alerts, cadence & heart rate zones.',
      iconLabel: 'RUN',
    },
    {
      id: 'trail_running',
      title: 'Trail Running',
      desc: 'Topographical vert ascent, technical terrain 3D map line.',
      iconLabel: 'TRAIL',
    },
    {
      id: 'outdoor_cycling',
      title: 'Outdoor Cycling',
      desc: 'Speed in km/h, grade % incline, power cadence simulator.',
      iconLabel: 'RIDE',
    },
    {
      id: 'strength_training',
      title: 'Strength Training',
      desc: 'Interval work/rest timer, active calories, heart peak.',
      iconLabel: 'LIFT',
    },
  ];

  const handleSelectSport = (sport: SportType) => {
    setLiveSport(sport);
    setIsRecordSelectOpen(false);
    setIsLiveRecording(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-[#101010] border border-[#292929] w-full max-w-lg rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#292929] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#C6FF00] animate-ping" />
            <h3 className="font-athletic text-xl font-bold uppercase text-white tracking-wide">
              Select Sport Discipline
            </h3>
          </div>
          <button
            onClick={() => setIsRecordSelectOpen(false)}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#222] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* GPS Sensor Lock Indicator */}
        <div className="px-5 py-2.5 bg-[#141414] border-b border-[#262626] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio size={14} className="text-[#C6FF00]" />
            <span className="text-[#8A8A8A]">GPS Status:</span>
            <span className="text-[#C6FF00] font-mono font-bold">L1/L5 Dual Band Locked</span>
          </div>
          <span className="text-[10px] font-mono text-[#8A8A8A]">Accuracy ±1.1m</span>
        </div>

        {/* Sports List */}
        <div className="p-4 space-y-2.5">
          {sports.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSelectSport(item.id)}
              className="w-full p-3.5 rounded-2xl bg-[#1A1A1A] hover:bg-[#222] border border-[#292929] hover:border-[#C6FF00]/50 flex items-center justify-between text-left transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[#101010] border border-[#292929] flex items-center justify-center font-athletic font-extrabold text-sm text-[#C6FF00] group-hover:scale-105 transition-transform">
                  {item.iconLabel}
                </div>
                <div>
                  <h4 className="font-athletic text-lg font-bold uppercase text-white group-hover:text-[#C6FF00] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-[11px] text-[#8A8A8A] leading-tight mt-0.5">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="w-8 h-8 rounded-full bg-[#C6FF00] text-black flex items-center justify-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all shadow-[0_0_12px_rgba(198,255,0,0.3)]">
                <Play size={14} fill="currentColor" strokeWidth={0} className="ml-0.5" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
