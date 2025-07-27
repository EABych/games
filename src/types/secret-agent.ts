// Types for Secret Agent game
export interface SecretAgentMission {
  id: string;
  type: 'cover' | 'main';
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit?: number; // для главных миссий (в минутах)
  isCompleted?: boolean;
}

export interface SecretAgentPlayer {
  id: string;
  name: string;
  coverMission?: SecretAgentMission;
  mainMission?: SecretAgentMission;
  hasReceivedMissions: boolean;
  isRevealed?: boolean; // был ли раскрыт другими игроками
}

export interface SecretAgentGameState {
  players: SecretAgentPlayer[];
  isGameStarted: boolean;
  roomId: string;
  hostMissions?: {
    cover: SecretAgentMission;
    main: SecretAgentMission;
  };
  gameEndTime?: Date;
}

export interface SecretAgentSettings {
  playerCount: number;
  gameDuration: number; // длительность игры в минутах
  allowHostParticipation: boolean;
}

// Категории заданий прикрытия
export const COVER_MISSION_CATEGORIES = {
  SOCIAL: 'social',        // социальные взаимодействия
  DRINKS: 'drinks',        // связанные с напитками
  FOOD: 'food',           // связанные с едой
  CONVERSATION: 'conversation', // разговорные привычки
  MOVEMENT: 'movement',    // движения и позы
  TIMING: 'timing',       // связанные со временем
  REACTIONS: 'reactions'   // реакции на события
} as const;

// Категории главных миссий
export const MAIN_MISSION_CATEGORIES = {
  INTERACTION: 'interaction',  // взаимодействие с людьми
  PERFORMANCE: 'performance',  // небольшие выступления
  COLLECTION: 'collection',    // сбор чего-либо
  MOVEMENT: 'movement',        // физические действия
  COMMUNICATION: 'communication', // общение
  CREATIVE: 'creative',        // творческие задания
  OBSERVATION: 'observation'   // наблюдение и анализ
} as const;

export type CoverMissionCategory = typeof COVER_MISSION_CATEGORIES[keyof typeof COVER_MISSION_CATEGORIES];
export type MainMissionCategory = typeof MAIN_MISSION_CATEGORIES[keyof typeof MAIN_MISSION_CATEGORIES];

// Успешные исходы миссий
export interface MissionResult {
  playerId: string;
  missionType: 'cover' | 'main';
  status: 'completed' | 'revealed' | 'failed';
  completedAt: Date;
  revealedBy?: string; // кто раскрыл агента
}