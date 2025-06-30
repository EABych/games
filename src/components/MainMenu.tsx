import React, { useState } from 'react';
import type { Team, GameSettings } from '../types';
import { getWordsCountByDifficulty, getTotalWordsCount } from '../data/words';

interface MainMenuProps {
  onStartGame: (teams: Team[], gameSettings: Partial<GameSettings>) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStartGame }) => {
  const [teams, setTeams] = useState<Team[]>([
    { id: '1', name: 'Команда 1', score: 0, color: '#FF6B6B' },
    { id: '2', name: 'Команда 2', score: 0, color: '#4ECDC4' }
  ]);
  const [roundTime, setRoundTime] = useState<number>(60);
  const [totalRounds, setTotalRounds] = useState<number>(5);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const updateTeamName = (id: string, name: string) => {
    setTeams(teams.map(team =>
      team.id === id ? { ...team, name } : team
    ));
  };

  const addTeam = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F'];
    const newTeam: Team = {
      id: Date.now().toString(),
      name: `Команда ${teams.length + 1}`,
      score: 0,
      color: colors[teams.length % colors.length]
    };
    setTeams([...teams, newTeam]);
  };

  const removeTeam = (id: string) => {
    if (teams.length > 2) {
      setTeams(teams.filter(team => team.id !== id));
    }
  };

  const handleStart = () => {
    if (teams.length >= 2 && teams.every(team => team.name.trim())) {
      onStartGame(teams, { roundTime, totalRounds, difficulty });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) {
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    return `${seconds}с`;
  };

  // @ts-ignore
  return (
    <div className="main-menu">
      <h1>Alias</h1>
      <div className="teams-setup">
        <h2>Настройка команд</h2>
        {teams.map((team) => (
          <div key={team.id} className="team-input" style={{ '--team-color': team.color } as React.CSSProperties}>
            <input
              type="text"
              value={team.name}
              onChange={(e) => updateTeamName(team.id, e.target.value)}
              placeholder="Название команды"
            />
            {teams.length > 2 && (
              <button
                className="remove-team"
                onClick={() => removeTeam(team.id)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {teams.length < 6 && (
          <button className="add-team" onClick={addTeam}>
            + Добавить команду
          </button>
        )}
      </div>

      <div className="game-settings-toggle">
        <button
          className="settings-toggle-button"
          onClick={() => setShowSettings(!showSettings)}
        >
          <span>Настройки игры</span>
          <div className="settings-summary">
            {formatTime(roundTime)} • {totalRounds} раундов
          </div>
          <span className={`toggle-icon ${showSettings ? 'expanded' : ''}`}>
            ▼
          </span>
        </button>

        <div className={`settings-content ${showSettings ? 'expanded' : ''}`}>
          <div className="game-settings">
            <h3>Длительность раунда</h3>
            <div className="time-options">
              {[30, 45, 60, 90, 120].map((time) => (
                <button
                  key={time}
                  className={`time-option ${roundTime === time ? 'active' : ''}`}
                  onClick={() => setRoundTime(time)}
                >
                  {formatTime(time)}
                </button>
              ))}
            </div>
          </div>

          <div className="game-settings">
            <h3>Количество раундов</h3>
            <div className="rounds-options">
              {[3, 5, 7, 10, 15].map((rounds) => (
                <button
                  key={rounds}
                  className={`rounds-option ${totalRounds === rounds ? 'active' : ''}`}
                  onClick={() => setTotalRounds(rounds)}
                >
                  {rounds}
                </button>
              ))}
            </div>
          </div>

          <div className="game-settings">
            <h3>Уровень сложности</h3>
            <div className="difficulty-options">
              {[
                { value: 'easy', label: 'Лёгкий', count: getWordsCountByDifficulty('easy') },
                { value: 'medium', label: 'Средний', count: getWordsCountByDifficulty('medium') },
                { value: 'hard', label: 'Сложный', count: getWordsCountByDifficulty('hard') }
              ].map((level) => (
                <button
                  key={level.value}
                  className={`difficulty-option ${difficulty === level.value ? 'active' : ''}`}
                  onClick={() => setDifficulty(level.value as 'easy' | 'medium' | 'hard')}
                >
                  <span className="difficulty-label">{level.label}</span>
                  <span className="difficulty-count">{level.count} слов</span>
                </button>
              ))}
            </div>
            <div className="total-words">
              Всего в базе: {getTotalWordsCount()} слов
            </div>
          </div>
        </div>
      </div>
      <button
        className="start-game"
        onClick={handleStart}
        disabled={teams.some(team => !team.name.trim())}
      >
        Начать игру
      </button>
    </div>
  );
};
