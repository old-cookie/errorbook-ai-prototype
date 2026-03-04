import { EriColorVariant } from './eriColor';

export type EriEvolutionPath = 1 | 2 | 3;

export interface AppSettingsState {
  showEri: boolean;
  reduceMotion: boolean;
  eriColor: EriColorVariant;
  eriEvolutionPath: EriEvolutionPath;
}

export interface GameProgressState {
  totalXP: number;
  streakDays: number;
  badgesEarned: number;
  missionsCompletedToday: number;
  lastSessionScore: number;
  lastSessionTotal: number;
  lastSessionAt: string | null;
  coins: number;
  ownedHats: string[];
  ownedClothes: string[];
  equippedHat: string;
  equippedClothes: string;
}

export interface PracticeSessionSummary {
  sessionId: string;
  score: number;
  total: number;
  hintsUsed: number;
  questionResults?: PracticeQuestionResult[];
  missionMode?: 'math-practice' | 'english';
  english?: {
    completedPhases: Array<'write' | 'speak' | 'listening'>;
    writeChars: number;
    speakTurns: number;
    listeningTurns: number;
  };
}

export interface PracticeQuestionPartResult {
  id: string;
  prompt: string;
  userAnswer: string;
  acceptedAnswers: string[];
  isCorrect: boolean;
}

export interface PracticeQuestionResult {
  id: number;
  question: string;
  isCorrect: boolean;
  userAnswer?: string;
  acceptedAnswers?: string[];
  parts?: PracticeQuestionPartResult[];
}

export interface PracticeRewards {
  xpEarned: number;
  streakChanged: 'up' | 'down' | 'same';
}

export interface PurchaseResult {
  progress: GameProgressState;
  success: boolean;
  reason?: 'already-owned' | 'insufficient-coins';
}

const SETTINGS_KEY = 'errorbook:settings';
const PROGRESS_KEY = 'errorbook:progress';
const APPLIED_SESSIONS_KEY = 'errorbook:applied-sessions';
const PROGRESS_MIGRATION_V1_KEY = 'errorbook:progress-migration-v1';

const defaultSettings: AppSettingsState = {
  showEri: true,
  reduceMotion: false,
  eriColor: 'violet',
  eriEvolutionPath: 3,
};

const appSettingsSubscribers = new Set<() => void>();
const gameProgressSubscribers = new Set<() => void>();
let appSettingsCache: AppSettingsState = defaultSettings;
let appSettingsInitialized = false;

const defaultProgress: GameProgressState = {
  totalXP: 1230,
  streakDays: 7,
  badgesEarned: 2,
  missionsCompletedToday: 1,
  lastSessionScore: 2,
  lastSessionTotal: 3,
  lastSessionAt: null,
  coins: 600,
  ownedHats: ['hat-basic'],
  ownedClothes: ['clothes-basic'],
  equippedHat: 'hat-basic',
  equippedClothes: 'clothes-basic',
};

let gameProgressCache: GameProgressState = defaultProgress;
let gameProgressInitialized = false;

function parseJSON<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function normalizeEriEvolutionPath(path: unknown): EriEvolutionPath {
  return path === 1 || path === 2 || path === 3 ? path : 3;
}

export function getAppSettings(): AppSettingsState {
  if (!isBrowser()) {
    return appSettingsCache;
  }

  if (!appSettingsInitialized) {
    const parsed = parseJSON<AppSettingsState>(window.localStorage.getItem(SETTINGS_KEY), defaultSettings);
    appSettingsCache = {
      ...defaultSettings,
      ...parsed,
      eriEvolutionPath: normalizeEriEvolutionPath(parsed.eriEvolutionPath),
    };
    appSettingsInitialized = true;
  }

  return appSettingsCache;
}

export function updateAppSettings(patch: Partial<AppSettingsState>): AppSettingsState {
  const current = getAppSettings();
  const next = {
    ...current,
    ...patch,
    eriEvolutionPath: normalizeEriEvolutionPath(patch.eriEvolutionPath ?? current.eriEvolutionPath),
  };

  const hasChanged =
    next.showEri !== appSettingsCache.showEri ||
    next.reduceMotion !== appSettingsCache.reduceMotion ||
    next.eriColor !== appSettingsCache.eriColor ||
    next.eriEvolutionPath !== appSettingsCache.eriEvolutionPath;

  if (!hasChanged) {
    return appSettingsCache;
  }

  appSettingsCache = next;
  appSettingsInitialized = true;

  if (isBrowser()) {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(appSettingsCache));
  }

  appSettingsSubscribers.forEach((listener) => {
    listener();
  });

  return appSettingsCache;
}

