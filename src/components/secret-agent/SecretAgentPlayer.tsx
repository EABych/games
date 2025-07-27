import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { SecretAgentMission } from '../../types/secret-agent';
import './SecretAgent.css';

export const SecretAgentPlayer: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [missions, setMissions] = useState<{cover: SecretAgentMission, main: SecretAgentMission} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasReceivedMissions, setHasReceivedMissions] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showMissions, setShowMissions] = useState(false);
  const [mainMissionStartTime, setMainMissionStartTime] = useState<Date | null>(null);
  const [mainMissionTimeLeft, setMainMissionTimeLeft] = useState<number | null>(null);
  const [isMainMissionActive, setIsMainMissionActive] = useState(false);
  
  // Генерируем уникальный ID пользователя один раз
  const [userId] = useState(() => `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    // Таймер для главной миссии
    let interval: NodeJS.Timeout;
    
    if (isMainMissionActive && mainMissionStartTime && missions?.main.timeLimit) {
      interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - mainMissionStartTime.getTime()) / 1000);
        const remaining = (missions.main.timeLimit! * 60) - elapsed;
        
        if (remaining <= 0) {
          setMainMissionTimeLeft(0);
          setIsMainMissionActive(false);
        } else {
          setMainMissionTimeLeft(remaining);
        }
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isMainMissionActive, mainMissionStartTime, missions]);

  const handleGetMissions = async () => {
    if (!playerName.trim() || !roomId) return;

    setIsLoading(true);
    try {
      const response = await fetch(`https://mafia-backend-5z0e.onrender.com/api/secret-agent/get-missions?roomId=${roomId}&userId=${userId}&playerName=${encodeURIComponent(playerName)}`);
      
      if (response.ok) {
        const data = await response.json();
        setMissions({
          cover: data.coverMission,
          main: data.mainMission
        });
        setHasReceivedMissions(true);
      } else {
        alert('Ошибка получения миссий. Проверьте подключение к интернету.');
      }
    } catch (error) {
      console.error('Ошибка получения миссий:', error);
      alert('Ошибка подключения к серверу. Попробуйте еще раз.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartMainMission = () => {
    setMainMissionStartTime(new Date());
    setIsMainMissionActive(true);
    if (missions?.main.timeLimit) {
      setMainMissionTimeLeft(missions.main.timeLimit * 60);
    }
  };

  const handleCompleteMainMission = () => {
    setIsMainMissionActive(false);
    setMainMissionStartTime(null);
    setMainMissionTimeLeft(null);
    // Здесь можно добавить логику отправки результата на сервер
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return '#34C759';
      case 'medium': return '#FF9500'; 
      case 'hard': return '#FF3B30';
      default: return '#007AFF';
    }
  };

  const getDifficultyText = (difficulty: string): string => {
    switch (difficulty) {
      case 'easy': return 'Простая';
      case 'medium': return 'Средняя';
      case 'hard': return 'Сложная';
      default: return 'Неизвестная';
    }
  };

  if (!hasReceivedMissions) {
    return (
      <div className="secret-agent-player">
        <div className="player-intro">
          <div className="intro-header">
            <div className="agent-icon">AGENT</div>
            <h1>Секретная операция</h1>
            <div className="classified-badge">
              СОВЕРШЕННО СЕКРЕТНО
            </div>
          </div>

          <div className="intro-content">
            <div className="room-info">
              <div className="room-detail">
                <span className="detail-label">Код операции:</span>
                <span className="detail-value">{roomId}</span>
              </div>
            </div>

            <div className="agent-registration">
              <h2>Идентификация агента</h2>
              <div className="name-input-group">
                <input
                  type="text"
                  placeholder="Введите ваш позывной"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="agent-name-input"
                  maxLength={20}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleGetMissions();
                    }
                  }}
                />
                <button
                  onClick={handleGetMissions}
                  disabled={!playerName.trim() || isLoading}
                  className="get-missions-btn"
                >
                  {isLoading ? 'Подключение...' : 'Получить миссии'}
                </button>
              </div>
            </div>

            <div className="mission-briefing">
              <h3>Брифинг операции:</h3>
              <div className="briefing-list">
                <div className="briefing-item">
                  <span className="briefing-icon">🎭</span>
                  <span>Получите задание прикрытия - выполняйте его всю игру незаметно</span>
                </div>
                <div className="briefing-item">
                  <span className="briefing-icon">BRIEF</span>
                  <span>Получите главную миссию - выполните за 5 минут так, чтобы никто не заметил</span>
                </div>
                <div className="briefing-item">
                  <span className="briefing-icon">🏆</span>
                  <span>Цель: выполнить главную миссию или не дать раскрыть ваше прикрытие</span>
                </div>
                <div className="briefing-item">
                  <span className="briefing-icon">⚠️</span>
                  <span>Внимание: если вас раскроют - миссия провалена</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="secret-agent-player">
      <div className="player-header">
        <div className="agent-info">
          <h1>Агент {playerName}</h1>
          <div className="operation-status">
            <span className="status-label">Статус:</span>
            <span className="status-value active">🟢 В операции</span>
          </div>
        </div>
        
        <button 
          className="toggle-missions-btn"
          onClick={() => setShowMissions(!showMissions)}
        >
          {showMissions ? 'Скрыть миссии' : 'Показать миссии'}
        </button>
      </div>

      {showMissions && missions && (
        <div className="missions-display">
          <div className="mission-card cover-mission">
            <div className="mission-header">
              <span className="mission-icon">🎭</span>
              <span className="mission-type">Задание прикрытия</span>
              <span 
                className="mission-difficulty"
                style={{ backgroundColor: getDifficultyColor(missions.cover.difficulty) }}
              >
                {getDifficultyText(missions.cover.difficulty)}
              </span>
            </div>
            
            <div className="mission-content">
              <h3 className="mission-title">{missions.cover.title}</h3>
              <p className="mission-description">{missions.cover.description}</p>
            </div>
            
            <div className="mission-instructions">
              <div className="instruction-item">
                <span className="instruction-icon">1</span>
                <span>Выполняй это задание всю игру незаметно</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">🤫</span>
                <span>Не дай другим догадаться о твоем прикрытии</span>
              </div>
            </div>
          </div>

          <div className="mission-card main-mission">
            <div className="mission-header">
              <span className="mission-icon">МИССИЯ</span>
              <span className="mission-type">Главная миссия</span>
              <span 
                className="mission-difficulty"
                style={{ backgroundColor: getDifficultyColor(missions.main.difficulty) }}
              >
                {getDifficultyText(missions.main.difficulty)}
              </span>
            </div>
            
            <div className="mission-content">
              <h3 className="mission-title">{missions.main.title}</h3>
              <p className="mission-description">{missions.main.description}</p>
            </div>

            {missions.main.timeLimit && (
              <div className="mission-timer-section">
                {!isMainMissionActive && mainMissionTimeLeft === null ? (
                  <div className="timer-controls">
                    <div className="timer-info">
                      <span className="timer-icon">TIME</span>
                      <span>Время выполнения: {missions.main.timeLimit} минут</span>
                    </div>
                    <button 
                      className="start-mission-btn"
                      onClick={handleStartMainMission}
                    >
                      🚀 Начать выполнение
                    </button>
                  </div>
                ) : isMainMissionActive && mainMissionTimeLeft !== null ? (
                  <div className="active-timer">
                    <div className={`timer-display ${mainMissionTimeLeft <= 60 ? 'urgent' : ''}`}>
                      <span className="timer-icon">TIME</span>
                      <span className="timer-time">{formatTime(mainMissionTimeLeft)}</span>
                    </div>
                    <div className="timer-progress">
                      <div 
                        className="progress-bar"
                        style={{ 
                          width: `${100 - (mainMissionTimeLeft / (missions.main.timeLimit! * 60)) * 100}%` 
                        }}
                      ></div>
                    </div>
                    <button 
                      className="complete-mission-btn"
                      onClick={handleCompleteMainMission}
                    >
                      ✅ Миссия выполнена
                    </button>
                  </div>
                ) : (
                  <div className="mission-completed">
                    <span className="completion-icon">✅</span>
                    <span>Главная миссия завершена</span>
                  </div>
                )}
              </div>
            )}

            <div className="mission-instructions">
              <div className="instruction-item">
                <span className="instruction-icon">1</span>
                <span>Выполни за {missions.main.timeLimit} минут незаметно</span>
              </div>
              <div className="instruction-item">
                <span className="instruction-icon">2</span>
                <span>Никто не должен понять что ты делаешь 5 минут после выполнения</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="player-tips">
        <h3>💡 Советы агенту</h3>
        <div className="tips-list">
          <div className="tip-item">
            <span className="tip-icon">🎭</span>
            <span>Задание прикрытия должно выглядеть как твоя естественная привычка</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">!</span>
            <span>Главную миссию выполняй когда удобный момент, но в рамках времени</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🤫</span>
            <span>После выполнения главной миссии веди себя обычно еще 5 минут</span>
          </div>
          <div className="tip-item">
            <span className="tip-icon">🏆</span>
            <span>Побеждаешь если выполнил главную миссию или тебя не раскрыли</span>
          </div>
        </div>
      </div>

      <div className="warning-footer">
        <div className="warning-text">
          Держите миссии в секрете! Показывайте экран только когда уверены, что никто не подглядывает.
        </div>
      </div>
    </div>
  );
};