/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCheck, Bell, Award, Zap, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotificationsModal: React.FC = () => {
  const { isNotificationsOpen, setIsNotificationsOpen, notifications, markNotificationsAsRead } = useApp();

  if (!isNotificationsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 select-none">
      <div className="bg-[#101010] border border-[#292929] w-full max-w-lg rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#292929] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-[#C6FF00]" />
            <h3 className="font-athletic text-xl font-bold uppercase text-white">
              Athlete Notifications
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markNotificationsAsRead}
              className="text-xs text-[#8A8A8A] hover:text-[#C6FF00] flex items-center gap-1 font-semibold"
            >
              <CheckCheck size={14} />
              <span>Mark Read</span>
            </button>
            <button
              onClick={() => setIsNotificationsOpen(false)}
              className="w-8 h-8 rounded-full bg-[#1A1A1A] hover:bg-[#222] flex items-center justify-center text-[#8A8A8A] hover:text-white"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="p-4 space-y-2.5 overflow-y-auto">
          {notifications.map((item) => (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                item.read
                  ? 'bg-[#141414] border-[#242424] opacity-80'
                  : 'bg-[#1A1A1A] border-[#333] shadow-sm'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#C6FF00]" />
                  <h4 className="text-xs font-bold text-white">{item.title}</h4>
                </div>
                <span className="text-[10px] font-mono text-[#8A8A8A] whitespace-nowrap">
                  {item.timestamp}
                </span>
              </div>
              <p className="text-xs text-[#8A8A8A] mt-1.5 leading-relaxed pl-4">
                {item.message}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
