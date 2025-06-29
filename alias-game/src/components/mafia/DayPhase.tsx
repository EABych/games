import React from 'react';
import { ROLE_INFO } from '../../data/mafiaRoles';
import type { MafiaGameState } from '../../types/mafia';

interface DayPhaseProps {
  gameState: MafiaGameState;
  onVote: (playerId: string) => void;
  onContinueToNight: () => void;
}

export const DayPhase: React.FC<DayPhaseProps> = ({ 
  gameState, 
  onVote, 
  onContinueToNight 
}) => {
  const alivePlayers = gameState.players.filter(p => p.isAlive && p.role !== 'moderator');
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseTitle = () => {
    switch (gameState.phase) {
      case 'discussion':
        return '💬 Обсуждение';
      case 'voting':
        return '🗳️ Голосование';
      default:
        return '☀️ День';
    }
  };

  const getPhaseDescription = () => {
    switch (gameState.phase) {
      case 'discussion':
        return 'Время для обсуждения. Найдите подозрительных игроков!';
      case 'voting':
        return 'Голосуйте за игрока, которого хотите исключить из игры';
      default:
        return '';
    }
  };

  const getTotalVotes = () => {
    return Object.values(gameState.votingResults).reduce((sum, votes) => sum + votes, 0);
  };

  return (
    <div className="day-phase">
      <div className="day-header">
        <h2>{getPhaseTitle()} - День {gameState.currentRound}</h2>
        {gameState.timeRemaining > 0 && (
          <div className={`timer ${gameState.timeRemaining <= 30 ? 'timer-warning' : ''}`}>
            {formatTime(gameState.timeRemaining)}
          </div>
        )}
        <p className="phase-description">{getPhaseDescription()}</p>
      </div>

      <div className="players-grid">
        {alivePlayers.map((player) => {
          const votes = gameState.votingResults[player.id] || 0;
          const roleInfo = ROLE_INFO[player.role];
          
          return (
            <div key={player.id} className="player-card">
              <div className="player-info">
                <div className="player-avatar">
                  {player.isRevealed ? roleInfo.emoji : '👤'}
                </div>
                <div className="player-details">
                  <h4>{player.name}</h4>
                  {player.isRevealed && (
                    <span className="revealed-role" style={{ color: roleInfo.color }}>
                      {roleInfo.name}
                    </span>
                  )}
                </div>
              </div>
              
              {gameState.phase === 'voting' && (
                <div className="voting-section">
                  <button
                    className="vote-button"
                    onClick={() => onVote(player.id)}
                  >
                    Голосовать
                  </button>
                  {votes > 0 && (
                    <div className="vote-count">
                      Голосов: {votes}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {gameState.phase === 'voting' && (
        <div className="voting-info">
          <p>Всего голосов: {getTotalVotes()}</p>
          <p>Игроков: {alivePlayers.length}</p>
        </div>
      )}

      {gameState.timeRemaining === 0 && gameState.phase === 'voting' && (
        <button className="continue-button" onClick={onContinueToNight}>
          Продолжить к ночи
        </button>
      )}
    </div>
  );
};