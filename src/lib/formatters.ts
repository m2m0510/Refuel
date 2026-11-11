/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, SportType, WeeklyStats, TrainingSession } from '../types';

/**
 * Calculates current age accurately from ISO birth date (YYYY-MM-DD)
 */
export const calculateAge = (dateOfBirthString: string): number => {
  if (!dateOfBirthString) return 30;
  const dob = new Date(dateOfBirthString);
  if (isNaN(dob.getTime())) return 30;

  const today = new Date('2026-11-11'); // Anchored to current applet local time
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }

  return Math.max(0, age);
};

/**
 * Format meters to kilometers with precision
 */
export const formatDistance = (meters: number, useImperial = false): string => {
  if (useImperial) {
    const miles = meters * 0.000621371;
    return `${miles.toFixed(1)} mi`;
  }
  const km = meters / 1000;
  return `${km.toFixed(1)} km`;
};

/**
 * Format seconds to hours and minutes (e.g. "1h 32m" or "48m")
 */
export const formatDuration = (seconds: number): string => {
  if (!seconds || seconds <= 0) return '0m';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs > 0 ? `${secs}s` : ''}`.trim();
  }
  return `${secs}s`;
};

/**
 * Format seconds into digital stopwatch timer (e.g. "01:24:35" or "24:35")
 */
export const formatTimer = (seconds: number): string => {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
};

/**
 * Format pace (seconds per km) into "4'32\" /km"
 */
export const formatPace = (secondsPerKm: number, sport: SportType = 'road_running'): string => {
  if (sport === 'outdoor_cycling') {
    // For cycling, show speed in km/h
    if (!secondsPerKm || secondsPerKm <= 0) return '0.0 km/h';
    const kmh = (3600 / secondsPerKm).toFixed(1);
    return `${kmh} km/h`;
  }

  if (!secondsPerKm || secondsPerKm <= 0) return '--\'--"/km';
  const mins = Math.floor(secondsPerKm / 60);
  const secs = Math.floor(secondsPerKm % 60);
  return `${mins}'${secs.toString().padStart(2, '0')}"/km`;
};

/**
 * Convert sport_type enum to human-friendly athletic label
 */
export const getSportLabel = (sport: SportType): string => {
  switch (sport) {
    case 'road_running':
      return 'Road Running';
    case 'trail_running':
      return 'Trail Running';
    case 'outdoor_cycling':
      return 'Outdoor Cycling';
    case 'strength_training':
      return 'Strength Training';
    case 'recovery':
      return 'Active Recovery';
    case 'rest_day':
      return 'Rest Day';
    default:
      return 'Workout';
  }
};

/**
 * Derive weekly statistics strictly from database records
 */
export const calculateWeeklyStats = (
  activities: Activity[],
  sessions: TrainingSession[]
): WeeklyStats => {
  let totalMeters = 0;
  let totalSeconds = 0;
  let totalCalories = 0;
  let totalElevation = 0;

  const sportDist = {
    road_running: 0,
    trail_running: 0,
    outdoor_cycling: 0,
    other: 0,
  };

  const dayTotals: Record<number, number> = {
    1: 0, // Mon
    2: 0, // Tue
    3: 0, // Wed
    4: 0, // Thu
    5: 0, // Fri
    6: 0, // Sat
    7: 0, // Sun
  };

  activities.forEach((act) => {
    totalMeters += act.distance_meters;
    totalSeconds += act.duration_seconds;
    totalCalories += act.calories;
    totalElevation += act.elevation_gain_meters;

    // Sport distribution
    if (act.sport_type === 'road_running') {
      sportDist.road_running += act.distance_meters;
    } else if (act.sport_type === 'trail_running') {
      sportDist.trail_running += act.distance_meters;
    } else if (act.sport_type === 'outdoor_cycling') {
      sportDist.outdoor_cycling += act.distance_meters;
    } else {
      sportDist.other += act.distance_meters;
    }

    // Assign to day of week based on started_at
    const date = new Date(act.started_at);
    // JavaScript getDay(): 0 is Sunday, 1 is Monday ... 6 is Saturday
    const jsDay = date.getDay();
    const dayIndex = jsDay === 0 ? 7 : jsDay; // Convert to 1=Mon, 7=Sun
    dayTotals[dayIndex] = (dayTotals[dayIndex] || 0) + act.distance_meters / 1000;
  });

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dailyDistance = dayNames.map((name, idx) => ({
    day: name,
    dayIndex: idx + 1,
    distance_km: parseFloat((dayTotals[idx + 1] || 0).toFixed(1)),
    target_km: idx === 5 ? 18 : idx === 1 ? 12 : idx === 2 ? 45 : 0, // Realistic benchmark target
  }));

  const completedSessions = sessions.filter((s) => s.is_completed).length;
  const totalPlanned = Math.max(sessions.length, 1);
  const consistencyScore = Math.min(100, Math.round((completedSessions / totalPlanned) * 100));

  return {
    total_distance_km: parseFloat((totalMeters / 1000).toFixed(1)),
    total_duration_seconds: totalSeconds,
    total_calories: totalCalories,
    total_elevation_meters: Math.round(totalElevation),
    distribution: sportDist,
    daily_distance: dailyDistance,
    consistency_score: consistencyScore,
    completed_sessions: completedSessions,
    total_planned_sessions: sessions.length,
  };
};
