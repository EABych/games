import React from 'react';
import type { PoetGameState } from '../../types/poet';

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
      <div className="poet-game loading">
        <div className="loading-content">
          <h2>Подготовка раунда...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="poet-game">
      {/* Заголовок игры */}
      <div className="game-header">
        <div className="round-info">
          <h1>Раунд {gameState.currentRound} из {gameState.settings.roundsCount}</h1>
          <div className="current-player">
            Ходит: <strong>{currentPlayer.name}</strong>
          </div>
        </div>
        
        <div className="score-display">
          <div className="score-item">
            ✅ {currentPlayer.completed}
          </div>
          <div className="score-item">
            ❌ {currentPlayer.failed}
          </div>
          <div className="score-item total">
            🏆 {currentPlayer.score}
          </div>
        </div>
      </div>

      {/* Задание */}
      <div className="task-display">
        <h2>Ваше задание:</h2>
        <div className="task-text">
          Придумайте вторую строку к двустишию:
        </div>
        <div className="first-line">
          "{gameState.currentFirstLine.text}"
        </div>
        {gameState.currentFirstLine.suggestedRhyme && (
          <div className="rhyme-suggestion">
            💡 Подсказка для рифмы: {gameState.currentFirstLine.suggestedRhyme}
          </div>
        )}
      </div>

      {/* Кнопки действий */}
      <div className="action-phase">
        <div className="instruction">
          <p>Подумайте над второй строкой и выберите:</p>
        </div>
        
        <div className="action-buttons">
          <button 
            onClick={handleConfirm}
            className="confirm-btn"
          >
            ✅ Выполнил
            <span className="points">+{gameState.settings.pointsForSuccess} очко</span>
          </button>
          
          <button 
            onClick={handleFail}
            className="fail-btn"
          >
            ❌ Не смог
            <span className="points">+{gameState.settings.pointsForFailure} очков</span>
          </button>
        </div>
        
        <div className="game-progress">
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

    </div>
  );
};