import React, { useState } from 'react';
import type { MafiaSettings } from '../../types/mafia';

interface MafiaSetupProps {
  onStartGame: (players: string[], settings: Partial<MafiaSettings>) => void;
}

export const MafiaSetup: React.FC<MafiaSetupProps> = ({ onStartGame }) => {
  const [players, setPlayers] = useState<string[]>(['', '', '', '']);
  const [discussionTime, setDiscussionTime] = useState<number>(300);
  const [votingTime, setVotingTime] = useState<number>(120);
  const [enableDoctor, setEnableDoctor] = useState<boolean>(true);
  const [enableDetective, setEnableDetective] = useState<boolean>(true);

  const updatePlayerName = (index: number, name: string) => {
    const newPlayers = [...players];
    newPlayers[index] = name;
    setPlayers(newPlayers);
  };

  const addPlayer = () => {
    if (players.length < 12) {
      setPlayers([...players, '']);
    }
  };

  const removePlayer = (index: number) => {
    if (players.length > 4) {
      setPlayers(players.filter((_, i) => i !== index));
    }
  };

  const handleStart = () => {
    const validPlayers = players.filter(name => name.trim());
    if (validPlayers.length >= 4) {
      onStartGame(validPlayers, {
        discussionTime,
        votingTime,
        enableDoctor,
        enableDetective
      });
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

  return (
    <div className="mafia-setup">
      <h1>Мафия</h1>
      
      <div className="players-setup">
        <h2>Игроки (минимум 4)</h2>
        {players.map((player, index) => (
          <div key={index} className="player-input">
            <input
              type="text"
              value={player}
              onChange={(e) => updatePlayerName(index, e.target.value)}
              placeholder={`Игрок ${index + 1}`}
            />
            {players.length > 4 && (
              <button 
                className="remove-player"
                onClick={() => removePlayer(index)}
              >
                ✕
              </button>
            )}
          </div>
        ))}
        {players.length < 12 && (
          <button className="add-player" onClick={addPlayer}>
            + Добавить игрока
          </button>
        )}
      </div>

      <div className="mafia-settings">
        <h3>Настройки игры</h3>
        
        <div className="setting-group">
          <label>Время обсуждения</label>
          <div className="time-options">
            {[180, 300, 420, 600].map((time) => (
              <button
                key={time}
                className={`time-option ${discussionTime === time ? 'active' : ''}`}
                onClick={() => setDiscussionTime(time)}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Время голосования</label>
          <div className="time-options">
            {[60, 120, 180, 240].map((time) => (
              <button
                key={time}
                className={`time-option ${votingTime === time ? 'active' : ''}`}
                onClick={() => setVotingTime(time)}
              >
                {formatTime(time)}
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label>Специальные роли</label>
          <div className="role-toggles">
            <button
              className={`role-toggle ${enableDoctor ? 'active' : ''}`}
              onClick={() => setEnableDoctor(!enableDoctor)}
            >
              👨‍⚕️ Доктор
            </button>
            <button
              className={`role-toggle ${enableDetective ? 'active' : ''}`}
              onClick={() => setEnableDetective(!enableDetective)}
            >
              🕵️ Детектив
            </button>
          </div>
        </div>
      </div>

      <button 
        className="start-mafia-game"
        onClick={handleStart}
        disabled={players.filter(p => p.trim()).length < 4}
      >
        Начать игру
      </button>
    </div>
  );
};