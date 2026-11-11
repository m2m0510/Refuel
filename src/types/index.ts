/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SportType = 
  | 'road_running' 
  | 'trail_running' 
  | 'outdoor_cycling' 
  | 'strength_training' 
  | 'recovery' 
  | 'rest_day';

export type NavTab = 'home' | 'explore' | 'record' | 'training' | 'profile';

export type ScreenType = 
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'forgot_password'
  | 'main'; // Contains tabs: home, explore, training, profile

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  date_of_birth: string; // YYYY-MM-DD
  height_cm: number;
  weight_kg: number;
  avatar_url?: string;
  fitness_goals: string[];
  preferred_sports: SportType[];
  created_at: string;
  updated_at: string;
}

export interface ActivitySplit {
  id: string;
  activity_id: string;
  split_number: number;
  distance_meters: number;
  duration_seconds: number;
  elevation_difference_meters: number;
  avg_heart_rate: number;
}

export interface ActivityGpsPoint {
  latitude: number;
  longitude: number;
  altitude_meters: number;
  heart_rate?: number;
  recorded_at: string;
}

export interface Activity {
  id: string;
  user_id: string;
  title: string;
  sport_type: SportType;
  distance_meters: number;
  duration_seconds: number;
  moving_time_seconds: number;
  elevation_gain_meters: number;
  calories: number;
  avg_heart_rate: number;
  max_heart_rate: number;
  avg_pace_seconds_per_km: number;
  avg_speed_kmh: number;
  polyline_overview?: string; // Encoded or SVG coordinates
  notes?: string;
  started_at: string;
  splits?: ActivitySplit[];
  gps_points?: ActivityGpsPoint[];
}

export interface TrainingSession {
  id: string;
  plan_id?: string;
  user_id: string;
  day_of_week: number; // 1 = Mon, 7 = Sun
  session_date: string; // YYYY-MM-DD
  sport_type: SportType;
  title: string;
  description?: string;
  target_distance_meters: number;
  target_duration_seconds: number;
  intensity_zone: 1 | 2 | 3 | 4 | 5;
  is_completed: boolean;
  completed_activity_id?: string;
  created_at?: string;
}

export interface HealthMetrics {
  id: string;
  user_id: string;
  recorded_date: string;
  vo2_max: number;
  resting_heart_rate: number;
  hrv_ms: number;
  sleep_score: number;
  recovery_percentage: number;
}

export interface WeeklyStats {
  total_distance_km: number;
  total_duration_seconds: number;
  total_calories: number;
  total_elevation_meters: number;
  distribution: {
    road_running: number;
    trail_running: number;
    outdoor_cycling: number;
    other: number;
  };
  daily_distance: {
    day: string; // 'Mon', 'Tue', etc.
    dayIndex: number; // 1-7
    distance_km: number;
    target_km: number;
  }[];
  consistency_score: number; // 0-100%
  completed_sessions: number;
  total_planned_sessions: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'achievement' | 'training' | 'recovery' | 'system';
}
