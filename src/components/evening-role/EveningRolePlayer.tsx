import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { EveningRoleTask } from '../../types/evening-role';
import './EveningRole.css';

interface TimerState {
  isActive: boolean;
  timeLeft: number;
  totalTime: number;
}

export const EveningRolePlayer: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [playerTask, setPlayerTask] = useState<EveningRoleTask | null>(null);
  const [hasReceivedTask, setHasReceivedTask] = useState(false);
  const [canChangeRole, setCanChangeRole] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId] = useState(() => `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [timer, setTimer] = useState<TimerState>({
    isActive: false,
    timeLeft: 0,
    totalTime: 0
  });

  // Таймер для заданий
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (timer.isActive && timer.timeLeft > 0) {
      interval = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    } else if (timer.timeLeft === 0 && timer.isActive) {
      // Таймер закончился
      setTimer(prev => ({ ...prev, isActive: false }));
      
      // Если у задания есть таймер, перезапускаем его
      if (playerTask?.hasTimer && playerTask.timerDuration) {
        setTimeout(() => {
          setTimer({
            isActive: true,
            timeLeft: playerTask.timerDuration!,
            totalTime: playerTask.timerDuration!
          });
        }, 1000);
      }
    }

    return () => clearInterval(interval);
  }, [timer.isActive, timer.timeLeft, playerTask]);

  const loadTask = async () => {
    if (!roomId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://mafia-backend-fbm5.onrender.com/api/evening-role/get-task?roomId=${roomId}&userId=${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка получения задания');
      }
      
      const data = await response.json();
      setPlayerTask(data.task);
      setCanChangeRole(data.canChangeRole);
      setHasReceivedTask(true);

      // Если у задания есть таймер, подготавливаем его
      if (data.task.hasTimer && data.task.timerDuration) {
        setTimer({
          isActive: false,
          timeLeft: data.task.timerDuration,
          totalTime: data.task.timerDuration
        });
      }
    } catch (err) {
      console.error('Ошибка загрузки задания:', err);
      setError(err instanceof Error ? err.message : 'Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetTask = () => {
    loadTask();
  };

  const handleChangeTask = async () => {
    if (!roomId || !canChangeRole) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://mafia-backend-fbm5.onrender.com/api/evening-role/change-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ roomId, userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка смены роли');
      }

      const data = await response.json();
      setPlayerTask(data.task);
      setCanChangeRole(data.canChangeRole);

      // Сбрасываем таймер
      setTimer({
        isActive: false,
        timeLeft: 0,
        totalTime: 0
      });

      // Если у нового задания есть таймер, подготавливаем его
      if (data.task.hasTimer && data.task.timerDuration) {
        setTimer({
          isActive: false,
          timeLeft: data.task.timerDuration,
          totalTime: data.task.timerDuration
        });
      }
    } catch (err) {
      console.error('Ошибка смены роли:', err);
      setError(err instanceof Error ? err.message : 'Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const startTimer = () => {
    if (playerTask?.hasTimer && playerTask.timerDuration) {
      setTimer({
        isActive: true,
        timeLeft: playerTask.timerDuration,
        totalTime: playerTask.timerDuration
      });
    }
  };

  const stopTimer = () => {
    setTimer(prev => ({ ...prev, isActive: false }));
  };

  const resetTimer = () => {
    if (playerTask?.hasTimer && playerTask.timerDuration) {
      setTimer({
        isActive: false,
        timeLeft: playerTask.timerDuration,
        totalTime: playerTask.timerDuration
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!timer.totalTime) return '#007AFF';
    const percentage = (timer.timeLeft / timer.totalTime) * 100;
    if (percentage <= 10) return '#FF3B30';
    if (percentage <= 30) return '#FF9500';
    return '#007AFF';
  };

  if (!roomId) {
    return (
      <div className="evening-role-player">
        <div className="error-message">
          <h2>Ошибка</h2>
          <p>Неверная ссылка. Попросите ведущего предоставить правильный QR-код.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="evening-role-player">
      <div className="player-header">
        <h1>Роль на вечер</h1>
        <div className="room-id">Комната: {roomId}</div>
      </div>

      <div className="player-content">
        {error && (
          <div className="error-message">
            <h2>Ошибка</h2>
            <p>{error}</p>
            <button 
              className="get-task-btn"
              onClick={handleGetTask}
              disabled={isLoading}
            >
              🔄 Попробовать снова
            </button>
          </div>
        )}

        {!hasReceivedTask && !error ? (
          <div className="get-task-section">
            <div className="welcome-card">
              <div className="welcome-icon">🎭</div>
              <h2>Добро пожаловать!</h2>
              <p>Получите свое уникальное задание на весь вечер</p>
              
              <button 
                className="get-task-btn"
                onClick={handleGetTask}
                disabled={isLoading}
              >
                {isLoading ? '⏳ Получение роли...' : '🎲 Получить мою роль'}
              </button>
              
              <div className="instructions">
                <h3>Что делать?</h3>
                <ul>
                  <li>Нажмите кнопку выше, чтобы получить свое задание</li>
                  <li>Выполняйте его весь вечер</li>
                  <li>Если у задания есть таймер, используйте его</li>
                  <li>Веселитесь и наслаждайтесь игрой!</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="task-section">
            <div className="task-card">
              <h2>Ваша роль на вечер</h2>
              
              <div className="task-content">
                <div className="task-text">
                  {playerTask?.text}
                </div>
                
                {playerTask?.requiresOtherPlayer && (
                  <div className="task-note">
                    💡 Это задание требует взаимодействия с другими игроками
                  </div>
                )}
                
                {playerTask?.category && (
                  <div className="task-category">
                    Категория: {playerTask.category}
                  </div>
                )}
              </div>

              {playerTask?.hasTimer && playerTask.timerDuration && (
                <div className="timer-section">
                  <h3>Таймер для задания</h3>
                  <div className="timer-display">
                    <div 
                      className="timer-circle"
                      style={{ '--timer-color': getTimerColor() } as React.CSSProperties}
                    >
                      <span className="timer-text">
                        {formatTime(timer.timeLeft)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="timer-controls">
                    {!timer.isActive ? (
                      <button 
                        className="timer-btn start"
                        onClick={startTimer}
                        disabled={timer.timeLeft === 0}
                      >
                        ▶️ Старт
                      </button>
                    ) : (
                      <button 
                        className="timer-btn stop"
                        onClick={stopTimer}
                      >
                        ⏸️ Пауза
                      </button>
                    )}
                    
                    <button 
                      className="timer-btn reset"
                      onClick={resetTimer}
                    >
                      🔄 Сброс
                    </button>
                  </div>
                  
                  <div className="timer-info">
                    Интервал: {Math.round((playerTask.timerDuration || 0) / 60)} мин
                  </div>
                </div>
              )}

              <div className="task-actions">
                {canChangeRole ? (
                  <button 
                    className="new-task-btn"
                    onClick={handleChangeTask}
                    disabled={isLoading}
                  >
                    {isLoading ? '⏳ Смена роли...' : '🎲 Сменить роль (один раз)'}
                  </button>
                ) : (
                  <div className="role-change-disabled">
                    <p>Вы уже использовали возможность сменить роль</p>
                    <small>Каждый игрок может сменить роль только один раз</small>
                  </div>
                )}
              </div>
            </div>

            <div className="game-tips">
              <h3>Советы</h3>
              <div className="tips-list">
                <div className="tip-item">
                  <span className="tip-icon">🎯</span>
                  <span>Выполняйте задание весь вечер для максимального веселья</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">⏰</span>
                  <span>Если есть таймер, следите за ним и выполняйте действия вовремя</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">🤝</span>
                  <span>Взаимодействуйте с другими игроками, если задание этого требует</span>
                </div>
                <div className="tip-item">
                  <span className="tip-icon">😄</span>
                  <span>Главное - получать удовольствие и смешить окружающих!</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};