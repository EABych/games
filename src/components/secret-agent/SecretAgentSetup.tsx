import React, { useState } from 'react';
import type { SecretAgentSettings } from '../../types/secret-agent';
import { PlayerCountWidget } from '../shared/PlayerCountWidget';
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
        <h2>Тайный агент</h2>
        <p>Секретные миссии для незабываемой вечеринки</p>
      </div>

      <div className="setup-content">
        <div className="setting-section">
          <PlayerCountWidget
            value={playerCount}
            min={3}
            max={15}
            onChange={setPlayerCount}
            hint="Рекомендуется: 4-8 игроков для лучшего игрового опыта"
          />
        </div>

        <div className="setting-section">
          <div className="setting-item">
            <label className="setting-label">Длительность игры</label>
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
            <p className="setting-hint">Время на выполнение всех миссий</p>
          </div>
        </div>

        <div className="setting-section">
          <div className="setting-item">
            <div className="setting-toggle">
              <label className="toggle-label">
                <input
                  type="checkbox"
                  className="toggle-input"
                  checked={allowHostParticipation}
                  onChange={(e) => setAllowHostParticipation(e.target.checked)}
                />
                <span className="toggle-slider"></span>
                <span className="toggle-text">Ведущий тоже играет</span>
              </label>
            </div>
            <p className="setting-hint">Ведущий получит свои секретные миссии</p>
          </div>
        </div>

        <div className="game-info">
          <h3>Как играть:</h3>
          <div className="rules-list">
            <div className="rule-item">
              <span className="rule-icon">1</span>
              <div className="rule-text">
                <strong>Задание прикрытия:</strong> Выполняй всю вечеринку незаметно
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-icon">2</span>
              <div className="rule-text">
                <strong>Главная миссия:</strong> Выполни за 5 минут так, чтобы никто не заметил
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-icon">3</span>
              <div className="rule-text">
                <strong>Победа:</strong> Выполни главную миссию или не дай раскрыть прикрытие
              </div>
            </div>
            <div className="rule-item">
              <span className="rule-icon">4</span>
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
                <span className="example-icon">→</span>
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
          Начать миссию
        </button>
      </div>
    </div>
  );
};