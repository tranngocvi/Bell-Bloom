import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Lock,
  Eye,
  SkipForward,
  RotateCcw,
  ExternalLink,
  Volume2,
  VolumeX,
  Sparkles,
  Download,
  Upload,
  RefreshCw,
  Edit3,
  CheckCircle,
  AlertTriangle,
  Home,
  Check,
  Tv,
  Keyboard,
  BookOpen
} from 'lucide-react';
import { Question, GameState, GameSettings, OptionKey } from '../types/quiz';
import { soundManager } from '../services/audio';
import { QuestionEditorModal } from './QuestionEditorModal';
import { ConfirmModal } from './ConfirmModal';
import { StorageService } from '../services/storage';
import { syncService } from '../services/syncChannel';

interface ControlPanelProps {
  state: GameState;
  questions: Question[];
  settings: GameSettings;
  onUpdateState: (newState: Partial<GameState>) => void;
  onUpdateQuestions: (newQuestions: Question[]) => void;
  onUpdateSettings: (newSettings: Partial<GameSettings>) => void;
  onOpenProjectorWindow: () => void;
  onClose?: () => void;
  onGoHome: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  state,
  questions,
  settings,
  onUpdateState,
  onUpdateQuestions,
  onUpdateSettings,
  onOpenProjectorWindow,
  onClose,
  onGoHome
}) => {
  const [activeTab, setActiveTab] = useState<'control' | 'questions' | 'settings'>('control');
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    action: () => void;
    isDanger?: boolean;
  }>({
    isOpen: false,
    title: '',
    message: '',
    action: () => {},
    isDanger: false
  });

  const [jsonError, setJsonError] = useState<string | null>(null);
  const [jsonSuccess, setJsonSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const currentQ = questions[state.currentQuestionIndex] || questions[0];

  // ---------------------------------------------
  // CONTROLLER ACTIONS
  // ---------------------------------------------
  const handleStartCountdown = () => {
    soundManager.stopOpening();
    soundManager.playCountdown();
    syncService.post({ type: 'PLAY_SOUND', sound: 'COUNTDOWN_START' });
    onUpdateState({
      timerState: 'COUNTING',
      phase: 'QUESTION'
    });
  };

  const handlePause = () => {
    soundManager.pauseCountdown();
    syncService.post({ type: 'PLAY_SOUND', sound: 'COUNTDOWN_PAUSE' });
    onUpdateState({ timerState: 'PAUSED' });
  };

  const handleResume = () => {
    soundManager.resumeCountdown();
    syncService.post({ type: 'PLAY_SOUND', sound: 'COUNTDOWN_RESUME' });
    onUpdateState({ timerState: 'COUNTING' });
  };

  const handleLockEarly = () => {
    soundManager.stopCountdown();
    soundManager.playTimeout();
    syncService.post({ type: 'PLAY_SOUND', sound: 'TIMEOUT' });
    onUpdateState({
      timerState: 'LOCKED',
      timeRemaining: 0
    });
  };

  const handleRevealAnswer = () => {
    soundManager.stopCountdown();
    soundManager.playBell();
    syncService.post({ type: 'PLAY_SOUND', sound: 'BELL' });
    onUpdateState({ timerState: 'REVEALED' });
  };

  const handleNextQuestion = () => {
    // If current timer is COUNTING, ask for confirmation
    if (state.timerState === 'COUNTING') {
      setConfirmConfig({
        isOpen: true,
        title: 'Chuyển câu khi đang đếm ngược?',
        message: 'Đồng hồ đếm ngược vẫn đang chạy. Bạn có chắc chắn muốn bỏ qua và chuyển câu ngay không?',
        isDanger: true,
        action: () => doAdvanceQuestion()
      });
      return;
    }

    doAdvanceQuestion();
  };

  const doAdvanceQuestion = () => {
    soundManager.stopCountdown();
    soundManager.stopOpening();
    syncService.post({ type: 'PLAY_SOUND', sound: 'COUNTDOWN_STOP' });

    if (state.currentQuestionIndex < 14) {
      const nextIdx = state.currentQuestionIndex + 1;
      const nextQ = questions[nextIdx];
      soundManager.playNewQuestionBling();
      syncService.post({ type: 'PLAY_SOUND', sound: 'NEW_QUESTION_BLING' });
      onUpdateState({
        currentQuestionIndex: nextIdx,
        phase: 'QUESTION',
        timerState: 'IDLE',
        timeRemaining: nextQ.timeLimit,
        totalTimeForCurrent: nextQ.timeLimit
      });
    } else {
      // Finished all 15 questions
      soundManager.playVictory();
      syncService.post({ type: 'PLAY_SOUND', sound: 'VICTORY' });
      onUpdateState({
        phase: 'FINISH',
        timerState: 'IDLE'
      });
    }
  };

  const handleJumpToQuestion = (index: number) => {
    if (index === state.currentQuestionIndex && state.phase === 'QUESTION') return;

    if (state.timerState === 'COUNTING') {
      setConfirmConfig({
        isOpen: true,
        title: `Chuyển tới Câu ${index + 1}?`,
        message: 'Thời gian câu hiện tại đang đếm ngược. Bạn có chắc muốn chuyển ngay?',
        isDanger: true,
        action: () => doJump(index)
      });
      return;
    }

    doJump(index);
  };

  const doJump = (index: number) => {
    soundManager.stopCountdown();
    soundManager.stopOpening();
    syncService.post({ type: 'PLAY_SOUND', sound: 'COUNTDOWN_STOP' });
    soundManager.playNewQuestionBling();
    syncService.post({ type: 'PLAY_SOUND', sound: 'NEW_QUESTION_BLING' });

    const targetQ = questions[index];
    onUpdateState({
      currentQuestionIndex: index,
      phase: 'QUESTION',
      timerState: 'IDLE',
      timeRemaining: targetQ.timeLimit,
      totalTimeForCurrent: targetQ.timeLimit
    });
  };

  const handleRestartGame = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Bắt đầu lại chương trình?',
      message: 'Tiến trình sẽ quay về Câu 1 và đặt lại đồng hồ thời gian. Bạn có chắc chắn?',
      isDanger: true,
      action: () => {
        const firstQ = questions[0];
        onUpdateState({
          phase: 'QUESTION',
          currentQuestionIndex: 0,
          timerState: 'IDLE',
          timeRemaining: firstQ.timeLimit,
          totalTimeForCurrent: firstQ.timeLimit
        });
      }
    });
  };

  const handleResetToDemo = () => {
    setConfirmConfig({
      isOpen: true,
      title: 'Khôi phục bộ câu hỏi demo?',
      message: 'Toàn bộ 15 câu hỏi hiện tại sẽ được thay thế bằng 15 câu hỏi demo mẫu chuẩn. Bạn có chắc chắn?',
      isDanger: true,
      action: () => {
        const demoQs = StorageService.resetQuestionsToDefault();
        onUpdateQuestions(demoQs);
        onUpdateSettings({ isDemo: true });
        setJsonSuccess('Đã khôi phục thành công 15 câu hỏi demo!');
        setTimeout(() => setJsonSuccess(null), 3000);
      }
    });
  };

  // ---------------------------------------------
  // JSON IMPORT / EXPORT
  // ---------------------------------------------
  const handleExportJson = () => {
    StorageService.exportToJsonFile(questions);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        const result = StorageService.validateQuestions(parsed);

        if (!result.valid || !result.questions) {
          setJsonError(result.errors.join(' | '));
          setJsonSuccess(null);
        } else {
          onUpdateQuestions(result.questions);
          onUpdateSettings({ isDemo: false });
          setJsonSuccess(`Nhập thành công bộ 15 câu hỏi chính thức!`);
          setJsonError(null);
          setTimeout(() => setJsonSuccess(null), 4000);
        }
      } catch (err) {
        setJsonError(`Lỗi đọc tệp JSON: ${(err as Error).message}`);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Logo upload
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      onUpdateSettings({ customLogoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
  };

  // ---------------------------------------------
  // KEYBOARD SHORTCUTS (MC Controller)
  // Space: Start / Pause / Resume
  // R: Reveal answer when locked
  // ArrowRight: Next question when revealed
  // M: Toggle audio
  // ---------------------------------------------
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not trigger if typing in input or textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        if (state.phase === 'QUESTION') {
          if (state.timerState === 'IDLE') handleStartCountdown();
          else if (state.timerState === 'COUNTING') handlePause();
          else if (state.timerState === 'PAUSED') handleResume();
        }
      } else if (e.code === 'KeyR' || e.key === 'r' || e.key === 'R') {
        if (state.phase === 'QUESTION' && state.timerState === 'LOCKED') {
          handleRevealAnswer();
        }
      } else if (e.code === 'ArrowRight') {
        if (state.phase === 'QUESTION' && state.timerState === 'REVEALED') {
          handleNextQuestion();
        }
      } else if (e.code === 'KeyM' || e.key === 'm' || e.key === 'M') {
        onUpdateSettings({ soundEnabled: !settings.soundEnabled });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state, settings]);

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-700">
      {/* 1. Header Toolbar */}
      <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#084DB8] text-white rounded-xl shadow-md">
            <Tv className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              BẢNG ĐIỀU KHIỂN MC / BTC
              {settings.isDemo ? (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  DEMO (15 CÂU)
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  CHÍNH THỨC
                </span>
              )}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Sự kiện Bell & Bloom - FPT POLYSCHOOL
            </p>
          </div>
        </div>

        {/* Top Buttons: Projector, Home, Close */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenProjectorWindow}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs md:text-sm rounded-xl shadow-md transition hover:scale-105 active:scale-95"
          >
            <ExternalLink className="w-4 h-4" />
            <span>MỞ MÀN HÌNH TRÌNH CHIẾU</span>
          </button>

          <button
            onClick={onGoHome}
            title="Về màn hình chào"
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition"
          >
            <Home className="w-5 h-5" />
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
            >
              Đóng
            </button>
          )}
        </div>
      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/80 px-4">
        <button
          onClick={() => setActiveTab('control')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'control'
              ? 'border-[#FF781F] text-[#FF781F] bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Điều khiển chương trình</span>
        </button>

        <button
          onClick={() => setActiveTab('questions')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'questions'
              ? 'border-[#FF781F] text-[#FF781F] bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Edit3 className="w-4 h-4" />
          <span>Quản lý 15 câu hỏi</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 font-bold text-sm border-b-2 transition flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-[#FF781F] text-[#FF781F] bg-slate-800/40'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Thiết lập & Logo</span>
        </button>
      </div>

      {/* 2.5 Quick LED Display & Scale Toolbar (Chuẩn cố định 16:9 cho màn hình sự kiện) */}
      <div className="bg-slate-900 border-b border-slate-800 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-bold">
          <Tv className="w-4 h-4 text-emerald-400" />
          <span>Khung hình Màn LED:</span>
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 border border-emerald-700/60 rounded-md font-mono font-bold">
            CỐ ĐỊNH 16:9
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            (Không bị lệch, méo hay vỡ khung)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Cỡ chữ sân khấu:</span>
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => onUpdateSettings({ ledScale: 1.0 })}
              className={`px-2.5 py-1 rounded-lg font-bold transition ${
                (settings.ledScale || 1.0) === 1.0
                  ? 'bg-amber-400 text-slate-950 shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Tự động (100%)
            </button>
            <button
              onClick={() => onUpdateSettings({ ledScale: 1.15 })}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                settings.ledScale === 1.15
                  ? 'bg-[#FF781F] text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              115% To
            </button>
            <button
              onClick={() => onUpdateSettings({ ledScale: 1.3 })}
              className={`px-2 py-1 rounded-lg font-bold transition ${
                settings.ledScale === 1.3
                  ? 'bg-[#FF781F] text-white shadow'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              130% Rất to
            </button>

            <div className="h-4 w-[1px] bg-slate-700 mx-1" />

            <button
              onClick={() => {
                const cur = settings.ledScale || 1.0;
                onUpdateSettings({ ledScale: Math.max(0.7, Math.round((cur - 0.05) * 100) / 100) });
              }}
              title="Giảm 5% (Phím -)"
              className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-bold"
            >
              -
            </button>
            <span className="font-mono font-bold text-white px-1">
              {Math.round((settings.ledScale || 1.0) * 100)}%
            </span>
            <button
              onClick={() => {
                const cur = settings.ledScale || 1.0;
                onUpdateSettings({ ledScale: Math.min(1.5, Math.round((cur + 0.05) * 100) / 100) });
              }}
              title="Tăng 5% (Phím +)"
              className="w-6 h-6 flex items-center justify-center bg-slate-700 hover:bg-slate-600 rounded text-slate-200 font-bold"
            >
              +
            </button>
          </div>
        </div>
      </div>

      {/* 3. Tab Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* TAB 1: ĐIỀU KHIỂN CHƯƠNG TRÌNH */}
        {activeTab === 'control' && (
          <div className="space-y-6">
            {/* Current Question Info & Live State */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Question Summary Box */}
              <div className="lg:col-span-2 p-5 bg-slate-800/80 border border-slate-700 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-[#084DB8] text-white font-black text-sm rounded-lg">
                      CÂU {String(state.currentQuestionIndex + 1).padStart(2, '0')}/15
                    </span>
                    <span className="text-xs font-bold text-slate-400">
                      Mức độ: {currentQ.difficulty} • {currentQ.timeLimit}s
                    </span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-mono">
                    ID #{currentQ.id}
                  </span>
                </div>

                <h3 className="text-lg md:text-xl font-bold text-white mb-3">
                  {currentQ.question}
                </h3>

                {/* Options preview (Multiple Choice or Written Answer) */}
                {currentQ.type === 'written' ? (
                  <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/50 flex flex-col items-start gap-1.5 my-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <span>✍️ CÂU HỎI VIẾT ĐÁP ÁN (TỰ LUẬN)</span>
                    </div>
                    <div className="text-base font-black text-white">
                      Đáp án chính xác: <span className="text-amber-300 font-extrabold">{currentQ.correctAnswerText || 'Thầy Nguyễn Văn Tấn'}</span>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {(['A', 'B', 'C', 'D'] as OptionKey[]).map((k) => (
                      <div
                        key={k}
                        className={`p-2 rounded-xl flex items-center gap-2 border ${
                          currentQ.correctOption === k
                            ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-300 font-bold'
                            : 'bg-slate-900/60 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                          {k}
                        </span>
                        <span className="truncate">{currentQ.options[k]}</span>
                        {currentQ.correctOption === k && (
                          <Check className="w-3.5 h-3.5 text-emerald-400 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Correct answer & explanation peek */}
                <div className="mt-3 pt-3 border-t border-slate-700/60 flex items-start gap-2 text-xs text-amber-300/90">
                  <span className="font-bold text-amber-400">
                    {currentQ.type === 'written'
                      ? `Đáp án viết: [ ${currentQ.correctAnswerText || 'Thầy Nguyễn Văn Tấn'} ]`
                      : `Đáp án đúng: [${currentQ.correctOption}] ${currentQ.options[currentQ.correctOption]}`}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-300 italic">{currentQ.explanation}</span>
                </div>
              </div>

              {/* Timer & Live Status Card */}
              <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  ĐỒNG HỒ ĐẾM NGƯỢC
                </div>
                <div className="font-mono text-6xl font-black text-amber-400 mb-1">
                  {String(Math.max(0, state.timeRemaining)).padStart(2, '0')}s
                </div>
                <div
                  className={`text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wide mb-3 ${
                    state.timerState === 'COUNTING'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                      : state.timerState === 'PAUSED'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : state.timerState === 'LOCKED'
                      ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                      : state.timerState === 'REVEALED'
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/40'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {state.timerState === 'COUNTING'
                    ? 'Đang đếm ngược'
                    : state.timerState === 'PAUSED'
                    ? 'Tạm dừng'
                    : state.timerState === 'LOCKED'
                    ? 'Đã khóa trả lời'
                    : state.timerState === 'REVEALED'
                    ? 'Đã công bố đáp án'
                    : 'Chưa tính giờ'}
                </div>

                {/* Keyboard tip */}
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-900/70 px-2.5 py-1 rounded-lg">
                  <Keyboard className="w-3.5 h-3.5 text-amber-400" />
                  <span>Phím tắt: [Space], [R], [→]</span>
                </div>
              </div>
            </div>

            {/* Main Stage Controls Buttons */}
            <div className="p-5 bg-slate-800/90 border border-slate-700 rounded-2xl">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                CÁC LỆNH ĐIỀU KHIỂN CÂU HỎI
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* 1. Start Countdown */}
                {state.timerState === 'IDLE' && (
                  <button
                    onClick={handleStartCountdown}
                    className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-lg shadow-emerald-900/40 transition hover:scale-105 active:scale-95"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>BẮT ĐẦU ĐẾM NGƯỢC (Space)</span>
                  </button>
                )}

                {/* 2. Pause / Resume */}
                {state.timerState === 'COUNTING' && (
                  <>
                    <button
                      onClick={handlePause}
                      className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-5 py-4 bg-amber-600 hover:bg-amber-500 text-white font-black text-base rounded-2xl shadow-md transition hover:scale-105"
                    >
                      <Pause className="w-5 h-5 fill-current" />
                      <span>TẠM DỪNG (Space)</span>
                    </button>
                    <button
                      onClick={handleLockEarly}
                      className="flex-1 min-w-[160px] flex items-center justify-center gap-2 px-5 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black text-base rounded-2xl shadow-md transition hover:scale-105"
                    >
                      <Lock className="w-5 h-5" />
                      <span>KHÓA TRẢ LỜI SỚM</span>
                    </button>
                  </>
                )}

                {state.timerState === 'PAUSED' && (
                  <button
                    onClick={handleResume}
                    className="flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg rounded-2xl shadow-md transition hover:scale-105"
                  >
                    <Play className="w-5 h-5 fill-current" />
                    <span>TIẾP TỤC ĐẾM (Space)</span>
                  </button>
                )}

                {/* 3. Reveal Answer (Only available when LOCKED) */}
                {state.timerState === 'LOCKED' && (
                  <button
                    onClick={handleRevealAnswer}
                    className="flex-1 min-w-[220px] flex items-center justify-center gap-2 px-6 py-4 bg-[#FF781F] hover:bg-[#E65D07] text-white font-black text-lg rounded-2xl shadow-lg shadow-orange-950/40 transition hover:scale-105 active:scale-95 animate-pulse"
                  >
                    <Eye className="w-5 h-5" />
                    <span>CÔNG BỐ ĐÁP ÁN (Phím R)</span>
                  </button>
                )}

                {/* 4. Next Question / Finish (Available anytime or after reveal) */}
                <button
                  onClick={handleNextQuestion}
                  className={`flex-1 min-w-[180px] flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-black text-base transition ${
                    state.timerState === 'REVEALED'
                      ? 'bg-[#084DB8] hover:bg-blue-600 text-white shadow-lg shadow-blue-950/40 hover:scale-105'
                      : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
                  }`}
                >
                  <SkipForward className="w-5 h-5" />
                  <span>
                    {state.currentQuestionIndex === 14
                      ? 'KẾT THÚC CHƯƠNG TRÌNH'
                      : 'CÂU TIẾP THEO (→)'}
                  </span>
                </button>
              </div>
            </div>

            {/* Quick 15 Question Selector Bar */}
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  CHỌN TRỰC TIẾP CÂU HỎI (1 - 15)
                </span>
                <span className="text-xs text-slate-400">
                  Nhấp vào số câu để chuyển nhanh
                </span>
              </div>

              <div className="grid grid-cols-5 sm:grid-cols-15 gap-1.5">
                {questions.map((q, idx) => {
                  const isCur = idx === state.currentQuestionIndex;
                  const isDone = idx < state.currentQuestionIndex;
                  return (
                    <button
                      key={q.id}
                      onClick={() => handleJumpToQuestion(idx)}
                      className={`py-2 px-1 rounded-xl text-xs font-mono font-bold transition flex flex-col items-center justify-center ${
                        isCur
                          ? 'bg-[#FF781F] text-white border-2 border-white shadow-md scale-105'
                          : isDone
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                          : 'bg-slate-900/80 text-slate-400 border border-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <span>{q.id}</span>
                      <span className="text-[10px] opacity-75">{q.difficulty[0]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Secondary Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    soundManager.stopCountdown();
                    soundManager.stopOpening();
                    onUpdateState({ phase: 'RULES', timerState: 'IDLE' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs rounded-xl transition"
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  <span>Màn hình Thể lệ</span>
                </button>

                <button
                  onClick={() => {
                    soundManager.stopCountdown();
                    soundManager.playOpening();
                    syncService.post({ type: 'PLAY_SOUND', sound: 'OPENING' });
                    onUpdateState({ phase: 'OPENING', timerState: 'IDLE' });
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Sân khấu Mở đầu (Nhạc Opening)</span>
                </button>

                <button
                  onClick={handleRestartGame}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Bắt đầu lại từ Câu 1</span>
                </button>

                <button
                  onClick={onGoHome}
                  className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
                >
                  <Home className="w-4 h-4 text-sky-400" />
                  <span>Về màn hình chào</span>
                </button>
              </div>

              <div className="text-xs text-slate-500 font-semibold">
                Dữ liệu đồng bộ realtime với màn hình trình chiếu
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUẢN LÝ 15 CÂU HỎI */}
        {activeTab === 'questions' && (
          <div className="space-y-4">
            {/* Top Toolbar: Export, Import, Reset Demo */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-800/80 border border-slate-700 rounded-2xl">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition"
                >
                  <Download className="w-4 h-4 text-sky-400" />
                  <span>Xuất JSON</span>
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition"
                >
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Nhập JSON</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImportJson}
                  accept=".json,application/json"
                  className="hidden"
                />

                <button
                  onClick={handleResetToDemo}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Khôi phục demo gốc</span>
                </button>
              </div>

              {/* Status Badge toggle */}
              <button
                onClick={() => onUpdateSettings({ isDemo: !settings.isDemo })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                  settings.isDemo
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                }`}
              >
                {settings.isDemo ? '🏷️ Trạng thái: BỘ DEMO (Bấm để đổi)' : '🏷️ Trạng thái: BỘ CHÍNH THỨC'}
              </button>
            </div>

            {/* Error or Success notification */}
            {jsonError && (
              <div className="p-3 bg-rose-950/80 border border-rose-600 text-rose-200 text-xs font-bold rounded-xl flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{jsonError}</span>
              </div>
            )}
            {jsonSuccess && (
              <div className="p-3 bg-emerald-950/80 border border-emerald-600 text-emerald-200 text-xs font-bold rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{jsonSuccess}</span>
              </div>
            )}

            {/* Questions List (15 items) */}
            <div className="space-y-2.5">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className={`p-4 rounded-2xl border transition flex items-center justify-between gap-4 ${
                    idx === state.currentQuestionIndex
                      ? 'bg-slate-800 border-amber-400/80 shadow-md'
                      : 'bg-slate-800/60 border-slate-700/80 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="w-8 h-8 rounded-xl bg-slate-700 text-slate-200 font-mono font-black text-sm flex items-center justify-center shrink-0">
                      {q.id}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded font-bold bg-slate-700 text-slate-300">
                          {q.difficulty}
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {q.timeLimit}s
                        </span>
                        <span className="text-xs font-bold text-emerald-400">
                          Đáp án đúng: [{q.correctOption}]
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-200 truncate">
                        {q.question}
                      </p>
                    </div>
                  </div>

                  {/* Edit button */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => setEditingQuestion(q)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-bold text-xs rounded-xl transition"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-sky-400" />
                      <span>Sửa</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: THIẾT LẬP & LOGO */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-2xl">
            {/* 1. General Settings */}
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                THIẾT LẬP HỆ THỐNG
              </h3>

              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Âm thanh hiệu ứng</div>
                  <div className="text-xs text-slate-400">Bật tiếng chuông, đếm ngược và thông báo</div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => soundManager.playBell()}
                    className="px-2.5 py-1 text-xs bg-slate-700 hover:bg-slate-600 rounded-lg text-slate-300"
                  >
                    Test chuông
                  </button>
                  <button
                    onClick={() => onUpdateSettings({ soundEnabled: !settings.soundEnabled })}
                    className={`p-2 rounded-xl transition ${
                      settings.soundEnabled
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {settings.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Animations Toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-700">
                <div>
                  <div className="text-sm font-bold text-white">Hiệu ứng chuyển động & Confetti</div>
                  <div className="text-xs text-slate-400">Hoa, mây bay, pháo giấy kết thúc</div>
                </div>
                <button
                  onClick={() => onUpdateSettings({ animationsEnabled: !settings.animationsEnabled })}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition ${
                    settings.animationsEnabled
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-700 text-slate-400'
                  }`}
                >
                  {settings.animationsEnabled ? 'ĐANG BẬT' : 'ĐANG TẮT'}
                </button>
              </div>

              {/* Winner Name Input */}
              <div className="pt-3 border-t border-slate-700">
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tên người chiến thắng (Hiển thị tại màn hình kết thúc)
                </label>
                <input
                  type="text"
                  value={settings.winnerName}
                  onChange={(e) => onUpdateSettings({ winnerName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn A - Lớp 10A1"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* 2. School Logo & Branding */}
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                LOGO & THÔNG TIN ĐƠN VỊ
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Tên đơn vị tổ chức
                </label>
                <input
                  type="text"
                  value={settings.schoolName}
                  onChange={(e) => onUpdateSettings({ schoolName: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white font-bold text-sm outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Logo tùy chỉnh
                </label>
                <div className="flex items-center gap-3">
                  {settings.customLogoUrl ? (
                    <img
                      src={settings.customLogoUrl}
                      alt="Logo preview"
                      className="h-12 w-auto object-contain bg-white/10 p-1 rounded-lg border border-slate-700"
                    />
                  ) : (
                    <div className="text-xs text-slate-400 italic">Chưa tải logo lên</div>
                  )}

                  <button
                    onClick={() => logoInputRef.current?.click()}
                    className="px-3.5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs rounded-xl transition"
                  >
                    Tải logo lên
                  </button>
                  {settings.customLogoUrl && (
                    <button
                      onClick={() => onUpdateSettings({ customLogoUrl: null })}
                      className="px-3 py-2 text-rose-400 hover:bg-rose-950/40 text-xs font-bold rounded-xl transition"
                    >
                      Xóa logo
                    </button>
                  )}
                  <input
                    type="file"
                    ref={logoInputRef}
                    onChange={handleLogoUpload}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* 3. Rules Editing */}
            <div className="p-5 bg-slate-800/80 border border-slate-700 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                CHỈNH SỬA THỂ LỆ (5 ĐIỀU)
              </h3>
              {settings.rulesText.map((rule, rIdx) => (
                <div key={rIdx} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                    {rIdx + 1}
                  </span>
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => {
                      const updated = [...settings.rulesText];
                      updated[rIdx] = e.target.value;
                      onUpdateSettings({ rulesText: updated });
                    }}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-medium outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Question Editor Modal */}
      <QuestionEditorModal
        isOpen={!!editingQuestion}
        question={editingQuestion}
        onClose={() => setEditingQuestion(null)}
        onSave={(updatedQ) => {
          const newQs = questions.map((q) => (q.id === updatedQ.id ? updatedQ : q));
          onUpdateQuestions(newQs);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        isDanger={confirmConfig.isDanger}
        onConfirm={() => {
          confirmConfig.action();
          setConfirmConfig({ ...confirmConfig, isOpen: false });
        }}
        onCancel={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
      />
    </div>
  );
};
