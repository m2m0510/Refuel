# REFUEL — Athletic Performance & Telemetry Mobile Application

REFUEL is a premium athletic technology mobile application inspired by Strava and Apple Health, built for high-performance endurance athletes.

---

## 1. Technology Architecture

- **UI / Core Framework**: React Native & Expo architecture with modern responsive container for preview and direct mobile execution.
- **Styling & Theme**: Dark Mode throughout.
  - Background: `#050505`
  - Secondary Background: `#101010`
  - Card Background: `#1A1A1A`
  - Kinetic Accent: `#C6FF00` (Electric Lime)
  - Primary Text: `#FFFFFF`
  - Muted Text: `#8A8A8A`
  - Hairline Border: `#292929`
- **Database & Authentication**: Supabase (PostgreSQL with Row Level Security policies) + local persistent fallback store.
- **State Management**: Reactive Zustand/React store with offline persistence and automatic statistic derivations.
- **Charts & Telemetry**: Custom SVG charts for weekly distance vs targets, monthly volume, resting & peak heart rate curves, and consistency score matrices.

---

## 2. Completed Phase 1 Core Screens

1. **Splash Screen**: Kinetic typography REFUEL mark with aerodynamic blades and animated launch sequence.
2. **Onboarding**: 3-step carousel covering Strava-grade GPS, Adaptive Training Matrix, and Apple Health biometrics.
3. **Login Screen**: Secure credential authentication + one-click instant Demo Athlete bypass.
4. **Register Screen**: New athlete registration with preferred discipline selection (Road, Trail, Cycling).
5. **Forgot Password Screen**: Passcode recovery transmission flow.
6. **Home Dashboard**:
   - Header with athletic logo, profile photo, greeting, and notification alerts.
   - Weekly statistics: Distance, Moving Time, Calories, Elevation Gain.
   - 4 Performance Cards: VO2 Max (ml/kg/min), Resting HR, Weekly Training Progress, Recovery Status.
   - Discipline Distribution bar (Road Running, Trail Running, Outdoor Cycling).
   - SVG Charts: Weekly Distance vs Target, Monthly Mileage, 7-day Heart Rate trend, and Consistency Matrix.
   - Weekly training schedule (Monday–Sunday).
   - Recent Activities feed with telemetry summary cards.
   - Prominent `#C6FF00` lime RECORD button.
7. **User Profile**: Full athlete vitals, date of birth with auto-calculated age, height, weight, BMI, goals, preferred sports, and lifetime cumulative totals.
8. **Edit Profile Modal**: Instant bio recalculation, goal add/remove, and photo customization.
9. **Activity History**: Category filters (Road, Trail, Cycling, All) + Date filters (7 days, 30 days, All time) with deep summary cards.
10. **Weekly Training Planner**: Monday-to-Sunday interactive calendar, planned vs completed volume progress, and quick completion checkboxes.
11. **Training Detail Modal**: Physiological intensity zone guidance (Zones 1–5), target pacing, workout instructions, and completion toggles.
12. **Settings**:
    - Supabase project connection manager (URL & Anon Key test connection).
    - One-click copy for the full PostgreSQL SQL migration.
    - Expo / Native instructions for iOS & Android.
    - Connected Apps management (Apple Health, Strava, Garmin).
13. **Live GPS Recorder**:
    - Dual-band GPS simulator.
    - Live timer, distance accumulation, real-time pace calculator, simulated heart rate, and elevation.
    - Tactical SVG route drawing.
    - Pause / Resume and "Finish & Save" which persists the activity to the database and recalculates weekly totals.
14. **Explore**: Segment records (KOMs), PR comparisons, and Community challenges.

---

## 3. Supabase SQL Migration

The complete PostgreSQL migration script is located in:
```
/supabase/migrations/20261111_refuel_core.sql
```

It creates the following tables with UUIDs, indexes, constraints, and Row Level Security:
- `profiles`
- `activities`
- `activity_gps_points`
- `activity_splits`
- `training_plans`
- `training_sessions`
- `health_metrics`
- `connected_apps`
- `handle_new_user()` trigger for automated profile generation on signup.

You can copy and execute this file directly in the **Supabase Dashboard -> SQL Editor**.

---

## 4. Environment Variables (.env)

Create a `.env` file with your credentials:
```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

---

## 5. Instructions for Running on iOS and Android with Expo

### Prerequisites
- Node.js 18+ installed
- For iOS: macOS with Xcode installed and CocoaPods
- For Android: Android Studio with Android SDK and Emulator configured

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Run on Web Preview Container
npm run dev

# 3. Start Expo development server
npx expo start

# 4. Run on iOS Simulator (macOS)
npx expo run:ios

# 5. Run on Android Emulator or connected physical device
npx expo run:android

# 6. Run via Expo Go on physical device
# Scan the QR code shown in terminal using the Expo Go mobile app (iOS Camera or Android Expo Go)
```
