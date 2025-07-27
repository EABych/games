import React, { useState } from 'react';
import { SecretAgentSetup } from './SecretAgentSetup';
import { SecretAgentHost } from './SecretAgentHost';
import type { SecretAgentSettings, SecretAgentGameState } from '../../types/secret-agent';
import './SecretAgent.css';

export const SecretAgentGame: React.FC = () => {
  const [gameState, setGameState] = useState<SecretAgentGameState>({
    players: [],
    isGameStarted: false,
    roomId: ''
  });
  const [gameSettings, setGameSettings] = useState<SecretAgentSettings | null>(null);

  const generateRoomId = (): string => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  const handleStartGame = async (settings: SecretAgentSettings) => {
    const roomId = generateRoomId();
    
    try {
      // Инициализируем игру на сервере
      const response = await fetch('https://mafia-backend-fbm5.onrender.com/api/secret-agent/create-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          playerCount: settings.playerCount,
          gameDuration: settings.gameDuration,
          allowHostParticipation: settings.allowHostParticipation
        }),
      });

      if (response.ok) {
        setGameSettings(settings);
        setGameState({
          players: [],
          isGameStarted: true,
          roomId
        });
      } else {
        alert('Ошибка создания игры. Попробуйте еще раз.');
      }
    } catch (error) {
      console.error('Ошибка создания игры:', error);
      alert('Ошибка подключения к серверу. Проверьте интернет-соединение.');
    }
  };

  const handleBackToSetup = () => {
    setGameState({
      players: [],
      isGameStarted: false,
      roomId: ''
    });
    setGameSettings(null);
  };

  if (!gameState.isGameStarted || !gameSettings) {
    return <SecretAgentSetup onStartGame={handleStartGame} />;
  }

  return (
    <SecretAgentHost
      roomId={gameState.roomId}
      settings={gameSettings}
      onBackToSetup={handleBackToSetup}
    />
  );
};