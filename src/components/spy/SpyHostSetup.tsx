import React, { useState } from 'react';

interface SpyHostSetupProps {
  onStartGame: (settings: SpyGameSettings) => void;
  onBack: () => void;
}

interface SpyGameSettings {
  playerCount: number;
}

export const SpyHostSetup: React.FC<SpyHostSetupProps> = ({ onStartGame, onBack }) => {
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
        <h2>🕵️ Настройка игры Шпион</h2>
        <p>Настройте параметры игры для ведущего</p>
      </div>

      <div className="setup-content">
        <div className="setting-section">
          <h3>Количество игроков</h3>
          <div className="player-count-controls">
            <button 
              onClick={() => setSettings({...settings, playerCount: Math.max(3, settings.playerCount - 1)})}
              className="count-button"
            >
              −
            </button>
            <span className="player-count">{settings.playerCount}</span>
            <button 
              onClick={() => setSettings({...settings, playerCount: Math.min(20, settings.playerCount + 1)})}
              className="count-button"
            >
              +
            </button>
          </div>
        </div>

        <div className="setting-section">
          <h3>Как играть в Шпиона?</h3>
          <div className="game-rules">
            <div className="rule-item">
              <span className="rule-icon">🎯</span>
              <div className="rule-text">
                <h4>Цель игры</h4>
                <p>Всем игрокам, кроме одного (шпиона), показывают одну и ту же локацию. Шпион не знает локацию.</p>
              </div>
            </div>
            
            <div className="rule-item">
              <span className="rule-icon">🕵️</span>
              <div className="rule-text">
                <h4>Задача шпиона</h4>
                <p>Угадать локацию, слушая других игроков и не выдав себя.</p>
              </div>
            </div>
            
            <div className="rule-item">
              <span className="rule-icon">👥</span>
              <div className="rule-text">
                <h4>Задача остальных</h4>
                <p>Найти шпиона среди игроков, задавая вопросы о локации.</p>
              </div>
            </div>
            
            <div className="rule-item">
              <span className="rule-icon">⏱️</span>
              <div className="rule-text">
                <h4>Процесс игры</h4>
                <p>Игроки по очереди задают друг другу вопросы о локации. Шпион должен отвечать, не выдав себя.</p>
              </div>
            </div>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="errors">
            <h4>⚠️ Исправьте ошибки:</h4>
            <ul>
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="setup-actions">
          <button 
            onClick={handleStartGame} 
            className="start-game-button"
            disabled={errors.length > 0}
          >
            🎯 Создать игру
          </button>
        </div>
      </div>
    </div>
  );
};