import React from 'react';
import type { KrocodilGameState } from '../../types/krocodil';

interface KrocodilEndProps {
  gameState: KrocodilGameState;
  onNewGame: () => void;
}

export const KrocodilEnd: React.FC<KrocodilEndProps> = ({ gameState, onNewGame }) => {
  const sortedTeams = [...gameState.teams].sort((a, b) => {
    if (a.score !== b.score) {
      return b.score - a.score;
    }
    // При равном количестве очков учитываем количество пропущенных слов (меньше = лучше)
    return a.skippedWords - b.skippedWords;
  });

  const winnerTeam = sortedTeams[0];
  const totalGuessed = gameState.teams.reduce((sum, team) => sum + team.guessedWords, 0);
  const totalSkipped = gameState.teams.reduce((sum, team) => sum + team.skippedWords, 0);

  const getTeamPlayers = (teamId: string) => {
    return gameState.players.filter(p => p.teamId === teamId);
  };

  return (
    <div className="krocodil-end">
      <h1>Игра завершена!</h1>
      
      <div className="winner-section">
        <div className="winner-card">
          <div className="winner-icon">🏆</div>
          <h2>Команда-победитель</h2>
          <h3 className="winner-name">{winnerTeam.name}</h3>
          <div className="winner-stats">
            <div className="winner-stat">
              <span className="stat-number">{winnerTeam.score}</span>
              <span className="stat-label">очков</span>
            </div>
            <div className="winner-stat">
              <span className="stat-number">{winnerTeam.guessedWords}</span>
              <span className="stat-label">угадано</span>
            </div>
            {gameState.settings.allowSkip && (
              <div className="winner-stat">
                <span className="stat-number">{winnerTeam.skippedWords}</span>
                <span className="stat-label">пропущено</span>
              </div>
            )}
          </div>
          
          <div className="winner-players">
            <h4>Состав команды:</h4>
            <div className="players-list">
              {getTeamPlayers(winnerTeam.id).map((player) => (
                <span key={player.id} className="player-name">
                  {player.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="game-stats">
        <h3>Статистика игры</h3>
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-value">{totalGuessed}</span>
            <span className="stat-name">Всего угадано слов</span>
          </div>
          {gameState.settings.allowSkip && (
            <div className="stat-card">
              <span className="stat-value">{totalSkipped}</span>
              <span className="stat-name">Всего пропущено слов</span>
            </div>
          )}
          <div className="stat-card">
            <span className="stat-value">{gameState.currentRound}</span>
            <span className="stat-name">Раундов сыграно</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{gameState.teams.length}</span>
            <span className="stat-name">Команд участвовало</span>
          </div>
        </div>
      </div>

      <div className="final-results">
        <h3>Итоговая таблица</h3>
        <div className="results-list">
          {sortedTeams.map((team, index) => (
            <div 
              key={team.id}
              className={`result-item ${index === 0 ? 'winner-result' : ''}`}
            >
              <div className="result-place">
                {index === 0 ? '🏆' : `${index + 1}.`}
              </div>
              
              <div className="result-team">
                <div className="team-info">
                  <span className="team-name">{team.name}</span>
                  <div className="team-players">
                    {getTeamPlayers(team.id).map((player, i) => (
                      <span key={player.id}>
                        {player.name}{i < getTeamPlayers(team.id).length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="team-stats">
                  <div className="result-stat primary">
                    <span className="stat-number">{team.score}</span>
                    <span className="stat-label">очков</span>
                  </div>
                  <div className="result-stat">
                    <span className="stat-number">{team.guessedWords}</span>
                    <span className="stat-label">угадано</span>
                  </div>
                  {gameState.settings.allowSkip && (
                    <div className="result-stat">
                      <span className="stat-number">{team.skippedWords}</span>
                      <span className="stat-label">пропущено</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="game-summary">
        <h3>Настройки игры</h3>
        <div className="settings-summary">
          <div className="summary-item">
            <span>Время раунда:</span>
            <span>{gameState.settings.roundTime} сек</span>
          </div>
          <div className="summary-item">
            <span>Очков для победы:</span>
            <span>{gameState.settings.pointsToWin}</span>
          </div>
          <div className="summary-item">
            <span>Сложность:</span>
            <span>
              {gameState.settings.difficulties.map(d => 
                d === 'easy' ? 'Легко' : d === 'medium' ? 'Средне' : 'Сложно'
              ).join(', ')}
            </span>
          </div>
          <div className="summary-item">
            <span>Категории:</span>
            <span>{gameState.settings.categories.length} категорий</span>
          </div>
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