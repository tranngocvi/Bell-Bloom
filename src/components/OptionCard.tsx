import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { OptionKey } from '../types/quiz';

interface OptionCardProps {
  optionKey: OptionKey;
  text: string;
  isRevealed: boolean;
  isCorrect: boolean;
  isEliminated?: boolean;
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
  isCorrect,
  isEliminated = false
}) => {
  const badgeStyle = OPTION_BADGE_COLORS[optionKey];

  // Fluid typography based on option text length for maximum balance in 1920x1080 stage
  const textLength = text.length;
  const optionFontSize =
    textLength > 65
      ? 'text-xl lg:text-[1.65rem]'
      : textLength > 35
      ? 'text-2xl lg:text-[1.95rem]'
      : 'text-3xl lg:text-[2.35rem]';

  // 50/50 Lifeline Elimination State: Dimmed, crossed out
  if (isEliminated && !isRevealed) {
    return (
      <div className="relative flex items-center gap-5 p-5 lg:p-6 rounded-3xl bg-white/40 border-2 border-dashed border-slate-300 opacity-20 select-none transition-all duration-300 pointer-events-none">
        <div className="w-16 h-16 lg:w-18 lg:h-18 shrink-0 rounded-2xl flex items-center justify-center font-black text-3xl bg-slate-300 text-slate-500 border-2 border-slate-400">
          <span className="line-through">{optionKey}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className={`line-through text-slate-400 font-extrabold ${optionFontSize}`}>
            {text}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center gap-5 p-5 lg:p-6 rounded-3xl transition-all duration-300 select-none ${
        isRevealed && isCorrect
          ? 'bg-emerald-50 border-4 border-emerald-500 shadow-2xl shadow-emerald-300 scale-[1.02] z-10'
          : isRevealed && !isCorrect
          ? 'bg-white/70 border-3 border-slate-200 opacity-40'
          : 'bg-white border-4 border-white/95 shadow-xl hover:shadow-2xl'
      }`}
    >
      {/* Option Key Badge (A, B, C, D) - Large for giant LED screen */}
      <div
        className={`w-16 h-16 lg:w-18 lg:h-18 shrink-0 rounded-2xl flex items-center justify-center font-black text-3xl lg:text-4xl border-3 md:border-4 shadow-lg transition-transform ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} ${
          isRevealed && isCorrect ? 'scale-110 rotate-2' : ''
        }`}
      >
        {optionKey}
      </div>

      {/* Option Text Content - Extra Large & High Contrast */}
      <div className="flex-1 min-w-0">
        <p
          className={`leading-snug break-words transition-colors ${
            isRevealed && isCorrect ? 'text-emerald-950 font-black' : 'text-slate-800 font-extrabold'
          } ${optionFontSize}`}
        >
          {text}
        </p>
      </div>

      {/* Correct Indicator Badge */}
      {isRevealed && isCorrect && (
        <div className="absolute -top-4 md:-top-5 right-6 md:right-10 px-4 py-1.5 md:px-6 md:py-2.5 bg-emerald-600 text-white rounded-full flex items-center gap-2 shadow-xl text-base md:text-xl lg:text-2xl font-black tracking-wide animate-bounce">
          <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7" />
          <span>ĐÁP ÁN ĐÚNG</span>
        </div>
      )}
    </div>
  );
});
