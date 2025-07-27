// Types for Evening Role game
export interface EveningRoleTask {
  id: string;
  text: string;
  type: 'individual' | 'group';
  hasTimer?: boolean;
  timerDuration?: number; // в секундах
  requiresOtherPlayer?: boolean;
  category?: string;
}

export interface EveningRolePlayer {
  id: string;
  name: string;
  task?: EveningRoleTask;
  hasReceivedTask: boolean;
}

export interface EveningRoleGameState {
  players: EveningRolePlayer[];
  groupTask?: EveningRoleTask;
  isGameStarted: boolean;
  roomId: string;
}

export interface EveningRoleSettings {
  playerCount: number;
  allowExplicitTasks: boolean;
}

// Категории заданий
export const EVENING_ROLE_CATEGORIES = {
  ACCENT: 'accent',
  MOVEMENT: 'movement', 
  DRINKING: 'drinking',
  SOCIAL: 'social',
  CREATIVE: 'creative',
  REACTION: 'reaction',
  ROLEPLAY: 'roleplay',
  PHONE: 'phone',
  CLOTHING: 'clothing',
  TIMING: 'timing'
} as const;

export type EveningRoleCategory = typeof EVENING_ROLE_CATEGORIES[keyof typeof EVENING_ROLE_CATEGORIES];