/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ChevronRight, Zap, Target, Activity, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { RefuelLogo } from '../components/common/RefuelLogo';

export const OnboardingScreen: React.FC = () => {
  const { setCurrentScreen } = useApp();
  const [step, setStep] = useState(0);

  const slides = [
    {
      badge: 'Strava-Grade Telemetry',
      title: 'PRECISION GPS & EFFICIENCY',
      subtitle: 'Real-time pace analytics, grade-adjusted speed, and live elevation tracking calibrated for road and trail dominance.',
      icon: Activity,
      stats: [
        { label: 'GPS Precision', value: '±1.2m' },
        { label: 'Sampling Rate', value: '1 Hz' },
        { label: 'Split Analysis', value: 'Real-time' },
      ],
    },
    {
      badge: 'Adaptive Matrix',
      title: 'WEEKLY TRAINING PLANNER',
      subtitle: 'Structured Monday-to-Sunday periodization. Plan road intervals, trail vert, and recovery flush sessions seamlessly.',
      icon: Target,
      stats: [
        { label: 'Weekly Period', value: 'Mon - Sun' },
        { label: 'Sport Types', value: '6 Supported' },
        { label: 'Volume Target', value: 'Auto-Derived' },
      ],
    },
    {
      badge: 'Apple Health & VO2',
      title: 'BIOMETRICS & PEAK RECOVERY',
      subtitle: 'Direct hardware sync for resting heart rate, HRV baseline, and dynamic VO2 Max scores to prevent overtraining.',
      icon: Zap,
      stats: [
        { label: 'HRV Status', value: 'Prime' },
        { label: 'VO2 Max Target', value: '55.0' },
        { label: 'Resting HR', value: '48 bpm' },
      ],
    },
  ];

  const currentSlide = slides[step];
  const IconComponent = currentSlide.icon;

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      setCurrentScreen('register');
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-[#050505] select-none">
      {/* Top Header */}
      <div className="pt-4 flex items-center justify-between">
        <RefuelLogo size="sm" />
        <button
          onClick={() => setCurrentScreen('login')}
          className="text-xs uppercase tracking-wider font-semibold text-[#8A8A8A] hover:text-white px-2 py-1"
        >
          Skip
        </button>
      </div>

      {/* Middle Interactive Slide Visual */}
      <div className="my-auto flex flex-col items-center text-center px-2">
        {/* Athletic Symbol Graphic */}
        <div className="w-24 h-24 rounded-3xl bg-[#101010] border border-[#292929] flex items-center justify-center mb-8 relative shadow-[0_0_30px_rgba(198,255,0,0.12)]">
          <div className="absolute inset-0 rounded-3xl border border-[#C6FF00]/20 animate-pulse" />
          <IconComponent size={44} className="text-[#C6FF00]" strokeWidth={2.2} />
        </div>

        {/* Slide Category Unboxed Text */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs uppercase font-mono tracking-widest text-[#C6FF00] font-semibold">
            {currentSlide.badge}
          </span>
        </div>

        {/* Athletic Headline */}
        <h2 className="font-athletic text-3xl font-extrabold uppercase tracking-wide text-white leading-tight">
          {currentSlide.title}
        </h2>

        {/* Prose description */}
        <p className="text-sm text-[#8A8A8A] mt-3 max-w-sm leading-relaxed">
          {currentSlide.subtitle}
        </p>

        {/* Data Spec Matrix */}
        <div className="grid grid-cols-3 gap-2 w-full max-w-sm mt-8">
          {currentSlide.stats.map((stat, idx) => (
            <div key={idx} className="bg-[#1A1A1A] border border-[#292929] rounded-xl p-2.5 text-center">
              <span className="text-[10px] text-[#8A8A8A] uppercase font-mono block">{stat.label}</span>
              <span className="font-athletic text-sm font-bold text-white tracking-wide mt-0.5 block">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="flex flex-col gap-5 pb-4">
        {/* Step Indicator Bars */}
        <div className="flex items-center justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setStep(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-[#C6FF00]' : 'w-2 bg-[#292929]'
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="h-13 px-4 rounded-xl bg-[#1A1A1A] border border-[#292929] text-[#8A8A8A] hover:text-white font-athletic text-base font-bold uppercase transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className="flex-1 h-13 rounded-xl bg-[#C6FF00] hover:bg-[#b5eb00] text-black font-athletic text-lg font-extrabold uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(198,255,0,0.3)] active:scale-[0.98] transition-all"
          >
            <span>{step === slides.length - 1 ? 'Get Started' : 'Next'}</span>
            <ChevronRight size={20} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
