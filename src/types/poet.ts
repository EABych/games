export interface PoetPlayer {
  id: string;
  name: string;
  score: number;
  completed: number;
  failed: number;
}

export interface PoetTask {
  id: string;
  playerId: string;
  playerName: string;
  firstLine: string;
  success: boolean;
  timestamp: number;
}

export interface PoetFirstLine {
  id: string;
  text: string;
  category: PoetCategory;
  difficulty: PoetDifficulty;
  suggestedRhyme?: string;
}

export type PoetCategory = 
  | 'life'      // Жизнь и быт
  | 'love'      // Любовь и отношения
  | 'nature'    // Природа
  | 'wisdom'    // Мудрость и философия
  | 'humor'     // Юмор
  | 'nostalgia' // Ностальгия
  | 'dreams'    // Мечты и фантазии
  | 'city'      // Городская жизнь
  | 'emotions'  // Эмоции и чувства
  | 'mystery';  // Загадочное и мистическое

export type PoetDifficulty = 'easy' | 'medium' | 'hard';

export interface PoetSettings {
  roundsCount: number;
  categories: PoetCategory[];
  difficulty: PoetDifficulty[];
  pointsForSuccess: number; // очки за успешное выполнение
  pointsForFailure: number; // очки за неудачу (обычно 0)
}

export type PoetGamePhase = 
  | 'setup'
  | 'playing'    // Игроки по очереди выполняют задания
  | 'results'    // Показ результатов раунда
  | 'completed'; // Конец игры

export interface PoetGameState {
  phase: PoetGamePhase;
  players: PoetPlayer[];
  settings: PoetSettings;
  currentRound: number;
  currentPlayerIndex: number;
  currentFirstLine: PoetFirstLine | null;
  completedTasks: PoetTask[];
  leaderboard: PoetPlayer[];
}

export const POET_CATEGORY_INFO: Record<PoetCategory, { name: string; emoji: string; description: string }> = {
  life: {
    name: 'Жизнь',
    emoji: '🌱',
    description: 'О повседневной жизни и быте'
  },
  love: {
    name: 'Любовь',
    emoji: '💝',
    description: 'О любви и отношениях'
  },
  nature: {
    name: 'Природа',
    emoji: '🌿',
    description: 'О природе и временах года'
  },
  wisdom: {
    name: 'Мудрость',
    emoji: '🦉',
    description: 'Философские размышления'
  },
  humor: {
    name: 'Юмор',
    emoji: '😄',
    description: 'Смешные и остроумные стихи'
  },
  nostalgia: {
    name: 'Ностальгия',
    emoji: '📸',
    description: 'О прошлом и воспоминаниях'
  },
  dreams: {
    name: 'Мечты',
    emoji: '✨',
    description: 'О мечтах и фантазиях'
  },
  city: {
    name: 'Город',
    emoji: '🏙️',
    description: 'О городской жизни'
  },
  emotions: {
    name: 'Эмоции',
    emoji: '💭',
    description: 'О чувствах и переживаниях'
  },
  mystery: {
    name: 'Тайны',
    emoji: '🌙',
    description: 'Загадочное и мистическое'
  }
};

export const POET_DIFFICULTY_INFO: Record<PoetDifficulty, { name: string; description: string; color: string }> = {
  easy: {
    name: 'Легкий',
    description: 'Простые строки с очевидными рифмами',
    color: '#32D74B'
  },
  medium: {
    name: 'Средний',
    description: 'Умеренно сложные строки',
    color: '#FF9500'
  },
  hard: {
    name: 'Сложный',
    description: 'Сложные строки, требующие творчества',
    color: '#FF3B30'
  }
};