import React from 'react';
import { Timer, AlertTriangle } from 'lucide-react';
import { TimerState } from '../types/quiz';

interface TimerDisplayProps {
  timeRemaining: number;
  totalTime: number;
  timerState: TimerState;
  size?: 'normal' | 'large' | 'compact';
}

export const TimerDisplay: React.FC<TimerDisplayProps> = ({
  timeRemaining,
  totalTime,
  timerState,
  size = 'large'
}) => {
  const isWarning = timeRemaining <= 5 && timeRemaining > 0 && timerState === 'COUNTING';
  const isTimeOut = timeRemaining === 0 || timerState === 'LOCKED';
  const progressPercent = totalTime > 0 ? (timeRemaining / totalTime) * 100 : 0;

  // Format mm:ss or simply ss
  const formattedTime = String(Math.max(0, timeRemaining)).padStart(2, '0');

  if (size === 'compact') {
    return (
      <div
        className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold border-2 transition-colors ${
          isWarning
            ? 'bg-rose-50 border-rose-500 text-rose-600 animate-pulse'
            : isTimeOut
            ? 'bg-amber-100 border-amber-600 text-amber-800'
            : 'bg-white border-blue-400 text-blue-900'
        }`}
      >
        <Timer className="w-5 h-5 text-amber-500" />
        <span className="font-mono text-xl">{formattedTime}s</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div
        className={`relative flex items-center justify-center transition-all duration-300 rounded-3xl border-4 ${
          isWarning
            ? 'bg-rose-50 border-rose-500 text-rose-600 shadow-xl shadow-rose-300/50 scale-105 animate-urgent'
            : isTimeOut
            ? 'bg-amber-50 border-amber-500 text-amber-700 shadow-lg'
            : timerState === 'PAUSED'
            ? 'bg-slate-100 border-slate-300 text-slate-500'
            : 'bg-white border-[#FFC83D] text-[#084DB8] shadow-lg shadow-sky-200'
        } ${
          size === 'large'
            ? 'px-8 py-3 min-w-[200px] md:min-w-[260px]'
            : 'px-5 py-2 min-w-[150px]'
        }`}
      >
        {/* Subtle circular SVG countdown stroke */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center">
            <svg className="w-14 h-14 md:w-16 md:h-16 transform -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke="#E2E8F0"
                strokeWidth="5"
                fill="none"
              />
              <circle
                cx="32"
                cy="32"
                r="26"
                stroke={isWarning ? '#EF4444' : isTimeOut ? '#F59E0B' : '#084DB8'}
                strokeWidth="5"
                strokeDasharray={163.3}
                strokeDashoffset={163.3 - (163.3 * progressPercent) / 100}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-300"
              />
            </svg>
            <Timer
              className={`w-6 h-6 absolute ${
                isWarning ? 'text-rose-600 animate-spin' : 'text-[#FF781F]'
              }`}
            />
          </div>

          <div className="text-center">
            <div
              className={`font-mono font-black tracking-tight leading-none ${
                size === 'large' ? 'text-5xl md:text-6xl lg:text-7xl' : 'text-4xl'
              }`}
            >
              {formattedTime}
              <span className="text-xl md:text-2xl font-bold ml-1 text-slate-400">s</span>
            </div>
            <div className="text-xs uppercase tracking-wider font-bold mt-1 text-slate-500">
              {timerState === 'COUNTING'
                ? 'Đang đếm ngược'
                : timerState === 'PAUSED'
                ? 'Đang tạm dừng'
                : timerState === 'IDLE'
                ? 'Sẵn sàng'
                : 'Đã khóa trả lời'}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Alert Banner when timeout or warning */}
      {isTimeOut && (
        <div className="mt-2 flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 text-white font-extrabold text-sm md:text-base rounded-full shadow-md animate-bounce">
          <AlertTriangle className="w-4 h-4" />
          <span>HẾT GIỜ - GIƠ BẢNG!</span>
        </div>
      )}
    </div>
  );
};
