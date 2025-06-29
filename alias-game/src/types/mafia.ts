export interface MafiaPlayer {
  id: string;
  name: string;
  role: MafiaRole;
  isAlive: boolean;
  isRevealed: boolean;
  votes: number;
}

export type MafiaRole = 'citizen' | 'mafia' | 'detective' | 'doctor' | 'moderator';

export type MafiaPhase = 'setup' | 'night' | 'discussion' | 'voting' | 'gameEnd';

export interface MafiaGameState {
  phase: MafiaPhase;
  players: MafiaPlayer[];
  currentRound: number;
  timeRemaining: number;
  nightActions: {
    mafiaTarget?: string;
    doctorTarget?: string;
    detectiveTarget?: string;
  };
  votingResults: { [playerId: string]: number };
  winner: 'mafia' | 'citizens' | null;
  settings: MafiaSettings;
}

export interface MafiaSettings {
  discussionTime: number; // в секундах
  votingTime: number; // в секундах
  enableDoctor: boolean;
  enableDetective: boolean;
}

export const DEFAULT_MAFIA_SETTINGS: MafiaSettings = {
  discussionTime: 300, // 5 минут
  votingTime: 120, // 2 минуты
  enableDoctor: true,
  enableDetective: true,
};

export interface RoleInfo {
  name: string;
  description: string;
  team: 'mafia' | 'citizens';
  color: string;
  emoji: string;
}