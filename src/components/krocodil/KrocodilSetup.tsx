import React, { useState } from 'react';
import type { 
  KrocodilTeam, 
  KrocodilPlayer, 
  KrocodilSettings, 
  KrocodilCategory, 
  KrocodilDifficulty 
} from '../../types/krocodil';
import { 
  DEFAULT_KROCODIL_SETTINGS, 
  KROCODIL_CATEGORY_INFO, 
  KROCODIL_DIFFICULTY_INFO 
} from '../../types/krocodil';
import './Krocodil.css';

interface KrocodilSetupProps {
  onStartGame: (teams: KrocodilTeam[], players: KrocodilPlayer[], settings: KrocodilSettings) => void;
}

export const KrocodilSetup: React.FC<KrocodilSetupProps> = ({ onStartGame }) => {
  const [teams, setTeams] = useState<KrocodilTeam[]>([]);
  const [players, setPlayers] = useState<KrocodilPlayer[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [addingPlayerToTeam, setAddingPlayerToTeam] = useState<string | null>(null);
  const [settings, setSettings] = useState<KrocodilSettings>(DEFAULT_KROCODIL_SETTINGS);
  const [showSettings, setShowSettings] = useState(false);

  const addTeam = () => {
    if (newTeamName.trim() && teams.length < 4) {
      const newTeam: KrocodilTeam = {
        id: Date.now().toString(),
        name: newTeamName.trim(),
        players: [],
        score: 0,
        guessedWords: 0,
        skippedWords: 0
      };
      setTeams([...teams, newTeam]);
      setNewTeamName('');
      if (!selectedTeamId) {
        setSelectedTeamId(newTeam.id);
      }
    }
  };

  const removeTeam = (teamId: string) => {
    setTeams(teams.filter(t => t.id !== teamId));
    setPlayers(players.filter(p => p.teamId !== teamId));
    if (selectedTeamId === teamId) {
      setSelectedTeamId(teams.length > 1 ? teams.find(t => t.id !== teamId)?.id || '' : '');
    }
  };

  const addPlayer = (teamId?: string) => {
    const targetTeamId = teamId || selectedTeamId;
    if (newPlayerName.trim() && targetTeamId) {
      const newPlayer: KrocodilPlayer = {
        id: Date.now().toString(),
        name: newPlayerName.trim(),
        teamId: targetTeamId
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      setAddingPlayerToTeam(null);
    }
  };

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter(p => p.id !== playerId));
  };

  const getTeamPlayers = (teamId: string) => {
    return players.filter(p => p.teamId === teamId);
  };

  const toggleCategory = (category: KrocodilCategory) => {
    setSettings(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const toggleDifficulty = (difficulty: KrocodilDifficulty) => {
    setSettings(prev => ({
      ...prev,
      difficulties: prev.difficulties.includes(difficulty)
        ? prev.difficulties.filter(d => d !== difficulty)
        : [...prev.difficulties, difficulty]
    }));
  };

  const handleStartGame = () => {
    if (canStartGame) {
      onStartGame(teams, players, settings);
    }
  };

  const canStartGame = teams.length >= 2 && 
                      teams.every(team => getTeamPlayers(team.id).length >= 1) &&
                      settings.difficulties.length > 0 &&
                      settings.categories.length > 0;

  return (
    <div className="krocodil-setup">
      <div className="setup-header">
        <h1>Крокодил</h1>
        <p className="subtitle">Покажи слово без слов</p>
      </div>

      <div className="setup-content">
        <div className="teams-setup">
        <h2>Команды и участники</h2>
        <p className="teams-subtitle">Создайте команды и добавьте в них участников</p>
        
        <div className="add-team">
          <input
            type="text"
            placeholder="Название команды"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTeam()}
            maxLength={20}
          />
          <button 
            onClick={addTeam}
            disabled={!newTeamName.trim() || teams.length >= 4}
            className="add-team-btn"
          >
            +
          </button>
        </div>

        <div className="teams-list">
          {teams.map((team) => (
            <div key={team.id} className="team-card">
              <div className="team-header">
                <h3>{team.name}</h3>
                <button
                  onClick={() => removeTeam(team.id)}
                  className="remove-team"
                  title="Удалить команду"
                >
                  ×
                </button>
              </div>
              
              <div className="team-players">
                {getTeamPlayers(team.id).map((player) => (
                  <div key={player.id} className="player-item">
                    <span>{player.name}</span>
                    <button
                      onClick={() => removePlayer(player.id)}
                      className="remove-player"
                      title="Удалить игрока"
                    >
                      ×
                    </button>
                  </div>
                ))}
                
                {getTeamPlayers(team.id).length === 0 && (
                  <div className="no-players">
                    Нет игроков в команде
                  </div>
                )}
              </div>
              
              {addingPlayerToTeam === team.id ? (
                <div className="add-player-form">
                  <input
                    type="text"
                    placeholder="Имя игрока"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        addPlayer(team.id);
                      } else if (e.key === 'Escape') {
                        setAddingPlayerToTeam(null);
                        setNewPlayerName('');
                      }
                    }}
                    maxLength={20}
                    autoFocus
                    className="add-player-input"
                  />
                  <button 
                    onClick={() => addPlayer(team.id)}
                    disabled={!newPlayerName.trim()}
                    className="confirm-add-player"
                    title="Добавить игрока"
                  >
                    ✓
                  </button>
                  <button 
                    onClick={() => {
                      setAddingPlayerToTeam(null);
                      setNewPlayerName('');
                    }}
                    className="cancel-add-player"
                    title="Отмена"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingPlayerToTeam(team.id)}
                  className="add-player-btn-new"
                >
                  + Добавить игрока
                </button>
              )}
            </div>
          ))}
        </div>

        
        {teams.length < 2 && (
          <div className="warning-message">
            Необходимо минимум 2 команды для начала игры
          </div>
        )}
        
        {teams.length >= 2 && teams.some(team => getTeamPlayers(team.id).length === 0) && (
          <div className="warning-message">
            В каждой команде должен быть хотя бы один игрок
          </div>
        )}
      </div>

      <div className="game-settings">
        <button
          className="settings-toggle"
          onClick={() => setShowSettings(true)}
          type="button"
        >
          <span>Настройки игры</span>
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
              <h3>Время раунда (секунды)</h3>
              <div className="time-options">
                {[30, 60, 90, 120].map(time => (
                  <button
                    key={time}
                    className={`time-option ${settings.roundTime === time ? 'active' : ''}`}
                    onClick={() => setSettings(prev => ({ ...prev, roundTime: time }))}
                    type="button"
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h3>Очков для победы</h3>
              <div className="points-options">
                {[10, 15, 20, 25, 30].map(points => (
                  <button
                    key={points}
                    className={`points-option ${settings.pointsToWin === points ? 'active' : ''}`}
                    onClick={() => setSettings(prev => ({ ...prev, pointsToWin: points }))}
                    type="button"
                  >
                    {points}
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h3>Категории слов</h3>
              <div className="categories-grid">
                {(Object.keys(KROCODIL_CATEGORY_INFO) as KrocodilCategory[]).map(category => (
                  <button
                    key={category}
                    className={`category-option ${settings.categories.includes(category) ? 'active' : ''}`}
                    onClick={() => toggleCategory(category)}
                    style={{ '--category-color': KROCODIL_CATEGORY_INFO[category].color } as React.CSSProperties}
                    type="button"
                  >
                    <span className="category-name">{KROCODIL_CATEGORY_INFO[category].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="setting-group">
              <h3>Сложность слов</h3>
              <div className="difficulty-options">
                {(Object.keys(KROCODIL_DIFFICULTY_INFO) as KrocodilDifficulty[]).map(difficulty => (
                  <button
                    key={difficulty}
                    className={`difficulty-option ${settings.difficulties.includes(difficulty) ? 'active' : ''}`}
                    onClick={() => toggleDifficulty(difficulty)}
                    style={{ '--difficulty-color': KROCODIL_DIFFICULTY_INFO[difficulty].color } as React.CSSProperties}
                    type="button"
                  >
                    {KROCODIL_DIFFICULTY_INFO[difficulty].name}
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
                <span>Разрешить пропускать слова</span>
              </label>
            </div>

              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <div className="setup-footer">
        <button
          className="start-game"
          onClick={handleStartGame}
          disabled={!canStartGame}
        >
          Начать игру
        </button>
      </div>
    </div>
  );
};