import React from 'react';
import type { GameState } from '../types';

interface GameEndProps {
  gameState: GameState;
  onNewGame: () => void;
}

export const GameEnd: React.FC<GameEndProps> = ({ gameState, onNewGame }) => {
  const sortedTeams = [...gameState.teams].sort((a, b) => b.score - a.score);
  const winner = sortedTeams[0];

  return (
    <div className="game-end">
      <h1>Игра окончена!</h1>
      
      <div className="winner" style={{ backgroundColor: winner.color }}>
        <h2>🏆 Победитель</h2>
        <h3>{winner.name}</h3>
        <p className="winner-score">{winner.score} очков</p>
      </div>

      <div className="final-results">
        <h3>Финальные результаты:</h3>
        {sortedTeams.map((team, index) => (
          <div 
            key={team.id} 
            className={`final-team-result ${index === 0 ? 'winner-result' : ''}`}
          >
            <span className="place">{index + 1}</span>
            <span className="team-name" style={{ color: team.color }}>
              {team.name}
            </span>
            <span className="team-score">{team.score} очков</span>
          </div>
        ))}
      </div>

      <button 
        className="new-game-button"
        onClick={onNewGame}
      >
        Новая игра
      </button>
    </div>
  );
};