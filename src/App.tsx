/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { DeviceFrame } from './components/common/DeviceFrame';
import { BottomTabBar } from './components/navigation/BottomTabBar';

// Screens
import { SplashScreen } from './screens/SplashScreen';
import { OnboardingScreen } from './screens/OnboardingScreen';
import { LoginScreen } from './screens/LoginScreen';
import { RegisterScreen } from './screens/RegisterScreen';
import { ForgotPasswordScreen } from './screens/ForgotPasswordScreen';
import { HomeScreen } from './screens/HomeScreen';
import { ActivityHistoryScreen } from './screens/ActivityHistoryScreen';
import { TrainingPlannerScreen } from './screens/TrainingPlannerScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { LiveRecordScreen } from './screens/LiveRecordScreen';
import { ExploreScreen } from './screens/ExploreScreen';
import { SettingsScreen } from './screens/SettingsScreen';

// Modals
import { RecordSelectModal } from './components/modals/RecordSelectModal';
import { EditProfileModal } from './components/modals/EditProfileModal';
import { ActivityDetailModal } from './components/modals/ActivityDetailModal';
import { TrainingDetailModal } from './components/modals/TrainingDetailModal';
import { AddSessionModal } from './components/modals/AddSessionModal';
import { NotificationsModal } from './components/modals/NotificationsModal';

const AppNavigator: React.FC = () => {
  const {
    currentScreen,
    activeTab,
    isLiveRecording,
    isSettingsOpen,
    setIsSettingsOpen,
    activeSubscreen,
    setActiveSubscreen,
  } = useApp();

  // If live recording workout is active, it takes over the device screen
  if (isLiveRecording) {
    return (
      <DeviceFrame>
        <LiveRecordScreen />
      </DeviceFrame>
    );
  }

  // Auth & Onboarding Flow Screens
  if (currentScreen === 'splash') {
    return (
      <DeviceFrame>
        <SplashScreen />
      </DeviceFrame>
    );
  }

  if (currentScreen === 'onboarding') {
    return (
      <DeviceFrame>
        <OnboardingScreen />
      </DeviceFrame>
    );
  }

  if (currentScreen === 'login') {
    return (
      <DeviceFrame>
        <LoginScreen />
      </DeviceFrame>
    );
  }

  if (currentScreen === 'register') {
    return (
      <DeviceFrame>
        <RegisterScreen />
      </DeviceFrame>
    );
  }

  if (currentScreen === 'forgot_password') {
    return (
      <DeviceFrame>
        <ForgotPasswordScreen />
      </DeviceFrame>
    );
  }

  // Settings Overlay View
  if (isSettingsOpen) {
    return (
      <DeviceFrame>
        <div className="flex-1 flex flex-col">
          <div className="p-3 border-b border-[#292929] flex items-center justify-between">
            <button
              onClick={() => setIsSettingsOpen(false)}
              className="text-xs font-semibold text-[#C6FF00] hover:underline"
            >
              ← Back to App
            </button>
          </div>
          <SettingsScreen />
        </div>
      </DeviceFrame>
    );
  }

  // Main 5-Tab Navigation Shell
  return (
    <DeviceFrame>
      <div className="flex-1 flex flex-col h-full relative">
        <main className="flex-1 flex flex-col overflow-y-auto">
          {activeSubscreen === 'history' ? (
            <div className="flex-1 flex flex-col">
              <div className="p-3 border-b border-[#292929] flex items-center justify-between bg-[#101010]">
                <button
                  onClick={() => setActiveSubscreen(null)}
                  className="text-xs font-semibold text-[#C6FF00] hover:underline flex items-center gap-1"
                >
                  <span>← Back to Dashboard</span>
                </button>
                <span className="text-xs font-mono text-[#8A8A8A]">Telemetry Log</span>
              </div>
              <ActivityHistoryScreen />
            </div>
          ) : (
            <>
              {activeTab === 'home' && <HomeScreen />}
              {activeTab === 'explore' && <ExploreScreen />}
              {activeTab === 'training' && <TrainingPlannerScreen />}
              {activeTab === 'profile' && <ProfileScreen />}
            </>
          )}
        </main>

        {/* 5-Tab Bottom Bar (Home | Explore | Record [Lime] | Training | Profile) */}
        <BottomTabBar />

        {/* Global Modals & Sheets */}
        <RecordSelectModal />
        <EditProfileModal />
        <ActivityDetailModal />
        <TrainingDetailModal />
        <AddSessionModal />
        <NotificationsModal />
      </div>
    </DeviceFrame>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppNavigator />
    </AppProvider>
  );
}
