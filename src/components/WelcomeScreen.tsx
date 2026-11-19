import React from 'react';
import { Play, BookOpen, Settings, Volume2, VolumeX, Maximize2 } from 'lucide-react';
import { GameSettings } from '../types/quiz';
import { ProgramLogo } from './ProgramLogo';

interface WelcomeScreenProps {
  settings: GameSettings;
  onStart: () => void;
  onOpenRules: () => void;
  onOpenControl?: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  isProjectorMode?: boolean;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = React.memo(({
  settings,
  onStart,
  onOpenRules,
  onOpenControl,
  onToggleSound,
  onToggleFullscreen,
  isProjectorMode = false
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between p-4 md:p-8 lg:p-10 w-full max-w-[96vw] mx-auto min-h-screen relative z-20">
      {/* Top Header Bar - Full Width with School Logo & Program Logo */}
      <div className="w-full flex items-center justify-between pb-3 border-b-2 border-white/60">
        {/* School Logo & Program Logo side-by-side in a polished badge */}
        <div className="flex items-center gap-3">
          <div className="bg-white/95 px-4 py-2 md:px-5 md:py-2.5 rounded-2xl md:rounded-3xl shadow-md border-2 border-white backdrop-blur-xs flex items-center gap-3 md:gap-4">
            {settings.customLogoUrl ? (
              <img
                src={settings.customLogoUrl}
                alt={settings.schoolName || 'FPT POLYSCHOOL'}
                className="h-10 md:h-14 lg:h-16 w-auto max-w-[180px] md:max-w-[260px] object-contain"
              />
            ) : (
              <span className="text-[#084DB8] font-black text-sm md:text-lg tracking-widest uppercase">
                {settings.schoolName || 'FPT POLYSCHOOL'}
              </span>
            )}
            <div className="h-8 md:h-10 w-[2px] bg-slate-200 hidden sm:block" />
            <ProgramLogo size="md" />
          </div>
        </div>

        {/* Quick action buttons on top right */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-3 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-md transition hover:scale-105"
          >
            {settings.soundEnabled ? <Volume2 className="w-6 h-6 text-emerald-600" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
          </button>
          <button
            onClick={onToggleFullscreen}
            title="Toàn màn hình"
            className="p-3 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-md transition hover:scale-105"
          >
            <Maximize2 className="w-6 h-6 text-[#084DB8]" />
          </button>
          {!isProjectorMode && onOpenControl && (
            <button
              onClick={onOpenControl}
              title="Bảng điều khiển BTC"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/95 hover:bg-white text-[#084DB8] font-black text-sm md:text-base rounded-2xl shadow-md border-2 border-blue-200 transition hover:scale-105"
            >
              <Settings className="w-5 h-5 text-[#FF781F]" />
              <span className="hidden sm:inline">Điều khiển BTC</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Hero Section - Centered & Glorious FULL WIDTH 100% (Scaled for Giant LED Wall) */}
      <div className="my-auto py-4 w-full flex flex-col items-center justify-center text-center">
        {/* Stylized Official Program Logo (HGP1 with title and slogan) - Massive Size */}
        <div className="relative mb-6 max-w-6xl xl:max-w-7xl flex justify-center w-full">
          <ProgramLogo size="hero" className="w-full justify-center" />
        </div>

        {/* Big Action Buttons - Sized for Stage Visibility */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 md:gap-7 z-20 w-full sm:w-auto mt-4">
          <button
            onClick={onStart}
            className="group flex items-center justify-center gap-4 px-12 py-5 md:px-14 md:py-6 bg-[#FF781F] hover:bg-[#E65D07] text-white font-black text-2xl md:text-3xl rounded-3xl md:rounded-4xl shadow-2xl shadow-orange-500/50 border-4 border-white transform transition hover:scale-105 active:scale-95 animate-pulse w-full sm:w-auto"
          >
            <Play className="w-8 h-8 md:w-9 md:h-9 fill-current group-hover:translate-x-1.5 transition-transform" />
            <span>BẮT ĐẦU HÀNH TRÌNH</span>
          </button>

          <button
            onClick={onOpenRules}
            className="flex items-center justify-center gap-3 px-10 py-5 md:px-12 md:py-6 bg-white hover:bg-slate-50 text-[#084DB8] font-black text-xl md:text-2xl rounded-3xl md:rounded-4xl shadow-xl border-3 md:border-4 border-blue-200 transition hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <BookOpen className="w-8 h-8 md:w-9 md:h-9 text-blue-600" />
            <span>THỂ LỆ</span>
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="w-full text-center pb-2 text-xs md:text-sm font-bold text-[#084DB8]/80">
        Chào mừng Ngày Nhà giáo Việt Nam 20/11 - FPT POLYSCHOOL
      </div>
    </div>
  );
});
