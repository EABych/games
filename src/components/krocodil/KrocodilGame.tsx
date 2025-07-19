import React from 'react';
import type { KrocodilGameState } from '../../types/krocodil';

interface KrocodilGameProps {
  gameState: KrocodilGameState;
  onGuessWord: () => void;
  onSkipWord: () => void;
  onEndRound: () => void;
}

export const KrocodilGame: React.FC<KrocodilGameProps> = ({
  gameState,
  onGuessWord,
  onSkipWord,
  onEndRound
}) => {
  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const currentPlayer = gameState.players.find(p => 
    p.teamId === currentTeam?.id
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (gameState.roundTimeLeft <= 10) return '#FF3B30';
    if (gameState.roundTimeLeft <= 30) return '#FF9500';
    return '#007AFF';
  };

  return (
    <div className="krocodil-game">
      <div className="game-header">
        <div className="round-info">
          <span className="round-number">Раунд {gameState.currentRound}</span>
        </div>
        
        <div className="timer-container">
          <div 
            className="timer"
            style={{ color: getTimerColor() }}
          >
            {formatTime(gameState.roundTimeLeft)}
          </div>
        </div>

        <div className="scores">
          {gameState.teams.map((team, index) => (
            <div 
              key={team.id} 
              className={`team-score ${index === gameState.currentTeamIndex ? 'active' : ''}`}
            >
              <span className="team-name">{team.name}</span>
              <span className="team-points">{team.score}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="current-team">
        <h2>Ходит команда: <span className="team-highlight">{currentTeam?.name}</span></h2>
        {currentPlayer && (
          <p className="current-player">Показывает: {currentPlayer.name}</p>
        )}
      </div>

      <div className="word-section">
        {gameState.currentWord ? (
          <div className="word-card">
            <div className="word-category">
              {gameState.currentWord.category && (
                <span className="category-badge">
                  {gameState.currentWord.category}
                </span>
              )}
              <span 
                className="difficulty-badge"
                style={{ 
                  backgroundColor: gameState.currentWord.difficulty === 'easy' ? '#32D74B' :
                                 gameState.currentWord.difficulty === 'medium' ? '#FF9500' : '#FF3B30'
                }}
              >
                {gameState.currentWord.difficulty === 'easy' ? 'Легко' :
                 gameState.currentWord.difficulty === 'medium' ? 'Средне' : 'Сложно'}
              </span>
            </div>
            
            <div className="word-display">
              <h1 className="current-word">{gameState.currentWord.word}</h1>
              <p className="word-instruction">
                Покажите это слово без использования слов и звуков
              </p>
            </div>
          </div>
        ) : (
          <div className="no-word">
            <h2>Слова закончились!</h2>
            <p>Возможно, нужно изменить настройки категорий или сложности</p>
          </div>
        )}
      </div>

      <div className="game-controls">
        {gameState.roundTimeLeft > 0 && gameState.currentWord && (
          <>
            <button 
              className="guess-btn"
              onClick={onGuessWord}
              disabled={!gameState.isTimerRunning}
            >
              ✓ Угадали
            </button>
            
            {gameState.settings.allowSkip && (
              <button 
                className="skip-btn"
                onClick={onSkipWord}
                disabled={!gameState.isTimerRunning}
              >
                ⏭️ Пропустить
              </button>
            )}
          </>
        )}
        
        {gameState.roundTimeLeft === 0 && (
          <button 
            className="end-round-btn"
            onClick={onEndRound}
          >
            Завершить раунд
          </button>
        )}
      </div>

      <div className="game-stats">
        <div className="stats-row">
          <div className="stat-item">
            <span className="stat-label">Угадано слов:</span>
            <span className="stat-value">{currentTeam?.guessedWords || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Пропущено слов:</span>
            <span className="stat-value">{currentTeam?.skippedWords || 0}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">До победы:</span>
            <span className="stat-value">
              {Math.max(0, gameState.settings.pointsToWin - (currentTeam?.score || 0))}
            </span>
          </div>
        </div>
      </div>

      <div className="game-instructions">
        <h3>Правила показа:</h3>
        <ul>
          <li>Нельзя произносить слова и издавать звуки</li>
          <li>Можно использовать жесты и мимику</li>
          <li>Нельзя показывать буквы и цифры пальцами</li>
          <li>Можно указывать на предметы только для обозначения цвета, размера или формы</li>
        </ul>
      </div>
    </div>
  );
};