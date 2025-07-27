import React from 'react';
import type { KrocodilGameState } from '../../types/krocodil';
import './Krocodil.css';

interface KrocodilRoundEndProps {
  gameState: KrocodilGameState;
  onStartNextRound: () => void;
}

export const KrocodilRoundEnd: React.FC<KrocodilRoundEndProps> = ({
  gameState,
  onStartNextRound
}) => {
  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const previousTeamIndex = gameState.currentTeamIndex === 0 
    ? gameState.teams.length - 1 
    : gameState.currentTeamIndex - 1;
  const previousTeam = gameState.teams[previousTeamIndex];

  const getTeamPlayers = (teamId: string) => {
    return gameState.players.filter(p => p.teamId === teamId);
  };

  const currentPlayer = gameState.players.find(p => p.teamId === currentTeam?.id);

  return (
    <div className="krocodil-round-end">
      <h1>Раунд завершён!</h1>
      
      <div className="round-summary">
        <div className="previous-team-results">
          <h2>Результаты команды "{previousTeam.name}"</h2>
          <div className="team-stats">
            <div className="stat-card">
              <span className="stat-number">{previousTeam.guessedWords}</span>
              <span className="stat-label">угадано слов</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{previousTeam.skippedWords}</span>
              <span className="stat-label">пропущено слов</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">{previousTeam.score}</span>
              <span className="stat-label">всего очков</span>
            </div>
          </div>
        </div>

        <div className="scores-table">
          <h3>Текущий счёт</h3>
          <div className="scores-list">
            {gameState.teams
              .sort((a, b) => b.score - a.score)
              .map((team, index) => (
                <div key={team.id} className="score-item">
                  <div className="team-position">
                    {index + 1}.
                  </div>
                  <div className="team-name">{team.name}</div>
                  <div className="team-score">{team.score} очков</div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="next-team-info">
        <h2>Следующий ход</h2>
        <div className="next-team-card">
          <h3>Команда: <span className="team-highlight">{currentTeam?.name}</span></h3>
          {currentPlayer && (
            <p>Показывает: <span className="player-highlight">{currentPlayer.name}</span></p>
          )}
          <div className="team-members">
            <h4>Состав команды:</h4>
            <div className="players-list">
              {getTeamPlayers(currentTeam?.id || '').map((player) => (
                <span key={player.id} className="player-name">
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="round-info">
        <div className="round-details">
          <div className="detail-item">
            <span>Раунд:</span>
            <span>{gameState.currentRound}</span>
          </div>
          <div className="detail-item">
            <span>Время раунда:</span>
            <span>{gameState.settings.roundTime} секунд</span>
          </div>
          <div className="detail-item">
            <span>До победы:</span>
            <span>{gameState.settings.pointsToWin} очков</span>
          </div>
        </div>
      </div>

      <button 
        className="start-round-button"
        onClick={onStartNextRound}
      >
        Начать раунд
      </button>
    </div>
  );
};