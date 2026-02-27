export interface AppSettingsState {
  showEri: boolean;
  reduceMotion: boolean;
}

export interface GameProgressState {
  totalXP: number;
  streakDays: number;
  badgesEarned: number;
  missionsCompletedToday: number;
  lastSessionScore: number;
  lastSessionTotal: number;
  lastSessionAt: string | null;
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

const SETTINGS_KEY = 'errorbook:settings';
const PROGRESS_KEY = 'errorbook:progress';
const APPLIED_SESSIONS_KEY = 'errorbook:applied-sessions';

const defaultSettings: AppSettingsState = {
  showEri: true,
  reduceMotion: false,
};

const defaultProgress: GameProgressState = {
  totalXP: 1230,
  streakDays: 7,
  badgesEarned: 2,
  missionsCompletedToday: 1,
  lastSessionScore: 2,
  lastSessionTotal: 3,
  lastSessionAt: null,
};

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

export function getAppSettings(): AppSettingsState {
  if (!isBrowser()) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...parseJSON<AppSettingsState>(window.localStorage.getItem(SETTINGS_KEY), defaultSettings),
  };
}

export function updateAppSettings(patch: Partial<AppSettingsState>): AppSettingsState {
  const next = {
    ...getAppSettings(),
    ...patch,
  };

  if (isBrowser()) {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
  }

  return next;
}

export function getGameProgress(): GameProgressState {
  if (!isBrowser()) {
    return defaultProgress;
  }

  return {
    ...defaultProgress,
    ...parseJSON<GameProgressState>(window.localStorage.getItem(PROGRESS_KEY), defaultProgress),
  };
}

function saveGameProgress(next: GameProgressState): GameProgressState {
  if (isBrowser()) {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  }

  return next;
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
