import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { OptionKey } from '../types/quiz';

interface OptionCardProps {
  optionKey: OptionKey;
  text: string;
  isRevealed: boolean;
  isCorrect: boolean;
}

const OPTION_BADGE_COLORS: Record<OptionKey, { bg: string; text: string; border: string }> = {
  A: { bg: 'bg-[#FF781F]', text: 'text-white', border: 'border-white' },
  B: { bg: 'bg-[#084DB8]', text: 'text-white', border: 'border-white' },
  C: { bg: 'bg-[#FFC83D]', text: 'text-[#084DB8]', border: 'border-white' },
  D: { bg: 'bg-[#10B981]', text: 'text-white', border: 'border-white' },
};

export const OptionCard: React.FC<OptionCardProps> = React.memo(({
  optionKey,
  text,
  isRevealed,
  isCorrect
}) => {
  const badgeStyle = OPTION_BADGE_COLORS[optionKey];

  return (
    <div
      className={`relative flex items-center gap-4 p-4 md:p-6 rounded-3xl transition-all duration-300 select-none ${
        isRevealed && isCorrect
          ? 'bg-emerald-50 border-4 border-emerald-500 shadow-xl shadow-emerald-200 scale-[1.02] z-10'
          : isRevealed && !isCorrect
          ? 'bg-white/70 border-3 border-slate-200 opacity-45'
          : 'bg-white border-4 border-white/90 shadow-md hover:shadow-lg'
      }`}
    >
      {/* Option Key Badge (A, B, C, D) */}
      <div
        className={`w-12 h-12 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center font-black text-2xl md:text-3xl border-3 shadow-md transition-transform ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} ${
          isRevealed && isCorrect ? 'scale-110 rotate-2' : ''
        }`}
      >
        {optionKey}
      </div>

      {/* Option Text Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-semibold text-slate-800 leading-snug break-words transition-colors ${
            isRevealed && isCorrect ? 'text-emerald-950 font-extrabold' : ''
          } text-xl md:text-2xl lg:text-3xl`}
        >
          {text}
        </p>
      </div>

      {/* Correct Indicator Badge */}
      {isRevealed && isCorrect && (
        <div className="absolute -top-3.5 right-6 px-3 py-1 bg-emerald-600 text-white rounded-full flex items-center gap-1.5 shadow-md text-sm md:text-base font-black tracking-wide animate-bounce">
          <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
          <span>ĐÁP ÁN ĐÚNG</span>
        </div>
      )}
    </div>
  );
});
