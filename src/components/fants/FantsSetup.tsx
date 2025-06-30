import React, { useState } from 'react';
import type { FantPlayer, FantSettings, FantCategory, FantDifficulty } from '../../types/fants';
import { DEFAULT_FANT_SETTINGS, CATEGORY_INFO, DIFFICULTY_INFO } from '../../types/fants';

interface FantsSetupProps {
  onStartGame: (players: FantPlayer[], settings: FantSettings) => void;
}

export const FantsSetup: React.FC<FantsSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<FantPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [settings, setSettings] = useState<FantSettings>(DEFAULT_FANT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

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
      <h1>Фанты</h1>
      <p className="subtitle">Весёлые задания для компании</p>

      <div className="players-setup">
        <h2>Участники</h2>
        
        <div className="add-player">
          <input
            type="text"
            placeholder="Имя участника"
            value={newPlayerName}
            onChange={(e) => setNewPlayerName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            maxLength={20}
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
                className="remove-player"
              >
                ×
              </button>
            </div>
          ))}
        </div>
        
        {players.length < 2 && (
          <p className="requirement">Минимум 2 участника</p>
        )}
      </div>

      <div className="game-settings">
        <button
          className="settings-toggle"
          onClick={() => setShowSettings(!showSettings)}
        >
          <span>Настройки игры</span>
          <span className={`toggle-icon ${showSettings ? 'expanded' : ''}`}>▼</span>
        </button>

        {showSettings && (
          <div className="settings-content">
            <div className="setting-group">
              <h3>Категории заданий</h3>
              <div className="categories-grid">
                {(Object.keys(CATEGORY_INFO) as FantCategory[]).map(category => (
                  <button
                    key={category}
                    className={`category-option ${settings.categories.includes(category) ? 'active' : ''}`}
                    onClick={() => toggleCategory(category)}
                    style={{ '--category-color': CATEGORY_INFO[category].color } as React.CSSProperties}
                  >
                    <span className="category-emoji">{CATEGORY_INFO[category].emoji}</span>
                    <span className="category-name">{CATEGORY_INFO[category].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h3>Сложность</h3>
              <div className="difficulty-options">
                {(Object.keys(DIFFICULTY_INFO) as FantDifficulty[]).map(difficulty => (
                  <button
                    key={difficulty}
                    className={`difficulty-option ${settings.difficulty.includes(difficulty) ? 'active' : ''}`}
                    onClick={() => toggleDifficulty(difficulty)}
                    style={{ '--difficulty-color': DIFFICULTY_INFO[difficulty].color } as React.CSSProperties}
                  >
                    {DIFFICULTY_INFO[difficulty].name}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h3>Фантов на игрока</h3>
              <div className="fants-per-player">
                {[5, 10, 15, 20, 25, 30].map(count => (
                  <button
                    key={count}
                    className={`count-option ${settings.fantsPerPlayer === count ? 'active' : ''}`}
                    onClick={() => setSettings(prev => ({ ...prev, fantsPerPlayer: count }))}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={settings.allowSkip}
                  onChange={(e) => setSettings(prev => ({ ...prev, allowSkip: e.target.checked }))}
                />
                <span>Разрешить пропускать задания</span>
              </label>
            </div>
          </div>
        )}
      </div>

      <button
        className="start-game"
        onClick={handleStartGame}
        disabled={!canStartGame}
      >
        Начать игру
      </button>
    </div>
  );
};