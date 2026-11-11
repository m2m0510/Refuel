/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export const WeeklyDistanceChart: React.FC = () => {
  const { weeklyStats } = useApp();
  const [activeDay, setActiveDay] = useState<number | null>(null);

  const days = weeklyStats.daily_distance;
  const maxDistance = Math.max(...days.map((d) => Math.max(d.distance_km, d.target_km, 20)));

  return (
    <div className="bg-[#1A1A1A] border border-[#292929] rounded-2xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#8A8A8A]">
            Weekly Mileage Breakdown
          </span>
          <h3 className="font-athletic text-lg font-bold uppercase text-white tracking-wide">
            Distance vs Target
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#C6FF00]" />
            <span className="text-white font-medium">Logged</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#292929] border border-[#444]" />
            <span className="text-[#8A8A8A]">Target</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="h-36 w-full pt-4 pb-2">
        <svg viewBox="0 0 320 120" className="w-full h-full overflow-visible">
          {/* Subtle Horizontal grid lines */}
          <line x1="0" y1="20" x2="320" y2="20" stroke="#292929" strokeDasharray="3 3" />
          <line x1="0" y1="60" x2="320" y2="60" stroke="#292929" strokeDasharray="3 3" />
          <line x1="0" y1="100" x2="320" y2="100" stroke="#292929" />

          {days.map((day, index) => {
            const x = index * 45 + 15;
            const barWidth = 14;
            const height = (day.distance_km / maxDistance) * 80;
            const targetHeight = (day.target_km / maxDistance) * 80;
            const y = 100 - height;
            const targetY = 100 - targetHeight;
            const isHovered = activeDay === index;

            return (
              <g
                key={day.day}
                onMouseEnter={() => setActiveDay(index)}
                onMouseLeave={() => setActiveDay(null)}
                className="cursor-pointer group"
              >
                {/* Target ghost bar */}
                {day.target_km > 0 && (
                  <rect
                    x={x}
                    y={targetY}
                    width={barWidth}
                    height={targetHeight}
                    rx="3"
                    fill="#262626"
                    stroke="#383838"
                    strokeWidth="1"
                  />
                )}

                {/* Actual Distance Bar */}
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(height, 3)}
                  rx="3"
                  fill={isHovered ? '#d6ff33' : '#C6FF00'}
                  className="transition-all duration-200"
                />

                {/* Day label */}
                <text
                  x={x + barWidth / 2}
                  y="114"
                  textAnchor="middle"
                  className={`text-[10px] font-mono select-none ${
                    isHovered ? 'fill-white font-bold' : 'fill-[#8A8A8A]'
                  }`}
                >
                  {day.day}
                </text>

                {/* Hover value indicator */}
                {isHovered && (
                  <g>
                    <rect
                      x={x - 12}
                      y={y - 20}
                      width="38"
                      height="16"
                      rx="4"
                      fill="#050505"
                      stroke="#C6FF00"
                      strokeWidth="1"
                    />
                    <text
                      x={x + barWidth / 2}
                      y={y - 9}
                      textAnchor="middle"
                      fill="#C6FF00"
                      className="text-[9px] font-mono font-bold"
                    >
                      {day.distance_km}k
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-[#292929] text-[11px] text-[#8A8A8A]">
        <span>Weekly Completion: <strong className="text-white font-mono">{weeklyStats.consistency_score}%</strong></span>
        <span>Total: <strong className="text-[#C6FF00] font-mono font-bold">{weeklyStats.total_distance_km} km</strong></span>
      </div>
    </div>
  );
};
