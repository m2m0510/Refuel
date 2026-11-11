-- ====================================================================
-- REFUEL ATHLETIC PERFORMANCE APPLICATION: DATABASE SCHEMA & MIGRATION
-- Phase 1: Core Performance Tracking, Training Matrix & Biometrics
-- ====================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. USER PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null default '',
  date_of_birth date,
  height_cm numeric(5,1) default 180.0,
  weight_kg numeric(5,1) default 75.0,
  avatar_url text,
  fitness_goals text[] default array['Marathon Sub 3:15', 'VO2 Max > 55', 'FTP 280W'],
  preferred_sports text[] default array['road_running', 'trail_running', 'outdoor_cycling'],
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. ACTIVITIES (Runs, Rides, Workouts)
create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  sport_type text not null check (sport_type in ('road_running', 'trail_running', 'outdoor_cycling', 'strength_training', 'recovery')),
  distance_meters numeric(10,2) default 0 not null,
  duration_seconds integer not null default 0,
  moving_time_seconds integer not null default 0,
  elevation_gain_meters numeric(8,2) default 0 not null,
  calories integer default 0 not null,
  avg_heart_rate integer,
  max_heart_rate integer,
  avg_pace_seconds_per_km numeric(8,2),
  avg_speed_kmh numeric(6,2),
  polyline_overview text,
  notes text,
  started_at timestamptz not null default now(),
  created_at timestamptz default now() not null
);

-- 3. ACTIVITY GPS POINTS
create table if not exists public.activity_gps_points (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references public.activities(id) on delete cascade not null,
  latitude numeric(10,7) not null,
  longitude numeric(10,7) not null,
  altitude_meters numeric(8,2),
  heart_rate integer,
  cadence integer,
  recorded_at timestamptz not null default now()
);

-- 4. ACTIVITY SPLITS (Kilometer / Mile splits)
create table if not exists public.activity_splits (
  id uuid primary key default gen_random_uuid(),
  activity_id uuid references public.activities(id) on delete cascade not null,
  split_number integer not null,
  distance_meters numeric(10,2) not null,
  duration_seconds integer not null,
  elevation_difference_meters numeric(8,2) default 0,
  avg_heart_rate integer,
  created_at timestamptz default now() not null
);

-- 5. TRAINING PLANS (Weekly microcycles)
create table if not exists public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  goal text,
  week_start_date date not null,
  is_active boolean default true not null,
  created_at timestamptz default now() not null
);

-- 6. TRAINING SESSIONS (Weekly Day by Day Calendar)
create table if not exists public.training_sessions (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references public.training_plans(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade not null,
  day_of_week integer not null check (day_of_week between 1 and 7), -- 1=Monday, 7=Sunday
  session_date date not null,
  sport_type text not null check (sport_type in ('road_running', 'trail_running', 'outdoor_cycling', 'strength_training', 'recovery', 'rest_day')),
  title text not null,
  description text,
  target_distance_meters numeric(10,2) default 0,
  target_duration_seconds integer default 0,
  intensity_zone integer check (intensity_zone between 1 and 5) default 3,
  is_completed boolean default false not null,
  completed_activity_id uuid references public.activities(id) on delete set null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 7. HEALTH METRICS (Apple Health / Whoop / Garmin daily sync)
create table if not exists public.health_metrics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recorded_date date not null,
  vo2_max numeric(4,1),
  resting_heart_rate integer,
  hrv_ms integer,
  sleep_score integer,
  recovery_percentage integer check (recovery_percentage between 0 and 100),
  created_at timestamptz default now() not null,
  unique(user_id, recorded_date)
);

-- 8. CONNECTED APPS
create table if not exists public.connected_apps (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  provider text not null check (provider in ('apple_health', 'strava', 'garmin', 'whoop', 'wahoo')),
  is_connected boolean default false not null,
  last_sync_at timestamptz,
  created_at timestamptz default now() not null,
  unique(user_id, provider)
);

-- ====================================================================
-- INDEXES FOR FAST QUERYING
-- ====================================================================
create index if not exists idx_activities_user_started on public.activities (user_id, started_at desc);
create index if not exists idx_activities_sport on public.activities (sport_type);
create index if not exists idx_gps_points_activity on public.activity_gps_points (activity_id);
create index if not exists idx_splits_activity on public.activity_splits (activity_id, split_number);
create index if not exists idx_training_sessions_user_date on public.training_sessions (user_id, session_date);
create index if not exists idx_health_metrics_user_date on public.health_metrics (user_id, recorded_date desc);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
alter table public.profiles enable row level security;
alter table public.activities enable row level security;
alter table public.activity_gps_points enable row level security;
alter table public.activity_splits enable row level security;
alter table public.training_plans enable row level security;
alter table public.training_sessions enable row level security;
alter table public.health_metrics enable row level security;
alter table public.connected_apps enable row level security;

-- Profiles: Users can view and edit their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Activities: Users can manage only their own activities
create policy "Users can select own activities"
  on public.activities for select
  using (auth.uid() = user_id);

create policy "Users can insert own activities"
  on public.activities for insert
  with check (auth.uid() = user_id);

create policy "Users can update own activities"
  on public.activities for update
  using (auth.uid() = user_id);

create policy "Users can delete own activities"
  on public.activities for delete
  using (auth.uid() = user_id);

-- GPS Points: Accessible through activity ownership
create policy "Users can access gps points of own activities"
  on public.activity_gps_points for all
  using (exists (select 1 from public.activities where activities.id = activity_gps_points.activity_id and activities.user_id = auth.uid()));

-- Activity Splits: Accessible through activity ownership
create policy "Users can access splits of own activities"
  on public.activity_splits for all
  using (exists (select 1 from public.activities where activities.id = activity_splits.activity_id and activities.user_id = auth.uid()));

-- Training Plans & Sessions
create policy "Users can manage own training plans"
  on public.training_plans for all
  using (auth.uid() = user_id);

create policy "Users can manage own training sessions"
  on public.training_sessions for all
  using (auth.uid() = user_id);

-- Health Metrics
create policy "Users can manage own health metrics"
  on public.health_metrics for all
  using (auth.uid() = user_id);

-- Connected Apps
create policy "Users can manage own connected apps"
  on public.connected_apps for all
  using (auth.uid() = user_id);

-- ====================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON AUTH SIGNUP
-- ====================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, date_of_birth, height_cm, weight_kg)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'REFUEL Athlete'),
    '1996-05-18'::date,
    182.0,
    74.5
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
