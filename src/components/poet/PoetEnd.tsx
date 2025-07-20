import React from 'react';
import type { PoetGameState } from '../../types/poet';

interface PoetEndProps {
  gameState: PoetGameState;
  onNewGame: () => void;
}

export const PoetEnd: React.FC<PoetEndProps> = ({
  gameState,
  onNewGame
}) => {
  const winner = gameState.leaderboard[0];
  const hasWinner = winner && winner.score > 0;

  // Статистика игры
  const totalTasks = gameState.completedTasks.length;
  const totalSuccessful = gameState.completedTasks.filter(task => task.success).length;
  const totalFailed = gameState.completedTasks.filter(task => !task.success).length;
  const successRate = totalTasks > 0 ? ((totalSuccessful / totalTasks) * 100).toFixed(1) : '0';

  // Самый успешный игрок
  const getMostSuccessfulPlayer = () => {
    return gameState.players
      .filter(player => player.completed > 0)
      .sort((a, b) => b.completed - a.completed)[0];
  };

  // Игрок с лучшим процентом успеха
  const getBestPerformer = () => {
    return gameState.players
      .filter(player => (player.completed + player.failed) > 0)
      .map(player => ({
        player,
        successRate: (player.completed / (player.completed + player.failed)) * 100
      }))
      .sort((a, b) => b.successRate - a.successRate)[0];
  };

  const mostSuccessfulPlayer = getMostSuccessfulPlayer();
  const bestPerformer = getBestPerformer();

  return (
    <div className="poet-end">
      {/* Заголовок с результатом */}
      <div className="game-end-header">
        <h1>🎭 Игра завершена!</h1>
        
        {hasWinner ? (
          <div className="winner-announcement">
            <div className="winner-crown">👑</div>
            <h2>Поздравляем победителя!</h2>
            <div className="winner-name">{winner.name}</div>
            <div className="winner-score">{winner.score} очков</div>
          </div>
        ) : (
          <div className="no-winner">
            <h2>Игра завершена!</h2>
            <p>В этой игре не было набрано очков</p>
          </div>
        )}
      </div>

      {/* Финальная таблица лидеров */}
      <div className="final-leaderboard">
        <h2>🏆 Финальные результаты</h2>
        <div className="leaderboard-list">
          {gameState.leaderboard.map((player, index) => {
            const isWinner = index === 0 && hasWinner;
            const tasksCompleted = player.completed;
            
            return (
              <div key={player.id} className={`final-leaderboard-item ${isWinner ? 'winner' : ''}`}>
                <div className="position">
                  {index === 0 && hasWinner ? '👑' : 
                   index === 1 ? '🥈' : 
                   index === 2 ? '🥉' : 
                   `${index + 1}.`}
                </div>
                
                <div className="player-details">
                  <div className="player-name">{player.name}</div>
                  <div className="player-stats">
                    <span className="stat">
                      <strong>{player.score}</strong> очков
                    </span>
                    <span className="stat">
                      <strong>{tasksCompleted}</strong> выполнено
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* Специальные награды */}
      <div className="special-awards">
        <h2>🎖️ Специальные награды</h2>
        <div className="awards-grid">
          {mostSuccessfulPlayer && (
            <div className="award-card">
              <div className="award-icon">✅</div>
              <div className="award-title">Мастер слова</div>
              <div className="award-recipient">{mostSuccessfulPlayer.name}</div>
              <div className="award-detail">{mostSuccessfulPlayer.completed} заданий выполнено</div>
            </div>
          )}
          
          {bestPerformer && (
            <div className="award-card">
              <div className="award-icon">🏆</div>
              <div className="award-title">Лучшая результативность</div>
              <div className="award-recipient">{bestPerformer.player.name}</div>
              <div className="award-detail">{bestPerformer.successRate.toFixed(1)}% успеха</div>
            </div>
          )}
          
          {totalTasks > 0 && (
            <div className="award-card">
              <div className="award-icon">📊</div>
              <div className="award-title">Общий успех</div>
              <div className="award-recipient">{successRate}%</div>
              <div className="award-detail">заданий выполнено</div>
            </div>
          )}
        </div>
      </div>

      {/* Статистика игры */}
      <div className="game-statistics">
        <h2>📈 Статистика игры</h2>
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-value">{gameState.settings.roundsCount}</div>
            <div className="stat-label">Раундов сыграно</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalSuccessful}</div>
            <div className="stat-label">Заданий выполнено</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{totalFailed}</div>
            <div className="stat-label">Заданий провалено</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{gameState.players.length}</div>
            <div className="stat-label">Игроков участвовало</div>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="game-end-actions">
        <button 
          onClick={onNewGame}
          className="new-game-btn"
        >
          Новая игра
        </button>
      </div>

      {/* Мотивирующее сообщение */}
      <div className="motivational-message">
        <p>
          {hasWinner 
            ? "Отличная игра! Поэзия объединяет сердца и пробуждает творчество." 
            : "Каждый стих - это маленькое чудо. Продолжайте творить!"}
        </p>
        <p className="quote">
          "Поэзия - это когда каждое слово не просто слово, а целый мир." ✨
        </p>
      </div>
    </div>
  );
};