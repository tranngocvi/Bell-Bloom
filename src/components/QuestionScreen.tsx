import React from 'react';
import { Question, TimerState, GameSettings } from '../types/quiz';
import { TimerDisplay } from './TimerDisplay';
import { OptionCard } from './OptionCard';
import { ProgressBar } from './ProgressBar';
import { ProgramLogo } from './ProgramLogo';
import { Info, Volume2, VolumeX, Maximize2, Settings, ArrowLeft } from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  currentIndex: number; // 0 to 14
  timerState: TimerState;
  timeRemaining: number;
  settings: GameSettings;
  onHomeClick?: () => void;
  onOpenControl?: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  isProjectorMode?: boolean;
}

const DIFFICULTY_BADGES: Record<string, { bg: string; text: string }> = {
  'Dễ': { bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'DỄ' },
  'Trung bình': { bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'TRUNG BÌNH' },
  'Khó': { bg: 'bg-rose-100 text-rose-800 border-rose-300', text: 'KHÓ' },
};

export const QuestionScreen: React.FC<QuestionScreenProps> = React.memo(({
  question,
  currentIndex,
  timerState,
  timeRemaining,
  settings,
  onHomeClick,
  onOpenControl,
  onToggleSound,
  onToggleFullscreen,
  isProjectorMode = false
}) => {
  const isRevealed = timerState === 'REVEALED';
  const diffBadge = DIFFICULTY_BADGES[question.difficulty] || DIFFICULTY_BADGES['Trung bình'];

  // Dynamic font sizing for long question text - Balanced for 1920x1080 stage
  const questionLength = question.question.length;
  let questionFontSize = 'text-4xl lg:text-[3.25rem]';
  if (questionLength > 120) {
    questionFontSize = 'text-2xl lg:text-[2.25rem]';
  } else if (questionLength > 70) {
    questionFontSize = 'text-3xl lg:text-[2.65rem]';
  }

  return (
    <div className="flex-1 w-full h-full flex flex-col justify-between p-8 lg:p-10 overflow-hidden relative z-20">
      {/* 1. Header Bar */}
      <div className="w-full flex items-center justify-between gap-4 pb-4 border-b-2 border-white/70">
        {/* Left: Program Branding, School Logo & Question Pill */}
        <div className="flex items-center gap-4">
          {onHomeClick && !isProjectorMode && (
            <button
              onClick={onHomeClick}
              title="Về màn hình chào"
              className="p-3 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-sm transition hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-[#084DB8]" />
            </button>
          )}

          {/* School Logo & Program Logo side-by-side in a polished badge */}
          <div className="bg-white/95 px-5 py-2.5 rounded-3xl shadow-md border-2 border-white flex items-center gap-4">
            {settings.customLogoUrl && (
              <img
                src={settings.customLogoUrl}
                alt="Logo trường"
                className="h-12 w-auto max-w-[180px] object-contain"
              />
            )}
            <div className="h-8 w-[2px] bg-slate-200" />
            <ProgramLogo size="md" />
          </div>

          {/* Question Counter Pill */}
          <div className="flex items-center gap-3">
            <div className="px-6 py-3 bg-[#084DB8] text-white font-black text-2xl rounded-2xl shadow-lg tracking-wider">
              CÂU {String(currentIndex + 1).padStart(2, '0')}/15
            </div>
            {/* Difficulty Badge */}
            <span className={`px-4 py-2 rounded-full text-base font-black border-2 shadow-sm ${diffBadge.bg}`}>
              {diffBadge.text}
            </span>
          </div>
        </div>

        {/* Center: Timer Display */}
        <div className="shrink-0">
          <TimerDisplay
            timeRemaining={timeRemaining}
            totalTime={question.timeLimit}
            timerState={timerState}
            size="large"
          />
        </div>

        {/* Right: Quick Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleSound}
            title={settings.soundEnabled ? 'Tắt âm thanh' : 'Bật âm thanh'}
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-sm transition hover:scale-105"
          >
            {settings.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-slate-400" />}
          </button>
          <button
            onClick={onToggleFullscreen}
            title="Toàn màn hình"
            className="p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-2xl shadow-sm transition hover:scale-105"
          >
            <Maximize2 className="w-5 h-5 text-[#084DB8]" />
          </button>
          {!isProjectorMode && onOpenControl && (
            <button
              onClick={onOpenControl}
              title="Bảng điều khiển BTC"
              className="p-2.5 bg-white/90 hover:bg-white text-[#084DB8] rounded-2xl shadow-sm transition hover:scale-105"
            >
              <Settings className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Central Full-Width Question Box (1920x1080 Stage Proportions) */}
      <div className="my-auto py-2 w-full animate-in fade-in zoom-in-98 duration-300">
        {/* Question Card - Balanced size, bold high-contrast text */}
        <div className={`bg-white border-4 border-white/95 rounded-3xl ${isRevealed ? 'p-6 mb-4' : 'p-8 mb-6'} shadow-2xl shadow-sky-300/50 transition-all duration-300 w-full`}>
          {/* Centered & Aligned Icon with Question Text */}
          <div className="flex items-center gap-6">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#FF8E3D] to-[#FF781F] text-white flex items-center justify-center font-black text-4xl shrink-0 shadow-xl border-3 border-white">
              ?
            </div>
            <div className="flex-1 min-w-0">
              <h2
                className={`font-black text-slate-900 leading-snug tracking-tight ${questionFontSize}`}
              >
                {question.question}
              </h2>
            </div>
          </div>
        </div>

        {/* 3. Four Full-Width Answer Options (2x2 Grid) */}
        <div className="w-full grid grid-cols-2 gap-5">
          <OptionCard
            optionKey="A"
            text={question.options.A}
            isRevealed={isRevealed}
            isCorrect={question.correctOption === 'A'}
          />
          <OptionCard
            optionKey="B"
            text={question.options.B}
            isRevealed={isRevealed}
            isCorrect={question.correctOption === 'B'}
          />
          <OptionCard
            optionKey="C"
            text={question.options.C}
            isRevealed={isRevealed}
            isCorrect={question.correctOption === 'C'}
          />
          <OptionCard
            optionKey="D"
            text={question.options.D}
            isRevealed={isRevealed}
            isCorrect={question.correctOption === 'D'}
          />
        </div>

        {/* 4. Explanation Box (Only shown after REVEALED) */}
        {isRevealed && question.explanation && (
          <div className="mt-4 p-5 rounded-3xl bg-amber-50/98 border-4 border-amber-300 shadow-xl animate-in fade-in slide-in-from-bottom-3 duration-400 w-full">
            <div className="flex items-start gap-4">
              <div className="p-2.5 bg-amber-200 text-amber-900 rounded-2xl shrink-0 mt-0.5">
                <Info className="w-7 h-7 text-amber-800" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black uppercase tracking-wider text-amber-800 mb-0.5">
                  GIẢI THÍCH CHI TIẾT
                </div>
                <p className="text-slate-800 font-extrabold text-xl leading-relaxed">
                  {question.explanation}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 5. Bottom Progress Bar (15 Milestones) */}
      <div className="w-full pt-3 border-t-2 border-white/70">
        <ProgressBar
          currentIndex={currentIndex}
          total={15}
          isInteractive={false}
        />
      </div>
    </div>
  );
});
