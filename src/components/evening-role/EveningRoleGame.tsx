import React, { useState } from 'react';
import { EveningRoleSetup } from './EveningRoleSetup';
import { EveningRoleHost } from './EveningRoleHost';

type GamePhase = 'setup' | 'host';

export const EveningRoleGame: React.FC = () => {
  const [gamePhase, setGamePhase] = useState<GamePhase>('setup');
  const [roomId, setRoomId] = useState<string>('');

  const handleStartGame = (newRoomId: string) => {
    setRoomId(newRoomId);
    setGamePhase('host');
  };

  const handleBackToSetup = () => {
    setGamePhase('setup');
    setRoomId('');
  };

  switch (gamePhase) {
    case 'setup':
      return <EveningRoleSetup onStartGame={handleStartGame} />;
    case 'host':
      return <EveningRoleHost roomId={roomId} onBackToSetup={handleBackToSetup} />;
    default:
      return <EveningRoleSetup onStartGame={handleStartGame} />;
  }
};