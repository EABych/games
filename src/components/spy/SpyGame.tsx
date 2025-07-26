import React, { useState } from 'react';
import { SpyHostSetup } from './SpyHostSetup';
import { SpyHostGame } from './SpyHostGame';

interface SpyGameProps {
  onBack: () => void;
}

interface SpyGameSettings {
  playerCount: number;
}

type GamePhase = 'setup' | 'game';

export const SpyGame: React.FC<SpyGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [gameSettings, setGameSettings] = useState<SpyGameSettings | null>(null);

  const handleStartGame = (settings: SpyGameSettings) => {
    setGameSettings(settings);
    setPhase('game');
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
      <SpyHostSetup
        onStartGame={handleStartGame}
        onBack={onBack}
      />
    );
  }

  if (phase === 'game' && gameSettings) {
    return (
      <SpyHostGame
        settings={gameSettings}
        onBack={handleBackToSetup}
        onNewGame={handleNewGame}
      />
    );
  }

  return null;
};