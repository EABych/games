import React, { useState } from 'react';
import type { PoetPlayer, PoetSettings, PoetCategory, PoetDifficulty } from '../../types/poet';
import { POET_CATEGORY_INFO, POET_DIFFICULTY_INFO } from '../../types/poet';

interface PoetSetupProps {
  onStartGame: (players: PoetPlayer[], settings: PoetSettings) => void;
}

export const PoetSetup: React.FC<PoetSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<PoetPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [settings, setSettings] = useState<PoetSettings>({
    roundsCount: 10,
    categories: ['life', 'love', 'nature', 'wisdom', 'humor'],
    difficulty: ['easy', 'medium'],
    pointsForSuccess: 1,
    pointsForFailure: 0
  });

  const addPlayer = () => {
    if (newPlayerName.trim() && players.length < 8) {
      const newPlayer: PoetPlayer = {
        id: `player_${Date.now()}`,
        name: newPlayerName.trim(),
        score: 0,
        completed: 0,
        failed: 0
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const toggleCategory = (category: PoetCategory) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleDifficulty = (difficulty: PoetDifficulty) => {
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
    <div className="poet-setup">
      <div className="setup-header">
        <h1>🎭 Поэт</h1>
        <p>Придумайте рифму к строке стиха и набирайте очки за успешное выполнение!</p>
      </div>

      <div className="setup-content">
        {/* Добавление игроков */}
        <div className="setup-section">
          <h2>Игроки ({players.length}/8)</h2>
          <div className="players-input">
            <input
              type="text"
              value={newPlayerName}
              onChange={(e) => setNewPlayerName(e.target.value)}
              placeholder="Имя игрока"
              maxLength={20}
              onKeyPress={(e) => e.key === 'Enter' && addPlayer()}
            />
            <button 
              onClick={addPlayer}
              disabled={!newPlayerName.trim() || players.length >= 8}
              className="add-player-btn"
            >
              Добавить
            </button>
          </div>
          
          <div className="players-list">
            {players.map((player) => (
              <div key={player.id} className="player-item">
                <span>{player.name}</span>
                <button onClick={() => removePlayer(player.id)} className="remove-btn">
                  ✕
                </button>
              </div>
            ))}
          </div>
          {players.length < 2 && (
            <p className="requirement-text">Необходимо минимум 2 игрока</p>
          )}
        </div>

        {/* Настройки категорий */}
        <div className="setup-section">
          <h2>Категории тем</h2>
          <div className="categories-grid">
            {(Object.entries(POET_CATEGORY_INFO) as [PoetCategory, typeof POET_CATEGORY_INFO[PoetCategory]][]).map(([category, info]) => (
              <button
                key={category}
                onClick={() => toggleCategory(category)}
                className={`category-btn ${settings.categories.includes(category) ? 'selected' : ''}`}
              >
                <span className="category-emoji">{info.emoji}</span>
                <div className="category-info">
                  <span className="category-name">{info.name}</span>
                  <span className="category-desc">{info.description}</span>
                </div>
              </button>
            ))}
          </div>
          {settings.categories.length === 0 && (
            <p className="requirement-text">Выберите хотя бы одну категорию</p>
          )}
        </div>

        {/* Настройки сложности */}
        <div className="setup-section">
          <h2>Уровень сложности</h2>
          <div className="difficulty-grid">
            {(Object.entries(POET_DIFFICULTY_INFO) as [PoetDifficulty, typeof POET_DIFFICULTY_INFO[PoetDifficulty]][]).map(([difficulty, info]) => (
              <button
                key={difficulty}
                onClick={() => toggleDifficulty(difficulty)}
                className={`difficulty-btn ${settings.difficulty.includes(difficulty) ? 'selected' : ''}`}
                style={{ borderColor: info.color }}
              >
                <div className="difficulty-info">
                  <span className="difficulty-name" style={{ color: info.color }}>
                    {info.name}
                  </span>
                  <span className="difficulty-desc">{info.description}</span>
                </div>
              </button>
            ))}
          </div>
          {settings.difficulty.length === 0 && (
            <p className="requirement-text">Выберите хотя бы один уровень сложности</p>
          )}
        </div>

        {/* Игровые настройки */}
        <div className="setup-section">
          <h2>Настройки игры</h2>
          <div className="game-settings">
            <div className="setting-item">
              <label>Количество раундов:</label>
              <select 
                value={settings.roundsCount} 
                onChange={(e) => setSettings(prev => ({ ...prev, roundsCount: Number(e.target.value) }))}
              >
                <option value={5}>5 раундов</option>
                <option value={10}>10 раундов</option>
                <option value={15}>15 раундов</option>
                <option value={20}>20 раундов</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>Очки за успех:</label>
              <select 
                value={settings.pointsForSuccess} 
                onChange={(e) => setSettings(prev => ({ ...prev, pointsForSuccess: Number(e.target.value) }))}
              >
                <option value={1}>1 очко</option>
                <option value={2}>2 очка</option>
                <option value={3}>3 очка</option>
                <option value={5}>5 очков</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label>Очки за неудачу:</label>
              <select 
                value={settings.pointsForFailure} 
                onChange={(e) => setSettings(prev => ({ ...prev, pointsForFailure: Number(e.target.value) }))}
              >
                <option value={0}>0 очков</option>
                <option value={-1}>-1 очко</option>
                <option value={-2}>-2 очка</option>
              </select>
            </div>
          </div>
        </div>

        {/* Кнопка старта */}
        <button 
          onClick={handleStartGame}
          disabled={!canStartGame}
          className="start-game-btn"
        >
          Начать игру
        </button>
      </div>
    </div>
  );
};