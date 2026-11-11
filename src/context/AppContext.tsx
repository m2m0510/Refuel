/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Activity,
  HealthMetrics,
  NavTab,
  NotificationItem,
  ScreenType,
  SportType,
  TrainingSession,
  UserProfile,
  WeeklyStats,
} from '../types';
import {
  INITIAL_ACTIVITIES,
  INITIAL_HEALTH_METRICS,
  INITIAL_NOTIFICATIONS,
  INITIAL_PROFILE,
  INITIAL_TRAINING_SESSIONS,
} from '../lib/mockData';
import { calculateWeeklyStats } from '../lib/formatters';
import { getSupabaseClient, testSupabaseConnection } from '../lib/supabase';

interface AppContextType {
  // Screen & Navigation
  currentScreen: ScreenType;
  setCurrentScreen: (screen: ScreenType) => void;
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  // Viewport mode (Mobile Device Frame vs Responsive Fullscreen)
  viewMode: 'device' | 'fullscreen';
  setViewMode: (mode: 'device' | 'fullscreen') => void;

  // Modals & Overlays
  isRecordSelectOpen: boolean;
  setIsRecordSelectOpen: (open: boolean) => void;
  isLiveRecording: boolean;
  setIsLiveRecording: (recording: boolean) => void;
  liveSport: SportType;
  setLiveSport: (sport: SportType) => void;
  selectedActivity: Activity | null;
  setSelectedActivity: (activity: Activity | null) => void;
  selectedSession: TrainingSession | null;
  setSelectedSession: (session: TrainingSession | null) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  isNotificationsOpen: boolean;
  setIsNotificationsOpen: (open: boolean) => void;
  isAddSessionOpen: boolean;
  setIsAddSessionOpen: (open: boolean) => void;

  // Subscreens
  activeSubscreen: 'history' | null;
  setActiveSubscreen: (subscreen: 'history' | null) => void;

  // Athlete Data
  isAuthenticated: boolean;
  profile: UserProfile;
  activities: Activity[];
  trainingSessions: TrainingSession[];
  healthMetrics: HealthMetrics;
  notifications: NotificationItem[];
  weeklyStats: WeeklyStats;

  // Database Connection Status
  isSupabaseConnected: boolean;
  supabaseMessage: string;
  checkConnection: () => Promise<void>;

  // Data Actions
  login: (email: string) => Promise<boolean>;
  logout: () => void;
  registerAthlete: (name: string, email: string) => Promise<boolean>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
  saveActivity: (activity: Omit<Activity, 'id' | 'user_id'>) => Promise<Activity>;
  deleteActivity: (id: string) => Promise<void>;
  createTrainingSession: (session: Omit<TrainingSession, 'id' | 'user_id'>) => Promise<void>;
  updateTrainingSession: (session: TrainingSession) => Promise<void>;
  deleteTrainingSession: (id: string) => Promise<void>;
  toggleTrainingCompleted: (id: string) => Promise<void>;
  markNotificationsAsRead: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_ACTIVITIES = 'refuel_app_activities';
const LOCAL_STORAGE_KEY_PROFILE = 'refuel_app_profile';
const LOCAL_STORAGE_KEY_SESSIONS = 'refuel_app_sessions';
const LOCAL_STORAGE_KEY_METRICS = 'refuel_app_metrics';
const LOCAL_STORAGE_KEY_AUTH = 'refuel_app_auth';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Navigation State
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('splash');
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [viewMode, setViewMode] = useState<'device' | 'fullscreen'>('device');

