import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Play, Volume2, VolumeX, Maximize2, Settings, ArrowLeft } from 'lucide-react';
import { ProgramLogo } from './ProgramLogo';
import { GameSettings } from '../types/quiz';

interface OpeningStageScreenProps {
  settings: GameSettings;
  onOpenQuestion: (questionIndex: number) => void;
  onGoHome: () => void;
  onOpenControl?: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  isProjectorMode?: boolean;
}

export const OpeningStageScreen: React.FC<OpeningStageScreenProps> = React.memo(({
  settings,
  onOpenQuestion,
  onGoHome,
  onOpenControl,
  onToggleSound,
  onToggleFullscreen,
  isProjectorMode = false
}) => {
  // Fire festive welcome confetti bursts on stage intro
  useEffect(() => {
    if (!settings.animationsEnabled) return;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#FFC83D', '#FF781F', '#084DB8', '#69D5F5', '#F39AB8']
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 70,
        spread: 100,
        origin: { y: 0.4 },
        colors: ['#FFC83D', '#FF781F', '#FFFFFF']
      });
    }, 800);

    return () => clearTimeout(timer);
  }, [settings.animationsEnabled]);

  return (
    <div className="flex-1 w-full h-full flex flex-col items-center justify-between p-10 lg:p-12 overflow-hidden text-center relative z-20">
      {/* Top Header */}
      <div className="w-full flex items-center justify-between pt-2">
        <div className="flex items-center gap-3">
          {onGoHome && !isProjectorMode && (
            <button
              onClick={onGoHome}
              title="Về màn hình chào"
              className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-sm transition hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-[#084DB8]" />
            </button>
          )}

          {/* School Logo & Program Logo in a single polished badge */}
          <div className="bg-white/95 px-4 py-2 md:px-5 md:py-2.5 rounded-2xl md:rounded-3xl shadow-md border-2 border-white flex items-center gap-3 md:gap-4">
            {settings.customLogoUrl && (
              <img
                src={settings.customLogoUrl}
                alt="Logo trường"
                className="h-10 md:h-14 lg:h-16 w-auto max-w-[150px] md:max-w-[220px] object-contain"
              />
            )}
            <div className="h-8 md:h-10 w-[2px] bg-slate-200 hidden sm:block" />
            <ProgramLogo size="md" />
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-sm transition hover:scale-105"
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <button
            onClick={onToggleFullscreen}
            title="Toàn màn hình"
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-sm transition hover:scale-105"
          >
            <Maximize2 className="w-5 h-5 text-[#084DB8]" />
          </button>
          {!isProjectorMode && onOpenControl && (
            <button
              onClick={onOpenControl}
              title="Bảng điều khiển BTC"
              className="p-2.5 bg-white/90 hover:bg-white text-[#084DB8] rounded-xl shadow-sm transition hover:scale-105"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Center Stage Presentation - Grand Program Key Visual (Maximized for Giant LED Wall) */}
      <div className="my-auto flex flex-col items-center justify-center py-4 animate-in zoom-in-95 duration-500 w-full">
        {/* Massive Official Program Title & Key Visual (HGP1) */}
        <div className="w-full max-w-6xl lg:max-w-7xl xl:max-w-[92vw] flex justify-center py-2">
          <ProgramLogo size="hero" className="w-full justify-center" />
        </div>

        {/* Action button to open Question 1 (Only on MC window) */}
        {!isProjectorMode && (
          <div className="flex flex-col sm:flex-row items-center gap-4 z-20 mt-10">
            <button
              onClick={() => onOpenQuestion(0)}
              className="group flex items-center gap-4 px-14 py-7 bg-[#FF781F] hover:bg-[#E65D07] text-white font-black text-2xl md:text-4xl rounded-3xl md:rounded-4xl shadow-2xl shadow-orange-500/50 border-4 md:border-6 border-white transform transition hover:scale-105 active:scale-95 animate-pulse"
            >
              <Play className="w-10 h-10 fill-current group-hover:translate-x-1.5 transition-transform" />
              <span>MỞ CÂU HỎI SỐ 1</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="text-sm font-bold text-[#084DB8]/80 pb-2">
        FPT POLYSCHOOL - BELL & BLOOM 20/11
      </div>
    </div>
  );
});
