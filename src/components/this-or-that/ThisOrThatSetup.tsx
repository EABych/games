import React, { useState } from 'react';
import type { 
  ThisOrThatPlayer, 
  ThisOrThatSettings, 
  ThisOrThatCategory, 
  ThisOrThatIntensity 
} from '../../types/this-or-that';
import { 
  DEFAULT_THIS_OR_THAT_SETTINGS, 
  THIS_OR_THAT_CATEGORY_INFO, 
  THIS_OR_THAT_INTENSITY_INFO 
} from '../../types/this-or-that';
import './ThisOrThat.css';

interface ThisOrThatSetupProps {
  onStartGame: (players: ThisOrThatPlayer[], settings: ThisOrThatSettings) => void;
}

export const ThisOrThatSetup: React.FC<ThisOrThatSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<ThisOrThatPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [settings, setSettings] = useState<ThisOrThatSettings>(DEFAULT_THIS_OR_THAT_SETTINGS);

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 20) {
      const newPlayer: ThisOrThatPlayer = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        answers: []
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const toggleCategory = (category: ThisOrThatCategory) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleIntensity = (intensity: ThisOrThatIntensity) => {
    setSettings(prev => ({
      ...prev,
      intensities: prev.intensities.includes(intensity)
        ? prev.intensities.filter(i => i !== intensity)
        : [...prev.intensities, intensity]
    }));
  };

  const handleStartGame = () => {
    if (canStartGame) {
      onStartGame(players, settings);
    }
  };

  const canStartGame = players.length >= 2 && 
                      settings.categories.length > 0 &&
                      settings.intensities.length > 0;

  return (
    <div className="this-or-that-setup">
      <div className="setup-header">
        <h2>То или То</h2>
        <p>Провокационные дилеммы для глубоких размышлений</p>
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
                disabled={!newPlayerName.trim() || players.length >= 20}
                className="add-player-btn"
              >
                +
              </button>
            </div>

            <div className="players-list">
              {players.map((player) => (
                <div key={player.id} className="player-item">
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
          </div>
        </div>

        <div className="setting-section">
          <h3>Количество вопросов</h3>
          <div className="setting-item">
            <span className="setting-label">Вопросов в игре</span>
            <input
              type="number"
              min="5"
              max="50"
              value={settings.questionsCount}
              onChange={(e) => setSettings(prev => ({ ...prev, questionsCount: parseInt(e.target.value) || 10 }))}
              className="setting-input"
            />
          </div>
        </div>

        <div className="setting-section">
          <h3>Категории вопросов</h3>
          <div className="categories-grid">
            {(Object.keys(THIS_OR_THAT_CATEGORY_INFO) as ThisOrThatCategory[]).map(category => (
              <div
                key={category}
                className={`category-card ${settings.categories.includes(category) ? 'selected' : ''}`}
                onClick={() => toggleCategory(category)}
              >
                <div className="category-name">{THIS_OR_THAT_CATEGORY_INFO[category].name}</div>
                <div className="category-description">{THIS_OR_THAT_CATEGORY_INFO[category].description}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="setting-section">
          <h3>Интенсивность вопросов</h3>
          <div className="intensity-grid">
            {(Object.keys(THIS_OR_THAT_INTENSITY_INFO) as ThisOrThatIntensity[]).map(intensity => (
              <div
                key={intensity}
                className={`intensity-card ${settings.intensities.includes(intensity) ? 'selected' : ''}`}
                onClick={() => toggleIntensity(intensity)}
              >
                <div className="intensity-name">{THIS_OR_THAT_INTENSITY_INFO[intensity].name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="setting-section">
          <h3>Дополнительные настройки</h3>
          <div className="setting-item">
            <span className="setting-label">Разрешить пропуск вопросов</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.allowSkip}
                onChange={(e) => setSettings(prev => ({ ...prev, allowSkip: e.target.checked }))}
              />
              <span className="slider"></span>
            </label>
          </div>
          <div className="setting-item">
            <span className="setting-label">Показывать статистику ответов</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={settings.showResults}
                onChange={(e) => setSettings(prev => ({ ...prev, showResults: e.target.checked }))}
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