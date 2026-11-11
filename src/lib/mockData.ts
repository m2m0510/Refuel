/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Activity, HealthMetrics, NotificationItem, TrainingSession, UserProfile } from '../types';

export const INITIAL_PROFILE: UserProfile = {
  id: 'usr_refuel_001',
  email: 'alex.rivera@refuel.app',
  full_name: 'Alex Rivera',
  date_of_birth: '1996-05-18',
  height_cm: 182,
  weight_kg: 74.5,
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  fitness_goals: [
    'Sub 3:15 Marathon',
    'Threshold Power 285W',
    'VO2 Max > 56',
    'Weekly Mileage 60km'
  ],
  preferred_sports: ['road_running', 'trail_running', 'outdoor_cycling'],
  created_at: '2026-01-10T08:00:00Z',
  updated_at: '2026-11-10T14:30:00Z',
};

export const INITIAL_HEALTH_METRICS: HealthMetrics = {
  id: 'hm_refuel_001',
  user_id: 'usr_refuel_001',
  recorded_date: '2026-11-11',
  vo2_max: 54.8,
  resting_heart_rate: 48,
  hrv_ms: 72,
  sleep_score: 91,
  recovery_percentage: 88,
};

// Generates activities for the current week and recent days
export const INITIAL_ACTIVITIES: Activity[] = [
  {
    id: 'act_001',
    user_id: 'usr_refuel_001',
    title: 'Sunrise Tempo Interval Run',
    sport_type: 'road_running',
    distance_meters: 12400,
    duration_seconds: 3420, // 57m 00s
    moving_time_seconds: 3390,
    elevation_gain_meters: 145,
    calories: 890,
    avg_heart_rate: 158,
    max_heart_rate: 178,
    avg_pace_seconds_per_km: 275, // 4:35 /km
    avg_speed_kmh: 13.05,
    started_at: '2026-11-10T06:45:00Z',
    notes: 'Zone 4 threshold intervals with 90s float recovery. Felt strong throughout, legs snappy.',
    splits: [
      { id: 'sp_1', activity_id: 'act_001', split_number: 1, distance_meters: 1000, duration_seconds: 290, elevation_difference_meters: 10, avg_heart_rate: 142 },
      { id: 'sp_2', activity_id: 'act_001', split_number: 2, distance_meters: 1000, duration_seconds: 280, elevation_difference_meters: 5, avg_heart_rate: 150 },
      { id: 'sp_3', activity_id: 'act_001', split_number: 3, distance_meters: 1000, duration_seconds: 265, elevation_difference_meters: -8, avg_heart_rate: 159 },
      { id: 'sp_4', activity_id: 'act_001', split_number: 4, distance_meters: 1000, duration_seconds: 260, elevation_difference_meters: 12, avg_heart_rate: 165 },
      { id: 'sp_5', activity_id: 'act_001', split_number: 5, distance_meters: 1000, duration_seconds: 270, elevation_difference_meters: -5, avg_heart_rate: 162 },
    ]
  },
  {
    id: 'act_002',
    user_id: 'usr_refuel_001',
    title: 'Marin Headlands Coastal Trail Climb',
    sport_type: 'trail_running',
    distance_meters: 16200,
    duration_seconds: 5280, // 1h 28m
    moving_time_seconds: 5120,
    elevation_gain_meters: 420,
    calories: 1240,
    avg_heart_rate: 152,
    max_heart_rate: 174,
    avg_pace_seconds_per_km: 325, // 5:25 /km
    avg_speed_kmh: 11.05,
    started_at: '2026-11-08T08:15:00Z',
    notes: 'Technical singletrack descent. Great grip on damp terrain. High aerobic efficiency.',
    splits: [
      { id: 'sp_1', activity_id: 'act_002', split_number: 1, distance_meters: 1000, duration_seconds: 330, elevation_difference_meters: 45, avg_heart_rate: 154 },
      { id: 'sp_2', activity_id: 'act_002', split_number: 2, distance_meters: 1000, duration_seconds: 340, elevation_difference_meters: 50, avg_heart_rate: 160 },
      { id: 'sp_3', activity_id: 'act_002', split_number: 3, distance_meters: 1000, duration_seconds: 310, elevation_difference_meters: -30, avg_heart_rate: 148 },
    ]
  },
  {
    id: 'act_003',
    user_id: 'usr_refuel_001',
    title: 'Paradise Loop Endurance Cadence Ride',
    sport_type: 'outdoor_cycling',
    distance_meters: 48600,
    duration_seconds: 5760, // 1h 36m
    moving_time_seconds: 5640,
    elevation_gain_meters: 580,
    calories: 1420,
    avg_heart_rate: 144,
    max_heart_rate: 168,
    avg_pace_seconds_per_km: 118, // cycling pace
    avg_speed_kmh: 30.38,
    started_at: '2026-11-06T09:00:00Z',
    notes: 'Steady Zone 2 baseline endurance ride. 92 RPM cadence average. Zero mechanicals.',
  },
  {
    id: 'act_004',
    user_id: 'usr_refuel_001',
    title: 'Easy Recovery Shakeout & Strides',
    sport_type: 'road_running',
    distance_meters: 6200,
    duration_seconds: 1860, // 31m
    moving_time_seconds: 1840,
    elevation_gain_meters: 45,
    calories: 410,
    avg_heart_rate: 132,
    max_heart_rate: 146,
    avg_pace_seconds_per_km: 300, // 5:00 /km
    avg_speed_kmh: 12.0,
    started_at: '2026-11-04T17:30:00Z',
    notes: 'Zone 1 active flush. 4x100m smooth accelerations at the tail end.',
  },
  {
    id: 'act_005',
    user_id: 'usr_refuel_001',
    title: 'High-Altitude Peak Ridge Traversal',
    sport_type: 'trail_running',
    distance_meters: 21000,
    duration_seconds: 7380, // 2h 03m
    moving_time_seconds: 7200,
    elevation_gain_meters: 790,
    calories: 1680,
    avg_heart_rate: 156,
    max_heart_rate: 182,
    avg_pace_seconds_per_km: 351, // 5:51 /km
    avg_speed_kmh: 10.24,
    started_at: '2026-11-01T07:15:00Z',
    notes: 'Challenging technical terrain with 790m elevation. Superb mountain views and hydration pacing.',
  }
];

