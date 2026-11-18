import React from 'react';

export const PaperPlane: React.FC<{ className?: string; angle?: number }> = React.memo(({ className = '', angle = -15 }) => (
  <svg
    viewBox="0 0 100 80"
    className={`drop-shadow-md select-none pointer-events-none will-change-transform ${className}`}
    style={{ transform: `rotate(${angle}deg)` }}
  >
    {/* White sticker border */}
    <path
      d="M10 40 L85 10 L55 70 L40 48 L10 40 Z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="8"
      strokeLinejoin="round"
    />
    {/* Main body */}
    <path d="M10 40 L85 10 L55 70 L40 48 L10 40 Z" fill="#FF781F" />
    {/* Fold shade */}
    <path d="M40 48 L85 10 L55 70 Z" fill="#E65D07" />
    <path d="M40 48 L85 10 L45 42 Z" fill="#FFA35C" />
  </svg>
));

export const Cloud: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <svg
    viewBox="0 0 240 140"
    className={`drop-shadow-md select-none pointer-events-none will-change-transform ${className}`}
  >
    {/* White Sticker Border Outline */}
    <path
      d="M 50 110
         C 28 110, 14 94, 14 74
         C 14 56, 28 42, 46 42
         C 50 42, 54 43, 58 44
         C 66 24, 86 14, 110 14
         C 134 14, 154 26, 162 46
         C 168 44, 174 42, 182 42
         C 204 42, 224 60, 224 82
         C 224 102, 206 110, 186 110
         Z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="12"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    {/* Soft Crisp White Cloud Body */}
    <path
      d="M 50 110
         C 28 110, 14 94, 14 74
         C 14 56, 28 42, 46 42
         C 50 42, 54 43, 58 44
         C 66 24, 86 14, 110 14
         C 134 14, 154 26, 162 46
         C 168 44, 174 42, 182 42
         C 204 42, 224 60, 224 82
         C 224 102, 206 110, 186 110
         Z"
      fill="#F8FDFF"
    />
    {/* Soft Sky Blue Bottom Highlight / Shade */}
    <path
      d="M 32 86
         C 46 104, 72 108, 115 108
         C 162 108, 192 104, 208 86
         C 192 100, 154 103, 115 103
         C 72 103, 46 98, 32 86
         Z"
      fill="#CBEBFC"
    />
  </svg>
));

export const CloudFluffy: React.FC<{ className?: string }> = React.memo(({ className = '' }) => (
  <svg
    viewBox="0 0 200 120"
    className={`drop-shadow-sm select-none pointer-events-none will-change-transform ${className}`}
  >
    {/* Sticker Outline */}
    <path
      d="M 40 95
         C 22 95, 12 82, 12 66
         C 12 50, 25 38, 42 38
         C 52 20, 75 14, 96 14
         C 118 14, 138 24, 145 40
         C 152 38, 160 38, 168 44
         C 182 54, 188 68, 186 82
         C 184 94, 172 95, 158 95
         Z"
      fill="#FFFFFF"
      stroke="#FFFFFF"
      strokeWidth="10"
      strokeLinejoin="round"
      strokeLinecap="round"
    />
    <path
      d="M 40 95
         C 22 95, 12 82, 12 66
         C 12 50, 25 38, 42 38
         C 52 20, 75 14, 96 14
         C 118 14, 138 24, 145 40
         C 152 38, 160 38, 168 44
         C 182 54, 188 68, 186 82
         C 184 94, 172 95, 158 95
         Z"
      fill="#FAFEFF"
    />
  </svg>
));

