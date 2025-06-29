import React from 'react';
import type { FantGameState } from '../../types/fants';
import { CATEGORY_INFO, DIFFICULTY_INFO } from '../../types/fants';

interface FantsGameProps {
  gameState: FantGameState;
  onComplete: () => void;
  onSkip: () => void;
}

export const FantsGame: React.FC<FantsGameProps> = ({ 
  gameState, 
  onComplete, 
  onSkip 
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const currentFant = gameState.currentFant;
  
  const totalCompleted = gameState.players.reduce((sum, player) => 
    sum + player.completedFants + player.skippedFants, 0
  );
  
  const progress = (totalCompleted / gameState.totalFants) * 100;

  if (!currentFant) {
    return (
      <div className="fants-game error">
        <h2>Задания закончились!</h2>
        <p>Попробуйте изменить настройки игры</p>
      </div>
    );
  }

  const categoryInfo = CATEGORY_INFO[currentFant.category];
  const difficultyInfo = DIFFICULTY_INFO[currentFant.difficulty];

  return (
    <div className="fants-game">
      <div className="fants-header">
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            {totalCompleted} из {gameState.totalFants}
          </span>
        </div>
      </div>

      <div className="current-player">
        <div className="player-avatar">
          {currentPlayer.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="player-name">{currentPlayer.name}</h2>
        <p className="player-turn">Ваша очередь!</p>
      </div>

      <div className="fant-card">
        <div className="fant-meta">
          <div 
            className="fant-category"
            style={{ '--category-color': categoryInfo.color } as React.CSSProperties}
          >
            <span className="category-emoji">{categoryInfo.emoji}</span>
            <span className="category-name">{categoryInfo.name}</span>
          </div>
          <div 
            className="fant-difficulty"
            style={{ '--difficulty-color': difficultyInfo.color } as React.CSSProperties}
          >
            {difficultyInfo.name}
          </div>
        </div>
        
        <div className="fant-content">
          <h3 className="fant-text">{currentFant.text}</h3>
        </div>
      </div>

      <div className="fant-actions">
        {gameState.settings.allowSkip && (
          <button 
            className="skip-button"
            onClick={onSkip}
          >
            Пропустить
          </button>
        )}
        <button 
          className="complete-button"
          onClick={onComplete}
        >
          Выполнено!
        </button>
      </div>

      <div className="players-summary">
        <h3>Участники</h3>
        <div className="players-grid">
          {gameState.players.map((player, index) => (
            <div 
              key={player.id} 
              className={`player-summary ${index === gameState.currentPlayerIndex ? 'current' : ''}`}
            >
              <div className="player-summary-avatar">
                {player.name.charAt(0).toUpperCase()}
              </div>
              <div className="player-summary-info">
                <span className="player-summary-name">{player.name}</span>
                <div className="player-stats">
                  <span className="stat completed">✓ {player.completedFants}</span>
                  {gameState.settings.allowSkip && (
                    <span className="stat skipped">⊘ {player.skippedFants}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};