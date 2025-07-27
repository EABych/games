import React, { useState, useEffect } from 'react';
import type { AdultFantsPlayer, AdultFantsTask } from '../../types/adult-fants';
import './AdultFants.css';

interface AdultFantsTaskModalProps {
  player: AdultFantsPlayer;
  task: AdultFantsTask;
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export const AdultFantsTaskModal: React.FC<AdultFantsTaskModalProps> = ({
  player,
  task,
  isOpen,
  onComplete,
  onSkip
}) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Запускаем анимацию появления
      setTimeout(() => setShowAnimation(true), 100);

      // Если есть таймер, инициализируем его
      if (task.hasTimer && task.timerDuration) {
        setTimeLeft(task.timerDuration);
      }
    } else {
      setShowAnimation(false);
      setTimeLeft(null);
      setIsTimerRunning(false);
    }
  }, [isOpen, task]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isTimerRunning && timeLeft !== null && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev === null || prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isTimerRunning, timeLeft]);

  const startTimer = () => {
    if (timeLeft !== null && timeLeft > 0) {
      setIsTimerRunning(true);
    }
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#2196F3';
    }
  };

  const getDifficultyText = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'Легко';
      case 'medium': return 'Средне';
      case 'hard': return 'Сложно';
      default: return 'Смешанно';
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className={`adult-fants-modal-overlay ${showAnimation ? 'show' : ''}`}>
      <div className={`adult-fants-modal ${showAnimation ? 'show' : ''}`}>
        <div className="modal-header">
          <div
            className="selected-player"
            style={{ backgroundColor: player.color }}
          >
            <div className="player-avatar-large">
              {player.name.charAt(0).toUpperCase()}
            </div>
            <div className="player-info">
              <h2>{player.name}</h2>
              <div className="player-subtitle">Твоя очередь!</div>
            </div>
          </div>
        </div>

        <div className="modal-content">
          <div className="task-card">
            <div className="task-header">
              <div
                className="difficulty-badge"
                style={{ backgroundColor: getDifficultyColor(task.difficulty) }}
              >
                {getDifficultyText(task.difficulty)}
              </div>
              {task.hasTimer && (
                <div className="timer-badge">
                  С таймером
                </div>
              )}
            </div>

            <div className="task-text">
              {task.text}
            </div>

            {task.hasTimer && task.timerDuration && (
              <div className="timer-section">
                <div className={`timer-display ${isTimerRunning ? 'running' : ''} ${timeLeft === 0 ? 'finished' : ''}`}>
                  <div className="timer-time">
                    {timeLeft !== null ? formatTime(timeLeft) : formatTime(task.timerDuration)}
                  </div>
                </div>

                <div className="timer-controls">
                  {!isTimerRunning && timeLeft !== 0 ? (
                    <button
                      className="timer-btn start"
                      onClick={startTimer}
                      disabled={timeLeft === 0}
                    >
                      Старт
                    </button>
                  ) : isTimerRunning ? (
                    <button
                      className="timer-btn stop"
                      onClick={stopTimer}
                    >
                      Пауза
                    </button>
                  ) : (
                    <div className="timer-finished">
                      Время вышло!
                    </div>
                  )}
                </div>

                {timeLeft !== null && timeLeft > 0 && (
                  <div className="timer-progress">
                    <div
                      className="progress-bar"
                      style={{
                        width: `${((task.timerDuration - timeLeft) / task.timerDuration) * 100}%`
                      }}
                    ></div>
                  </div>
                )}
              </div>
            )}

            <div className="task-category">
              Категория: {task.category.replace('_', ' ')}
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="action-btn skip"
            onClick={onSkip}
          >
            Пропустить
          </button>

          <button
            className="action-btn complete"
            onClick={onComplete}
          >
            Выполнено
          </button>
        </div>

        <div className="modal-footer">
          <div className="disclaimer">
            Игра предназначена для лиц старше 18 лет.
            Играйте с уважением друг к другу!
          </div>
        </div>
      </div>
    </div>
  );
};
