import React from 'react';
import type { FantGameState } from '../../types/fants';
import './Fants.css';

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

  // Проверяем на ничью
  const topScore = sortedPlayers[0];
  const winners = sortedPlayers.filter(player => 
    player.completedFants === topScore.completedFants && 
    player.skippedFants === topScore.skippedFants
  );
  const isDrawn = winners.length > 1;

  const totalCompleted = gameState.players.reduce((sum, player) => sum + player.completedFants, 0);
  const totalSkipped = gameState.players.reduce((sum, player) => sum + player.skippedFants, 0);

  return (
    <div className="fants-end">
      <h1>Игра завершена!</h1>
      
      <div className="winner-section">
        {isDrawn ? (
          <div className="draw-card">
            <h2>Ничья!</h2>
            <h3 className="draw-description">
              {winners.length} игрока показали одинаковый результат
            </h3>
            <div className="draw-winners">
              {winners.map((winner, index) => (
                <span key={winner.id} className="draw-winner-name">
                  {winner.name}
                  {index < winners.length - 1 && ", "}
                </span>
              ))}
            </div>
            <div className="winner-stats">
              <div className="winner-stat">
                <span className="stat-number">{topScore.completedFants}</span>
                <span className="stat-label">выполнено</span>
              </div>
              {gameState.settings.allowSkip && (
                <div className="winner-stat">
                  <span className="stat-number">{topScore.skippedFants}</span>
                  <span className="stat-label">пропущено</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="winner-card">
            <div className="winner-avatar">
              {topScore.name.charAt(0).toUpperCase()}
            </div>
            <h2>Победитель</h2>
            <h3 className="winner-name">{topScore.name}</h3>
            <div className="winner-stats">
              <div className="winner-stat">
                <span className="stat-number">{topScore.completedFants}</span>
                <span className="stat-label">выполнено</span>
              </div>
              {gameState.settings.allowSkip && (
                <div className="winner-stat">
                  <span className="stat-number">{topScore.skippedFants}</span>
                  <span className="stat-label">пропущено</span>
                </div>
              )}
            </div>
          </div>
        )}
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
          {sortedPlayers.map((player, index) => {
            const isWinner = winners.some(w => w.id === player.id);
            return (
              <div 
                key={player.id}
                className={`result-item ${isWinner ? 'winner-result' : ''}`}
              >
                <div className="result-place">
                  {isWinner ? (isDrawn ? '=' : '1') : `${index + 1}`}
                </div>
              <div className="result-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="result-info">
                <span className="result-name">{player.name}</span>
                <div className="result-stats">
                  <span className="result-stat completed">{player.completedFants} выполнено</span>
                  {gameState.settings.allowSkip && (
                    <span className="result-stat skipped">{player.skippedFants} пропущено</span>
                  )}
                </div>
              </div>
            </div>
            );
          })}
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