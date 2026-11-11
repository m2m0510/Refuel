/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, MapPin, Trophy, Users, ChevronRight, Award, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ExploreScreen: React.FC = () => {
  const { setIsRecordSelectOpen } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<'segments' | 'challenges' | 'routes'>('segments');

  const segments = [
    {
      id: 'seg_1',
      name: 'Hawk Hill Coastal Vert Assault',
      distance: '2.8 km',
      elev: '+184m',
      category: 'Cat 3 Climb',
      kom: '6:42 (Julian A.)',
      yourPr: '7:55 (Rank #14)',
    },
    {
      id: 'seg_2',
      name: 'Presidio Crissy Field Sprint Mile',
      distance: '1.6 km',
      elev: '+2m',
      category: 'Flat Sprint',
      kom: '4:11 (Marcus T.)',
      yourPr: '4:35 (Rank #8)',
    },
    {
      id: 'seg_3',
      name: 'Marin Headlands Coastal Ridge Singletrack',
      distance: '5.2 km',
      elev: '+240m',
      category: 'Technical Trail',
      kom: '19:40 (Sarah K.)',
      yourPr: '21:15 (Rank #4)',
    },
  ];

  const challenges = [
    {
      id: 'chal_1',
      title: 'November 100km Gran Fondo',
      sub: 'Log 100 kilometers of endurance volume in November.',
      progress: 68,
      participants: '14,290 athletes',
      reward: 'Exclusive Gran Fondo Digital Badge',
    },
    {
      id: 'chal_2',
      title: 'Vertical Elevation 3,000m Ascent',
      sub: 'Conquer 3,000 meters of cumulative climbing.',
      progress: 42,
      participants: '8,410 athletes',
      reward: 'King of the Mountain Badge',
    },
  ];

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 bg-[#050505] overflow-y-auto">
      {/* Header */}
      <div className="pt-1">
        <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
          Community & Topography
        </span>
        <h2 className="font-athletic text-2xl font-extrabold uppercase tracking-wide text-white">
          Explore Segments & Routes
        </h2>
      </div>

      {/* Segmented Category Buttons */}
      <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-2xl border border-[#292929]">
        <button
          onClick={() => setSelectedCategory('segments')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            selectedCategory === 'segments'
              ? 'bg-[#292929] text-[#C6FF00]'
              : 'text-[#8A8A8A] hover:text-white'
          }`}
        >
          Segments
        </button>
        <button
          onClick={() => setSelectedCategory('challenges')}
          className={`flex-1 py-2 text-xs font-semibold rounded-xl transition-all ${
            selectedCategory === 'challenges'
              ? 'bg-[#292929] text-[#C6FF00]'
              : 'text-[#8A8A8A] hover:text-white'
          }`}
        >
          Challenges
        </button>
      </div>

      {/* SEGMENTS TAB */}
      {selectedCategory === 'segments' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-[#8A8A8A]">
            <span>Nearby Verified Segments</span>
            <span className="font-mono text-[#C6FF00]">3 GPS Match</span>
          </div>

          {segments.map((seg) => (
            <div
              key={seg.id}
              className="bg-[#1A1A1A] border border-[#292929] hover:border-[#383838] rounded-2xl p-4 space-y-2 transition-all group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-[#101010] border border-[#292929] text-[#C6FF00]">
                  {seg.category}
                </span>
                <span className="text-xs font-mono text-white font-bold">
                  {seg.distance} · {seg.elev}
                </span>
              </div>

              <h3 className="font-athletic text-lg font-bold uppercase text-white group-hover:text-[#C6FF00] transition-colors">
                {seg.name}
              </h3>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#262626] text-xs font-mono">
                <div>
                  <span className="text-[9px] text-[#8A8A8A] block uppercase">Course Record (KOM)</span>
                  <span className="text-white font-semibold">{seg.kom}</span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A8A8A] block uppercase">Your Personal Best</span>
                  <span className="text-[#C6FF00] font-semibold">{seg.yourPr}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CHALLENGES TAB */}
      {selectedCategory === 'challenges' && (
        <div className="space-y-3">
          {challenges.map((chal) => (
            <div
              key={chal.id}
              className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy size={16} className="text-[#C6FF00]" />
                  <h3 className="font-athletic text-lg font-bold uppercase text-white">
                    {chal.title}
                  </h3>
                </div>
                <span className="text-xs font-mono text-[#C6FF00] font-bold">
                  {chal.progress}%
                </span>
              </div>

              <p className="text-xs text-[#8A8A8A] leading-relaxed">
                {chal.sub}
              </p>

              <div className="h-2 w-full bg-[#101010] rounded-full overflow-hidden border border-[#292929]">
                <div
                  className="h-full bg-[#C6FF00] rounded-full"
                  style={{ width: `${chal.progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] pt-1">
                <span>{chal.participants}</span>
                <span className="text-white font-mono">{chal.reward}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Phase 2 Roadmap Notice */}
      <div className="bg-[#101010] border border-[#292929] rounded-2xl p-4 space-y-2">
        <div className="flex items-center gap-2">
          <Zap size={14} className="text-[#C6FF00]" />
          <span className="text-xs font-mono uppercase font-bold text-white">
            Upcoming in Phase 2
          </span>
        </div>
        <p className="text-xs text-[#8A8A8A] leading-relaxed">
          Real-time turn-by-turn audio routing, live peer beacon tracking, and 3D terrain flyover replays will integrate in Phase 2.
        </p>
      </div>
    </div>
  );
};
