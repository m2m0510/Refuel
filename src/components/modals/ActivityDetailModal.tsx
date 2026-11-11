/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Trash2, Mountain, Heart, Flame, Clock, Navigation, MapPin } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { formatDuration, formatPace, getSportLabel } from '../../lib/formatters';

export const ActivityDetailModal: React.FC = () => {
  const { selectedActivity, setSelectedActivity, deleteActivity } = useApp();

  if (!selectedActivity) return null;

  const handleDelete = () => {
    deleteActivity(selectedActivity.id);
    setSelectedActivity(null);
  };

  // Generate simulated splits if not present
  const kmCount = Math.max(1, Math.floor(selectedActivity.distance_meters / 1000));
  const splits = selectedActivity.splits && selectedActivity.splits.length > 0
    ? selectedActivity.splits
    : Array.from({ length: Math.min(kmCount, 8) }).map((_, i) => ({
        id: `split_${i}`,
        activity_id: selectedActivity.id,
        split_number: i + 1,
        distance_meters: 1000,
        duration_seconds: Math.round(selectedActivity.avg_pace_seconds_per_km + (i % 2 === 0 ? -6 : 8)),
        elevation_difference_meters: Math.round((selectedActivity.elevation_gain_meters / kmCount) + (i % 3 === 0 ? 12 : -5)),
        avg_heart_rate: Math.round(selectedActivity.avg_heart_rate + (i * 2)),
      }));

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#101010] border border-[#292929] w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#292929] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase bg-[#1A1A1A] border border-[#292929] px-2 py-0.5 rounded text-[#C6FF00] font-bold">
              {getSportLabel(selectedActivity.sport_type)}
            </span>
            <span className="text-xs text-[#8A8A8A] font-mono">
              {new Date(selectedActivity.started_at).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </div>
          <button
            onClick={() => setSelectedActivity(null)}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#222] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto">
          {/* Activity Title */}
          <div>
            <h2 className="font-athletic text-2xl font-bold uppercase text-white leading-tight">
              {selectedActivity.title}
            </h2>
            {selectedActivity.notes && (
              <p className="text-xs text-[#8A8A8A] mt-1.5 leading-relaxed bg-[#1A1A1A] p-2.5 rounded-xl border border-[#262626]">
                "{selectedActivity.notes}"
              </p>
            )}
          </div>

          {/* Primary Telemetry Grid */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5">
              <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Total Distance</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-athletic text-3xl font-extrabold text-white">
                  {(selectedActivity.distance_meters / 1000).toFixed(2)}
                </span>
                <span className="text-xs font-mono text-[#8A8A8A]">km</span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5">
              <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Moving Time</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-athletic text-3xl font-extrabold text-[#C6FF00]">
                  {formatDuration(selectedActivity.duration_seconds)}
                </span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5">
              <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Average Pace</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-athletic text-2xl font-extrabold text-white">
                  {formatPace(selectedActivity.avg_pace_seconds_per_km, selectedActivity.sport_type)}
                </span>
              </div>
            </div>

            <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5">
              <span className="text-[10px] font-mono text-[#8A8A8A] uppercase block">Elevation Gain</span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="font-athletic text-2xl font-extrabold text-white">
                  +{selectedActivity.elevation_gain_meters}
                </span>
                <span className="text-xs font-mono text-[#8A8A8A]">m</span>
              </div>
            </div>
          </div>

          {/* Secondary Vitals */}
          <div className="grid grid-cols-4 gap-2 bg-[#141414] border border-[#262626] rounded-2xl p-3 text-center">
            <div>
              <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Energy</span>
              <span className="font-athletic text-base font-bold text-white mt-0.5 block">
                {selectedActivity.calories} <span className="text-[9px] text-[#8A8A8A]">kcal</span>
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Avg Heart</span>
              <span className="font-athletic text-base font-bold text-red-400 mt-0.5 block">
                {selectedActivity.avg_heart_rate} <span className="text-[9px] text-[#8A8A8A]">bpm</span>
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Max Heart</span>
              <span className="font-athletic text-base font-bold text-red-500 mt-0.5 block">
                {selectedActivity.max_heart_rate} <span className="text-[9px] text-[#8A8A8A]">bpm</span>
              </span>
            </div>
            <div>
              <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Avg Speed</span>
              <span className="font-athletic text-base font-bold text-white mt-0.5 block">
                {selectedActivity.avg_speed_kmh} <span className="text-[9px] text-[#8A8A8A]">km/h</span>
              </span>
            </div>
          </div>

          {/* Elevation Profile Curve (SVG) */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
                Topographical Elevation Profile
              </span>
              <span className="text-[10px] font-mono text-[#C6FF00]">
                Peak: +{selectedActivity.elevation_gain_meters}m
              </span>
            </div>
            <div className="h-24 w-full">
              <svg viewBox="0 0 300 70" className="w-full h-full overflow-visible">
                <defs>
                  <linearGradient id="vert-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C6FF00" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#C6FF00" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,55 Q40,25 80,45 T160,18 T240,38 T300,20 L300,70 L0,70 Z"
                  fill="url(#vert-grad)"
                />
                <path
                  d="M0,55 Q40,25 80,45 T160,18 T240,38 T300,20"
                  fill="none"
                  stroke="#C6FF00"
                  strokeWidth="2.5"
                />
              </svg>
            </div>
          </div>

          {/* Kilometer Splits Table */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5 space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A] block">
              Kilometer Split Telemetry
            </span>
            <div className="space-y-1.5">
              <div className="grid grid-cols-4 text-[10px] font-mono text-[#8A8A8A] px-2">
                <span>Split</span>
                <span>Pace</span>
                <span>Elev</span>
                <span className="text-right">Heart</span>
              </div>
              {splits.map((sp) => (
                <div
                  key={sp.split_number}
                  className="grid grid-cols-4 items-center p-2 rounded-xl bg-[#101010] text-xs font-mono border border-[#262626]"
                >
                  <span className="font-bold text-white">KM {sp.split_number}</span>
                  <span className="text-[#C6FF00] font-bold">
                    {formatPace(sp.duration_seconds, selectedActivity.sport_type)}
                  </span>
                  <span className="text-[#8A8A8A]">
                    {sp.elevation_difference_meters >= 0 ? `+${sp.elevation_difference_meters}m` : `${sp.elevation_difference_meters}m`}
                  </span>
                  <span className="text-right text-red-400">{sp.avg_heart_rate} bpm</span>
                </div>
              ))}
            </div>
          </div>

          {/* Delete Action */}
          <div className="pt-2">
            <button
              onClick={handleDelete}
              className="w-full py-2.5 rounded-xl bg-transparent hover:bg-red-950/20 text-xs font-semibold text-red-400 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete Activity from Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
