import React, { useState } from 'react';
import type { AdultFantsPlayer } from '../../types/adult-fants';
import { PLAYER_COLORS } from '../../types/adult-fants';
import './AdultFants.css';

interface AdultFantsSetupProps {
  onStartGame: (players: AdultFantsPlayer[]) => void;
}

export const AdultFantsSetup: React.FC<AdultFantsSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<AdultFantsPlayer[]>([]);
  const [currentPlayerName, setCurrentPlayerName] = useState('');

  const addPlayer = () => {
    if (currentPlayerName.trim() && players.length < 15) {
      const newPlayer: AdultFantsPlayer = {
        id: `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: currentPlayerName.trim(),
        color: PLAYER_COLORS[players.length % PLAYER_COLORS.length]
      };
      
      setPlayers([...players, newPlayer]);
      setCurrentPlayerName('');
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(player => player.id !== playerId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPlayer();
    }
  };

  const canStartGame = players.length >= 2;

  return (
    <div className="adult-fants-setup">
      <div className="setup-header">
        {/* Removed emoji icon */}
        <h1>Взрослые Фанты 18+</h1>
        <p className="setup-subtitle">
          Пикантная игра для взрослой компании
        </p>
        <div className="warning-badge">
          Только для лиц старше 18 лет
        </div>
      </div>

      <div className="setup-content">
        <div className="player-input-section">
          <h2>Добавьте игроков</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Введите имя игрока"
              value={currentPlayerName}
              onChange={(e) => setCurrentPlayerName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="player-name-input"
              maxLength={20}
            />
            <button
              onClick={addPlayer}
              disabled={!currentPlayerName.trim() || players.length >= 15}
              className="add-player-btn"
            >
              Добавить
            </button>
          </div>
          <div className="player-count">
            Игроков: {players.length} / 15
          </div>
        </div>

        {players.length > 0 && (
          <div className="players-list">
            <h3>Участники игры:</h3>
            <div className="players-grid">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="player-card"
                  style={{ borderColor: player.color }}
                >
                  <div 
                    className="player-avatar"
                    style={{ backgroundColor: player.color }}
                  >
                    {player.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="player-name">{player.name}</span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="remove-player-btn"
                    title="Удалить игрока"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="game-info">
          <h3>Правила игры:</h3>
          <div className="rules-list">
            <div className="rule-item">
              <span className="rule-icon">1</span>
              <span>Нажмите красную кнопку для запуска колеса</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">2</span>
              <span>Выполняйте задания с юмором и уважением</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">3</span>
              <span>Некоторые задания имеют таймер</span>
            </div>
            <div className="rule-item">
              <span className="rule-icon">4</span>
              <span>Можете отказаться от любого задания</span>
            </div>
          </div>
        </div>

        <div className="game-stats">
          <div className="stat-item">
            <div className="stat-number">200+</div>
            <div className="stat-label">Пикантных заданий</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">10</div>
            <div className="stat-label">Категорий</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">18+</div>
            <div className="stat-label">Возрастной рейтинг</div>
          </div>
        </div>

        {canStartGame && (
          <button
            onClick={() => onStartGame(players)}
            className="start-game-btn"
          >
            Начать игру
          </button>
        )}

        {!canStartGame && players.length < 2 && (
          <div className="start-game-hint">
            Добавьте минимум 2 игроков для начала игры
          </div>
        )}
      </div>
    </div>
  );
};