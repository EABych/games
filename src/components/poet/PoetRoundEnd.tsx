import React from 'react';
import type { PoetGameState } from '../../types/poet';

interface PoetRoundEndProps {
  gameState: PoetGameState;
  onNextRound: () => void;
}

export const PoetRoundEnd: React.FC<PoetRoundEndProps> = ({
  gameState,
  onNextRound
}) => {
  // Получаем задачи последнего раунда
  const currentRoundTasks = gameState.completedTasks.filter(task => {
    // Подсчитываем количество задач до этого игрока в текущем раунде
    const tasksBeforePlayer = gameState.completedTasks.slice(0, gameState.completedTasks.indexOf(task));
    const roundIndex = Math.floor(tasksBeforePlayer.length / gameState.players.length);
    return roundIndex === gameState.currentRound - 1;
  });

  const successfulTasks = currentRoundTasks.filter(task => task.success);
  const failedTasks = currentRoundTasks.filter(task => !task.success);

  const isLastRound = gameState.currentRound >= gameState.settings.roundsCount;

  return (
    <div className="poet-round-end">
      <div className="round-end-header">
        <h1>Результаты раунда {gameState.currentRound}</h1>
        <div className="round-summary">
          <div className="summary-stats">
            <div className="stat-item success">
              <span className="stat-icon">✅</span>
              <span className="stat-value">{successfulTasks.length}</span>
              <span className="stat-label">справились</span>
            </div>
            <div className="stat-item failed">
              <span className="stat-icon">❌</span>
              <span className="stat-value">{failedTasks.length}</span>
              <span className="stat-label">не смогли</span>
            </div>
          </div>
        </div>
      </div>

      {/* Результаты задач раунда */}
      <div className="round-results">
        <h2>📝 Задания раунда</h2>
        
        {currentRoundTasks.length > 0 ? (
          <div className="tasks-list">
            {currentRoundTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.success ? 'success' : 'failed'}`}>
                <div className="task-status">
                  {task.success ? '✅' : '❌'}
                </div>
                
                <div className="task-content">
                  <div className="task-line">
                    "{task.firstLine}"
                  </div>
                  <div className="task-player">
                    {task.playerName} — {task.success ? 'справился' : 'не смог'}
                  </div>
                </div>
                
                <div className="task-points">
                  +{task.success ? gameState.settings.pointsForSuccess : gameState.settings.pointsForFailure}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks">
            <p>В этом раунде не было заданий 🤔</p>
          </div>
        )}
      </div>

      {/* Общий счет */}
      <div className="current-leaderboard">
        <h2>📊 Общий счет</h2>
        <div className="leaderboard-list">
          {gameState.leaderboard.map((player, index) => (
            <div key={player.id} className={`leaderboard-item ${index === 0 ? 'leader' : ''}`}>
              <div className="position">
                {index === 0 ? '👑' : `${index + 1}.`}
              </div>
              <div className="player-info">
                <span className="player-name">{player.name}</span>
                <div className="player-stats">
                  <span className="player-score">{player.score} очков</span>
                  <span className="player-breakdown">✅{player.completed} ❌{player.failed}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Кнопка продолжения */}
      <div className="round-end-actions">
        <button 
          onClick={onNextRound}
          className="next-round-btn"
        >
          {isLastRound ? 'Завершить игру' : `Раунд ${gameState.currentRound + 1}`}
        </button>
      </div>

      {/* Прогресс игры */}
      <div className="game-progress">
        <div className="progress-info">
          Раунд {gameState.currentRound} из {gameState.settings.roundsCount}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(gameState.currentRound / gameState.settings.roundsCount) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};