import React from 'react';
import { Question, TimerState, GameSettings, OptionKey } from '../types/quiz';
import { TimerDisplay } from './TimerDisplay';
import { OptionCard } from './OptionCard';
import { ProgramLogo } from './ProgramLogo';
import { Volume2, VolumeX, Maximize2, Settings, ArrowLeft, Edit3, Sparkles } from 'lucide-react';

interface QuestionScreenProps {
  question: Question;
  currentIndex: number; // 0 to 14
  timerState: TimerState;
  timeRemaining: number;
  eliminatedOptions?: OptionKey[];
  settings: GameSettings;
  onHomeClick?: () => void;
  onOpenControl?: () => void;
  onToggleSound: () => void;
  onToggleFullscreen: () => void;
  isProjectorMode?: boolean;
}

export const QuestionScreen: React.FC<QuestionScreenProps> = React.memo(({
  question,
  currentIndex,
  timerState,
  timeRemaining,
  eliminatedOptions = [],
  settings,
  onHomeClick,
  onOpenControl,
  onToggleSound,
  onToggleFullscreen,
  isProjectorMode = false
}) => {
  const isRevealed = timerState === 'REVEALED';

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
          {/* Centered & Aligned Icon with Question Text and Optional Image */}
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
            {/* Question Illustration Image (Questions 6 & 7) */}
            {question.imageUrl && (
              <div className="shrink-0 flex items-center justify-center p-2 bg-slate-50 border-3 border-amber-300 rounded-2xl shadow-md overflow-hidden max-h-[160px]">
                <img
                  src={question.imageUrl}
                  alt="Hình ảnh câu hỏi"
                  className="max-h-[140px] w-auto object-contain rounded-xl"
                />
              </div>
            )}
          </div>
        </div>

        {/* 3. Question Body: Written Answer (Question 15) OR 4 Multiple Choice Options (Questions 1 - 14) */}
        {question.type === 'written' ? (
          <div className="w-full flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in-95 duration-400">
            {!isRevealed ? (
              /* State 1: Prompt contestants to write answer on board */
              <div className="w-full max-w-4xl p-10 bg-white border-4 border-amber-400 rounded-3xl shadow-2xl flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-amber-100 text-amber-700 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
                  <Edit3 className="w-10 h-10 text-amber-600 animate-bounce" />
                </div>
                <div className="px-6 py-2 bg-amber-400 text-slate-950 font-black text-lg uppercase tracking-wider rounded-full mb-3 shadow">
                  ✍️ CÂU HỎI VIẾT ĐÁP ÁN LÊN BẢNG
                </div>
                <h3 className="text-3xl font-black text-slate-800 mb-2">
                  HÃY VIẾT ĐÁP ÁN CHÍNH XÁC LÊN BẢNG CỦA BẠN!
                </h3>
                <p className="text-lg font-bold text-slate-500">
                  Khi có hiệu lệnh hết giờ (00 giây), dừng viết và đồng loạt giơ bảng theo hiệu lệnh của MC.
                </p>
              </div>
            ) : (
              /* State 2: Grand Golden Reveal */
              <div className="w-full max-w-4xl p-10 bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-4 border-white rounded-3xl shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-500 scale-105">
                <div className="px-8 py-2.5 bg-slate-900 text-amber-300 font-black text-xl uppercase tracking-widest rounded-full mb-4 shadow-xl border-2 border-white flex items-center gap-2">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span>ĐÁP ÁN CHÍNH XÁC</span>
                  <Sparkles className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-5xl font-black text-blue-950 mb-3 tracking-wide drop-shadow-sm font-heading">
                  👑 {question.correctAnswerText || 'Thầy Nguyễn Văn Tấn'} 👑
                </div>
                <p className="text-xl font-black text-amber-950/90">
                  Xin chúc mừng các bạn học sinh có câu trả lời chính xác!
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Standard 4 Multiple-Choice Options Grid (2x2) */
          <div className="w-full grid grid-cols-2 gap-5">
            <OptionCard
              optionKey="A"
              text={question.options.A}
              isRevealed={isRevealed}
              isCorrect={question.correctOption === 'A'}
              isEliminated={eliminatedOptions.includes('A')}
            />
            <OptionCard
              optionKey="B"
              text={question.options.B}
              isRevealed={isRevealed}
              isCorrect={question.correctOption === 'B'}
              isEliminated={eliminatedOptions.includes('B')}
            />
            <OptionCard
              optionKey="C"
              text={question.options.C}
              isRevealed={isRevealed}
              isCorrect={question.correctOption === 'C'}
              isEliminated={eliminatedOptions.includes('C')}
            />
            <OptionCard
              optionKey="D"
              text={question.options.D}
              isRevealed={isRevealed}
              isCorrect={question.correctOption === 'D'}
              isEliminated={eliminatedOptions.includes('D')}
            />
          </div>
        )}
      </div>
    </div>
  );
});
