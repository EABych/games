// Types for Adult Fants 18+ game
export interface AdultFantsTask {
  id: string;
  text: string;
  hasTimer?: boolean;
  timerDuration?: number; // в секундах
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

export interface AdultFantsPlayer {
  id: string;
  name: string;
  color: string;
}

export interface AdultFantsGameState {
  players: AdultFantsPlayer[];
  currentTask?: AdultFantsTask;
  selectedPlayer?: AdultFantsPlayer;
  isSpinning: boolean;
  isGameStarted: boolean;
  completedTasks: string[];
}

export interface AdultFantsSettings {
  playerCount: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
}

// Категории заданий
export const ADULT_FANTS_CATEGORIES = {
  SOCIAL_MEDIA: 'social_media',
  DANCE: 'dance',
  VOCAL: 'vocal', 
  ACTING: 'acting',
  DARING: 'daring',
  CREATIVE: 'creative',
  PHYSICAL: 'physical',
  COMMUNICATION: 'communication',
  EMBARRASSING: 'embarrassing',
  PARTY: 'party'
} as const;

export type AdultFantsCategory = typeof ADULT_FANTS_CATEGORIES[keyof typeof ADULT_FANTS_CATEGORIES];

// Цвета для игроков
export const PLAYER_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
  '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2'
];