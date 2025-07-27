import React from 'react';
import type { PoetGameState } from '../../types/poet';
import './Poet.css';

interface PoetRoundEndProps {
  gameState: PoetGameState;
  onNextRound: () => void;
}

export const PoetRoundEnd: React.FC<PoetRoundEndProps> = ({
  gameState,
  onNextRound
}) => {
  // Получаем задачи последнего завершенного раунда
  const completedRound = gameState.currentRound - 1;
  const currentRoundTasks = gameState.completedTasks.filter(task => 
    task.round === completedRound
  );

  const successfulTasks = currentRoundTasks.filter(task => task.success);
  const failedTasks = currentRoundTasks.filter(task => !task.success);

  const isLastRound = gameState.currentRound >= gameState.settings.roundsCount;

  return (
    <div className="poet-round-end">
      <div className="round-end-header">
        <h1>Результаты раунда {completedRound}</h1>
        <div className="round-summary">
          <div className="summary-stats">
            <div className="stat-item success">
              <span className="stat-value">{successfulTasks.length}</span>
              <span className="stat-label">выполнено</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item failed">
              <span className="stat-value">{failedTasks.length}</span>
              <span className="stat-label">пропущено</span>
            </div>
          </div>
        </div>
      </div>

      <div className="round-results">
        <h2>Задания раунда</h2>
        
        {currentRoundTasks.length > 0 ? (
          <div className="tasks-list">
            {currentRoundTasks.map((task) => (
              <div key={task.id} className={`task-item ${task.success ? 'success' : 'failed'}`}>
                <div className="task-indicator"></div>
                <div className="task-content">
                  <div className="task-line">
                    {task.firstLine}
                  </div>
                  <div className="task-player">
                    <span className="player-name">{task.playerName}</span>
                    <span className="task-result">{task.success ? 'выполнено' : 'пропущено'}</span>
                  </div>
                </div>
                <div className="task-points">
                  <span className="points-value">+{task.success ? gameState.settings.pointsForSuccess : gameState.settings.pointsForFailure}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-tasks">
            <p>В этом раунде не было заданий</p>
          </div>
        )}
      </div>

      <div className="current-leaderboard">
        <h2>Общий счет</h2>
        <div className="leaderboard-list">
          {gameState.leaderboard.map((player, index) => (
            <div key={player.id} className={`leaderboard-item ${index === 0 ? 'leader' : ''}`}>
              <div className="position">
                <span className="position-number">{index + 1}</span>
              </div>
              <div className="player-info">
                <span className="player-name">{player.name}</span>
                <div className="player-stats">
                  <span className="player-score">{player.score} очков</span>
                  <span className="player-breakdown">
                    <span className="stat-success">{player.completed}</span>
                    <span className="stat-separator">·</span>
                    <span className="stat-failed">{player.failed}</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="round-end-actions">
        <button 
          onClick={onNextRound}
          className="next-round-btn"
        >
          {isLastRound ? 'Завершить игру' : `Раунд ${gameState.currentRound + 1}`}
        </button>
      </div>

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