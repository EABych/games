export interface HeadwordsGameSettings {
  playerCount: number;
  category: string;
}

export interface HeadwordsCategory {
  id: string;
  name: string;
  rolesCount: number;
}

export interface HeadwordsRole {
  playerNumber: number;
  totalPlayers: number;
  role: string;
  category: string;
  isLastPlayer: boolean;
  roomId?: string;
}