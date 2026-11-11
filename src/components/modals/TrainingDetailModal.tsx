/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, Trash2, Calendar, Target, Zap, Clock, ShieldAlert } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../../context/AppContext';
import { formatDuration, getSportLabel } from '../../lib/formatters';

export const TrainingDetailModal: React.FC = () => {
  const { selectedSession, setSelectedSession, toggleTrainingCompleted, deleteTrainingSession } = useApp();

  if (!selectedSession) return null;

  const handleToggle = () => {
    if (!selectedSession.is_completed) {
      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#C6FF00', '#ffffff', '#8A8A8A'],
        });
      } catch { /* ignore */ }
    }
    toggleTrainingCompleted(selectedSession.id);
  };

  const handleDelete = () => {
    deleteTrainingSession(selectedSession.id);
    setSelectedSession(null);
  };

  const getZoneDescription = (zone: number) => {
    switch (zone) {
      case 1:
        return 'Active Recovery (<65% HRmax) — Cellular flushing and mitochondrial replenishment.';
      case 2:
        return 'Aerobic Endurance Base (65-75% HRmax) — Fat oxidation and aerobic capacity build.';
      case 3:
        return 'Tempo / Aerobic Power (75-85% HRmax) — Sustained marathon pace efficiency.';
      case 4:
        return 'Lactate Threshold (85-92% HRmax) — Elevating anaerobic threshold and clearing lactate.';
      case 5:
        return 'VO2 Max & Neuromuscular (>92% HRmax) — Peak stroke volume and maximum power intervals.';
      default:
        return 'Mixed Aerobic Stress.';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#101010] border border-[#292929] w-full max-w-lg rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#292929] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-[#1A1A1A] border border-[#292929] px-2 py-0.5 rounded text-[#C6FF00] font-bold">
              {getSportLabel(selectedSession.sport_type)}
            </span>
            <span className="text-xs text-[#8A8A8A] font-mono">
              Day {selectedSession.day_of_week} · {selectedSession.session_date}
            </span>
          </div>
          <button
            onClick={() => setSelectedSession(null)}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#222] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 overflow-y-auto max-h-[75vh]">
          {/* Title */}
          <div>
            <h3 className="font-athletic text-2xl font-bold uppercase text-white leading-tight">
              {selectedSession.title}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-[11px] font-mono uppercase font-bold px-2 py-0.5 rounded ${
                  selectedSession.is_completed
                    ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                    : 'bg-amber-950/60 border border-amber-800 text-amber-400'
                }`}
              >
                {selectedSession.is_completed ? 'Session Completed' : 'Pending Execution'}
              </span>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-[#1A1A1A] border border-[#292929] rounded-xl p-3">
              <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Target Distance</span>
              <span className="font-athletic text-xl font-bold text-white mt-0.5 block">
                {selectedSession.target_distance_meters > 0
                  ? `${(selectedSession.target_distance_meters / 1000).toFixed(1)} km`
                  : '--'}
              </span>
            </div>
            <div className="bg-[#1A1A1A] border border-[#292929] rounded-xl p-3">
              <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Duration</span>
              <span className="font-athletic text-xl font-bold text-white mt-0.5 block">
                {formatDuration(selectedSession.target_duration_seconds)}
              </span>
            </div>
            <div className="bg-[#1A1A1A] border border-[#292929] rounded-xl p-3">
              <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Intensity</span>
              <span className="font-athletic text-xl font-bold text-[#C6FF00] mt-0.5 block">
                Zone {selectedSession.intensity_zone}
              </span>
            </div>
          </div>

          {/* Workout Description */}
          {selectedSession.description && (
            <div className="bg-[#1A1A1A] border border-[#292929] rounded-xl p-3.5 space-y-1">
              <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Workout Instructions</span>
              <p className="text-xs text-[#d1d1d1] leading-relaxed">
                {selectedSession.description}
              </p>
            </div>
          )}

          {/* Zone Guidance */}
          <div className="bg-[#141414] border border-[#292929] rounded-xl p-3.5 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-[#C6FF00] font-bold">
              <Zap size={14} />
              <span>Physiological Target</span>
            </div>
            <p className="text-[11px] text-[#8A8A8A] leading-relaxed">
              {getZoneDescription(selectedSession.intensity_zone)}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 space-y-2">
            <button
              onClick={handleToggle}
              className={`w-full h-12 rounded-xl font-athletic text-base font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                selectedSession.is_completed
                  ? 'bg-[#1A1A1A] border border-[#292929] text-[#8A8A8A] hover:text-white'
                  : 'bg-[#C6FF00] hover:bg-[#b5eb00] text-black shadow-[0_0_16px_rgba(198,255,0,0.3)]'
              }`}
            >
              <CheckCircle2 size={18} strokeWidth={2.5} />
              <span>{selectedSession.is_completed ? 'Mark as Incomplete' : 'Complete Session'}</span>
            </button>

            <button
              onClick={handleDelete}
              className="w-full py-2.5 rounded-xl bg-transparent hover:bg-red-950/20 text-xs font-semibold text-red-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete Training Session</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
