/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, MapPin, Radio, Heart, Flame, Mountain, Navigation, Compass } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useApp } from '../context/AppContext';
import { formatDuration, formatPace, formatTimer, getSportLabel } from '../lib/formatters';

export const LiveRecordScreen: React.FC = () => {
  const { liveSport, setIsLiveRecording, saveActivity, setActiveTab } = useApp();

  const [isRunning, setIsRunning] = useState(true);
  const [seconds, setSeconds] = useState(14); // start with a few seconds for immediate excitement
  const [distanceMeters, setDistanceMeters] = useState(55);
  const [elevationGain, setElevationGain] = useState(2);
  const [heartRate, setHeartRate] = useState(154);
  const [routePoints, setRoutePoints] = useState<[number, number][]>([
    [50, 180],
    [70, 160],
    [90, 170],
    [120, 140],
    [150, 130],
  ]);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);

        // Accumulate distance based on sport
        const speedFactor = liveSport === 'outdoor_cycling' ? 8.2 : 3.6; // m/s
        setDistanceMeters((prev) => prev + speedFactor);

        // Subtle heart rate and elevation changes
        setHeartRate(Math.floor(152 + Math.sin(Date.now() / 2000) * 8));

        if (Math.random() > 0.8) {
          setElevationGain((prev) => prev + 1);
        }

        // Add GPS route point simulation every few seconds
        setRoutePoints((prev) => {
          if (prev.length > 25) return prev;
          const last = prev[prev.length - 1];
          const newX = last[0] + (Math.random() * 14 + 5);
          const newY = last[1] + (Math.sin(Date.now()) * 12);
          return [...prev, [Math.min(newX, 360), Math.max(20, Math.min(newY, 220))]];
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, liveSport]);

  const currentKm = distanceMeters / 1000;
  const currentPaceSecondsPerKm = currentKm > 0 ? Math.round(seconds / currentKm) : 275;
  const caloriesBurned = Math.round(seconds * (liveSport === 'outdoor_cycling' ? 0.24 : 0.28));

  const handleFinishAndSave = async () => {
    setIsRunning(false);

    try {
      confetti({
        particleCount: 60,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#C6FF00', '#ffffff', '#22c55e'],
      });
    } catch { /* ignore */ }

    const defaultTitle = `${getSportLabel(liveSport)} Session`;

    await saveActivity({
      title: defaultTitle,
      sport_type: liveSport,
      distance_meters: Math.round(distanceMeters),
      duration_seconds: seconds,
      moving_time_seconds: Math.round(seconds * 0.98),
      elevation_gain_meters: elevationGain,
      calories: caloriesBurned,
      avg_heart_rate: heartRate,
      max_heart_rate: heartRate + 12,
      avg_pace_seconds_per_km: currentPaceSecondsPerKm,
      avg_speed_kmh: currentKm > 0 ? parseFloat(((currentKm / (seconds / 3600))).toFixed(1)) : 12.5,
      notes: 'Recorded live with REFUEL high-performance GPS engine.',
      started_at: new Date().toISOString(),
    });

    setIsLiveRecording(false);
    setActiveTab('home');
  };

  const handleDiscard = () => {
    setIsLiveRecording(false);
  };

  // Convert route points to SVG path
  const pathD = routePoints.reduce((acc, pt, idx) => {
    return idx === 0 ? `M ${pt[0]} ${pt[1]}` : `${acc} L ${pt[0]} ${pt[1]}`;
  }, '');

  return (
    <div className="flex-1 flex flex-col justify-between p-4 bg-[#050505] relative select-none">
      {/* Top Header */}
      <div className="pt-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#C6FF00] animate-pulse" />
          <span className="font-athletic text-base font-extrabold uppercase text-white tracking-wider">
            {getSportLabel(liveSport)} · GPS LIVE
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#101010] border border-[#292929] text-[10px] font-mono text-[#C6FF00]">
          <Radio size={12} className="animate-spin" />
          <span>Locked</span>
        </div>
      </div>

      {/* Simulated Live GPS Map Viewport */}
      <div className="w-full h-44 rounded-2xl bg-[#0c0c0c] border border-[#292929] relative overflow-hidden my-3">
        {/* Tactical Map Grid */}
        <div className="absolute inset-0 opacity-15">
          <svg className="w-full h-full">
            <defs>
              <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#FFFFFF" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Live Animated Polyline */}
        <svg className="w-full h-full absolute inset-0 overflow-visible">
          <path
            d={pathD}
            fill="none"
            stroke="#C6FF00"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_rgba(198,255,0,0.8)]"
          />
          {routePoints.length > 0 && (
            <g transform={`translate(${routePoints[routePoints.length - 1][0]}, ${routePoints[routePoints.length - 1][1]})`}>
              <circle r="6" fill="#C6FF00" />
              <circle r="12" fill="#C6FF00" opacity="0.3" className="animate-ping" />
            </g>
          )}
        </svg>

        {/* Compass Overlay Badge */}
        <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 backdrop-blur border border-[#292929] flex items-center gap-1 text-[9px] font-mono text-white">
          <Compass size={11} className="text-[#C6FF00]" />
          <span>315° NW · Golden Gate Presidio</span>
        </div>
      </div>

      {/* Hero Live Telemetry Metrics */}
      <div className="space-y-4 my-auto">
        {/* Big Distance */}
        <div className="text-center">
          <span className="text-xs font-mono uppercase text-[#8A8A8A] tracking-wider block">
            Distance (km)
          </span>
          <div className="font-athletic text-6xl font-extrabold text-white tracking-tighter mt-0.5">
            {currentKm.toFixed(2)}
          </div>
        </div>

        {/* Digital Stopwatch */}
        <div className="text-center">
          <span className="text-xs font-mono uppercase text-[#8A8A8A] tracking-wider block">
            Elapsed Time
          </span>
          <div className="font-mono text-4xl font-extrabold text-[#C6FF00] tracking-tight mt-0.5">
            {formatTimer(seconds)}
          </div>
        </div>

        {/* Live Secondary Grid */}
        <div className="grid grid-cols-3 gap-2 bg-[#1A1A1A] border border-[#292929] rounded-2xl p-3 text-center">
          <div>
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Current Pace</span>
            <span className="font-athletic text-xl font-bold text-white mt-0.5 block">
              {formatPace(currentPaceSecondsPerKm, liveSport)}
            </span>
          </div>

          <div>
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Heart Rate</span>
            <div className="flex items-center justify-center gap-1 mt-0.5">
              <Heart size={14} className="text-red-400 fill-red-400 animate-pulse" />
              <span className="font-athletic text-xl font-bold text-red-400">
                {heartRate}
              </span>
            </div>
          </div>

          <div>
            <span className="text-[9px] font-mono text-[#8A8A8A] uppercase block">Elevation</span>
            <span className="font-athletic text-xl font-bold text-white mt-0.5 block">
              +{elevationGain}m
            </span>
          </div>
        </div>
      </div>

      {/* Control Buttons (Pause / Resume / Finish / Discard) */}
      <div className="space-y-2.5 pb-2">
        <div className="flex items-center gap-3">
          {/* Pause / Resume Button */}
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`flex-1 h-14 rounded-2xl font-athletic text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
              isRunning
                ? 'bg-[#1A1A1A] border border-[#292929] text-white hover:bg-[#222]'
                : 'bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_16px_rgba(34,197,94,0.3)]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause size={20} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play size={20} fill="currentColor" strokeWidth={0} />
                <span>Resume</span>
              </>
            )}
          </button>

          {/* Finish & Save Button */}
          <button
            onClick={handleFinishAndSave}
            className="flex-1 h-14 rounded-2xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_24px_rgba(198,255,0,0.35)] active:scale-95 transition-all"
          >
            <Square size={18} fill="currentColor" />
            <span>Finish & Save</span>
          </button>
        </div>

        <button
          onClick={handleDiscard}
          className="w-full py-2 text-xs font-semibold text-[#8A8A8A] hover:text-red-400 text-center transition-colors"
        >
          Discard Workout
        </button>
      </div>
    </div>
  );
};
