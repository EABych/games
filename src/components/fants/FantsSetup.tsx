import React, { useState } from 'react';
import type { FantPlayer, FantSettings, FantCategory, FantDifficulty } from '../../types/fants';
import { DEFAULT_FANT_SETTINGS, CATEGORY_INFO, DIFFICULTY_INFO } from '../../types/fants';
import './Fants.css';

interface FantsSetupProps {
  onStartGame: (players: FantPlayer[], settings: FantSettings) => void;
}

export const FantsSetup: React.FC<FantsSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<FantPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [settings, setSettings] = useState<FantSettings>(DEFAULT_FANT_SETTINGS);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: FantPlayer = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        completedFants: 0,
        skippedFants: 0
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const toggleCategory = (category: FantCategory) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleDifficulty = (difficulty: FantDifficulty) => {
    setSettings(prev => ({
      ...prev,
      difficulty: prev.difficulty.includes(difficulty)
        ? prev.difficulty.filter(d => d !== difficulty)
        : [...prev.difficulty, difficulty]
    }));
  };

  const handleStartGame = () => {
    if (players.length >= 2 && settings.categories.length > 0 && settings.difficulty.length > 0) {
      onStartGame(players, settings);
    }
  };

  const canStartGame = players.length >= 2 && settings.categories.length > 0 && settings.difficulty.length > 0;

  return (
    <div className="fants-setup">
      <div className="setup-header">
        <h2>Фанты</h2>
        <p>Весёлые задания для компании</p>
      </div>
      
      <div className="setup-content">
        <div className="setting-section">
          <h3>Участники</h3>
          <div className="players-section">
            <div className="players-input">
              <input
                type="text"
                placeholder="Имя участника"
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
                maxLength={20}
                className="player-input"
              />
              <button 
                onClick={addPlayer}
                disabled={!newPlayerName.trim() || players.length >= 8}
                className="add-player-btn"
              >
                +
              </button>
            </div>

            <div className="players-list">
              {players.map((player, index) => (
                <div key={player.id} className="player-item">
                  <span className="player-number">{index + 1}</span>
                  <span className="player-name">{player.name}</span>
                  <button
                    onClick={() => removePlayer(player.id)}
                    className="remove-player-btn"
                    title="Удалить участника"
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
            
            {players.length < 2 && (
              <p className="warning-message">Минимум 2 участника</p>
            )}
          </div>
        </div>

        <div className="setting-section">
          <h3>Категории заданий</h3>
          <div className="categories-grid">
            {(Object.keys(CATEGORY_INFO) as FantCategory[]).map(category => (
              <button
                key={category}
                className={`category-option ${settings.categories.includes(category) ? 'active' : ''}`}
                onClick={() => toggleCategory(category)}
                type="button"
              >
                <span className="category-name">{CATEGORY_INFO[category].name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="setting-section">
          <h3>Сложность</h3>
          <div className="difficulty-options">
            {(Object.keys(DIFFICULTY_INFO) as FantDifficulty[]).map(difficulty => (
              <button
                key={difficulty}
                className={`difficulty-option ${settings.difficulty.includes(difficulty) ? 'active' : ''}`}
                onClick={() => toggleDifficulty(difficulty)}
                type="button"
              >
                {DIFFICULTY_INFO[difficulty].name}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-section">
          <h3>Настройки игры</h3>
          <div className="setting-item">
            <span className="setting-label">Фантов на игрока</span>
            <input
              type="number"
              min="5"
              max="30"
              value={settings.fantsPerPlayer}
              onChange={(e) => setSettings(prev => ({ ...prev, fantsPerPlayer: parseInt(e.target.value) || 10 }))}
              className="setting-input"
            />
          </div>
          <div className="setting-item">
            <span className="setting-label">Разрешить пропускать задания</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.allowSkip}
                onChange={(e) => setSettings(prev => ({ ...prev, allowSkip: e.target.checked }))}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="setup-footer">
        <button
          className="start-game-btn"
          onClick={handleStartGame}
          disabled={!canStartGame}
        >
          Начать игру
        </button>
      </div>
    </div>
  );
};