export const TulipFlower: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    viewBox="0 0 120 160"
    className={`drop-shadow-lg select-none pointer-events-none ${className}`}
  >
    {/* Sticker white contour */}
    <g stroke="#FFFFFF" strokeWidth="8" strokeLinejoin="round" fill="#FFFFFF">
      {/* Stem */}
      <path d="M60 85 Q58 120 60 155" strokeWidth="12" strokeLinecap="round" />
      {/* Leaves */}
      <path d="M60 125 Q35 110 20 135 Q40 145 60 135" />
      <path d="M60 115 Q85 100 100 125 Q80 138 60 125" />
      {/* Petals */}
      <path d="M60 25 C40 25 25 50 25 75 C25 90 40 100 60 100 C80 100 95 90 95 75 C95 50 80 25 60 25 Z" />
    </g>

    {/* Green Stem & Leaves */}
    <path d="M60 85 Q58 120 60 155" stroke="#38A169" strokeWidth="6" strokeLinecap="round" fill="none" />
    <path d="M60 125 Q35 110 20 135 Q40 145 60 135 Z" fill="#48BB78" />
    <path d="M60 115 Q85 100 100 125 Q80 138 60 125 Z" fill="#48BB78" />

    {/* Pink Tulip Bloom */}
    {/* Side Left */}
    <path d="M60 98 C42 98 28 85 28 70 C28 50 45 32 55 28 C48 45 48 75 60 98 Z" fill="#F39AB8" />
    {/* Side Right */}
    <path d="M60 98 C78 98 92 85 92 70 C92 50 75 32 65 28 C72 45 72 75 60 98 Z" fill="#F39AB8" />
    {/* Center Petal */}
    <path d="M60 25 C45 38 42 70 55 98 C65 98 78 70 65 25 Z" fill="#F8B4CB" />
    {/* Highlight shine */}
    <ellipse cx="50" cy="50" rx="4" ry="12" transform="rotate(-15 50 50)" fill="#FFFFFF" opacity="0.6" />
  </svg>
);

export const GoldenBell: React.FC<{ className?: string; ringing?: boolean; size?: number }> = ({
  className = '',
  ringing = false,
  size = 120
}) => (
  <div
    className={`inline-block transition-transform duration-300 ${ringing ? 'animate-bell-ring' : ''} ${className}`}
    style={{ width: size, height: size }}
  >
    <svg viewBox="0 0 160 160" className="w-full h-full drop-shadow-xl">
      <defs>
        <linearGradient id="bellGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="35%" stopColor="#FFC83D" />
          <stop offset="85%" stopColor="#E59E00" />
          <stop offset="100%" stopColor="#BA7500" />
        </linearGradient>
        <radialGradient id="clapperGrad" cx="40%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#FFE17D" />
          <stop offset="100%" stopColor="#B36B00" />
        </radialGradient>
      </defs>

      {/* White Sticker Border */}
      <g stroke="#FFFFFF" strokeWidth="10" strokeLinejoin="round" fill="#FFFFFF">
        {/* Top Loop */}
        <circle cx="80" cy="24" r="14" />
        {/* Bell Body */}
        <path d="M80 32 C55 32 45 70 38 105 C35 115 25 118 25 125 C25 130 30 134 40 134 L120 134 C130 134 135 130 135 125 C135 118 125 115 122 105 C115 70 105 32 80 32 Z" />
        {/* Clapper ball */}
        <ellipse cx="80" cy="138" rx="16" ry="10" />
      </g>

      {/* Top hanger ring */}
      <circle cx="80" cy="24" r="12" fill="none" stroke="#E59E00" strokeWidth="6" />
      <circle cx="80" cy="24" r="12" fill="none" stroke="#FFC83D" strokeWidth="4" />

      {/* Clapper ball */}
      <ellipse cx="80" cy="138" rx="14" ry="9" fill="url(#clapperGrad)" />

      {/* Bell body */}
      <path
        d="M80 32 C55 32 45 70 38 105 C35 115 25 118 25 125 C25 130 30 134 40 134 L120 134 C130 134 135 130 135 125 C135 118 125 115 122 105 C115 70 105 32 80 32 Z"
        fill="url(#bellGrad)"
      />

      {/* Bell bottom rim highlight */}
      <path
        d="M32 126 C42 133 118 133 128 126"
        stroke="#FFE885"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />

      {/* Bell body shine */}
      <path
        d="M58 48 C50 65 46 95 48 115"
        stroke="#FFFFFF"
        strokeWidth="6"
        strokeLinecap="round"
        opacity="0.6"
        fill="none"
      />

      {/* Cute orange ribbon bow at top */}
      <g id="bow">
        <path
          d="M80 36 C68 22 50 32 62 44 C72 50 80 40 80 36 Z"
          fill="#FF781F"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <path
          d="M80 36 C92 22 110 32 98 44 C88 50 80 40 80 36 Z"
          fill="#FF781F"
          stroke="#FFFFFF"
          strokeWidth="3"
        />
        <circle cx="80" cy="38" r="6" fill="#E65D07" stroke="#FFFFFF" strokeWidth="2" />
        {/* Ribbon tails */}
        <path d="M77 42 Q70 56 64 62" stroke="#FF781F" strokeWidth="4" strokeLinecap="round" />
        <path d="M83 42 Q90 56 96 62" stroke="#FF781F" strokeWidth="4" strokeLinecap="round" />
      </g>
    </svg>
  </div>
);

