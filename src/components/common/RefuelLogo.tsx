/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface RefuelLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  className?: string;
}

export const RefuelLogo: React.FC<RefuelLogoProps> = ({
  size = 'md',
  showSubtitle = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-lg tracking-tight',
    md: 'text-2xl tracking-tighter',
    lg: 'text-4xl tracking-tighter',
    xl: 'text-6xl tracking-tighter',
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-9 h-9',
    xl: 'w-14 h-14',
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <div className="flex items-center gap-2 select-none">
        {/* Athletic chevron / kinetic energy chevron icon */}
        <div className={`relative flex items-center justify-center ${iconSizes[size]}`}>
          <svg
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-[0_0_8px_rgba(198,255,0,0.5)]"
          >
            {/* Aerodynamic athletic parallel blades */}
            <path
              d="M6 26L14 6H20L12 26H6Z"
              fill="#FFFFFF"
            />
            <path
              d="M15 26L23 6H28L20 26H15Z"
              fill="#C6FF00"
            />
            {/* Speed dot / pulse notch */}
            <circle cx="27" cy="8" r="2" fill="#C6FF00" />
          </svg>
        </div>

        {/* Athletic typography */}
        <span
          className={`font-athletic font-extrabold italic uppercase text-white ${sizeClasses[size]}`}
          style={{ letterSpacing: '0.04em' }}
        >
          RE<span className="text-[#C6FF00]">FUEL</span>
        </span>
      </div>

      {showSubtitle && (
        <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-[#8A8A8A] mt-0.5 ml-8">
          Athletic Performance
        </span>
      )}
    </div>
  );
};
