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
    <div className="w-full max-w-7xl xl:max-w-[92vw] mx-auto px-2 py-3">
      <div className="flex items-center justify-between gap-1.5 md:gap-3">
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
              className={`flex-1 flex flex-col items-center justify-center transition-all duration-300 rounded-xl md:rounded-2xl py-2 md:py-3 px-1 relative select-none ${
                isInteractive ? 'cursor-pointer hover:scale-105' : 'cursor-default'
              } ${
                isCurrent
                  ? 'bg-[#FFC83D] border-3 md:border-4 border-[#FF781F] text-[#084DB8] font-black shadow-xl shadow-amber-300/80 scale-115 z-10'
                  : isPassed
                  ? 'bg-emerald-500 border-2 md:border-3 border-emerald-600 text-white font-bold'
                  : 'bg-white/80 border-2 border-white/95 text-slate-400 font-bold opacity-75'
              }`}
            >
              <div className="flex items-center justify-center">
                {isPassed ? (
                  <Check className="w-4 h-4 md:w-6 md:h-6 stroke-[3]" />
                ) : (
                  <span className="text-xs md:text-base lg:text-lg font-mono font-black leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                )}
              </div>
              {/* Indicator dot under active step */}
              {isCurrent && (
                <span className="w-2 h-2 bg-[#FF781F] rounded-full mt-1 animate-ping" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});
