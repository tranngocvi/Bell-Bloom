import { Question, GameSettings, GameState } from '../types/quiz';
import { DEFAULT_QUESTIONS } from '../data/defaultQuestions';
import { DEFAULT_SETTINGS } from '../data/defaultRules';

const STORAGE_KEYS = {
  QUESTIONS: 'bb_questions_v3',
  SETTINGS: 'bb_settings_v3',
  GAME_STATE: 'bb_gamestate_v3'
};

export const StorageService = {
  getQuestions(): Question[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      if (data) {
        const parsed = JSON.parse(data);
        const validation = this.validateQuestions(parsed);
        if (validation.valid && validation.questions) {
          return validation.questions;
        }
      }
    } catch (e) {
      console.error('Failed to load questions from storage, using defaults:', e);
    }
    return DEFAULT_QUESTIONS;
  },

  saveQuestions(questions: Question[]): void {
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
  },

  resetQuestionsToDefault(): Question[] {
    localStorage.removeItem(STORAGE_KEYS.QUESTIONS);
    return DEFAULT_QUESTIONS;
  },

  getSettings(): GameSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        const parsed = JSON.parse(data);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          customLogoUrl: parsed.customLogoUrl || DEFAULT_SETTINGS.customLogoUrl
        };
      }
    } catch (e) {
      console.error('Failed to load settings from storage:', e);
    }
    return DEFAULT_SETTINGS;
  },

  saveSettings(settings: GameSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getGameState(initialTotalTime: number = 20): GameState {
    const defaultState: GameState = {
      phase: 'WELCOME',
      currentQuestionIndex: 0,
      timerState: 'IDLE',
      timeRemaining: initialTotalTime,
      totalTimeForCurrent: initialTotalTime,
      lastUpdated: Date.now()
    };

    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      if (data) {
        const parsed: GameState = JSON.parse(data);
        // If it was in COUNTING state when reloaded, calculate elapsed time
        if (parsed.timerState === 'COUNTING') {
          const elapsedSeconds = Math.floor((Date.now() - parsed.lastUpdated) / 1000);
          const newRemaining = Math.max(0, parsed.timeRemaining - elapsedSeconds);
          if (newRemaining <= 0) {
            parsed.timeRemaining = 0;
            parsed.timerState = 'LOCKED';
          } else {
            parsed.timeRemaining = newRemaining;
          }
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to load game state:', e);
    }
    return defaultState;
  },

  saveGameState(state: GameState): void {
    localStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify({
      ...state,
      lastUpdated: Date.now()
    }));
  },

  validateQuestions(data: unknown): { valid: boolean; errors: string[]; questions?: Question[] } {
    const errors: string[] = [];

    if (!Array.isArray(data)) {
      return { valid: false, errors: ['Dữ liệu câu hỏi phải là một mảng JSON (Array).'] };
    }

    if (data.length !== 15) {
      errors.push(`Số lượng câu hỏi phải đúng 15 câu (hiện tại có ${data.length} câu).`);
    }

    const seenIds = new Set<number>();
    const validatedQuestions: Question[] = [];

    data.forEach((q, idx) => {
      const qNum = idx + 1;
      if (!q || typeof q !== 'object') {
        errors.push(`Câu số ${qNum}: Dữ liệu không hợp lệ.`);
        return;
      }

      const id = Number(q.id);
      if (!id || id < 1 || id > 15) {
        errors.push(`Câu số ${qNum}: ID phải là số từ 1 đến 15 (hiện tại: ${q.id}).`);
      } else if (seenIds.has(id)) {
        errors.push(`Câu số ${qNum}: Bị trùng lặp ID ${id}.`);
      } else {
        seenIds.add(id);
      }

      if (!q.question || typeof q.question !== 'string' || !q.question.trim()) {
        errors.push(`Câu số ${qNum} (ID ${id || qNum}): Nội dung câu hỏi không được để trống.`);
      }

      const isWritten = q.type === 'written';

      if (!isWritten) {
        if (!q.options || typeof q.options !== 'object') {
          errors.push(`Câu số ${qNum}: Thiếu 4 phương án A, B, C, D.`);
        } else {
          const { A, B, C, D } = q.options as Record<string, unknown>;
          if (!A || typeof A !== 'string' || !A.trim()) errors.push(`Câu ${qNum}: Phương án A bị trống.`);
          if (!B || typeof B !== 'string' || !B.trim()) errors.push(`Câu ${qNum}: Phương án B bị trống.`);
          if (!C || typeof C !== 'string' || !C.trim()) errors.push(`Câu ${qNum}: Phương án C bị trống.`);
          if (!D || typeof D !== 'string' || !D.trim()) errors.push(`Câu ${qNum}: Phương án D bị trống.`);
        }
      }

      const correct = String(q.correctOption || 'A').toUpperCase();
      if (!isWritten && !['A', 'B', 'C', 'D'].includes(correct)) {
        errors.push(`Câu số ${qNum}: Đáp án đúng phải là A, B, C hoặc D (hiện tại: ${q.correctOption}).`);
      }

      const time = Number(q.timeLimit);
      if (isNaN(time) || time < 5 || time > 300) {
        errors.push(`Câu số ${qNum}: Thời gian trả lời phải từ 5 đến 300 giây (hiện tại: ${q.timeLimit}).`);
      }

      const difficulty = ['Dễ', 'Trung bình', 'Khó'].includes(q.difficulty) ? q.difficulty : 'Trung bình';

      validatedQuestions.push({
        id: id || qNum,
        question: String(q.question || '').trim(),
        type: isWritten ? 'written' : 'multiple_choice',
        imageUrl: q.imageUrl ? String(q.imageUrl).trim() : null,
        revealImageUrl: q.revealImageUrl ? String(q.revealImageUrl).trim() : null,
        options: {
          A: String(q.options?.A || '').trim(),
          B: String(q.options?.B || '').trim(),
          C: String(q.options?.C || '').trim(),
          D: String(q.options?.D || '').trim(),
        },
        correctOption: (['A', 'B', 'C', 'D'].includes(correct) ? correct : 'A') as 'A' | 'B' | 'C' | 'D',
        correctAnswerText: q.correctAnswerText ? String(q.correctAnswerText).trim() : undefined,
        explanation: String(q.explanation || '').trim(),
        timeLimit: Math.round(time || 15),
        difficulty
      });
    });

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    // Sort by id 1..15
    validatedQuestions.sort((a, b) => a.id - b.id);

    return { valid: true, errors: [], questions: validatedQuestions };
  },

  exportToJsonFile(questions: Question[], filename = 'bell-bloom-15-cau-hoi.json'): void {
    const jsonStr = JSON.stringify(questions, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
