import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameState, Question, GameSettings, SyncAction } from './types/quiz';
import { StorageService } from './services/storage';
import { syncService } from './services/syncChannel';
import { soundManager } from './services/audio';
import { DecorativeBackground } from './components/DecorativeBackground';
import { WelcomeScreen } from './components/WelcomeScreen';
import { QuestionScreen } from './components/QuestionScreen';
import { OpeningStageScreen } from './components/OpeningStageScreen';
import { FinishScreen } from './components/FinishScreen';
import { RulesScreen } from './components/RulesScreen';
import { RulesModal } from './components/RulesModal';
import { ControlPanel } from './components/ControlPanel';
import { Sliders, Tv } from 'lucide-react';

export const App: React.FC = () => {
  // Check if current tab is dedicated projector mode (?mode=projector)
  const isProjectorMode = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('mode') === 'projector';

  // Questions and Settings from Storage
  const [questions, setQuestions] = useState<Question[]>(() => StorageService.getQuestions());
  const [settings, setSettings] = useState<GameSettings>(() => StorageService.getSettings());

  // Game state
  const [gameState, setGameState] = useState<GameState>(() => {
    const initialTime = questions[0]?.timeLimit || 15;
    return StorageService.getGameState(initialTime);
  });

  // UI state
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isControlOpen, setIsControlOpen] = useState(false);
  const [hasProjectorOpen, setHasProjectorOpen] = useState(false);

  // Timer reference
  const timerIntervalRef = useRef<number | null>(null);

  // Sound manager configuration:
  // RULE: Only ONE window plays audio!
  // If Projector window is open: Projector plays ALL audio, Controller stays completely silent!
  // If only 1 window is running: that window plays audio.
  useEffect(() => {
    if (isProjectorMode) {
      soundManager.setEnabled(settings.soundEnabled);
    } else {
      // If controller has projector open, mute controller audio
      soundManager.setEnabled(settings.soundEnabled && !hasProjectorOpen);
    }
  }, [settings.soundEnabled, isProjectorMode, hasProjectorOpen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // -------------------------------------------------------------
  // DYNAMIC 16:9 STAGE SCALING & PROJECTOR CLASS
  // -------------------------------------------------------------
  useEffect(() => {
    if (isProjectorMode) {
      document.documentElement.classList.add('projector-mode');
    } else {
      document.documentElement.classList.remove('projector-mode');
    }
  }, [isProjectorMode]);

  useEffect(() => {
    const scale = settings.ledScale || (isProjectorMode ? 1.15 : 1.0);
    document.documentElement.style.setProperty('--led-scale-factor', String(scale));
  }, [settings.ledScale, isProjectorMode]);

  // -------------------------------------------------------------
  // BROADCAST CHANNEL SYNCHRONIZATION
  // -------------------------------------------------------------
  // Projector listens to updates from MC
  useEffect(() => {
    const unsubscribe = syncService.subscribe((action: SyncAction) => {
      if (action.type === 'STATE_UPDATE') {
        setGameState(action.state);
      } else if (action.type === 'QUESTIONS_UPDATE') {
        setQuestions(action.questions);
      } else if (action.type === 'SETTINGS_UPDATE') {
        setSettings(action.settings);
      } else if (action.type === 'PROJECTOR_CONNECTED') {
        if (!isProjectorMode) {
          setHasProjectorOpen(true);
        }
      } else if (action.type === 'PROJECTOR_DISCONNECTED') {
        if (!isProjectorMode) {
          setHasProjectorOpen(false);
        }
      } else if (action.type === 'PLAY_SOUND') {
        // ONLY Projector plays audio when projector mode is active
        // Or if only controller is open (hasProjectorOpen is false)
        if (isProjectorMode || (!isProjectorMode && !hasProjectorOpen)) {
          if (action.sound === 'START') soundManager.playStart();
          else if (action.sound === 'TICK') soundManager.playCountdownTick(gameState.timeRemaining);
          else if (action.sound === 'TIMEOUT') soundManager.playTimeout();
          else if (action.sound === 'BELL') soundManager.playBell();
          else if (action.sound === 'VICTORY') soundManager.playVictory();
          else if (action.sound === 'OPENING') soundManager.playOpening();
          else if (action.sound === 'COUNTDOWN_START') soundManager.playCountdown();
          else if (action.sound === 'COUNTDOWN_PAUSE') soundManager.pauseCountdown();
          else if (action.sound === 'COUNTDOWN_RESUME') soundManager.resumeCountdown();
          else if (action.sound === 'COUNTDOWN_STOP') soundManager.stopCountdown();
          else if (action.sound === 'NEW_QUESTION_BLING') soundManager.playNewQuestionBling();
        }
      } else if (action.type === 'PING') {
        // If MC receives PING from new Projector window, answer with current full state
        if (!isProjectorMode) {
          syncService.post({
            type: 'PONG',
            state: gameState,
            questions,
            settings
          });
        }
      } else if (action.type === 'PONG') {
        // Projector received full state from MC
        if (isProjectorMode) {
          setGameState(action.state);
          setQuestions(action.questions);
          setSettings(action.settings);
        }
      }
    });

    // When mounting, if Projector mode, announce presence and ping MC
    let heartbeatInterval: number | null = null;
    if (isProjectorMode) {
      syncService.post({ type: 'PROJECTOR_CONNECTED' });
      syncService.post({ type: 'PING' });
      heartbeatInterval = window.setInterval(() => {
        syncService.post({ type: 'PROJECTOR_CONNECTED' });
      }, 3000);
    }

    return () => {
      if (isProjectorMode) {
        syncService.post({ type: 'PROJECTOR_DISCONNECTED' });
      }
      if (heartbeatInterval) clearInterval(heartbeatInterval);
      unsubscribe();
    };
  }, [isProjectorMode, gameState, questions, settings]);

  // -------------------------------------------------------------
  // STATE & SETTINGS UPDATERS
  // -------------------------------------------------------------
  const updateGameState = useCallback((partial: Partial<GameState>) => {
    setGameState((prev) => {
      const updated: GameState = {
        ...prev,
        ...partial,
        lastUpdated: Date.now()
      };
      StorageService.saveGameState(updated);
      syncService.post({ type: 'STATE_UPDATE', state: updated });
      return updated;
    });
  }, []);

  const updateQuestions = useCallback((newQuestions: Question[]) => {
    setQuestions(newQuestions);
    StorageService.saveQuestions(newQuestions);
    syncService.post({ type: 'QUESTIONS_UPDATE', questions: newQuestions });
  }, []);

  const updateSettings = useCallback((partial: Partial<GameSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...partial };
      StorageService.saveSettings(updated);
      syncService.post({ type: 'SETTINGS_UPDATE', settings: updated });
      return updated;
    });
  }, []);

  // Keyboard shortcuts for instant LED Zoom (+ / - / 0)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'INPUT' || activeTag === 'TEXTAREA') return;

      if (e.key === '+' || e.key === '=') {
        e.preventDefault();
        const currentScale = settings.ledScale || 1.15;
        const nextScale = Math.min(1.8, Math.round((currentScale + 0.05) * 100) / 100);
        updateSettings({ ledScale: nextScale });
      } else if (e.key === '-' || e.key === '_') {
        e.preventDefault();
        const currentScale = settings.ledScale || 1.15;
        const nextScale = Math.max(0.75, Math.round((currentScale - 0.05) * 100) / 100);
        updateSettings({ ledScale: nextScale });
      } else if (e.key === '0') {
        e.preventDefault();
        updateSettings({ ledScale: 1.15 });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.ledScale, updateSettings]);

  // -------------------------------------------------------------
  // TIMER TICK ENGINE (Only runs on MC / non-projector view)
  // -------------------------------------------------------------
  useEffect(() => {
    if (isProjectorMode) return; // Projector only mirrors state

    if (gameState.timerState === 'COUNTING') {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

      timerIntervalRef.current = window.setInterval(() => {
        setGameState((prev) => {
          if (prev.timerState !== 'COUNTING') return prev;

          const nextRemaining = prev.timeRemaining - 1;

          if (nextRemaining <= 0) {
            // Timer expired!
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            soundManager.playTimeout();
            syncService.post({ type: 'PLAY_SOUND', sound: 'TIMEOUT' });

            const lockedState: GameState = {
              ...prev,
              timeRemaining: 0,
              timerState: 'LOCKED',
              lastUpdated: Date.now()
            };
            StorageService.saveGameState(lockedState);
            syncService.post({ type: 'STATE_UPDATE', state: lockedState });
            return lockedState;
          }

          const runningState: GameState = {
            ...prev,
            timeRemaining: nextRemaining,
            lastUpdated: Date.now()
          };
          syncService.post({ type: 'STATE_UPDATE', state: runningState });
          return runningState;
        });
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }
    };
  }, [gameState.timerState, isProjectorMode]);

  // Open Projector Window in secondary tab/window
  const openProjectorWindow = () => {
    const projectorUrl = `${window.location.origin}${window.location.pathname}?mode=projector`;
    window.open(projectorUrl, 'BellBloomProjector', 'width=1920,height=1080,menubar=no,toolbar=no,location=no');
  };

  const handleStartFromWelcome = () => {
    if (!hasProjectorOpen) {
      soundManager.playOpening();
    }
    syncService.post({ type: 'PLAY_SOUND', sound: 'OPENING' });
    updateGameState({
      phase: 'OPENING',
      timerState: 'IDLE'
    });
  };

  const handleOpenQuestion = (index: number = 0) => {
    soundManager.stopOpening();
    soundManager.stopCountdown();
    soundManager.playNewQuestionBling();
    syncService.post({ type: 'PLAY_SOUND', sound: 'NEW_QUESTION_BLING' });
    const curQ = questions[index] || questions[0];
    updateGameState({
      phase: 'QUESTION',
      currentQuestionIndex: index,
      timerState: 'IDLE',
      timeRemaining: curQ.timeLimit,
      totalTimeForCurrent: curQ.timeLimit
    });
  };

  const handleRestart = () => {
    const firstQ = questions[0];
    updateGameState({
      phase: 'QUESTION',
      currentQuestionIndex: 0,
      timerState: 'IDLE',
      timeRemaining: firstQ.timeLimit,
      totalTimeForCurrent: firstQ.timeLimit
    });
  };

  const handleGoHome = () => {
    updateGameState({
      phase: 'WELCOME',
      timerState: 'IDLE'
    });
  };

  const curQuestion = questions[gameState.currentQuestionIndex] || questions[0];

  return (
    <div className="w-screen h-screen overflow-hidden relative select-none">
      <DecorativeBackground animated={settings.animationsEnabled}>
        {/* Projector indicator & Quick Zoom Tool on Stage Screen */}
        {isProjectorMode && (
          <div className="absolute top-2 left-2 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl text-white shadow-xl border border-white/20 transition-opacity opacity-40 hover:opacity-100">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Tv className="w-3.5 h-3.5" />
              <span>MÀN LED (16:9)</span>
            </div>
            <div className="h-3 w-[1px] bg-white/30" />
            <div className="flex items-center gap-1">
              <button
                onClick={() => {
                  const currentScale = settings.ledScale || 1.15;
                  updateSettings({ ledScale: Math.max(0.75, Math.round((currentScale - 0.05) * 100) / 100) });
                }}
                title="Thu nhỏ cỡ chữ (Phím -)"
                className="w-5 h-5 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded text-xs font-bold"
              >
                -
              </button>
              <span className="text-[11px] font-mono px-1 font-bold">
                {Math.round((settings.ledScale || 1.15) * 100)}%
              </span>
              <button
                onClick={() => {
                  const currentScale = settings.ledScale || 1.15;
                  updateSettings({ ledScale: Math.min(1.8, Math.round((currentScale + 0.05) * 100) / 100) });
                }}
                title="Phóng to cỡ chữ (Phím +)"
                className="w-5 h-5 flex items-center justify-center bg-white/20 hover:bg-white/40 rounded text-xs font-bold"
              >
                +
              </button>
              <button
                onClick={() => updateSettings({ ledScale: 1.15 })}
                title="Tự động cân đối chuẩn 16:9 (Phím 0)"
                className="ml-1 px-1.5 py-0.5 bg-amber-400 hover:bg-amber-300 text-slate-900 rounded text-[10px] font-bold"
              >
                Auto 16:9
              </button>
            </div>
          </div>
        )}

        {/* 1. WELCOME SCREEN */}
        {gameState.phase === 'WELCOME' && (
          <WelcomeScreen
            settings={settings}
            onStart={handleStartFromWelcome}
            onOpenRules={() => updateGameState({ phase: 'RULES', timerState: 'IDLE' })}
            onOpenControl={() => setIsControlOpen(true)}
            onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            onToggleFullscreen={toggleFullscreen}
            isProjectorMode={isProjectorMode}
          />
        )}

        {/* 1.2. FULL-SCREEN RULES SCREEN (Đầy đủ toàn màn hình cho sinh viên dễ theo dõi) */}
        {gameState.phase === 'RULES' && (
          <RulesScreen
            settings={settings}
            onGoHome={handleGoHome}
            onStartStage={handleStartFromWelcome}
            onOpenControl={() => setIsControlOpen(true)}
            onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            onToggleFullscreen={toggleFullscreen}
            isProjectorMode={isProjectorMode}
          />
        )}

        {/* 1.5. OPENING STAGE SCREEN (Nhạc Opening.mp3 & Màn chào sân khấu) */}
        {gameState.phase === 'OPENING' && (
          <OpeningStageScreen
            settings={settings}
            onOpenQuestion={handleOpenQuestion}
            onGoHome={handleGoHome}
            onOpenControl={() => setIsControlOpen(true)}
            onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            onToggleFullscreen={toggleFullscreen}
            isProjectorMode={isProjectorMode}
          />
        )}

        {/* 2. QUESTION SCREEN */}
        {gameState.phase === 'QUESTION' && (
          <QuestionScreen
            question={curQuestion}
            currentIndex={gameState.currentQuestionIndex}
            timerState={gameState.timerState}
            timeRemaining={gameState.timeRemaining}
            settings={settings}
            onHomeClick={handleGoHome}
            onOpenControl={() => setIsControlOpen(true)}
            onToggleSound={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            onToggleFullscreen={toggleFullscreen}
            isProjectorMode={isProjectorMode}
          />
        )}

        {/* 3. FINISH SCREEN */}
        {gameState.phase === 'FINISH' && (
          <FinishScreen
            settings={settings}
            onRestart={handleRestart}
            onGoHome={handleGoHome}
            onOpenControl={() => setIsControlOpen(true)}
            isProjectorMode={isProjectorMode}
          />
        )}
      </DecorativeBackground>

      {/* Floating Floating MC Control Opener button (Only on main window) */}
      {!isProjectorMode && (
        <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
          <button
            onClick={() => setIsControlOpen(!isControlOpen)}
            className="flex items-center gap-2 px-5 py-3 bg-[#084DB8] hover:bg-blue-800 text-white font-black text-sm rounded-2xl shadow-xl shadow-blue-900/30 border-2 border-white transition hover:scale-105 active:scale-95"
          >
            <Sliders className="w-4 h-4 text-amber-300" />
            <span>BẢNG ĐIỀU KHIỂN MC</span>
          </button>
        </div>
      )}

      {/* Control Panel Drawer / Modal (When opened) */}
      {!isProjectorMode && isControlOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-5xl h-[92vh] flex flex-col">
            <ControlPanel
              state={gameState}
              questions={questions}
              settings={settings}
              onUpdateState={updateGameState}
              onUpdateQuestions={updateQuestions}
              onUpdateSettings={updateSettings}
              onOpenProjectorWindow={openProjectorWindow}
              onClose={() => setIsControlOpen(false)}
              onGoHome={handleGoHome}
            />
          </div>
        </div>
      )}

      {/* Rules Modal */}
      <RulesModal
        isOpen={isRulesOpen}
        rules={settings.rulesText}
        onClose={() => setIsRulesOpen(false)}
        onStart={gameState.phase === 'WELCOME' ? handleStartFromWelcome : undefined}
      />
    </div>
  );
};
