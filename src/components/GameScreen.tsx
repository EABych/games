import React, { useState, useRef, useCallback } from 'react';
import type { GameState } from '../types';

interface GameScreenProps {
  gameState: GameState;
  onGuess: () => void;
  onSkip: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  gameState, 
  onGuess, 
  onSkip 
}) => {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentTeam = gameState.teams[gameState.currentTeamIndex];
  const minutes = Math.floor(gameState.timer / 60);
  const seconds = gameState.timer % 60;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    setIsSwipeActive(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isSwipeActive) return;

    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const deltaX = currentX - touchStartX.current;
    const deltaY = currentY - touchStartY.current;

    // Проверяем, что это горизонтальный свайп
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 20) {
      e.preventDefault(); // Предотвращаем скролл
      const clampedOffset = Math.max(-150, Math.min(150, deltaX));
      setSwipeOffset(clampedOffset);
    }
  }, [isSwipeActive]);

  const handleTouchEnd = useCallback(() => {
    if (!isSwipeActive) return;

    const threshold = 80;
    
    if (swipeOffset > threshold) {
      // Свайп вправо - угадали
      onGuess();
    } else if (swipeOffset < -threshold) {
      // Свайп влево - пропустить
      onSkip();
    }

    // Сброс состояния
    setSwipeOffset(0);
    setIsSwipeActive(false);
  }, [isSwipeActive, swipeOffset, onGuess, onSkip]);

  return (
    <div className="game-screen">
      <div className="game-header">
        <div className="round-info">
          {Math.ceil(gameState.currentRound / gameState.teams.length)}/{gameState.settings.totalRounds}
        </div>
        <div className="current-team-section">
          <div className="team-info" style={{ backgroundColor: currentTeam.color }}>
            <h2>{currentTeam.name}</h2>
            <p>Очки за раунд: {gameState.roundScore}</p>
          </div>
          <div className={`timer ${gameState.timer <= 10 ? 'timer-warning' : ''}`}>
            {minutes}:{seconds.toString().padStart(2, '0')}
          </div>
        </div>
        <div className="placeholder"></div>
      </div>

      <div 
        className={`word-container ${isSwipeActive ? 'swipe-active' : ''}`}
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ 
          transform: `translateX(${swipeOffset}px)`,
          backgroundColor: swipeOffset > 80 ? 'rgba(52, 199, 89, 0.2)' : 
                          swipeOffset < -80 ? 'rgba(255, 59, 48, 0.2)' : 
                          'transparent',
          transition: isSwipeActive ? 'none' : 'transform 0.3s ease-out, background-color 0.3s ease-out'
        }}
      >
        <h1 className="current-word">{gameState.currentWord}</h1>
        {swipeOffset > 80 && (
          <div className="swipe-indicator swipe-success">✓ Угадали!</div>
        )}
        {swipeOffset < -80 && (
          <div className="swipe-indicator swipe-skip">✗ Пропустить</div>
        )}
      </div>

      <div className="game-controls">
        <button 
          className="skip-button"
          onClick={onSkip}
        >
          Пропустить (-1)
        </button>
        <button 
          className="guess-button"
          onClick={onGuess}
          style={{ backgroundColor: currentTeam.color }}
        >
          Угадали! (+1)
        </button>
      </div>

      <div className="scores-overview">
        {gameState.teams.map((team) => (
          <div key={team.id} className="team-score">
            <span style={{ color: team.color }}>{team.name}</span>
            <span>{team.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
};