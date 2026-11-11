/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Bell,
  ChevronRight,
  Flame,
  Clock,
  TrendingUp,
  Mountain,
  Heart,
  Zap,
  Calendar,
  Activity as ActivityIcon,
  Plus,
  Compass,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RefuelLogo } from '../components/common/RefuelLogo';
import { formatDistance, formatDuration, formatPace, getSportLabel } from '../lib/formatters';
import { WeeklyDistanceChart } from '../components/dashboard/WeeklyDistanceChart';
import { PerformanceCharts } from '../components/dashboard/PerformanceCharts';
import { SportType } from '../types';

export const HomeScreen: React.FC = () => {
  const {
    profile,
    weeklyStats,
    healthMetrics,
    trainingSessions,
    activities,
    notifications,
    setIsRecordSelectOpen,
    setSelectedActivity,
    setSelectedSession,
    setIsNotificationsOpen,
    setActiveTab,
    toggleTrainingCompleted,
    setActiveSubscreen,
  } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Derive sport distribution percentages
  const totalMeters = Object.values(weeklyStats.distribution).reduce((a, b) => a + b, 0) || 1;
  const roadPct = Math.round((weeklyStats.distribution.road_running / totalMeters) * 100);
  const trailPct = Math.round((weeklyStats.distribution.trail_running / totalMeters) * 100);
  const cyclingPct = Math.round((weeklyStats.distribution.outdoor_cycling / totalMeters) * 100);

  // Helper icon for sport type
  const renderSportBadge = (sport: SportType) => {
    switch (sport) {
      case 'road_running':
        return <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase">Road Run</span>;
      case 'trail_running':
        return <span className="text-[10px] font-mono text-amber-400 font-semibold uppercase">Trail Run</span>;
      case 'outdoor_cycling':
        return <span className="text-[10px] font-mono text-[#C6FF00] font-semibold uppercase">Cycling</span>;
      case 'strength_training':
        return <span className="text-[10px] font-mono text-purple-400 font-semibold uppercase">Strength</span>;
      case 'recovery':
        return <span className="text-[10px] font-mono text-emerald-400 font-semibold uppercase">Recovery</span>;
      case 'rest_day':
        return <span className="text-[10px] font-mono text-[#8A8A8A] font-semibold uppercase">Rest</span>;
      default:
        return <span className="text-[10px] font-mono text-white font-semibold uppercase">Workout</span>;
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 pb-24 space-y-5 bg-[#050505] overflow-y-auto">
      {/* 1. HEADER */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          {/* Athlete Profile Avatar */}
          <button
            onClick={() => setActiveTab('profile')}
            className="relative group focus:outline-none"
            aria-label="View Profile"
          >
            <div className="w-11 h-11 rounded-full overflow-hidden border-2 border-[#292929] group-hover:border-[#C6FF00] transition-colors bg-[#1A1A1A]">
              <img
                src={profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
                alt={profile.full_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#C6FF00] rounded-full border-2 border-black flex items-center justify-center">
              <span className="text-[7px] text-black font-extrabold">✓</span>
            </div>
          </button>

          {/* Athlete Greeting & Name */}
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#8A8A8A] font-medium">Good morning,</span>
              <span className="text-xs text-white font-bold">{profile.full_name.split(' ')[0]}</span>
            </div>
            <RefuelLogo size="sm" showSubtitle={false} className="mt-0.5" />
          </div>
        </div>

        {/* Notification Bell */}
        <button
          onClick={() => setIsNotificationsOpen(true)}
          className="relative min-w-[44px] min-h-[44px] rounded-xl bg-[#1A1A1A] hover:bg-[#222222] border border-[#292929] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#C6FF00] shadow-[0_0_8px_#C6FF00]" />
          )}
        </button>
      </div>

      {/* 2. WEEKLY STATISTICS BAR */}
      <div className="bg-[#101010] border border-[#292929] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
            Current Microcycle Volume
          </span>
          <span className="text-[11px] text-[#C6FF00] font-mono font-medium">
            Mon 09 – Sun 15 Nov
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {/* Distance */}
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 border border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-[#8A8A8A] block">Distance</span>
            <span className="font-athletic text-xl font-extrabold text-white block mt-0.5">
              {weeklyStats.total_distance_km}
            </span>
            <span className="text-[9px] text-[#8A8A8A] font-mono">kilometers</span>
          </div>

          {/* Activity Time */}
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 border border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-[#8A8A8A] block">Time</span>
            <span className="font-athletic text-xl font-extrabold text-white block mt-0.5">
              {formatDuration(weeklyStats.total_duration_seconds)}
            </span>
            <span className="text-[9px] text-[#8A8A8A] font-mono">moving time</span>
          </div>

          {/* Calories */}
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 border border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-[#8A8A8A] block">Energy</span>
            <span className="font-athletic text-xl font-extrabold text-white block mt-0.5">
              {weeklyStats.total_calories}
            </span>
            <span className="text-[9px] text-[#8A8A8A] font-mono">active kcal</span>
          </div>

          {/* Elevation Gain */}
          <div className="bg-[#1A1A1A] rounded-xl p-2.5 border border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-[#8A8A8A] block">Elevation</span>
            <span className="font-athletic text-xl font-extrabold text-[#C6FF00] block mt-0.5">
              +{weeklyStats.total_elevation_meters}m
            </span>
            <span className="text-[9px] text-[#8A8A8A] font-mono">vert ascent</span>
          </div>
        </div>
      </div>

      {/* 3. PERFORMANCE CARDS (VO2 Max, Resting HR, Weekly Progress, Recovery Status) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs uppercase font-mono tracking-wider text-[#8A8A8A]">
            Biometrics & Adaptation
          </span>
          <span className="text-[11px] text-[#8A8A8A]">Apple Health Synced</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Card A: VO2 Max */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8A8A]">VO2 Max</span>
              <div className="w-6 h-6 rounded-lg bg-[#C6FF00]/15 flex items-center justify-center">
                <Zap size={14} className="text-[#C6FF00]" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-athletic text-3xl font-extrabold text-white tracking-tight">
                  {healthMetrics.vo2_max}
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">ml/kg/min</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-[#C6FF00] uppercase font-athletic tracking-wide">
                  Superior Grade
                </span>
                <span className="text-[10px] text-[#8A8A8A]">· Top 5%</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-[#101010] rounded-full overflow-hidden">
              <div className="h-full bg-[#C6FF00] rounded-full w-[88%]" />
            </div>
          </div>

          {/* Card B: Resting Heart Rate */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8A8A]">Resting HR</span>
              <div className="w-6 h-6 rounded-lg bg-red-500/15 flex items-center justify-center">
                <Heart size={14} className="text-red-400" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-athletic text-3xl font-extrabold text-white tracking-tight">
                  {healthMetrics.resting_heart_rate}
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">bpm</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase font-athletic tracking-wide">
                  Athletic Bradycardia
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#8A8A8A] font-mono">
              <span>HRV Baseline: {healthMetrics.hrv_ms} ms</span>
              <span className="text-emerald-400">Stable</span>
            </div>
          </div>

          {/* Card C: Weekly Training Progress */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8A8A]">Weekly Progress</span>
              <div className="w-6 h-6 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <TrendingUp size={14} className="text-blue-400" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-athletic text-3xl font-extrabold text-white tracking-tight">
                  {weeklyStats.consistency_score}%
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">volume</span>
              </div>
              <span className="text-[10px] text-[#8A8A8A] block mt-0.5">
                {weeklyStats.completed_sessions} of {weeklyStats.total_planned_sessions} sessions finished
              </span>
            </div>
            <div className="h-1.5 w-full bg-[#101010] rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-400 rounded-full"
                style={{ width: `${weeklyStats.consistency_score}%` }}
              />
            </div>
          </div>

          {/* Card D: Recovery Status */}
          <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase text-[#8A8A8A]">Recovery Status</span>
              <div className="w-6 h-6 rounded-lg bg-[#C6FF00]/15 flex items-center justify-center">
                <ActivityIcon size={14} className="text-[#C6FF00]" />
              </div>
            </div>
            <div className="my-2">
              <div className="flex items-baseline gap-1">
                <span className="font-athletic text-3xl font-extrabold text-[#C6FF00] tracking-tight">
                  {healthMetrics.recovery_percentage}%
                </span>
                <span className="text-[11px] font-mono text-[#8A8A8A]">score</span>
              </div>
              <span className="text-[10px] font-semibold text-white uppercase font-athletic tracking-wide block mt-0.5">
                Prime Adaptation State
              </span>
            </div>
            <div className="flex items-center justify-between text-[9px] text-[#8A8A8A] font-mono">
              <span>Sleep Score: {healthMetrics.sleep_score}/100</span>
              <span className="text-[#C6FF00]">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. ACTIVITY DISTRIBUTION (Road Running, Trail Running, Outdoor Cycling) */}
      <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A]">
            Discipline Distribution
          </span>
          <span className="text-[11px] text-[#8A8A8A]">By Distance</span>
        </div>

        {/* Stacked Proportional Bar */}
        <div className="h-3 w-full bg-[#101010] rounded-full overflow-hidden flex gap-0.5 p-0.5 border border-[#292929]">
          <div
            className="h-full bg-cyan-400 rounded-l-full transition-all duration-300"
            style={{ width: `${roadPct}%` }}
            title={`Road Running: ${roadPct}%`}
          />
          <div
            className="h-full bg-amber-400 transition-all duration-300"
            style={{ width: `${trailPct}%` }}
            title={`Trail Running: ${trailPct}%`}
          />
          <div
            className="h-full bg-[#C6FF00] rounded-r-full transition-all duration-300"
            style={{ width: `${cyclingPct}%` }}
            title={`Outdoor Cycling: ${cyclingPct}%`}
          />
        </div>

        {/* Distribution Legend */}
        <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-[#292929]">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span className="text-[11px] text-white font-medium">Road Run</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#8A8A8A] mt-0.5">
              {(weeklyStats.distribution.road_running / 1000).toFixed(1)} km <span className="text-[10px]">({roadPct}%)</span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-[11px] text-white font-medium">Trail Run</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#8A8A8A] mt-0.5">
              {(weeklyStats.distribution.trail_running / 1000).toFixed(1)} km <span className="text-[10px]">({trailPct}%)</span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C6FF00]" />
              <span className="text-[11px] text-white font-medium">Cycling</span>
            </div>
            <span className="text-xs font-mono font-bold text-[#8A8A8A] mt-0.5">
              {(weeklyStats.distribution.outdoor_cycling / 1000).toFixed(1)} km <span className="text-[10px]">({cyclingPct}%)</span>
            </span>
          </div>
        </div>
      </div>

      {/* 5. CHARTS: WEEKLY DISTANCE & PERFORMANCE */}
      <WeeklyDistanceChart />
      <PerformanceCharts />

      {/* 6. TRAINING SCHEDULE (Mon - Sun Current Week) */}
      <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A]">
              Microcycle Schedule
            </span>
            <h3 className="font-athletic text-lg font-bold uppercase text-white tracking-wide">
              Weekly Training Calendar
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('training')}
            className="flex items-center gap-1 text-xs text-[#C6FF00] hover:underline font-semibold"
          >
            <span>Full Planner</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-2">
          {trainingSessions.slice(0, 5).map((session) => (
            <div
              key={session.id}
              onClick={() => setSelectedSession(session)}
              className="p-3 rounded-xl bg-[#101010] border border-[#262626] hover:border-[#383838] flex items-center justify-between cursor-pointer transition-colors group"
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleTrainingCompleted(session.id);
                  }}
                  className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-all ${
                    session.is_completed
                      ? 'bg-[#C6FF00] border-[#C6FF00] text-black shadow-[0_0_10px_rgba(198,255,0,0.3)]'
                      : 'border-[#383838] bg-[#1A1A1A] text-transparent hover:border-[#8A8A8A]'
                  }`}
                  aria-label={session.is_completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  <CheckCircle2 size={16} strokeWidth={3} className={session.is_completed ? 'text-black' : 'opacity-0'} />
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-[#8A8A8A]">
                      {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][session.day_of_week - 1]}
                    </span>
                    <span className="text-[#383838]">·</span>
                    {renderSportBadge(session.sport_type)}
                  </div>
                  <h4 className="text-xs font-semibold text-white group-hover:text-[#C6FF00] transition-colors truncate max-w-[200px]">
                    {session.title}
                  </h4>
                </div>
              </div>

              <div className="text-right">
                {session.target_distance_meters > 0 ? (
                  <span className="font-mono text-xs font-bold text-white block">
                    {(session.target_distance_meters / 1000).toFixed(1)}k
                  </span>
                ) : (
                  <span className="font-mono text-xs text-[#8A8A8A] block">
                    {formatDuration(session.target_duration_seconds)}
                  </span>
                )}
                <span className="text-[9px] font-mono text-[#8A8A8A]">Zone {session.intensity_zone}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 7. RECENT ACTIVITIES */}
      <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A]">
              Telemetry Feed
            </span>
            <h3 className="font-athletic text-lg font-bold uppercase text-white tracking-wide">
              Recent Activities
            </h3>
          </div>
          <button
            onClick={() => setActiveSubscreen('history')}
            className="flex items-center gap-1 text-xs text-[#C6FF00] hover:underline font-semibold"
          >
            <span>View All ({activities.length})</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div className="space-y-2.5">
          {activities.slice(0, 3).map((act) => (
            <div
              key={act.id}
              onClick={() => setSelectedActivity(act)}
              className="p-3 rounded-xl bg-[#101010] border border-[#262626] hover:border-[#C6FF00]/40 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  {renderSportBadge(act.sport_type)}
                  <span className="text-[#383838]">·</span>
                  <span className="text-[10px] font-mono text-[#8A8A8A]">
                    {new Date(act.started_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <ChevronRight size={14} className="text-[#8A8A8A] group-hover:text-white transition-colors" />
              </div>

              <h4 className="text-sm font-bold text-white group-hover:text-[#C6FF00] transition-colors truncate">
                {act.title}
              </h4>

              <div className="grid grid-cols-4 gap-2 mt-2 pt-2 border-t border-[#222222] text-center">
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Distance</span>
                  <span className="font-athletic text-sm font-bold text-white">
                    {(act.distance_meters / 1000).toFixed(1)} km
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Duration</span>
                  <span className="font-athletic text-sm font-bold text-white">
                    {formatDuration(act.duration_seconds)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Pace</span>
                  <span className="font-athletic text-sm font-bold text-white">
                    {formatPace(act.avg_pace_seconds_per_km, act.sport_type)}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] text-[#8A8A8A] uppercase font-mono block">Avg HR</span>
                  <span className="font-athletic text-sm font-bold text-[#C6FF00]">
                    {act.avg_heart_rate} bpm
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Hint / Quick Record Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#101010] to-[#1A1A1A] border border-[#292929] flex items-center justify-between">
        <div>
          <span className="text-[10px] font-mono text-[#C6FF00] uppercase font-bold tracking-wider">
            Ready to Train?
          </span>
          <p className="font-athletic text-base font-bold text-white uppercase">
            Start GPS Telemetry
          </p>
        </div>
        <button
          onClick={() => setIsRecordSelectOpen(true)}
          className="h-11 px-4 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-sm font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-[0_0_16px_rgba(198,255,0,0.3)] active:scale-95 transition-all"
        >
          <Plus size={16} strokeWidth={3} />
          <span>Record</span>
        </button>
      </div>
    </div>
  );
};
