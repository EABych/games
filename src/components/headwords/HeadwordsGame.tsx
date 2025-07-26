import React, { useState } from 'react';
import { HeadwordsHostSetup, HeadwordsGameSettings } from './HeadwordsHostSetup';
import { HeadwordsHostGame } from './HeadwordsHostGame';
import './Headwords.css';

interface HeadwordsGameProps {
  onBack: () => void;
}

type HeadwordsPhase = 'setup' | 'game';

export const HeadwordsGame: React.FC<HeadwordsGameProps> = ({ onBack }) => {
  const [phase, setPhase] = useState<HeadwordsPhase>('setup');
  const [gameSettings, setGameSettings] = useState<HeadwordsGameSettings>({
    playerCount: 4,
    category: 'celebrities'
  });

  const handleGameStart = (settings: HeadwordsGameSettings) => {
    setGameSettings(settings);
    setPhase('game');
  };

  const handleBackToSetup = () => {
    setPhase('setup');
  };

  const handleNewGame = () => {
    setPhase('setup');
  };

  return (
    <>
      {phase === 'setup' && (
        <HeadwordsHostSetup
          onGameStart={handleGameStart}
          onBack={onBack}
        />
      )}
      
      {phase === 'game' && (
        <HeadwordsHostGame
          settings={gameSettings}
          onBack={handleBackToSetup}
          onNewGame={handleNewGame}
        />
      )}
    </>
  );
};