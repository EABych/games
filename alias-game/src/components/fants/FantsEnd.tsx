import React from 'react';
import type { FantGameState } from '../../types/fants';

interface FantsEndProps {
  gameState: FantGameState;
  onNewGame: () => void;
}

export const FantsEnd: React.FC<FantsEndProps> = ({ gameState, onNewGame }) => {
  const sortedPlayers = [...gameState.players].sort((a, b) => {
    // Сначала по количеству выполненных, потом по количеству пропущенных (меньше = лучше)
    if (a.completedFants !== b.completedFants) {
      return b.completedFants - a.completedFants;
    }
    return a.skippedFants - b.skippedFants;
  });

  const winner = sortedPlayers[0];
  const totalCompleted = gameState.players.reduce((sum, player) => sum + player.completedFants, 0);
  const totalSkipped = gameState.players.reduce((sum, player) => sum + player.skippedFants, 0);

  return (
    <div className="fants-end">
      <h1>Игра завершена!</h1>
      
      <div className="winner-section">
        <div className="winner-card">
          <div className="winner-avatar">
            {winner.name.charAt(0).toUpperCase()}
          </div>
          <h2>Победитель</h2>
          <h3 className="winner-name">{winner.name}</h3>
          <div className="winner-stats">
            <div className="winner-stat">
              <span className="stat-number">{winner.completedFants}</span>
              <span className="stat-label">выполнено</span>
            </div>
            {gameState.settings.allowSkip && (
              <div className="winner-stat">
                <span className="stat-number">{winner.skippedFants}</span>
                <span className="stat-label">пропущено</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="game-stats">
        <h3>Статистика игры</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{totalCompleted}</span>
            <span className="stat-name">Выполнено заданий</span>
          </div>
          {gameState.settings.allowSkip && (
            <div className="stat-card">
              <span className="stat-value">{totalSkipped}</span>
              <span className="stat-name">Пропущено заданий</span>
            </div>
          )}
          <div className="stat-card">
            <span className="stat-value">{gameState.players.length}</span>
            <span className="stat-name">Участников</span>
          </div>
        </div>
      </div>

      <div className="final-results">
        <h3>Результаты участников</h3>
        <div className="results-list">
          {sortedPlayers.map((player, index) => (
            <div 
              key={player.id}
              className={`result-item ${index === 0 ? 'winner-result' : ''}`}
            >
              <div className="result-place">
                {index === 0 ? '🏆' : `${index + 1}.`}
              </div>
              <div className="result-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="result-info">
                <span className="result-name">{player.name}</span>
                <div className="result-stats">
                  <span className="result-stat completed">✓ {player.completedFants}</span>
                  {gameState.settings.allowSkip && (
                    <span className="result-stat skipped">⊘ {player.skippedFants}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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