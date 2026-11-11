/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, CheckCircle2, Circle, Calendar as CalendarIcon, ChevronRight, Dumbbell, Zap } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDuration, getSportLabel } from '../lib/formatters';
import { SportType, TrainingSession } from '../types';

export const TrainingPlannerScreen: React.FC = () => {
  const {
    trainingSessions,
    weeklyStats,
    setSelectedSession,
    setIsAddSessionOpen,
    toggleTrainingCompleted,
  } = useApp();

  const [activeDayFilter, setActiveDayFilter] = useState<number | null>(null);

  const daysOfWeek = [
    { num: 1, name: 'Monday', short: 'Mon', date: 'Nov 09' },
    { num: 2, name: 'Tuesday', short: 'Tue', date: 'Nov 10' },
    { num: 3, name: 'Wednesday', short: 'Wed', date: 'Nov 11' },
    { num: 4, name: 'Thursday', short: 'Thu', date: 'Nov 12' },
    { num: 5, name: 'Friday', short: 'Fri', date: 'Nov 13' },
    { num: 6, name: 'Saturday', short: 'Sat', date: 'Nov 14' },
    { num: 7, name: 'Sunday', short: 'Sun', date: 'Nov 15' },
  ];

  // Helper badge color
  const getSportStyle = (sport: SportType) => {
    switch (sport) {
      case 'road_running':
        return { color: 'text-cyan-400', bg: 'bg-cyan-950/30', border: 'border-cyan-800/40', label: 'Road Running' };
      case 'trail_running':
        return { color: 'text-amber-400', bg: 'bg-amber-950/30', border: 'border-amber-800/40', label: 'Trail Running' };
      case 'outdoor_cycling':
        return { color: 'text-[#C6FF00]', bg: 'bg-[#C6FF00]/10', border: 'border-[#C6FF00]/30', label: 'Cycling' };
      case 'strength_training':
        return { color: 'text-purple-400', bg: 'bg-purple-950/30', border: 'border-purple-800/40', label: 'Strength' };
      case 'recovery':
        return { color: 'text-emerald-400', bg: 'bg-emerald-950/30', border: 'border-emerald-800/40', label: 'Recovery' };
      case 'rest_day':
        return { color: 'text-[#8A8A8A]', bg: 'bg-[#151515]', border: 'border-[#292929]', label: 'Rest Day' };
      default:
        return { color: 'text-white', bg: 'bg-[#151515]', border: 'border-[#292929]', label: 'Session' };
    }
  };

  const completedCount = trainingSessions.filter((s) => s.is_completed).length;

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 bg-[#050505] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
            Training Matrix
          </span>
          <h2 className="font-athletic text-2xl font-extrabold uppercase tracking-wide text-white">
            Weekly Planner
          </h2>
        </div>
        <button
          onClick={() => setIsAddSessionOpen(true)}
          className="h-10 px-3.5 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-sm font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_12px_rgba(198,255,0,0.3)] active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={2.8} />
          <span>Add Session</span>
        </button>
      </div>

      {/* Planned vs Completed Summary Card */}
      <div className="bg-[#101010] border border-[#292929] rounded-2xl p-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-[#8A8A8A]">Periodization Progress</span>
          <span className="font-mono text-white font-bold">
            {completedCount} / {trainingSessions.length} Completed ({weeklyStats.consistency_score}%)
          </span>
        </div>
        <div className="h-2 w-full bg-[#1A1A1A] rounded-full overflow-hidden border border-[#292929]">
          <div
            className="h-full bg-[#C6FF00] rounded-full transition-all duration-300"
            style={{ width: `${weeklyStats.consistency_score}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#222] text-[11px] text-[#8A8A8A]">
          <span>Current Week: <strong>Mon Nov 09 – Sun Nov 15</strong></span>
          <span className="text-[#C6FF00] font-mono">{trainingSessions.length - completedCount} workouts left</span>
        </div>
      </div>

      {/* Horizontal Day Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        <button
          onClick={() => setActiveDayFilter(null)}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
            activeDayFilter === null
              ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
              : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A] hover:text-white'
          }`}
        >
          All 7 Days
        </button>
        {daysOfWeek.map((day) => {
          const isSelected = activeDayFilter === day.num;
          const daySessions = trainingSessions.filter((s) => s.day_of_week === day.num);
          const allCompleted = daySessions.length > 0 && daySessions.every((s) => s.is_completed);

          return (
            <button
              key={day.num}
              onClick={() => setActiveDayFilter(day.num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex items-center gap-1.5 transition-all border ${
                isSelected
                  ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                  : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A] hover:text-white'
              }`}
            >
              <span>{day.short}</span>
              {allCompleted && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            </button>
          );
        })}
      </div>

      {/* Monday to Sunday Calendar List */}
      <div className="space-y-3">
        {daysOfWeek
          .filter((day) => activeDayFilter === null || activeDayFilter === day.num)
          .map((day) => {
            const sessionsForDay = trainingSessions.filter((s) => s.day_of_week === day.num);

            return (
              <div key={day.num} className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5 space-y-2.5">
                {/* Day Header Row */}
                <div className="flex items-center justify-between pb-1.5 border-b border-[#262626]">
                  <div className="flex items-center gap-2">
                    <span className="font-athletic text-base font-bold text-white uppercase tracking-wider">
                      {day.name}
                    </span>
                    <span className="text-[#8A8A8A] text-xs font-mono">· {day.date}</span>
                  </div>
                  <span className="text-[10px] font-mono text-[#8A8A8A]">
                    {sessionsForDay.length} {sessionsForDay.length === 1 ? 'session' : 'sessions'}
                  </span>
                </div>

                {/* Day Sessions */}
                {sessionsForDay.length === 0 ? (
                  <div className="py-3 text-center text-xs text-[#8A8A8A] flex items-center justify-center gap-2">
                    <span>No training programmed for this day.</span>
                    <button
                      onClick={() => setIsAddSessionOpen(true)}
                      className="text-[#C6FF00] hover:underline font-semibold"
                    >
                      + Schedule
                    </button>
                  </div>
                ) : (
                  sessionsForDay.map((session) => {
                    const style = getSportStyle(session.sport_type);
                    return (
                      <div
                        key={session.id}
                        onClick={() => setSelectedSession(session)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          session.is_completed
                            ? 'bg-[#101010] border-[#292929] opacity-85'
                            : 'bg-[#141414] border-[#2b2b2b] hover:border-[#3d3d3d]'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          {/* Complete Toggle Checkbox */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTrainingCompleted(session.id);
                            }}
                            className={`w-7 h-7 rounded-lg flex items-center justify-center border transition-all ${
                              session.is_completed
                                ? 'bg-[#C6FF00] border-[#C6FF00] text-black shadow-[0_0_10px_rgba(198,255,0,0.3)]'
                                : 'border-[#444] bg-[#1A1A1A] text-transparent hover:border-[#8A8A8A]'
                            }`}
                            aria-label={session.is_completed ? 'Mark incomplete' : 'Mark complete'}
                          >
                            <CheckCircle2 size={18} strokeWidth={3} className={session.is_completed ? 'text-black' : 'opacity-0'} />
                          </button>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${style.bg} ${style.border} ${style.color}`}>
                                {style.label}
                              </span>
                              <span className="text-[10px] font-mono text-[#8A8A8A]">
                                Zone {session.intensity_zone}
                              </span>
                            </div>
                            <h4 className={`text-sm font-bold mt-1 ${session.is_completed ? 'text-[#8A8A8A] line-through' : 'text-white'}`}>
                              {session.title}
                            </h4>
                            {session.description && (
                              <p className="text-[11px] text-[#8A8A8A] line-clamp-1 mt-0.5">
                                {session.description}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right flex items-center gap-2">
                          <div>
                            {session.target_distance_meters > 0 ? (
                              <span className="font-mono text-sm font-extrabold text-white block">
                                {(session.target_distance_meters / 1000).toFixed(1)}k
                              </span>
                            ) : (
                              <span className="font-mono text-xs text-[#8A8A8A] block">
                                {formatDuration(session.target_duration_seconds)}
                              </span>
                            )}
                            <span className="text-[9px] text-[#8A8A8A] block">
                              {session.is_completed ? 'Done' : 'Planned'}
                            </span>
                          </div>
                          <ChevronRight size={14} className="text-[#8A8A8A]" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};