export const INITIAL_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: 'ts_01',
    user_id: 'usr_refuel_001',
    day_of_week: 1, // Monday
    session_date: '2026-11-09',
    sport_type: 'recovery',
    title: 'Mobility & Active Foam Rolling',
    description: '30 min hip opener flow, soft tissue release, and ankle dorsiflexion.',
    target_distance_meters: 0,
    target_duration_seconds: 1800,
    intensity_zone: 1,
    is_completed: true,
  },
  {
    id: 'ts_02',
    user_id: 'usr_refuel_001',
    day_of_week: 2, // Tuesday
    session_date: '2026-11-10',
    sport_type: 'road_running',
    title: 'Threshold Intervals (5x1km @ 3:55)',
    description: '12km total with 5x1000m progressive threshold surges. 90s active jog between.',
    target_distance_meters: 12000,
    target_duration_seconds: 3600,
    intensity_zone: 4,
    is_completed: true,
    completed_activity_id: 'act_001',
  },
  {
    id: 'ts_03',
    user_id: 'usr_refuel_001',
    day_of_week: 3, // Wednesday
    session_date: '2026-11-11',
    sport_type: 'outdoor_cycling',
    title: 'Aerobic Power Build (Z2 Base)',
    description: '45km rolling hill circuit maintaining 85-90 RPM and 210-230W.',
    target_distance_meters: 45000,
    target_duration_seconds: 5400,
    intensity_zone: 2,
    is_completed: false,
  },
  {
    id: 'ts_04',
    user_id: 'usr_refuel_001',
    day_of_week: 4, // Thursday
    session_date: '2026-11-12',
    sport_type: 'strength_training',
    title: 'Posterior Chain & Core Stability',
    description: 'Trap bar deadlifts, single-leg Bulgarian splits, pallof presses, and calf raises.',
    target_distance_meters: 0,
    target_duration_seconds: 3000,
    intensity_zone: 3,
    is_completed: false,
  },
  {
    id: 'ts_05',
    user_id: 'usr_refuel_001',
    day_of_week: 5, // Friday
    session_date: '2026-11-13',
    sport_type: 'rest_day',
    title: 'Full Rest & Cellular Recovery',
    description: 'Zero impact training day. Prioritize 8.5+ hours sleep and 3L electrolyte hydration.',
    target_distance_meters: 0,
    target_duration_seconds: 0,
    intensity_zone: 1,
    is_completed: false,
  },
  {
    id: 'ts_06',
    user_id: 'usr_refuel_001',
    day_of_week: 6, // Saturday
    session_date: '2026-11-14',
    sport_type: 'trail_running',
    title: 'Mountain Skyline Long Run',
    description: '18km sustained trail aerobic volume with 500m vert ascent.',
    target_distance_meters: 18000,
    target_duration_seconds: 6600,
    intensity_zone: 3,
    is_completed: false,
  },
  {
    id: 'ts_07',
    user_id: 'usr_refuel_001',
    day_of_week: 7, // Sunday
    session_date: '2026-11-15',
    sport_type: 'recovery',
    title: 'Low Resistance Spin / Flush',
    description: 'Light 45 min cadence pedal to promote lymphatic drainage.',
    target_distance_meters: 15000,
    target_duration_seconds: 2700,
    intensity_zone: 1,
    is_completed: false,
  },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'Peak Recovery State',
    message: 'HRV baseline +14% above 30-day average. You are primed for high-intensity training.',
    timestamp: '2h ago',
    read: false,
    type: 'recovery',
  },
  {
    id: 'notif_2',
    title: 'New 10K Segment PR',
    message: 'Congratulations! You set a personal record of 41:22 on Sunrise Tempo Interval Run.',
    timestamp: 'Yesterday',
    read: false,
    type: 'achievement',
  },
  {
    id: 'notif_3',
    title: 'Weekly Mileage Goal: 62% Achieved',
    message: 'You have logged 37.2km of your 60km weekly target. 2 workouts remaining.',
    timestamp: '2d ago',
    read: true,
    type: 'training',
  },
];
