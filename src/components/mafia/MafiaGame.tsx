import React, { useState } from 'react';
import { MafiaHostSetup } from './MafiaHostSetup';
import { MafiaHostTimer } from './MafiaHostTimer';

interface MafiaGameProps {
  onBack: () => void;
}

interface MafiaGameSettings {
  playerCount: number;
  includeDoctor: boolean;
  includeDetective: boolean;
  includeSheriff: boolean;
  includeDon: boolean;
  discussionTime: number;
  votingTime: number;
  nightTime: number;
}

type GamePhase = 'setup' | 'timer';

export const MafiaGame: React.FC<MafiaGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [gameSettings, setGameSettings] = useState<MafiaGameSettings | null>(null);

  const handleStartGame = (settings: MafiaGameSettings) => {
    setGameSettings(settings);
    setPhase('timer');
  };

  const handleBackToSetup = () => {
    setPhase('setup');
  };

  const handleNewGame = () => {
    setPhase('setup');
    setGameSettings(null);
  };

  if (phase === 'setup') {
    return (
      <MafiaHostSetup
        onStartGame={handleStartGame}
      />
    );
  }

  if (phase === 'timer' && gameSettings) {
    return (
      <MafiaHostTimer
        settings={gameSettings}
        onNewGame={handleNewGame}
      />
    );
  }

  return null;
};