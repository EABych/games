export interface KrocodilWord {
  id: string;
  word: string;
  difficulty: KrocodilDifficulty;
  category?: KrocodilCategory;
}

export type KrocodilDifficulty = 'easy' | 'medium' | 'hard';
export type KrocodilCategory = 'objects' | 'actions' | 'animals' | 'professions' | 'emotions' | 'abstract';

export interface KrocodilTeam {
  id: string;
  name: string;
  players: string[];
  score: number;
  guessedWords: number;
  skippedWords: number;
}

export interface KrocodilPlayer {
  id: string;
  name: string;
  teamId: string;
}

export type KrocodilPhase = 'setup' | 'playing' | 'roundEnd' | 'completed';

export interface KrocodilGameState {
  phase: KrocodilPhase;
  teams: KrocodilTeam[];
  players: KrocodilPlayer[];
  currentTeamIndex: number;
  currentPlayerIndex: number;
  currentWord: KrocodilWord | null;
  usedWords: string[];
  settings: KrocodilSettings;
  roundTimeLeft: number;
  currentRound: number;
  isTimerRunning: boolean;
}

export interface KrocodilSettings {
  roundTime: number; // в секундах
  pointsToWin: number;
  wordsPerRound: number;
  difficulties: KrocodilDifficulty[];
  categories: KrocodilCategory[];
  allowSkip: boolean;
}

export const DEFAULT_KROCODIL_SETTINGS: KrocodilSettings = {
  roundTime: 60,
  pointsToWin: 20,
  wordsPerRound: 10,
  difficulties: ['easy', 'medium'],
  categories: ['objects', 'actions', 'animals', 'professions'],
  allowSkip: true
};

export interface CategoryInfo {
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export const KROCODIL_CATEGORY_INFO: Record<KrocodilCategory, CategoryInfo> = {
  objects: {
    name: 'Предметы',
    description: 'Различные объекты и вещи',
    emoji: '📦',
    color: '#007AFF'
  },
  actions: {
    name: 'Действия',
    description: 'Глаголы и действия',
    emoji: '🏃',
    color: '#32D74B'
  },
  animals: {
    name: 'Животные',
    description: 'Звери, птицы, насекомые',
    emoji: '🐾',
    color: '#FF9500'
  },
  professions: {
    name: 'Профессии',
    description: 'Различные профессии и занятия',
    emoji: '👔',
    color: '#5856D6'
  },
  emotions: {
    name: 'Эмоции',
    description: 'Чувства и эмоции',
    emoji: '😊',
    color: '#FF3B30'
  },
  abstract: {
    name: 'Абстрактное',
    description: 'Абстрактные понятия',
    emoji: '💭',
    color: '#8E8E93'
  }
};

export const KROCODIL_DIFFICULTY_INFO: Record<KrocodilDifficulty, { name: string; color: string }> = {
  easy: { name: 'Легко', color: '#32D74B' },
  medium: { name: 'Средне', color: '#FF9500' },
  hard: { name: 'Сложно', color: '#FF3B30' }
};