  // Modals & Overlays
  const [isRecordSelectOpen, setIsRecordSelectOpen] = useState(false);
  const [isLiveRecording, setIsLiveRecording] = useState(false);
  const [liveSport, setLiveSport] = useState<SportType>('road_running');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [selectedSession, setSelectedSession] = useState<TrainingSession | null>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isAddSessionOpen, setIsAddSessionOpen] = useState(false);
  const [activeSubscreen, setActiveSubscreen] = useState<'history' | null>(null);

  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(LOCAL_STORAGE_KEY_AUTH) === 'true';
  });

  // Data Store Initializers (Load from localStorage if available, else seed records)
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_PROFILE;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_ACTIVITIES);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_ACTIVITIES;
  });

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SESSIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_TRAINING_SESSIONS;
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY_METRICS);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return INITIAL_HEALTH_METRICS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(false);
  const [supabaseMessage, setSupabaseMessage] = useState<string>('Initializing database connection...');

  // Auto-derived weekly statistics from actual activity records
  const weeklyStats = useMemo(() => {
    return calculateWeeklyStats(activities, trainingSessions);
  }, [activities, trainingSessions]);

  // Synchronize to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_ACTIVITIES, JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_SESSIONS, JSON.stringify(trainingSessions));
  }, [trainingSessions]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_METRICS, JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY_AUTH, String(isAuthenticated));
  }, [isAuthenticated]);

  // Check Supabase connection on mount
  const checkConnection = async () => {
    const { isConfigured, client } = getSupabaseClient();
    if (!isConfigured || !client) {
      setIsSupabaseConnected(false);
      setSupabaseMessage('Running in High-Performance Local Mode. Connect to Supabase anytime in Settings.');
      return;
    }

    try {
      const res = await testSupabaseConnection();
      setIsSupabaseConnected(res.success);
      setSupabaseMessage(res.message);
    } catch {
      setIsSupabaseConnected(false);
      setSupabaseMessage('Offline / local database fallback active.');
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  // Auth Handlers
  const login = async (email: string): Promise<boolean> => {
    setIsAuthenticated(true);
    setProfile(prev => ({
      ...prev,
      email: email || prev.email,
    }));
    setCurrentScreen('main');
    return true;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentScreen('login');
  };

  const registerAthlete = async (name: string, email: string): Promise<boolean> => {
    const newProfile: UserProfile = {
      ...INITIAL_PROFILE,
      id: `usr_${Date.now()}`,
      full_name: name,
      email: email,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProfile(newProfile);
    setIsAuthenticated(true);
    setCurrentScreen('main');
    return true;
  };

  const updateProfile = async (updated: Partial<UserProfile>): Promise<void> => {
    const newProfile = {
      ...profile,
      ...updated,
      updated_at: new Date().toISOString(),
    };
    setProfile(newProfile);

    // If Supabase is connected, sync profile to Supabase
    const { isConfigured, client } = getSupabaseClient();
    if (isConfigured && client) {
      try {
        await client.from('profiles').upsert({
          id: newProfile.id,
          full_name: newProfile.full_name,
          date_of_birth: newProfile.date_of_birth,
          height_cm: newProfile.height_cm,
          weight_kg: newProfile.weight_kg,
          avatar_url: newProfile.avatar_url,
          fitness_goals: newProfile.fitness_goals,
          preferred_sports: newProfile.preferred_sports,
          updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Supabase sync skipped, stored locally:', err);
      }
    }
  };

  // Activity Handlers
  const saveActivity = async (activityData: Omit<Activity, 'id' | 'user_id'>): Promise<Activity> => {
    const newActivity: Activity = {
      ...activityData,
      id: `act_${Date.now()}`,
      user_id: profile.id,
    };

    setActivities(prev => [newActivity, ...prev]);

    // Check if there was a training session scheduled for today matching the sport, mark it completed!
    const todayStr = '2026-11-11';
    setTrainingSessions(prev => prev.map(s => {
      if (s.session_date === todayStr && s.sport_type === newActivity.sport_type && !s.is_completed) {
        return {
          ...s,
          is_completed: true,
          completed_activity_id: newActivity.id,
        };
      }
      return s;
    }));

    // If Supabase is connected, persist to activities table
    const { isConfigured, client } = getSupabaseClient();
    if (isConfigured && client) {
      try {
        await client.from('activities').insert({
          id: newActivity.id,
          user_id: newActivity.user_id,
          title: newActivity.title,
          sport_type: newActivity.sport_type,
          distance_meters: newActivity.distance_meters,
          duration_seconds: newActivity.duration_seconds,
          moving_time_seconds: newActivity.moving_time_seconds,
          elevation_gain_meters: newActivity.elevation_gain_meters,
          calories: newActivity.calories,
          avg_heart_rate: newActivity.avg_heart_rate,
          max_heart_rate: newActivity.max_heart_rate,
          avg_pace_seconds_per_km: newActivity.avg_pace_seconds_per_km,
          avg_speed_kmh: newActivity.avg_speed_kmh,
          notes: newActivity.notes,
          started_at: newActivity.started_at,
        });
      } catch (err) {
        console.warn('Supabase insert skipped, stored locally:', err);
      }
    }

    return newActivity;
  };

  const deleteActivity = async (id: string): Promise<void> => {
    setActivities(prev => prev.filter(a => a.id !== id));
    if (selectedActivity?.id === id) {
      setSelectedActivity(null);
    }
  };

  // Training Session Handlers
  const createTrainingSession = async (sessionData: Omit<TrainingSession, 'id' | 'user_id'>): Promise<void> => {
    const newSession: TrainingSession = {
      ...sessionData,
      id: `ts_${Date.now()}`,
      user_id: profile.id,
      created_at: new Date().toISOString(),
    };
    setTrainingSessions(prev => [...prev, newSession]);
  };

  const updateTrainingSession = async (updated: TrainingSession): Promise<void> => {
    setTrainingSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    if (selectedSession?.id === updated.id) {
      setSelectedSession(updated);
    }
  };

  const deleteTrainingSession = async (id: string): Promise<void> => {
    setTrainingSessions(prev => prev.filter(s => s.id !== id));
    if (selectedSession?.id === id) {
      setSelectedSession(null);
    }
  };

  const toggleTrainingCompleted = async (id: string): Promise<void> => {
    setTrainingSessions(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.is_completed;
        const updated = { ...s, is_completed: nextState };
        if (selectedSession?.id === id) {
          setSelectedSession(updated);
        }
        return updated;
      }
      return s;
    }));
  };

  const markNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetAllData = () => {
    setProfile(INITIAL_PROFILE);
    setActivities(INITIAL_ACTIVITIES);
    setTrainingSessions(INITIAL_TRAINING_SESSIONS);
    setHealthMetrics(INITIAL_HEALTH_METRICS);
    setNotifications(INITIAL_NOTIFICATIONS);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        activeTab,
        setActiveTab,
        viewMode,
        setViewMode,
        isRecordSelectOpen,
        setIsRecordSelectOpen,
        isLiveRecording,
        setIsLiveRecording,
        liveSport,
        setLiveSport,
        selectedActivity,
        setSelectedActivity,
        selectedSession,
        setSelectedSession,
        isEditProfileOpen,
        setIsEditProfileOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        isNotificationsOpen,
        setIsNotificationsOpen,
        isAddSessionOpen,
        setIsAddSessionOpen,
        activeSubscreen,
        setActiveSubscreen,
        isAuthenticated,
        profile,
        activities,
        trainingSessions,
        healthMetrics,
        notifications,
        weeklyStats,
        isSupabaseConnected,
        supabaseMessage,
        checkConnection,
        login,
        logout,
        registerAthlete,
        updateProfile,
        saveActivity,
        deleteActivity,
        createTrainingSession,
        updateTrainingSession,
        deleteTrainingSession,
        toggleTrainingCompleted,
        markNotificationsAsRead,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
