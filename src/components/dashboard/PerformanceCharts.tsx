/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Activity, CheckCircle2, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PerformanceCharts: React.FC = () => {
  const { weeklyStats, healthMetrics } = useApp();
  const [selectedChart, setSelectedChart] = useState<'heart_rate' | 'monthly' | 'consistency'>('heart_rate');

  // Simulated 7-day heart rate points
  const hrPoints = [
    { day: 'Thu', rest: 49, peak: 168 },
    { day: 'Fri', rest: 50, peak: 145 },
    { day: 'Sat', rest: 47, peak: 174 },
    { day: 'Sun', rest: 48, peak: 165 },
    { day: 'Mon', rest: 46, peak: 142 },
    { day: 'Tue', rest: 48, peak: 178 },
    { day: 'Wed', rest: healthMetrics.resting_heart_rate, peak: 172 },
  ];

  // 4-week monthly volume progression
  const monthlyWeeks = [
    { label: 'Wk 42', km: 48.2 },
    { label: 'Wk 43', km: 54.0 },
    { label: 'Wk 44', km: 62.4 },
    { label: 'Wk 45 (Current)', km: weeklyStats.total_distance_km },
  ];

  return (
    <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
      {/* Segmented Controls / Tabs */}
      <div className="flex items-center justify-between pb-3 border-b border-[#292929]">
        <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-xl border border-[#292929]">
          <button
            onClick={() => setSelectedChart('heart_rate')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedChart === 'heart_rate'
                ? 'bg-[#292929] text-[#C6FF00]'
                : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Heart Rate
          </button>
          <button
            onClick={() => setSelectedChart('monthly')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedChart === 'monthly'
                ? 'bg-[#292929] text-[#C6FF00]'
                : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setSelectedChart('consistency')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
              selectedChart === 'consistency'
                ? 'bg-[#292929] text-[#C6FF00]'
                : 'text-[#8A8A8A] hover:text-white'
            }`}
          >
            Consistency
          </button>
        </div>

        <span className="text-[10px] font-mono text-[#8A8A8A] uppercase">
          7-Day Telemetry
        </span>
      </div>

      {/* Chart View 1: Heart Rate Trend */}
      {selectedChart === 'heart_rate' && (
        <div className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-[#8A8A8A] block">Resting vs Workout Peak</span>
              <span className="font-athletic text-lg font-bold text-white">
                {healthMetrics.resting_heart_rate} <span className="text-xs text-[#8A8A8A] font-normal">bpm resting</span> · 178 <span className="text-xs text-[#8A8A8A] font-normal">bpm peak</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <Heart size={16} className="text-red-400" />
            </div>
          </div>

          <div className="h-28 w-full">
            <svg viewBox="0 0 280 80" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="hr-peak-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="0" y1="20" x2="280" y2="20" stroke="#262626" strokeDasharray="2 2" />
              <line x1="0" y1="50" x2="280" y2="50" stroke="#262626" strokeDasharray="2 2" />

              {/* Peak HR line */}
              <polyline
                fill="none"
                stroke="#ef4444"
                strokeWidth="2.5"
                points="20,15 60,35 100,12 140,22 180,38 220,10 260,16"
              />

              {/* Resting HR line */}
              <polyline
                fill="none"
                stroke="#C6FF00"
                strokeWidth="2"
                points="20,62 60,60 100,66 140,64 180,68 220,64 260,64"
              />

              {/* Day Dots and text */}
              {hrPoints.map((pt, i) => {
                const x = 20 + i * 40;
                return (
                  <g key={i}>
                    <circle cx={x} cy={64} r="2.5" fill="#C6FF00" />
                    <text x={x} y="78" textAnchor="middle" fill="#8A8A8A" className="text-[8px] font-mono">
                      {pt.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1 text-[#8A8A8A]">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-[#C6FF00]" /> Resting HR (Apple Health)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-0.5 bg-red-400" /> Max Effort Heart Rate
            </span>
          </div>
        </div>
      )}

      {/* Chart View 2: Monthly Activity Volume */}
      {selectedChart === 'monthly' && (
        <div className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-[#8A8A8A] block">4-Week Rolling Mileage</span>
              <span className="font-athletic text-lg font-bold text-white">
                242.6 <span className="text-xs text-[#8A8A8A] font-normal">km total logged</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-[#C6FF00] text-xs font-bold font-athletic">
              <TrendingUp size={15} />
              <span>+18.4% vs Last Month</span>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            {monthlyWeeks.map((wk, idx) => {
              const pct = Math.min(100, Math.round((wk.km / 70) * 100));
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-[#8A8A8A]">{wk.label}</span>
                    <span className="text-white font-mono font-medium">{wk.km} km</span>
                  </div>
                  <div className="h-2 w-full bg-[#101010] rounded-full overflow-hidden border border-[#292929]">
                    <div
                      className="h-full bg-gradient-to-r from-[#8A8A8A] to-[#C6FF00] rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Chart View 3: Training Consistency Matrix */}
      {selectedChart === 'consistency' && (
        <div className="pt-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs text-[#8A8A8A] block">Microcycle Adherence</span>
              <span className="font-athletic text-lg font-bold text-white">
                {weeklyStats.consistency_score}% <span className="text-xs text-[#C6FF00] font-normal">Optimal Adaptation</span>
              </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#C6FF00]/15 border border-[#C6FF00]/40 flex items-center justify-center">
              <CheckCircle2 size={16} className="text-[#C6FF00]" />
            </div>
          </div>

          {/* 7-Day Consistency Dot Matrix */}
          <div className="grid grid-cols-7 gap-1.5 py-3">
            {[
              { day: 'M', completed: true, label: 'Recovery' },
              { day: 'T', completed: true, label: 'Road Interval' },
              { day: 'W', completed: false, label: 'Cycling Base' },
              { day: 'T', completed: false, label: 'Strength' },
              { day: 'F', completed: false, label: 'Rest' },
              { day: 'S', completed: false, label: 'Trail Run' },
              { day: 'S', completed: false, label: 'Spin Flush' },
            ].map((slot, i) => (
              <div
                key={i}
                className={`flex flex-col items-center justify-center py-2 rounded-xl border ${
                  slot.completed
                    ? 'bg-[#C6FF00]/15 border-[#C6FF00] text-white'
                    : 'bg-[#101010] border-[#292929] text-[#8A8A8A]'
                }`}
              >
                <span className="text-[10px] font-mono font-bold">{slot.day}</span>
                <span className={`w-2 h-2 rounded-full mt-1 ${slot.completed ? 'bg-[#C6FF00]' : 'bg-[#333]'}`} />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[#8A8A8A] text-center">
            2 of 5 planned sessions completed. 3 active workouts remaining in cycle.
          </p>
        </div>
      )}
    </div>
  );
};
