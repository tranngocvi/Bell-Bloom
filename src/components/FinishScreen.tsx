import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, RotateCcw, Home, Sparkles, Heart } from 'lucide-react';
import { GoldenBell } from './DecorativeBackground';
import { ProgramLogo } from './ProgramLogo';
import { GameSettings } from '../types/quiz';

interface FinishScreenProps {
  settings: GameSettings;
  onRestart: () => void;
  onGoHome: () => void;
  onOpenControl?: () => void;
  isProjectorMode?: boolean;
}

export const FinishScreen: React.FC<FinishScreenProps> = React.memo(({
  settings,
  onRestart,
  onGoHome,
  isProjectorMode = false
}) => {
  // Fire celebratory confetti bursts
  useEffect(() => {
    if (!settings.animationsEnabled) return;

    // Burst 1: Center
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFC83D', '#FF781F', '#F39AB8', '#084DB8', '#10B981']
    });

    // Burst 2 & 3: Left and Right
    const timer1 = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.65 },
        colors: ['#FFC83D', '#FF781F', '#F39AB8']
      });
    }, 400);

    const timer2 = setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.65 },
        colors: ['#084DB8', '#69D5F5', '#FFC83D']
      });
    }, 700);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [settings.animationsEnabled]);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-between p-4 md:p-6 lg:p-8 overflow-hidden text-center relative z-20">
      {/* Top Header */}
      <div className="pt-2">
        <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-md border-2 border-white backdrop-blur-xs inline-flex items-center gap-3">
          {settings.customLogoUrl ? (
            <img
              src={settings.customLogoUrl}
              alt={settings.schoolName || 'FPT POLYSCHOOL'}
              className="h-10 md:h-14 w-auto max-w-[200px] md:max-w-[260px] object-contain"
            />
          ) : (
            <span className="text-[#084DB8] font-black text-sm md:text-base tracking-widest uppercase">
              {settings.schoolName || 'FPT POLYSCHOOL'}
            </span>
          )}
          <div className="h-8 w-[2px] bg-slate-200 hidden sm:block" />
          <ProgramLogo size="sm" />
        </div>
      </div>

      {/* Main Content */}
      <div className="my-auto flex flex-col items-center py-4">
        {/* Celebration Trophy / Bell */}
        <div className="relative mb-4">
          <GoldenBell size={160} ringing={true} />
          <div className="absolute -top-3 -right-3 p-3 bg-amber-400 text-white rounded-full shadow-lg border-2 border-white animate-bounce">
            <Trophy className="w-8 h-8" />
          </div>
        </div>

        {/* Closing Title */}
        <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-amber-100 border border-amber-300 rounded-full text-amber-900 font-black text-sm md:text-base mb-3">
          <Sparkles className="w-4 h-4 text-amber-600" />
          <span>VINH DANH ĐẤU TRƯỜNG TRI THỨC</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#084DB8] leading-tight mb-4 drop-shadow-sm">
          Hành trình 15 câu hỏi đã khép lại!
        </h1>

        {/* Winner Highlight Box if available */}
        {settings.winnerName && settings.winnerName.trim() ? (
          <div className="mb-6 p-6 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-4 border-white rounded-3xl shadow-xl max-w-xl w-full transform hover:scale-105 transition-transform duration-300">
            <div className="text-xs uppercase font-black tracking-widest text-amber-900 mb-1">
              👑 QUÁN QUÂN CHUNG CUỘC 👑
            </div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-black text-blue-950 font-heading">
              {settings.winnerName}
            </div>
            <p className="text-sm font-bold text-amber-900/80 mt-1">
              Xuất sắc vượt qua 15 câu hỏi của Bell & Bloom!
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-white/80 border-2 border-white rounded-2xl shadow-md max-w-lg">
            <p className="text-lg md:text-xl font-extrabold text-[#084DB8]">
              Chúc mừng tất cả các bạn học sinh đã kiên cường chinh phục từng thử thách!
            </p>
          </div>
        )}

        {/* Gratitude Message */}
        <div className="max-w-2xl px-6 py-4 bg-white/90 border-2 border-blue-100 rounded-3xl shadow-sm mb-8">
          <div className="flex items-center justify-center gap-2 text-rose-500 font-bold mb-1">
            <Heart className="w-5 h-5 fill-current" />
            <span className="text-sm uppercase tracking-wider">Tri ân 20/11</span>
          </div>
          <p className="text-lg md:text-2xl font-bold text-slate-700 leading-relaxed">
            “Cảm ơn bạn đã cùng Bell & Bloom lan tỏa tri thức và gửi lời tri ân đến thầy cô.”
          </p>
        </div>

        {/* Buttons (Hidden on pure Projector unless operated) */}
        {!isProjectorMode && (
          <div className="flex flex-col sm:flex-row items-center gap-4 z-20">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-slate-50 text-[#084DB8] font-bold text-lg rounded-2xl shadow-md border-2 border-blue-200 transition hover:scale-105 active:scale-95"
            >
              <Home className="w-5 h-5" />
              <span>Về màn hình chào</span>
            </button>

            <button
              onClick={onRestart}
              className="flex items-center gap-2.5 px-6 py-3.5 bg-[#FF781F] hover:bg-[#E65D07] text-white font-black text-lg rounded-2xl shadow-lg shadow-orange-500/30 border-2 border-white transition hover:scale-105 active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Chơi lại chương trình</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-xs md:text-sm font-semibold text-[#084DB8]/80 pb-2">
        BELL & BLOOM 20/11 • FPT POLYSCHOOL
      </div>
    </div>
  );
});
