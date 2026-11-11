/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Check, Plus, Trash2, Camera, Ruler, Weight, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateAge, getSportLabel } from '../../lib/formatters';
import { SportType } from '../../types';

export const EditProfileModal: React.FC = () => {
  const { profile, updateProfile, isEditProfileOpen, setIsEditProfileOpen } = useApp();

  const [fullName, setFullName] = useState(profile.full_name);
  const [dateOfBirth, setDateOfBirth] = useState(profile.date_of_birth);
  const [heightCm, setHeightCm] = useState(profile.height_cm);
  const [weightKg, setWeightKg] = useState(profile.weight_kg);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
  const [goals, setGoals] = useState<string[]>(profile.fitness_goals);
  const [newGoal, setNewGoal] = useState('');
  const [preferredSports, setPreferredSports] = useState<SportType[]>(profile.preferred_sports);
  const [isSaving, setIsSaving] = useState(false);

  if (!isEditProfileOpen) return null;

  const currentAge = calculateAge(dateOfBirth);

  const toggleSport = (sport: SportType) => {
    if (preferredSports.includes(sport)) {
      if (preferredSports.length > 1) {
        setPreferredSports(preferredSports.filter((s) => s !== sport));
      }
    } else {
      setPreferredSports([...preferredSports, sport]);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, newGoal.trim()]);
      setNewGoal('');
    }
  };

  const handleRemoveGoal = (index: number) => {
    setGoals(goals.filter((_, i) => i !== index));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        date_of_birth: dateOfBirth,
        height_cm: Number(heightCm),
        weight_kg: Number(weightKg),
        avatar_url: avatarUrl,
        fitness_goals: goals,
        preferred_sports: preferredSports,
      });
      setIsEditProfileOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-[#101010] border border-[#292929] w-full max-w-lg max-h-[90vh] rounded-t-3xl sm:rounded-3xl flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#292929] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#8A8A8A]">
              Profile Configuration
            </span>
            <h3 className="font-athletic text-xl font-bold uppercase text-white">
              Edit Athlete Vitals
            </h3>
          </div>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="w-9 h-9 rounded-full bg-[#1A1A1A] hover:bg-[#222] flex items-center justify-center text-[#8A8A8A] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8A8A8A]">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl px-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]"
            />
          </div>

          {/* Date of Birth & Live Calculated Age */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-mono uppercase text-[#8A8A8A]">
                Date of Birth
              </label>
              <span className="text-xs font-mono text-[#C6FF00] font-bold">
                Age: {currentAge} years old
              </span>
            </div>
            <div className="relative flex items-center">
              <Calendar size={16} className="absolute left-3 text-[#8A8A8A]" />
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                required
                className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          {/* Height and Weight Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8A8A8A]">Height (cm)</label>
              <div className="relative flex items-center">
                <Ruler size={16} className="absolute left-3 text-[#8A8A8A]" />
                <input
                  type="number"
                  step="0.5"
                  value={heightCm}
                  onChange={(e) => setHeightCm(Number(e.target.value))}
                  required
                  className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#8A8A8A]">Weight (kg)</label>
              <div className="relative flex items-center">
                <Weight size={16} className="absolute left-3 text-[#8A8A8A]" />
                <input
                  type="number"
                  step="0.1"
                  value={weightKg}
                  onChange={(e) => setWeightKg(Number(e.target.value))}
                  required
                  className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-3 text-sm text-white focus:outline-none focus:border-[#C6FF00]"
                />
              </div>
            </div>
          </div>

          {/* Avatar URL */}
          <div className="space-y-1">
            <label className="text-xs font-mono uppercase text-[#8A8A8A]">Profile Photo URL</label>
            <div className="relative flex items-center">
              <Camera size={16} className="absolute left-3 text-[#8A8A8A]" />
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://..."
                className="w-full h-11 bg-[#1A1A1A] border border-[#292929] rounded-xl pl-10 pr-3 text-sm text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00]"
              />
            </div>
          </div>

          {/* Preferred Sports */}
          <div className="space-y-1.5 pt-2">
            <label className="text-xs font-mono uppercase text-[#8A8A8A] block">
              Preferred Sports Disciplines
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'road_running' as SportType, label: 'Road Running' },
                { id: 'trail_running' as SportType, label: 'Trail Running' },
                { id: 'outdoor_cycling' as SportType, label: 'Outdoor Cycling' },
                { id: 'strength_training' as SportType, label: 'Strength Training' },
              ].map((s) => {
                const isSelected = preferredSports.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => toggleSport(s.id)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#C6FF00]/15 border-[#C6FF00] text-white'
                        : 'bg-[#1A1A1A] border-[#292929] text-[#8A8A8A]'
                    }`}
                  >
                    <span>{s.label}</span>
                    {isSelected && <Check size={14} className="text-[#C6FF00]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="space-y-2 pt-2">
            <label className="text-xs font-mono uppercase text-[#8A8A8A] block">
              Fitness Goals
            </label>
            <div className="space-y-1.5">
              {goals.map((goal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded-xl bg-[#1A1A1A] border border-[#292929]"
                >
                  <span className="text-xs text-white truncate max-w-[240px]">{goal}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveGoal(index)}
                    className="text-[#8A8A8A] hover:text-red-400 p-1"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add new goal (e.g. Sub 20m 5K)"
                className="flex-1 h-10 bg-[#1A1A1A] border border-[#292929] rounded-xl px-3 text-xs text-white placeholder-[#555] focus:outline-none focus:border-[#C6FF00]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddGoal();
                  }
                }}
              />
              <button
                type="button"
                onClick={handleAddGoal}
                className="h-10 px-3 rounded-xl bg-[#292929] hover:bg-[#333] text-white text-xs font-bold flex items-center gap-1"
              >
                <Plus size={14} />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="pt-3 pb-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full h-12 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-base font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_16px_rgba(198,255,0,0.3)] active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSaving ? 'Updating Database...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
