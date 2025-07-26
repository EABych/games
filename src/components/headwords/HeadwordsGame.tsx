import React, { useState } from 'react';
import { HeadwordsHostSetup } from './HeadwordsHostSetup';
import { HeadwordsHostGame } from './HeadwordsHostGame';
import type { HeadwordsGameSettings } from './HeadwordsHostSetup';
import './Headwords.css';

interface HeadwordsGameProps {}

type HeadwordsPhase = 'setup' | 'game';

export const HeadwordsGame: React.FC<HeadwordsGameProps> = () => {
  const [phase, setPhase] = useState<HeadwordsPhase>('setup');
  const [gameSettings, setGameSettings] = useState<HeadwordsGameSettings>({
    playerCount: 4,
    categories: ['celebrities']
  });

  const handleGameStart = (settings: HeadwordsGameSettings) => {
    setGameSettings(settings);
    setPhase('game');
  };

  const handleNewGame = () => {
    setPhase('setup');
  };

  return (
    <>
      {phase === 'setup' && (
        <HeadwordsHostSetup
          onGameStart={handleGameStart}
        />
      )}
      
      {phase === 'game' && (
        <HeadwordsHostGame
          settings={gameSettings}
          onBack={() => setPhase('setup')}
          onNewGame={handleNewGame}
        />
      )}
    </>
  );
};