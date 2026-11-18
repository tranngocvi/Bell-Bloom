import React from 'react';
import { ArrowLeft, BookOpen, Volume2, VolumeX, Maximize2, Settings, Play, CheckCircle2 } from 'lucide-react';
import { GameSettings } from '../types/quiz';
import { ProgramLogo } from './ProgramLogo';

interface RulesScreenProps {
  settings: GameSettings;
  onGoHome: () => void;
  onStartStage: () => void;
  onOpenControl?: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  isProjectorMode?: boolean;
}

const RULE_ICONS = ['👂', '💡', '✍️', '🛑', '🏆'];

export const RulesScreen: React.FC<RulesScreenProps> = React.memo(({
  settings,
  onGoHome,
  onStartStage,
  onOpenControl,
  onToggleSound,
  onToggleFullscreen,
  isProjectorMode = false
}) => {
  const rules = settings.rulesText && settings.rulesText.length > 0 ? settings.rulesText : [
    "Lắng nghe và đọc kỹ câu hỏi được trình chiếu trên màn hình.",
    "Suy nghĩ và chọn một đáp án chính xác nhất trong 4 phương án A, B, C hoặc D.",
    "Ghi đáp án lên bảng trả lời trong thời gian đồng hồ đếm ngược (15 giây).",
    "Khi có hiệu lệnh hết giờ (00 giây), lập tức dừng viết và đồng loạt giơ bảng theo hiệu lệnh của MC.",
    "Theo dõi đáp án chính xác, lời giải thích từ BTC và hướng dẫn tiếp tục của chương trình."
  ];

  return (
    <div className="flex-1 flex flex-col justify-between p-3 md:p-6 lg:p-8 w-full max-w-[96vw] mx-auto min-h-screen relative z-20">
      {/* 1. Header Bar */}
      <div className="w-full flex items-center justify-between pb-3 border-b-2 border-white/60">
        {/* Left: Back Button & Logos */}
        <div className="flex items-center gap-3">
          {onGoHome && !isProjectorMode && (
            <button
              onClick={onGoHome}
              title="Về màn hình chào"
              className="p-2.5 bg-white/95 hover:bg-white text-slate-700 rounded-2xl shadow-sm transition hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 text-[#084DB8]" />
            </button>
          )}

          {/* School Logo & Program Logo in a single polished badge */}
          <div className="bg-white/95 px-4 py-2 rounded-2xl shadow-md border-2 border-white backdrop-blur-xs flex items-center gap-3">
            {settings.customLogoUrl ? (
              <img
                src={settings.customLogoUrl}
                alt={settings.schoolName || 'FPT POLYSCHOOL'}
                className="h-9 md:h-12 w-auto max-w-[160px] md:max-w-[200px] object-contain"
              />
            ) : (
              <span className="text-[#084DB8] font-black text-sm md:text-base tracking-widest uppercase">
                {settings.schoolName || 'FPT POLYSCHOOL'}
              </span>
            )}
            <div className="h-7 w-[2px] bg-slate-200 hidden sm:block" />
            <ProgramLogo size="sm" />
          </div>
        </div>

        {/* Right Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-sm transition hover:scale-105"
          >
            {settings.soundEnabled ? <Volume2 className="w-6 h-6 text-emerald-600" /> : <VolumeX className="w-6 h-6 text-slate-400" />}
          </button>
          <button
            onClick={onToggleFullscreen}
            title="Toàn màn hình"
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-sm transition hover:scale-105"
          >
            <Maximize2 className="w-6 h-6 text-[#084DB8]" />
          </button>
          {!isProjectorMode && onOpenControl && (
            <button
              onClick={onOpenControl}
              title="Bảng điều khiển BTC"
              className="p-2.5 bg-white/90 hover:bg-white text-[#084DB8] rounded-2xl shadow-sm transition hover:scale-105"
            >
              <Settings className="w-6 h-6 text-[#FF781F]" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Main Stage Center Presentation */}
      <div className="my-auto py-4 w-full flex flex-col items-center">
        {/* Stage Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-white/95 rounded-full border-2 border-amber-300 shadow-md text-[#FF781F] font-black text-sm md:text-base uppercase tracking-wider mb-3">
            <BookOpen className="w-5 h-5 text-[#FF781F]" />
            <span>QUY ĐỊNH THI ĐẤU CHÍNH THỨC</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-[#084DB8] leading-tight drop-shadow-sm tracking-tight">
            THỂ LỆ TRÒ CHƠI
          </h1>
          <p className="text-slate-700 font-bold text-lg md:text-2xl mt-1">
            Đấu trường tri thức BELL & BLOOM - 15 Câu hỏi chinh phục
          </p>
        </div>

        {/* 3. Full-Screen Rules Cards Grid (Large, High Contrast, Visible from afar) */}
        <div className="w-full max-w-6xl flex flex-col gap-3.5 md:gap-4 mb-6">
          {rules.map((rule, idx) => (
            <div
              key={idx}
              className="w-full flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-3xl bg-white border-3 border-white/95 shadow-lg shadow-sky-200/50 hover:shadow-xl hover:scale-[1.01] transition-all duration-300"
            >
              {/* Rule Number Badge */}
              <div className="w-12 h-12 md:w-16 md:h-16 lg:w-18 lg:h-18 rounded-2xl bg-gradient-to-br from-[#084DB8] to-[#2575FC] text-white flex items-center justify-center font-black text-2xl md:text-3xl lg:text-4xl shrink-0 shadow-md border-2 border-white">
                {idx + 1}
              </div>

              {/* Emoji Icon Sticker */}
              <div className="text-2xl md:text-4xl shrink-0 hidden sm:block">
                {RULE_ICONS[idx % RULE_ICONS.length]}
              </div>

              {/* Rule Text */}
              <div className="flex-1 min-w-0">
                <p className="text-slate-800 font-extrabold text-xl md:text-2xl lg:text-3xl leading-snug">
                  {rule}
                </p>
              </div>

              {/* Verified check indicator */}
              <div className="shrink-0 text-emerald-500 hidden md:block">
                <CheckCircle2 className="w-7 h-7 md:w-8 md:h-8" />
              </div>
            </div>
          ))}
        </div>

        {/* 4. Action buttons (Only on MC / non-projector view) */}
        {!isProjectorMode ? (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 z-20 w-full sm:w-auto mt-2">
            <button
              onClick={onGoHome}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-[#084DB8] font-black text-lg md:text-xl rounded-3xl shadow-md border-3 border-blue-200 transition hover:scale-105 active:scale-95 w-full sm:w-auto"
            >
              <ArrowLeft className="w-6 h-6 text-blue-600" />
              <span>VỀ TRANG CHỦ</span>
            </button>

            <button
              onClick={onStartStage}
              className="group flex items-center justify-center gap-3 px-10 py-5 bg-[#FF781F] hover:bg-[#E65D07] text-white font-black text-xl md:text-2xl rounded-3xl shadow-xl shadow-orange-500/40 border-4 border-white transform transition hover:scale-105 active:scale-95 animate-pulse w-full sm:w-auto"
            >
              <Play className="w-7 h-7 fill-current group-hover:translate-x-1.5 transition-transform" />
              <span>BẮT ĐẦU VÀO SÂN KHẤU</span>
            </button>
          </div>
        ) : (
          <div className="px-6 py-2 bg-white/90 rounded-full border border-white text-xs md:text-sm font-bold text-[#084DB8] shadow-sm">
            FPT POLYSCHOOL - BELL & BLOOM 20/11 • CHUÔNG VANG TRI THỨC - HOA NỞ TRI ÂN
          </div>
        )}
      </div>

      {/* 5. Footer */}
      <div className="w-full text-center pb-2 text-xs md:text-sm font-bold text-[#084DB8]/80">
        Chào mừng Ngày Nhà giáo Việt Nam 20/11 - FPT POLYSCHOOL
      </div>
    </div>
  );
});
