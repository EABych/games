import React, { useState } from 'react';

interface MafiaHostSetupProps {
  onStartGame: (settings: MafiaGameSettings) => void;
  onBack: () => void;
}

interface MafiaGameSettings {
  playerCount: number;
  includeDoctor: boolean;
  includeDetective: boolean;
  includeSheriff: boolean;
  includeDon: boolean;
  discussionTime: number;
  votingTime: number;
  nightTime: number;
}

export const MafiaHostSetup: React.FC<MafiaHostSetupProps> = ({ onStartGame, onBack }) => {
  const [settings, setSettings] = useState<MafiaGameSettings>({
    playerCount: 6,
    includeDoctor: true,
    includeDetective: true,
    includeSheriff: false,
    includeDon: false,
    discussionTime: 180, // 3 минуты
    votingTime: 60,      // 1 минута
    nightTime: 30        // 30 секунд
  });

  const [errors, setErrors] = useState<string[]>([]);

  const validateSettings = (): boolean => {
    const newErrors: string[] = [];

    if (settings.playerCount < 4) {
      newErrors.push('Минимум 4 игрока');
    }
    if (settings.playerCount > 20) {
      newErrors.push('Максимум 20 игроков');
    }
    if (settings.includeDetective && settings.includeSheriff) {
      newErrors.push('Выберите либо детектива, либо шерифа');
    }
    if (settings.includeDetective && settings.playerCount < 5) {
      newErrors.push('Детектив доступен от 5 игроков');
    }
    if (settings.includeSheriff && settings.playerCount < 6) {
      newErrors.push('Шериф доступен от 6 игроков');
    }
    if (settings.includeDoctor && settings.playerCount < 6) {
      newErrors.push('Доктор доступен от 6 игроков');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleStartGame = () => {
    if (validateSettings()) {
      onStartGame(settings);
    }
  };

  const getMafiaCount = () => Math.floor(settings.playerCount / 3);
  const getSpecialRolesCount = () => {
    let count = 0;
    if (settings.includeDoctor && settings.playerCount >= 6) count++;
    if (settings.includeDetective && settings.playerCount >= 5) count++;
    if (settings.includeSheriff && settings.playerCount >= 6 && !settings.includeDetective) count++;
    return count;
  };
  const getCitizensCount = () => settings.playerCount - getMafiaCount() - getSpecialRolesCount();

  return (
    <div className="mafia-host-setup">
      <div className="setup-header">
        <button onClick={onBack} className="back-button">← Назад</button>
        <h2>🎭 Настройка игры Мафия</h2>
        <p>Настройте параметры игры для ведущего</p>
      </div>

      <div className="setup-content">
        <div className="setting-section">
          <h3>Количество игроков</h3>
          <div className="player-count-controls">
            <button 
              onClick={() => setSettings({...settings, playerCount: Math.max(4, settings.playerCount - 1)})}
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
          <h3>Роли в игре</h3>
          <div className="roles-preview">
            <div className="role-item mafia-role">
              <span>🔫 Мафия: {getMafiaCount()}</span>
            </div>
            <div className="role-item citizen-role">
              <span>👥 Мирные жители: {getCitizensCount()}</span>
            </div>
          </div>

          <div className="special-roles">
            <h4>Специальные роли</h4>
            
            <label className="role-checkbox">
              <input
                type="checkbox"
                checked={settings.includeDoctor}
                onChange={(e) => setSettings({...settings, includeDoctor: e.target.checked})}
                disabled={settings.playerCount < 6}
              />
              <span>👨‍⚕️ Доктор (защищает от убийства)</span>
              {settings.playerCount < 6 && <span className="role-requirement">Нужно 6+ игроков</span>}
            </label>

            <label className="role-checkbox">
              <input
                type="checkbox"
                checked={settings.includeDetective}
                onChange={(e) => setSettings({
                  ...settings, 
                  includeDetective: e.target.checked,
                  includeSheriff: e.target.checked ? false : settings.includeSheriff
                })}
                disabled={settings.playerCount < 5}
              />
              <span>🕵️ Детектив (проверяет игроков)</span>
              {settings.playerCount < 5 && <span className="role-requirement">Нужно 5+ игроков</span>}
            </label>

            <label className="role-checkbox">
              <input
                type="checkbox"
                checked={settings.includeSheriff}
                onChange={(e) => setSettings({
                  ...settings, 
                  includeSheriff: e.target.checked,
                  includeDetective: e.target.checked ? false : settings.includeDetective
                })}
                disabled={settings.playerCount < 6 || settings.includeDetective}
              />
              <span>🤠 Шериф (альтернатива детективу)</span>
              {settings.playerCount < 6 && <span className="role-requirement">Нужно 6+ игроков</span>}
              {settings.includeDetective && <span className="role-requirement">Нельзя с детективом</span>}
            </label>

            <label className="role-checkbox">
              <input
                type="checkbox"
                checked={settings.includeDon}
                onChange={(e) => setSettings({...settings, includeDon: e.target.checked})}
              />
              <span>👑 Дон мафии (заменяет одного мафиози)</span>
            </label>
          </div>
        </div>

        <div className="setting-section">
          <h3>Настройки времени</h3>
          
          <div className="time-setting">
            <label>Время на обсуждение (секунды):</label>
            <input
              type="number"
              min="30"
              max="600"
              value={settings.discussionTime}
              onChange={(e) => setSettings({...settings, discussionTime: parseInt(e.target.value)})}
              className="time-input"
            />
          </div>

          <div className="time-setting">
            <label>Время на голосование (секунды):</label>
            <input
              type="number"
              min="15"
              max="120"
              value={settings.votingTime}
              onChange={(e) => setSettings({...settings, votingTime: parseInt(e.target.value)})}
              className="time-input"
            />
          </div>

          <div className="time-setting">
            <label>Время на ночные действия (секунды):</label>
            <input
              type="number"
              min="15"
              max="180"
              value={settings.nightTime}
              onChange={(e) => setSettings({...settings, nightTime: parseInt(e.target.value)})}
              className="time-input"
            />
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