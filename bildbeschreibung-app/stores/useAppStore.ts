import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { users, User, isTeacher as checkIsTeacher } from '../data/auth';
import type { LanguageCode } from '../data/i18n';

interface LevelProgress {
  total: number;
  correct: number;
  attempts: number;
}

interface PhaseProgress {
  level1: LevelProgress;
  level2: LevelProgress;
  level3: LevelProgress;
}

interface VocabWord {
  word: string;
  category: string;
  wordType: string;
  correct: number;
  attempts: number;
  lastSeen: number;
  streak: number;
}

export interface ProgressState {
  phases: Record<string, PhaseProgress>;
  fokusGrammar: Record<string, { correct: number; attempts: number }>;
  vocab: { words: Record<string, VocabWord> };
  vocabGames: Record<string, { correct: number; attempts: number; bestScore: number }>;
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  level: number;
  // Daily goal tracking
  dailyGoal: number;                            // XP-Ziel pro Tag (Standard 20)
  dailyXpByDate: Record<string, number>;        // { "2026-04-11": 15, ... }
  // Achievements (Phase C)
  achievements: Record<string, string>;         // { "first_exercise": "2026-04-11", ... }
}

export interface LastActivity {
  type: 'phase' | 'grammar' | 'vocab-game';
  routePath: string;        // e.g. "/exercise/phase2" or "/wortschatz/cloze/cloze-park-l1"
  title: string;            // Human-readable label
  subtitle?: string;
  timestamp: number;        // ms since epoch
}

interface AppState {
  currentUser: User | null;
  isTeacher: boolean;
  progress: ProgressState;
  nativeLanguage: LanguageCode | null;
  showTranslations: boolean;
  hasCompletedOnboarding: boolean;
  lastActivity: LastActivity | null;
  favoriteWords: string[];
  /** List of achievement IDs newly unlocked since last consumed; UI can show a modal. */
  pendingUnlockedAchievements: string[];                       // list of vocabulary words marked "schwer/favorite"

  login: (username: string, password: string) => boolean;
  logout: () => void;

  setNativeLanguage: (lang: LanguageCode | null) => void;
  setShowTranslations: (show: boolean) => void;
  completeOnboarding: () => void;
  setLastActivity: (activity: LastActivity | null) => void;
  setDailyGoal: (goal: number) => void;
  toggleFavoriteWord: (word: string) => void;

  updateExerciseResult: (phaseId: string, level: number, correct: boolean) => void;
  updateVocabResult: (word: string, category: string, wordType: string, correct: boolean) => void;
  updateFokusGrammar: (topic: string, correct: boolean) => void;
  updateVocabGame: (gameKey: string, correct: number, total: number) => void;
  addXp: (amount: number) => void;
  resetProgress: () => void;

  getPhasePercent: (phaseId: string) => number;
  getOverallPercent: () => number;
  getFokusGrammarStats: () => Record<string, { correct: number; attempts: number }>;
  getVocabGameStats: (gameKey: string) => { correct: number; attempts: number; bestScore: number } | undefined;
  getTodayXp: () => number;
  getWeekXp: () => Array<{ date: string; xp: number }>;
  checkAndUnlockAchievements: () => string[];  // returns newly unlocked ids
  consumePendingUnlocks: () => string[];       // read+clear pending unlock list
}

const createEmptyLevelProgress = (): LevelProgress => ({
  total: 0,
  correct: 0,
  attempts: 0,
});

const createEmptyPhaseProgress = (): PhaseProgress => ({
  level1: createEmptyLevelProgress(),
  level2: createEmptyLevelProgress(),
  level3: createEmptyLevelProgress(),
});

const createEmptyProgress = (): ProgressState => ({
  phases: {
    phase1: createEmptyPhaseProgress(),
    phase2: createEmptyPhaseProgress(),
    phase3: createEmptyPhaseProgress(),
    phase4: createEmptyPhaseProgress(),
    example: createEmptyPhaseProgress(),
  },
  fokusGrammar: {},
  vocab: { words: {} },
  vocabGames: {},
  xp: 0,
  streak: 0,
  lastActiveDate: null,
  level: 1,
  dailyGoal: 20,
  dailyXpByDate: {},
  achievements: {},
});

function todayKey(): string {
  return new Date().toISOString().split('T')[0];
}

