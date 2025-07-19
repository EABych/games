export interface ThisOrThatQuestion {
  id: string;
  question: string;
  category: ThisOrThatCategory;
  intensity: ThisOrThatIntensity;
}

export type ThisOrThatCategory = 'philosophy' | 'psychology' | 'ethics' | 'relationships' | 'society' | 'existence' | 'taboo' | 'provocative';

export type ThisOrThatIntensity = 'mild' | 'medium' | 'intense' | 'extreme';

export interface ThisOrThatPlayer {
  id: string;
  name: string;
  answers: ThisOrThatAnswer[];
}

export interface ThisOrThatAnswer {
  questionId: string;
  choice: 'this' | 'that';
  timestamp: number;
}

export type ThisOrThatPhase = 'setup' | 'playing' | 'completed';

export interface ThisOrThatGameState {
  phase: ThisOrThatPhase;
  players: ThisOrThatPlayer[];
  currentQuestionIndex: number;
  questions: ThisOrThatQuestion[];
  settings: ThisOrThatSettings;
  completedQuestions: string[];
}

export interface ThisOrThatSettings {
  questionsCount: number;
  categories: ThisOrThatCategory[];
  intensities: ThisOrThatIntensity[];
  allowSkip: boolean;
  showResults: boolean;
}

export const DEFAULT_THIS_OR_THAT_SETTINGS: ThisOrThatSettings = {
  questionsCount: 20,
  categories: ['philosophy', 'psychology', 'ethics', 'relationships'],
  intensities: ['mild', 'medium'],
  allowSkip: true,
  showResults: true
};

export interface CategoryInfo {
  name: string;
  description: string;
  emoji: string;
  color: string;
}

export const THIS_OR_THAT_CATEGORY_INFO: Record<ThisOrThatCategory, CategoryInfo> = {
  philosophy: {
    name: 'Философия',
    description: 'Глубокие вопросы о смысле жизни',
    emoji: '🤔',
    color: '#007AFF'
  },
  psychology: {
    name: 'Психология',
    description: 'Вопросы о человеческой природе',
    emoji: '🧠',
    color: '#32D74B'
  },
  ethics: {
    name: 'Этика',
    description: 'Моральные дилеммы и выборы',
    emoji: '⚖️',
    color: '#FF9500'
  },
  relationships: {
    name: 'Отношения',
    description: 'Любовь, дружба, семья',
    emoji: '❤️',
    color: '#FF3B30'
  },
  society: {
    name: 'Общество',
    description: 'Социальные проблемы и нормы',
    emoji: '🏛️',
    color: '#5856D6'
  },
  existence: {
    name: 'Бытие',
    description: 'Экзистенциальные вопросы',
    emoji: '🌌',
    color: '#8E8E93'
  },
  taboo: {
    name: 'Табу',
    description: 'Запретные темы',
    emoji: '🚫',
    color: '#FF2D92'
  },
  provocative: {
    name: 'Провокации',
    description: 'Острые и спорные вопросы',
    emoji: '🔥',
    color: '#FF6B35'
  }
};

export const THIS_OR_THAT_INTENSITY_INFO: Record<ThisOrThatIntensity, { name: string; color: string; description: string }> = {
  mild: { 
    name: 'Мягко', 
    color: '#32D74B',
    description: 'Легкие вопросы для разминки'
  },
  medium: { 
    name: 'Умеренно', 
    color: '#FF9500',
    description: 'Заставляют задуматься'
  },
  intense: { 
    name: 'Интенсивно', 
    color: '#FF3B30',
    description: 'Глубокие и сложные вопросы'
  },
  extreme: { 
    name: 'Экстремально', 
    color: '#8B0000',
    description: 'Самые провокационные вопросы'
  }
};