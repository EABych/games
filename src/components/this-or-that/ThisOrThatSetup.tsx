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

interface ThisOrThatSetupProps {
  onStartGame: (players: ThisOrThatPlayer[], settings: ThisOrThatSettings) => void;
}

export const ThisOrThatSetup: React.FC<ThisOrThatSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<ThisOrThatPlayer[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [settings, setSettings] = useState<ThisOrThatSettings>(DEFAULT_THIS_OR_THAT_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

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
      <h1>То или То</h1>
      <p className="subtitle">Провокационные дилеммы для глубоких размышлений</p>
      <p className="warning">⚠️ Игра содержит философские и провокационные вопросы для взрослой аудитории</p>

      <div className="players-setup">
        <h2>Участники</h2>
        <p className="players-subtitle">Добавьте участников игры (минимум 2)</p>
        
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
                className="remove-player"
                title="Удалить участника"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        {players.length === 0 && (
          <div className="no-players">
            Добавьте участников для начала игры
          </div>
        )}
        
        {players.length < 2 && players.length > 0 && (
          <div className="requirement">
            ⚠️ Необходимо минимум 2 участника для начала игры
          </div>
        )}
      </div>

      <div className="game-settings">
        <button
          className="settings-toggle"
          onClick={() => setShowSettings(true)}
          type="button"
        >
          <span>⚙️ Настройки игры</span>
        </button>

        {showSettings && (
          <div className="modal-overlay" onClick={() => setShowSettings(false)}>
            <div className="modal-content settings-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Настройки игры</h3>
                <button
                  className="modal-close"
                  onClick={() => setShowSettings(false)}
                  type="button"
                >
                  ×
                </button>
              </div>
              <div className="modal-body settings-modal-body">
                <div className="setting-group">
                  <h3>Количество вопросов</h3>
                  <div className="questions-options">
                    {[10, 15, 20, 25, 30, 50].map(count => (
                      <button
                        key={count}
                        className={`questions-option ${settings.questionsCount === count ? 'active' : ''}`}
                        onClick={() => setSettings(prev => ({ ...prev, questionsCount: count }))}
                        type="button"
                      >
                        {count}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-group">
                  <h3>Категории вопросов</h3>
                  <div className="categories-grid">
                    {(Object.keys(THIS_OR_THAT_CATEGORY_INFO) as ThisOrThatCategory[]).map(category => (
                      <button
                        key={category}
                        className={`category-option ${settings.categories.includes(category) ? 'active' : ''}`}
                        onClick={() => toggleCategory(category)}
                        style={{ '--category-color': THIS_OR_THAT_CATEGORY_INFO[category].color } as React.CSSProperties}
                        type="button"
                      >
                        <span className="category-emoji">{THIS_OR_THAT_CATEGORY_INFO[category].emoji}</span>
                        <span className="category-name">{THIS_OR_THAT_CATEGORY_INFO[category].name}</span>
                        <span className="category-description">{THIS_OR_THAT_CATEGORY_INFO[category].description}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="setting-group">
                  <h3>Интенсивность вопросов</h3>
                  <div className="intensity-options">
                    {(Object.keys(THIS_OR_THAT_INTENSITY_INFO) as ThisOrThatIntensity[]).map(intensity => (
                      <button
                        key={intensity}
                        className={`intensity-option ${settings.intensities.includes(intensity) ? 'active' : ''}`}
                        onClick={() => toggleIntensity(intensity)}
                        style={{ '--intensity-color': THIS_OR_THAT_INTENSITY_INFO[intensity].color } as React.CSSProperties}
                        type="button"
                      >
                        <span className="intensity-name">{THIS_OR_THAT_INTENSITY_INFO[intensity].name}</span>
                        <span className="intensity-description">{THIS_OR_THAT_INTENSITY_INFO[intensity].description}</span>
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
                    <span>Разрешить пропускать вопросы</span>
                  </label>
                  <p className="setting-hint">
                    Участники смогут пропустить вопрос, если он слишком личный или неудобный
                  </p>
                </div>

                <div className="setting-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={settings.showResults}
                      onChange={(e) => setSettings(prev => ({ ...prev, showResults: e.target.checked }))}
                    />
                    <span>Показывать статистику ответов</span>
                  </label>
                  <p className="setting-hint">
                    В конце игры будут показаны статистики ответов участников
                  </p>
                </div>
              </div>
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

      {!canStartGame && (
        <div className="requirements">
          {players.length < 2 && <div>• Добавьте минимум 2 участников</div>}
          {settings.categories.length === 0 && <div>• Выберите минимум 1 категорию</div>}
          {settings.intensities.length === 0 && <div>• Выберите минимум 1 уровень интенсивности</div>}
        </div>
      )}
    </div>
  );
};