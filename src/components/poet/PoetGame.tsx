import React from 'react';
import type { PoetGameState } from '../../types/poet';
import './Poet.css';

interface PoetGameProps {
  gameState: PoetGameState;
  onConfirmTask: (success: boolean) => void;
}

export const PoetGame: React.FC<PoetGameProps> = ({
  gameState,
  onConfirmTask
}) => {
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];
  const isPlaying = gameState.phase === 'playing';


  const handleConfirm = () => {
    onConfirmTask(true);
  };

  const handleFail = () => {
    onConfirmTask(false);
  };

  if (!isPlaying || !gameState.currentFirstLine || !currentPlayer) {
    return (
      <div className="poet-game">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Подготовка раунда...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="poet-game">
      <div className="game-header">
        <h2>Раунд {gameState.currentRound} из {gameState.settings.roundsCount}</h2>
        <p>Ходит: {currentPlayer.name}</p>
      </div>

      <div className="game-body">

        <div className="task-card">
          <h3>Ваше задание:</h3>
          <div className="task-text">
            Придумайте вторую строку к двустишию:
          </div>
          <div className="first-line">
            "{gameState.currentFirstLine.text}"
          </div>
          {gameState.currentFirstLine.suggestedRhyme && (
            <div className="rhyme-suggestion">
              Подсказка для рифмы: {gameState.currentFirstLine.suggestedRhyme}
            </div>
          )}
        </div>

        <div className="score-card">
          <div className="score-display">
            <div className="score-item">
              <span className="score-label">Успехов</span>
              <span className="score-value">{currentPlayer.completed}</span>
            </div>
            <div className="score-item">
              <span className="score-label">Неудач</span>
              <span className="score-value">{currentPlayer.failed}</span>
            </div>
            <div className="score-item total">
              <span className="score-label">Очков</span>
              <span className="score-value">{currentPlayer.score}</span>
            </div>
          </div>
        </div>

        <div className="players-progress">
          <h3>Результаты игроков:</h3>
          <div className="players-list">
            {gameState.players.map((player, index) => (
              <div 
                key={player.id} 
                className={`player-item ${index === gameState.currentPlayerIndex ? 'current' : ''}`}
              >
                <span className="player-name">{player.name}</span>
                <span className="player-score">{player.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="game-actions">
        <div className="action-buttons">
          <button 
            onClick={handleConfirm}
            className="confirm-button"
          >
            Выполнил
            <span className="points">+{gameState.settings.pointsForSuccess}</span>
          </button>
          
          <button 
            onClick={handleFail}
            className="fail-button"
          >
            Не смог
            <span className="points">{gameState.settings.pointsForFailure === 0 ? '0' : gameState.settings.pointsForFailure}</span>
          </button>
        </div>
      </div>

    </div>
  );
};