import React, { useState } from 'react';
import { PlayerCountWidget } from '../shared/PlayerCountWidget';

interface SpyHostSetupProps {
  onStartGame: (settings: SpyGameSettings) => void;
}

interface SpyGameSettings {
  playerCount: number;
}

export const SpyHostSetup: React.FC<SpyHostSetupProps> = ({ onStartGame }) => {
  const [settings, setSettings] = useState<SpyGameSettings>({
    playerCount: 5
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateSettings = (): boolean => {
    const newErrors: string[] = [];

    if (settings.playerCount < 3) {
      newErrors.push('Минимум 3 игрока');
    }
    if (settings.playerCount > 20) {
      newErrors.push('Максимум 20 игроков');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleStartGame = () => {
    if (validateSettings()) {
      onStartGame(settings);
    }
  };

  return (
    <div className="spy-host-setup">
      <div className="setup-header">
        <h2>Шпион</h2>
        <p>Настройте параметры игры</p>
      </div>

      <div className="setup-content">
        <div className="setting-section">
          <PlayerCountWidget
            value={settings.playerCount}
            min={3}
            max={20}
            onChange={(playerCount) => setSettings({...settings, playerCount})}
            hint="Минимум 3 игрока, максимум 20"
          />
        </div>

        <div className="game-rules">
          <h3>Как играть:</h3>
          <ul>
            <li>Всем игрокам, кроме одного (шпиона), показывают одну и ту же локацию</li>
            <li>Шпион не знает локацию и должен её угадать</li>
            <li>Остальные игроки должны найти шпиона</li>
            <li>Игроки по очереди задают друг другу вопросы о локации</li>
            <li>Шпион отвечает, стараясь не выдать себя</li>
            <li>Победа: шпион угадывает локацию ИЛИ остальные находят шпиона</li>
          </ul>
        </div>

      </div>

      <div className="setup-actions">
        <button 
          onClick={handleStartGame} 
          className="start-game-button"
          disabled={errors.length > 0}
        >
          Создать игру
        </button>
        
        {errors.length > 0 && (
          <p className="warning-message">
            {errors.join(', ')}
          </p>
        )}
      </div>
    </div>
  );
};