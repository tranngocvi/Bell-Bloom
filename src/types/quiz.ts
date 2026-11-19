export type OptionKey = 'A' | 'B' | 'C' | 'D';

export type DifficultyLevel = 'Dễ' | 'Trung bình' | 'Khó';

export type QuestionType = 'multiple_choice' | 'written';

export interface Question {
  id: number;
  question: string;
  type?: QuestionType;
  imageUrl?: string | null;
  revealImageUrl?: string | null;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctOption: OptionKey;
  correctAnswerText?: string;
  explanation: string;
  timeLimit: number; // in seconds (5 - 300)
  difficulty: DifficultyLevel;
}

export type GamePhase = 'WELCOME' | 'RULES' | 'OPENING' | 'QUESTION' | 'FINISH';

export type TimerState = 'IDLE' | 'COUNTING' | 'PAUSED' | 'LOCKED' | 'REVEALED';

export interface GameSettings {
  defaultTimeLimit: number;
  soundEnabled: boolean;
  animationsEnabled: boolean;
  rulesText: string[];
  winnerName: string;
  customLogoUrl: string | null;
  schoolName: string;
  eventTitle: string;
  eventSlogan: string;
  isDemo: boolean;
  ledScale?: number; // e.g. 1.0 (100%), 1.15 (115%), 1.3 (130%), 1.5 (150%)
}

export interface GameState {
  phase: GamePhase;
  currentQuestionIndex: number; // 0 to 14
  timerState: TimerState;
  timeRemaining: number;
  totalTimeForCurrent: number;
  eliminatedOptions?: OptionKey[]; // For 50/50 lifeline: 2 incorrect options eliminated
  lastUpdated: number; // timestamp for syncing
}

export type SyncAction =
  | { type: 'STATE_UPDATE'; state: GameState }
  | { type: 'QUESTIONS_UPDATE'; questions: Question[] }
  | { type: 'SETTINGS_UPDATE'; settings: GameSettings }
  | { type: 'PING' }
  | { type: 'PONG'; state: GameState; questions: Question[]; settings: GameSettings }
  | { type: 'PROJECTOR_CONNECTED' }
  | { type: 'PROJECTOR_DISCONNECTED' }
  | { type: 'PLAY_SOUND'; sound: 'START' | 'TICK' | 'TIMEOUT' | 'BELL' | 'VICTORY' | 'OPENING' | 'COUNTDOWN_START' | 'COUNTDOWN_PAUSE' | 'COUNTDOWN_RESUME' | 'COUNTDOWN_STOP' | 'NEW_QUESTION_BLING' };
