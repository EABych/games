import React, { useState } from 'react';
import type { SecretAgentSettings } from '../../types/secret-agent';
import './SecretAgent.css';

interface SecretAgentSetupProps {
  onStartGame: (settings: SecretAgentSettings) => void;
}

export const SecretAgentSetup: React.FC<SecretAgentSetupProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(4);
  const [gameDuration, setGameDuration] = useState(120); // 2 часа по умолчанию
  const [allowHostParticipation, setAllowHostParticipation] = useState(true);

  const handleStartGame = () => {
    const settings: SecretAgentSettings = {
      playerCount,
      gameDuration,
      allowHostParticipation
    };
    onStartGame(settings);
  };

  return (
    <div className="secret-agent-setup">
      <div className="setup-header">
        <div className="game-icon">🕵️</div>
        <h1>Тайный агент</h1>
        <p className="setup-subtitle">
          Секретные миссии для незабываемой вечеринки
        </p>
        <div className="mission-badge">
          🎯 Выполни миссию незаметно
        </div>
      </div>

      <div className="setup-content">
        <div className="settings-section">
          <h2>Настройки игры</h2>
          
          <div className="setting-group">
            <label className="setting-label">
              <span className="label-text">
                <span className="label-icon">👥</span>
                Количество игроков
              </span>
              <div className="player-counter">
                <button 
                  className="counter-btn"
                  onClick={() => setPlayerCount(Math.max(3, playerCount - 1))}
                  disabled={playerCount <= 3}
                >
                  −
                </button>
                <span className="counter-value">{playerCount}</span>
                <button 
                  className="counter-btn"
                  onClick={() => setPlayerCount(Math.min(15, playerCount + 1))}
                  disabled={playerCount >= 15}
                >
                  +
                </button>
              </div>
            </label>
            <div className="setting-hint">Рекомендуется: 4-8 игроков</div>
          </div>

          <div className="setting-group">
            <label className="setting-label">
              <span className="label-text">
                <span className="label-icon">⏰</span>
                Длительность игры
              </span>
              <select 
                className="setting-select"
                value={gameDuration}
                onChange={(e) => setGameDuration(Number(e.target.value))}
              >
                <option value={60}>1 час</option>
                <option value={90}>1.5 часа</option>
                <option value={120}>2 часа</option>
                <option value={180}>3 часа</option>
                <option value={240}>4 часа</option>
              </select>
            </label>
            <div className="setting-hint">Время на выполнение всех миссий</div>
          </div>

          <div className="setting-group">
            <label className="setting-checkbox">
              <input
                type="checkbox"
                checked={allowHostParticipation}
                onChange={(e) => setAllowHostParticipation(e.target.checked)}
              />
              <span className="checkbox-custom"></span>
              <span className="checkbox-text">
                <span className="label-icon">🎮</span>
                Ведущий тоже играет
              </span>
            </label>
            <div className="setting-hint">Ведущий получит свои секретные миссии</div>
          </div>
        </div>

        <div className="game-info">
          <h3>Как играть:</h3>
          <div className="rules-list">
            <div className="rule-item">
              <span className="rule-icon">🎯</span>
              <div className="rule-text">
                <strong>Задание прикрытия:</strong> Выполняй всю вечеринку незаметно
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-icon">⚡</span>
              <div className="rule-text">
                <strong>Главная миссия:</strong> Выполни за 5 минут так, чтобы никто не заметил
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-icon">🏆</span>
              <div className="rule-text">
                <strong>Победа:</strong> Выполни главную миссию или не дай раскрыть прикрытие
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-icon">🕵️</span>
              <div className="rule-text">
                <strong>Разоблачение:</strong> Угадай миссию другого агента
              </div>
            </div>
          </div>
        </div>

        <div className="mission-examples">
          <h3>Примеры миссий:</h3>
          <div className="examples-grid">
            <div className="example-card cover">
              <div className="example-header">
                <span className="example-icon">🎭</span>
                <span className="example-type">Прикрытие</span>
              </div>
              <div className="example-text">
                "Всегда перехватывай инициативу при тостах"
              </div>
            </div>
            <div className="example-card main">
              <div className="example-header">
                <span className="example-icon">⚡</span>
                <span className="example-type">Главная</span>
              </div>
              <div className="example-text">
                "Обними 5 разных людей за 5 минут"
              </div>
            </div>
          </div>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <div className="stat-number">70+</div>
            <div className="stat-label">Заданий прикрытия</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">50+</div>
            <div className="stat-label">Главных миссий</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">7</div>
            <div className="stat-label">Категорий</div>
          </div>
        </div>

        <button
          onClick={handleStartGame}
          className="start-game-btn"
        >
          🚀 Начать миссию
        </button>
      </div>
    </div>
  );
};