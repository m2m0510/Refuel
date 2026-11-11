/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Filter, Calendar, ChevronRight, TrendingUp, Mountain, Flame, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDistance, formatDuration, formatPace, getSportLabel } from '../lib/formatters';
import { Activity, SportType } from '../types';

export const ActivityHistoryScreen: React.FC = () => {
  const { activities, setSelectedActivity } = useApp();

  const [sportFilter, setSportFilter] = useState<'all' | 'road_running' | 'trail_running' | 'outdoor_cycling'>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'this_week' | 'this_month'>('all');

  // Filter activities
  const filteredActivities = activities.filter((act) => {
    // Sport match
    if (sportFilter !== 'all' && act.sport_type !== sportFilter) {
      return false;
    }

    // Date range filter
    const actDate = new Date(act.started_at);
    const now = new Date('2026-11-11');

    if (dateFilter === 'this_week') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (actDate < oneWeekAgo) return false;
    } else if (dateFilter === 'this_month') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      if (actDate < oneMonthAgo) return false;
    }

    return true;
  });

  const totalFilteredDist = filteredActivities.reduce((s, a) => s + a.distance_meters, 0);
  const totalFilteredTime = filteredActivities.reduce((s, a) => s + a.duration_seconds, 0);

  const getBadgeColor = (sport: SportType) => {
    switch (sport) {
      case 'road_running':
        return 'text-cyan-400 border-cyan-800/40 bg-cyan-950/30';
      case 'trail_running':
        return 'text-amber-400 border-amber-800/40 bg-amber-950/30';
      case 'outdoor_cycling':
        return 'text-[#C6FF00] border-[#C6FF00]/40 bg-[#C6FF00]/10';
      default:
        return 'text-white border-[#292929] bg-[#101010]';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-4 bg-[#050505] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
            Endurance Archive
          </span>
          <h2 className="font-athletic text-2xl font-extrabold uppercase tracking-wide text-white">
            Activity History
          </h2>
        </div>
        <span className="text-xs font-mono text-[#8A8A8A]">
          {filteredActivities.length} recorded
        </span>
      </div>

      {/* Sport Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {[
          { id: 'all', label: 'All Sports' },
          { id: 'road_running', label: 'Road Running' },
          { id: 'trail_running', label: 'Trail Running' },
          { id: 'outdoor_cycling', label: 'Cycling' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSportFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              sportFilter === tab.id
                ? 'bg-[#C6FF00] text-black border-[#C6FF00]'
                : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A] hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Range Sub-Filter */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#8A8A8A] uppercase font-mono text-[10px]">Date Range:</span>
        <div className="flex items-center gap-1 bg-[#101010] p-1 rounded-xl border border-[#292929]">
          <button
            onClick={() => setDateFilter('all')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
              dateFilter === 'all' ? 'bg-[#292929] text-white' : 'text-[#8A8A8A]'
            }`}
          >
            All Time
          </button>
          <button
            onClick={() => setDateFilter('this_month')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
              dateFilter === 'this_month' ? 'bg-[#292929] text-white' : 'text-[#8A8A8A]'
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateFilter('this_week')}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-all ${
              dateFilter === 'this_week' ? 'bg-[#292929] text-white' : 'text-[#8A8A8A]'
            }`}
          >
            7 Days
          </button>
        </div>
      </div>

      {/* Filter Aggregates Strip */}
      <div className="grid grid-cols-2 gap-2 bg-[#101010] border border-[#292929] rounded-2xl p-3 text-center">
        <div>
          <span className="text-[10px] text-[#8A8A8A] uppercase font-mono">Filtered Mileage</span>
          <span className="font-athletic text-xl font-bold text-white block mt-0.5">
            {(totalFilteredDist / 1000).toFixed(1)} km
          </span>
        </div>
        <div>
          <span className="text-[10px] text-[#8A8A8A] uppercase font-mono">Total Time</span>
          <span className="font-athletic text-xl font-bold text-[#C6FF00] block mt-0.5">
            {formatDuration(totalFilteredTime)}
          </span>
        </div>
      </div>

      {/* Activity Card Feed */}
      <div className="space-y-3">
        {filteredActivities.length === 0 ? (
          <div className="py-12 text-center bg-[#101010] border border-[#292929] rounded-2xl p-6">
            <span className="text-sm text-[#8A8A8A]">No activities match the selected filter.</span>
          </div>
        ) : (
          filteredActivities.map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="bg-[#1A1A1A] border border-[#292929] hover:border-[#3d3d3d] rounded-2xl p-4 cursor-pointer transition-all group"
            >
              {/* Card Header */}
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded border ${getBadgeColor(act.sport_type)}`}>
                    {getSportLabel(act.sport_type)}
                  </span>
                  <span className="text-[11px] font-mono text-[#8A8A8A]">
                    {new Date(act.started_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <ChevronRight size={16} className="text-[#8A8A8A] group-hover:text-white transition-colors" />
              </div>

              {/* Title */}
              <h3 className="font-bold text-white text-base group-hover:text-[#C6FF00] transition-colors">
                {act.title}
              </h3>

              {/* Metrics Grid */}
              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-[#262626] text-center">
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Distance</span>
                  <span className="font-athletic text-base font-extrabold text-white">
                    {(act.distance_meters / 1000).toFixed(1)} km
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Duration</span>
                  <span className="font-athletic text-base font-extrabold text-white">
                    {formatDuration(act.duration_seconds)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Avg Pace</span>
                  <span className="font-athletic text-base font-extrabold text-white">
                    {formatPace(act.avg_pace_seconds_per_km, act.sport_type)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Elevation</span>
                  <span className="font-athletic text-base font-extrabold text-[#C6FF00]">
                    +{act.elevation_gain_meters}m
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
