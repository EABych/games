import React from 'react';
import type { GameState } from '../types';

interface RoundEndProps {
  gameState: GameState;
  onNextRound: () => void;
}

export const RoundEnd: React.FC<RoundEndProps> = ({ gameState, onNextRound }) => {
  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const nextTeamIndex = (gameState.currentTeamIndex + 1) % gameState.teams.length;
  const nextTeam = gameState.teams[nextTeamIndex];

  return (
    <div className="round-end">
      <h2>Раунд завершен!</h2>

      <div className="round-summary" style={{ borderColor: currentTeam.color }}>
        <h3>{currentTeam.name}</h3>
        <p className="round-score">Очки за раунд: {Math.max(0, gameState.roundScore)}</p>
        <p>Общий счет: {currentTeam.score}</p>
      </div>

      <div className="all-scores">
        <h3>Текущий счет:</h3>
        {gameState.teams
          .sort((a, b) => b.score - a.score)
          .map((team) => (
            <div key={team.id} className="team-result">
              <span style={{ color: team.color }}>{team.name}</span>
              <span>{team.score} очков</span>
            </div>
          ))}
      </div>
      <div className="next-team-info">
        <p>Следующая команда: <strong style={{ color: nextTeam.color }}>{nextTeam.name}</strong></p>
      </div>

      <button
        className="next-round-button"
        onClick={onNextRound}
        style={{ backgroundColor: nextTeam.color }}
      >
        Начать следующий раунд
      </button>
    </div>
  );
};