export function subscribeAppSettings(listener: () => void): () => void {
  appSettingsSubscribers.add(listener);

  if (!isBrowser()) {
    return () => {
      appSettingsSubscribers.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === SETTINGS_KEY) {
      const parsed = parseJSON<AppSettingsState>(window.localStorage.getItem(SETTINGS_KEY), defaultSettings);
      const next = {
        ...defaultSettings,
        ...parsed,
        eriEvolutionPath: normalizeEriEvolutionPath(parsed.eriEvolutionPath),
      };
      const hasChanged =
        next.showEri !== appSettingsCache.showEri ||
        next.reduceMotion !== appSettingsCache.reduceMotion ||
        next.eriColor !== appSettingsCache.eriColor ||
        next.eriEvolutionPath !== appSettingsCache.eriEvolutionPath;

      if (hasChanged) {
        appSettingsCache = next;
        appSettingsInitialized = true;
        listener();
      }
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    appSettingsSubscribers.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

export function getGameProgress(): GameProgressState {
  if (!isBrowser()) {
    return gameProgressCache;
  }

  if (!gameProgressInitialized) {
    const parsedProgress = parseJSON<GameProgressState>(window.localStorage.getItem(PROGRESS_KEY), defaultProgress);
    const migrationDone = window.localStorage.getItem(PROGRESS_MIGRATION_V1_KEY) === 'done';
    const migratedProgress =
      !migrationDone && parsedProgress.coins < 600
        ? {
          ...parsedProgress,
          coins: 600,
        }
        : parsedProgress;

    gameProgressCache = {
      ...defaultProgress,
      ...migratedProgress,
    };

    if (!migrationDone) {
      window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameProgressCache));
      window.localStorage.setItem(PROGRESS_MIGRATION_V1_KEY, 'done');
    }

    gameProgressInitialized = true;
  }

  return gameProgressCache;
}

function saveGameProgress(next: GameProgressState): GameProgressState {
  gameProgressCache = next;
  gameProgressInitialized = true;

  if (isBrowser()) {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(gameProgressCache));
  }

  gameProgressSubscribers.forEach((listener) => {
    listener();
  });

  return next;
}

export function subscribeGameProgress(listener: () => void): () => void {
  gameProgressSubscribers.add(listener);

  if (!isBrowser()) {
    return () => {
      gameProgressSubscribers.delete(listener);
    };
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === PROGRESS_KEY) {
      gameProgressCache = {
        ...defaultProgress,
        ...parseJSON<GameProgressState>(window.localStorage.getItem(PROGRESS_KEY), defaultProgress),
      };
      gameProgressInitialized = true;
      listener();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    gameProgressSubscribers.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

export function updateGameProgress(patch: Partial<GameProgressState>): GameProgressState {
  const next: GameProgressState = {
    ...getGameProgress(),
    ...patch,
  };

  return saveGameProgress(next);
}

export function purchaseEriItem(
  itemType: 'hat' | 'clothes',
  itemId: string,
  price: number,
): PurchaseResult {
  const progress = getGameProgress();
  const ownedKey = itemType === 'hat' ? 'ownedHats' : 'ownedClothes';
  const ownedItems = progress[ownedKey];

  if (ownedItems.includes(itemId)) {
    return {
      progress,
      success: false,
      reason: 'already-owned',
    };
  }

  if (progress.coins < price) {
    return {
      progress,
      success: false,
      reason: 'insufficient-coins',
    };
  }

  const next = saveGameProgress({
    ...progress,
    coins: progress.coins - price,
    [ownedKey]: [...ownedItems, itemId],
  });

  return {
    progress: next,
    success: true,
  };
}

export function equipEriItem(itemType: 'hat' | 'clothes', itemId: string): GameProgressState {
  const progress = getGameProgress();
  const ownedItems = itemType === 'hat' ? progress.ownedHats : progress.ownedClothes;

  if (!ownedItems.includes(itemId)) {
    return progress;
  }

  return saveGameProgress({
    ...progress,
    equippedHat: itemType === 'hat' ? itemId : progress.equippedHat,
    equippedClothes: itemType === 'clothes' ? itemId : progress.equippedClothes,
  });
}

function getAppliedSessions(): string[] {
  if (!isBrowser()) {
    return [];
  }

  return parseJSON<string[]>(window.localStorage.getItem(APPLIED_SESSIONS_KEY), []);
}

function markSessionApplied(sessionId: string) {
  if (!isBrowser()) {
    return;
  }

  const sessions = getAppliedSessions();
  if (!sessions.includes(sessionId)) {
    window.localStorage.setItem(APPLIED_SESSIONS_KEY, JSON.stringify([...sessions, sessionId]));
  }
}

export function estimateSessionXP(score: number, total: number): number {
  const boundedScore = Math.max(0, Math.min(score, total));
  const base = 15 + boundedScore * 5;
  const perfectBonus = boundedScore === total ? 10 : 0;
  return base + perfectBonus;
}

export function applyPracticeSession(summary: PracticeSessionSummary): { progress: GameProgressState; rewards: PracticeRewards } {
  const progress = getGameProgress();

  if (getAppliedSessions().includes(summary.sessionId)) {
    return {
      progress,
      rewards: {
        xpEarned: 0,
        streakChanged: 'same',
      },
    };
  }

  const xpEarned = estimateSessionXP(summary.score, summary.total);
  const accuracy = summary.total > 0 ? summary.score / summary.total : 0;

  const nextStreak = accuracy >= 0.67 ? progress.streakDays + 1 : Math.max(1, progress.streakDays - 1);
  const streakChanged: PracticeRewards['streakChanged'] =
    nextStreak > progress.streakDays ? 'up' : nextStreak < progress.streakDays ? 'down' : 'same';

  const next: GameProgressState = {
    ...progress,
    totalXP: progress.totalXP + xpEarned,
    streakDays: nextStreak,
    missionsCompletedToday: Math.min(3, progress.missionsCompletedToday + 1),
    badgesEarned: summary.score === summary.total ? progress.badgesEarned + 1 : progress.badgesEarned,
    lastSessionScore: summary.score,
    lastSessionTotal: summary.total,
    lastSessionAt: new Date().toISOString(),
  };

  markSessionApplied(summary.sessionId);

  return {
    progress: saveGameProgress(next),
    rewards: {
      xpEarned,
      streakChanged,
    },
  };
}
