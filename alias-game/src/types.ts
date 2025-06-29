export interface Team {
  id: string;
  name: string;
  score: number;
  color: string;
}

export interface GameSettings {
  roundTime: number;
  wordsPerRound: number;
  winningScore: number;
  totalRounds: number;
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
  currentRound: number;
}

export const DEFAULT_SETTINGS: GameSettings = {
  roundTime: 60,
  wordsPerRound: 30,
  winningScore: 50,
  totalRounds: 5
};