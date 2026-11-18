import React from 'react';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentIndex: number; // 0 to 14
  total?: number; // 15
  onSelectIndex?: (index: number) => void;
  isInteractive?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = React.memo(({
  currentIndex,
  total = 15,
  onSelectIndex,
  isInteractive = false
}) => {
  const steps = Array.from({ length: total }, (_, i) => i);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-2">
      <div className="flex items-center justify-between gap-1.5 md:gap-2">
        {steps.map((idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={idx}
              type="button"
              disabled={!isInteractive}
              onClick={() => isInteractive && onSelectIndex && onSelectIndex(idx)}
              title={`Câu ${idx + 1}`}
              className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 rounded-xl py-1 md:py-2 px-1 relative select-none ${
                isInteractive ? 'cursor-pointer hover:scale-105' : 'cursor-default'
              } ${
                isCurrent
                  ? 'bg-[#FFC83D] border-3 border-[#FF781F] text-[#084DB8] font-black shadow-lg shadow-amber-300/60 scale-110 z-10'
                  : isPassed
                  ? 'bg-emerald-500 border-2 border-emerald-600 text-white font-bold'
                  : 'bg-white/70 border-2 border-white/90 text-slate-400 font-semibold opacity-70'
              }`}
            >
              <div className="flex items-center justify-center">
                {isPassed ? (
                  <Check className="w-3.5 h-3.5 md:w-4 md:h-4 stroke-[3]" />
                ) : (
                  <span className="text-xs md:text-sm font-mono leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                )}
              </div>
              {/* Indicator dot under active step */}
              {isCurrent && (
                <span className="w-1.5 h-1.5 bg-[#FF781F] rounded-full mt-0.5 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