export const StaticSkyDecorations: React.FC<{ animated?: boolean }> = React.memo(({ animated = true }) => {
  return (
    <>
      {/* Floating clouds in sky */}
      <div className={`absolute top-6 left-8 w-44 md:w-56 opacity-90 pointer-events-none ${animated ? 'animate-float-slow' : ''}`}>
        <Cloud />
      </div>
      <div className={`absolute top-12 right-12 w-52 md:w-64 opacity-85 pointer-events-none ${animated ? 'animate-float-reverse' : ''}`}>
        <Cloud />
      </div>
      <div className="absolute top-28 left-1/3 w-36 opacity-60 hidden md:block pointer-events-none">
        <Cloud />
      </div>

      {/* Flying orange paper airplanes */}
      <div className={`absolute top-16 left-1/4 w-14 md:w-20 pointer-events-none ${animated ? 'animate-paper-plane' : ''}`}>
        <PaperPlane angle={-12} />
      </div>
      <div className={`absolute top-10 right-1/4 w-12 md:w-16 pointer-events-none ${animated ? 'animate-paper-plane-reverse' : ''}`}>
        <PaperPlane angle={25} />
      </div>

      {/* Tulip bouquets blooming at bottom corners */}
      <div className="absolute -bottom-4 -left-4 w-44 md:w-72 z-10 pointer-events-none flex items-end">
        <div className={`relative ${animated ? 'animate-bloom' : ''}`}>
          <TulipFlower className="w-32 md:w-48 -rotate-12 translate-x-2 translate-y-3" />
          <TulipFlower className="w-32 md:w-48 absolute left-12 -bottom-2 rotate-6" />
          <TulipFlower className="w-28 md:w-40 absolute left-28 bottom-2 rotate-18 opacity-90" />
        </div>
      </div>

      <div className="absolute -bottom-4 -right-4 w-44 md:w-72 z-10 pointer-events-none flex items-end justify-end">
        <div className={`relative ${animated ? 'animate-sway' : ''}`}>
          <TulipFlower className="w-28 md:w-40 absolute right-28 bottom-2 -rotate-18 opacity-90" />
          <TulipFlower className="w-32 md:w-48 absolute right-12 -bottom-2 -rotate-6" />
          <TulipFlower className="w-32 md:w-48 rotate-12 -translate-x-2 translate-y-3" />
        </div>
      </div>
    </>
  );
});

export const DecorativeBackground: React.FC<{ children?: React.ReactNode; animated?: boolean }> = React.memo(({
  children,
  animated = true
}) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#69D5F5] via-[#8EE4F8] to-[#D5F5FF] flex flex-col justify-between">
      <StaticSkyDecorations animated={animated} />

      {/* Main content layer */}
      <div className="relative z-20 flex-1 flex flex-col w-full h-full">
        {children}
      </div>
    </div>
  );
});