const XP_PER_CORRECT = 10;
const XP_PER_WRONG = 2;
const XP_PER_LEVEL = 100;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isTeacher: false,
      progress: createEmptyProgress(),
      nativeLanguage: null,
      showTranslations: true,
      hasCompletedOnboarding: false,
      lastActivity: null,
      favoriteWords: [],
      pendingUnlockedAchievements: [],

      setNativeLanguage: (lang: LanguageCode | null) => {
        set({ nativeLanguage: lang });
      },

      setShowTranslations: (show: boolean) => {
        set({ showTranslations: show });
      },

      completeOnboarding: () => {
        set({ hasCompletedOnboarding: true });
      },

      setLastActivity: (activity: LastActivity | null) => {
        set({ lastActivity: activity });
      },

      setDailyGoal: (goal: number) => {
        set((state) => ({
          progress: { ...state.progress, dailyGoal: Math.max(5, Math.min(100, goal)) },
        }));
      },

      toggleFavoriteWord: (word: string) => {
        set((state) => {
          const favs = state.favoriteWords.includes(word)
            ? state.favoriteWords.filter((w) => w !== word)
            : [...state.favoriteWords, word];
          return { favoriteWords: favs };
        });
      },

      login: (username: string, password: string) => {
        const user = users.find(
          (u) => u.username === username.toLowerCase().trim() && u.password === password
        );
        if (user) {
          set({ currentUser: user, isTeacher: checkIsTeacher(user.username) });
          const today = new Date().toISOString().split('T')[0];
          const state = get();
          const lastDate = state.progress.lastActiveDate;
          let newStreak = state.progress.streak;

          if (lastDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            newStreak = lastDate === yesterday ? newStreak + 1 : 1;
            set({
              progress: { ...state.progress, streak: newStreak, lastActiveDate: today },
            });
          }
          return true;
        }
        return false;
      },

      logout: () => {
        set({ currentUser: null, isTeacher: false });
      },

      updateExerciseResult: (phaseId: string, level: number, correct: boolean) => {
        set((state) => {
          const progress = { ...state.progress };
          const phases = { ...progress.phases };
          const phase = { ...(phases[phaseId] || createEmptyPhaseProgress()) };
          const levelKey = `level${level}` as keyof PhaseProgress;
          const levelData = { ...phase[levelKey] };

          levelData.attempts += 1;
          levelData.total += 1;
          if (correct) levelData.correct += 1;

          phase[levelKey] = levelData;
          phases[phaseId] = phase;
          progress.phases = phases;

          const xpGain = correct ? XP_PER_CORRECT : XP_PER_WRONG;
          progress.xp = (progress.xp || 0) + xpGain;
          progress.level = Math.floor(progress.xp / XP_PER_LEVEL) + 1;

          const today = todayKey();
          if (progress.lastActiveDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            progress.streak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;
            progress.lastActiveDate = today;
          }

          // Track daily XP
          const dailyXpByDate = { ...(progress.dailyXpByDate || {}) };
          dailyXpByDate[today] = (dailyXpByDate[today] || 0) + xpGain;
          progress.dailyXpByDate = dailyXpByDate;

          return { progress };
        });
        // Check achievements after state update (async microtask)
        setTimeout(() => get().checkAndUnlockAchievements(), 0);
      },

      updateVocabResult: (word: string, category: string, wordType: string, correct: boolean) => {
        set((state) => {
          const progress = { ...state.progress };
          const vocab = { ...progress.vocab, words: { ...progress.vocab.words } };
          const existing = vocab.words[word] || {
            word,
            category,
            wordType,
            correct: 0,
            attempts: 0,
            lastSeen: 0,
            streak: 0,
          };

          vocab.words[word] = {
            ...existing,
            attempts: existing.attempts + 1,
            correct: existing.correct + (correct ? 1 : 0),
            lastSeen: Date.now(),
            streak: correct ? existing.streak + 1 : 0,
          };

          progress.vocab = vocab;
          return { progress };
        });
      },

      updateFokusGrammar: (topic: string, correct: boolean) => {
        set((state) => {
          const progress = { ...state.progress };
          const fokus = { ...progress.fokusGrammar };
          const existing = fokus[topic] || { correct: 0, attempts: 0 };
          fokus[topic] = {
            correct: existing.correct + (correct ? 1 : 0),
            attempts: existing.attempts + 1,
          };
          progress.fokusGrammar = fokus;
          return { progress };
        });
      },

      updateVocabGame: (gameKey: string, correct: number, total: number) => {
        set((state) => {
          const progress = { ...state.progress };
          const games = { ...(progress.vocabGames || {}) };
          const existing = games[gameKey] || { correct: 0, attempts: 0, bestScore: 0 };
          const scorePercent = total > 0 ? Math.round((correct / total) * 100) : 0;
          games[gameKey] = {
            correct: existing.correct + correct,
            attempts: existing.attempts + total,
            bestScore: Math.max(existing.bestScore, scorePercent),
          };
          progress.vocabGames = games;

          const xpGain = correct * XP_PER_CORRECT + (total - correct) * XP_PER_WRONG;
          progress.xp = (progress.xp || 0) + xpGain;
          progress.level = Math.floor(progress.xp / XP_PER_LEVEL) + 1;

          const today = todayKey();
          if (progress.lastActiveDate !== today) {
            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            progress.streak = progress.lastActiveDate === yesterday ? progress.streak + 1 : 1;
            progress.lastActiveDate = today;
          }

          // Track daily XP
          const dailyXpByDate = { ...(progress.dailyXpByDate || {}) };
          dailyXpByDate[today] = (dailyXpByDate[today] || 0) + xpGain;
          progress.dailyXpByDate = dailyXpByDate;

          return { progress };
        });
        setTimeout(() => get().checkAndUnlockAchievements(), 0);
      },

      addXp: (amount: number) => {
        set((state) => {
          const progress = { ...state.progress };
          progress.xp += amount;
          progress.level = Math.floor(progress.xp / XP_PER_LEVEL) + 1;
          return { progress };
        });
      },

      resetProgress: () => {
        set({ progress: createEmptyProgress() });
      },

      getPhasePercent: (phaseId: string) => {
        const phase = get().progress.phases[phaseId];
        if (!phase) return 0;
        const total = phase.level1.total + phase.level2.total + phase.level3.total;
        const correct = phase.level1.correct + phase.level2.correct + phase.level3.correct;
        return total === 0 ? 0 : Math.round((correct / total) * 100);
      },

      getOverallPercent: () => {
        const { phases } = get().progress;
        let total = 0;
        let correct = 0;
        for (const phase of Object.values(phases)) {
          total += phase.level1.total + phase.level2.total + phase.level3.total;
          correct += phase.level1.correct + phase.level2.correct + phase.level3.correct;
        }
        return total === 0 ? 0 : Math.round((correct / total) * 100);
      },

      getFokusGrammarStats: () => {
        return get().progress.fokusGrammar;
      },

      getVocabGameStats: (gameKey: string) => {
        return get().progress.vocabGames?.[gameKey];
      },

      getTodayXp: () => {
        const today = todayKey();
        return get().progress.dailyXpByDate?.[today] ?? 0;
      },

      getWeekXp: () => {
        const dailyXpByDate = get().progress.dailyXpByDate || {};
        const result: Array<{ date: string; xp: number }> = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(Date.now() - i * 86400000);
          const key = d.toISOString().split('T')[0];
          result.push({ date: key, xp: dailyXpByDate[key] ?? 0 });
        }
        return result;
      },

      checkAndUnlockAchievements: () => {
        // Lazy-import to avoid circular dep with data/achievements.ts
        const { achievements } = require('../data/achievements') as typeof import('../data/achievements');
        const state = get();
        const current = state.progress.achievements || {};
        const newlyUnlocked: string[] = [];
        const today = todayKey();
        for (const def of achievements) {
          if (current[def.id]) continue;
          if (def.check({ progress: state.progress, favoriteWords: state.favoriteWords })) {
            newlyUnlocked.push(def.id);
          }
        }
        if (newlyUnlocked.length > 0) {
          set((s) => {
            const progress = { ...s.progress };
            const achv = { ...(progress.achievements || {}) };
            for (const id of newlyUnlocked) {
              achv[id] = today;
            }
            progress.achievements = achv;
            return {
              progress,
              pendingUnlockedAchievements: [
                ...s.pendingUnlockedAchievements,
                ...newlyUnlocked,
              ],
            };
          });
        }
        return newlyUnlocked;
      },

      consumePendingUnlocks: () => {
        const state = get();
        const pending = state.pendingUnlockedAchievements;
        if (pending.length === 0) return [];
        set({ pendingUnlockedAchievements: [] });
        return pending;
      },
    }),
    {
      name: 'dtz-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        currentUser: state.currentUser,
        isTeacher: state.isTeacher,
        progress: state.progress,
        nativeLanguage: state.nativeLanguage,
        showTranslations: state.showTranslations,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        lastActivity: state.lastActivity,
        favoriteWords: state.favoriteWords,
      }),
    }
  )
);
