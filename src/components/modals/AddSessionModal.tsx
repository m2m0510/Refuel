/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Calendar, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SportType } from '../../types';

export const AddSessionModal: React.FC = () => {
  const { isAddSessionOpen, setIsAddSessionOpen, createTrainingSession } = useApp();

  const [title, setTitle] = useState('');
  const [sportType, setSportType] = useState<SportType>('road_running');
  const [dayOfWeek, setDayOfWeek] = useState<number>(3); // Wednesday default
  const [distanceKm, setDistanceKm] = useState('10.0');
  const [durationMins, setDurationMins] = useState('50');
  const [intensityZone, setIntensityZone] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [description, setDescription] = useState('');

  if (!isAddSessionOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const sessionDates: Record<number, string> = {
      1: '2026-11-09',
      2: '2026-11-10',
      3: '2026-11-11',
      4: '2026-11-12',
      5: '2026-11-13',
      6: '2026-11-14',
      7: '2026-11-15',
    };

    createTrainingSession({
      day_of_week: dayOfWeek,
      session_date: sessionDates[dayOfWeek] || '2026-11-11',
      sport_type: sportType,
      title: title.trim(),
      description: description.trim(),
      target_distance_meters: parseFloat(distanceKm || '0') * 1000,
      target_duration_seconds: parseInt(durationMins || '0', 10) * 60,
      intensity_zone: intensityZone,
      is_completed: false,
    });

    setIsAddSessionOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#101010] border border-[#292929] w-full max-w-lg rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        <div className="p-4 border-b border-[#292929] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
              Microcycle Periodization
            </span>
            <h3 className="font-athletic text-xl font-bold uppercase text-white">
              Add Training Session
            </h3>
          </div>
          <button
            onClick={() => setIsAddSessionOpen(false)}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#222] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3.5 overflow-y-auto max-h-[75vh]">
          {/* Day of Week */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8A8A8A]">Target Day</label>
            <div className="grid grid-cols-7 gap-1">
              {[
                { n: 1, s: 'Mon' },
                { n: 2, s: 'Tue' },
                { n: 3, s: 'Wed' },
                { n: 4, s: 'Thu' },
                { n: 5, s: 'Fri' },
                { n: 6, s: 'Sat' },
                { n: 7, s: 'Sun' },
              ].map((d) => (
                <button
                  key={d.n}
                  type="button"
                  onClick={() => setDayOfWeek(d.n)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold transition-all border ${
                    dayOfWeek === d.n
                      ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                      : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A]'
                  }`}
                >
                  {d.s}
                </button>
              ))}
            </div>
          </div>

          {/* Sport Selection */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8A8A8A]">Sport Discipline</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'road_running' as SportType, label: 'Road Run' },
                { id: 'trail_running' as SportType, label: 'Trail Run' },
                { id: 'outdoor_cycling' as SportType, label: 'Cycling' },
                { id: 'strength_training' as SportType, label: 'Strength' },
                { id: 'recovery' as SportType, label: 'Recovery' },
                { id: 'rest_day' as SportType, label: 'Rest Day' },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSportType(s.id)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all border text-center ${
                    sportType === s.id
                      ? 'bg-[#C6FF00]/15 border-[#C6FF00] text-white'
                      : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8A8A8A]">Session Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              placeholder="e.g. Progressive Tempo 10K"
              className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl px-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]"
            />
          </div>

          {/* Target Distance & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8A8A8A]">Target Dist (km)</label>
              <input
                type="number"
                step="0.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                placeholder="0 for gym/rest"
                className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl px-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8A8A8A]">Duration (mins)</label>
              <input
                type="number"
                value={durationMins}
                onChange={(e) => setDurationMins(e.target.value)}
                required
                className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl px-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          {/* Intensity Zone 1-5 */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8A8A8A]">
              Intensity Zone (Zone {intensityZone})
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setIntensityZone(z as any)}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    intensityZone === z
                      ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                      : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A]'
                  }`}
                >
                  Z{z}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8A8A8A]">Description / Coach Cues</label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Pacing notes, drills, fuel strategy..."
              className="w-full bg-[#1A1A1A] border border-[#292929] rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#C6FF00]"
            />
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-base font-extrabold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-[0_0_16px_rgba(198,255,0,0.3)] active:scale-[0.98] transition-all"
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Program Workout</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
