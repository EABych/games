export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface GameSettings {
  roundTime: number; // in seconds
  wordsPerRound: number;
  winningScore: number;
}

export type GamePhase = 'menu' | 'setup' | 'playing' | 'roundEnd' | 'gameEnd';

export interface GameState {
  phase: GamePhase;
  teams: Team[];
  currentTeamIndex: number;
  currentWord: string;
  usedWords: string[];
  timer: number;
  roundScore: number;
  settings: GameSettings;
}

export const DEFAULT_SETTINGS: GameSettings = {
  roundTime: 60,
  wordsPerRound: 30,
  winningScore: 50
};