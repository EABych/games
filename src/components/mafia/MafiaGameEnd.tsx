import React from 'react';
import { ROLE_INFO } from '../../data/mafiaRoles';
import type { MafiaGameState } from '../../types/mafia';

interface MafiaGameEndProps {
  gameState: MafiaGameState;
  onNewGame: () => void;
}

export const MafiaGameEnd: React.FC<MafiaGameEndProps> = ({ gameState, onNewGame }) => {
  const getWinnerTitle = () => {
    switch (gameState.winner) {
      case 'mafia':
        return '🕴️ Победа Мафии!';
      case 'citizens':
        return '👥 Победа Мирных жителей!';
      default:
        return 'Игра окончена';
    }
  };

  const getWinnerDescription = () => {
    switch (gameState.winner) {
      case 'mafia':
        return 'Мафия захватила город! Темные силы одержали верх.';
      case 'citizens':
        return 'Справедливость восторжествовала! Все мафиози найдены.';
      default:
        return '';
    }
  };

  const getWinnerColor = () => {
    switch (gameState.winner) {
      case 'mafia':
        return '#FF3B30';
      case 'citizens':
        return '#34C759';
      default:
        return '#86868b';
    }
  };

  const alivePlayers = gameState.players.filter(p => p.isAlive && p.role !== 'moderator');
  const deadPlayers = gameState.players.filter(p => !p.isAlive && p.role !== 'moderator');

  return (
    <div className="mafia-game-end">
      <div className="winner-announcement">
        <h1 style={{ color: getWinnerColor() }}>{getWinnerTitle()}</h1>
        <p>{getWinnerDescription()}</p>
      </div>

      <div className="game-results">
        <div className="survivors-section">
          <h3>🎉 Выжившие</h3>
          <div className="players-list">
            {alivePlayers.map((player) => {
              const roleInfo = ROLE_INFO[player.role];
              return (
                <div key={player.id} className="result-player-card alive">
                  <div className="player-avatar">{roleInfo.emoji}</div>
                  <div className="player-info">
                    <h4>{player.name}</h4>
                    <span className="player-role" style={{ color: roleInfo.color }}>
                      {roleInfo.name}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {deadPlayers.length > 0 && (
          <div className="casualties-section">
            <h3>💀 Погибшие</h3>
            <div className="players-list">
              {deadPlayers.map((player) => {
                const roleInfo = ROLE_INFO[player.role];
                return (
                  <div key={player.id} className="result-player-card dead">
                    <div className="player-avatar">{roleInfo.emoji}</div>
                    <div className="player-info">
                      <h4>{player.name}</h4>
                      <span className="player-role" style={{ color: roleInfo.color }}>
                        {roleInfo.name}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="game-stats">
        <h3>📊 Статистика игры</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Раундов сыграно:</span>
            <span className="stat-value">{gameState.currentRound - 1}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Всего игроков:</span>
            <span className="stat-value">{gameState.players.filter(p => p.role !== 'moderator').length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Мафиози в игре:</span>
            <span className="stat-value">{gameState.players.filter(p => p.role === 'mafia').length}</span>
          </div>
        </div>
      </div>

      <button className="new-mafia-game-button" onClick={onNewGame}>
        Новая игра
      </button>
    </div>
  );
};