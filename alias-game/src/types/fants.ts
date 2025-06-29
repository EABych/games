export interface Fant {
  id: string;
  text: string;
  category: FantCategory;
  difficulty: FantDifficulty;
}

export type FantCategory = 'creative' | 'funny' | 'active' | 'social' | 'thinking';

export type FantDifficulty = 'easy' | 'medium' | 'hard';

export interface FantPlayer {
  id: string;
  name: string;
  completedFants: number;
  skippedFants: number;
}

export type FantPhase = 'setup' | 'playing' | 'completed';

export interface FantGameState {
  phase: FantPhase;
  players: FantPlayer[];
  currentPlayerIndex: number;
  currentFant: Fant | null;
  usedFants: string[];
  settings: FantSettings;
  totalFants: number;
}

export interface FantSettings {
  categories: FantCategory[];
  difficulty: FantDifficulty[];
  allowSkip: boolean;
  fantsPerPlayer: number;
}

export const DEFAULT_FANT_SETTINGS: FantSettings = {
  categories: ['creative', 'funny', 'active', 'social'],
  difficulty: ['easy', 'medium'],
  allowSkip: true,
  fantsPerPlayer: 3,
};

export interface CategoryInfo {
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export const CATEGORY_INFO: Record<FantCategory, CategoryInfo> = {
  creative: {
    name: 'Творческие',
    description: 'Задания на творчество и фантазию',
    emoji: '🎨',
    color: '#FF9500'
  },
  funny: {
    name: 'Весёлые',
    description: 'Смешные и развлекательные задания',
    emoji: '😄',
    color: '#FFD60A'
  },
  active: {
    name: 'Активные',
    description: 'Физические активности и движения',
    emoji: '🏃',
    color: '#32D74B'
  },
  social: {
    name: 'Социальные',
    description: 'Задания для взаимодействия с другими',
    emoji: '👥',
    color: '#007AFF'
  },
  thinking: {
    name: 'Размышления',
    description: 'Задания на логику и мышление',
    emoji: '🧠',
    color: '#5856D6'
  }
};

export const DIFFICULTY_INFO: Record<FantDifficulty, { name: string; color: string }> = {
  easy: { name: 'Легко', color: '#32D74B' },
  medium: { name: 'Средне', color: '#FF9500' },
  hard: { name: 'Сложно', color: '#FF3B30' }
};