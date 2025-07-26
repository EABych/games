import React, { useState, useEffect } from 'react';
import { QRCodeModal } from './QRCodeModal';
import './QRCodeModal.css';

interface MafiaHostTimerProps {
  settings: MafiaGameSettings;
  onBack: () => void;
  onNewGame: () => void;
}

interface MafiaGameSettings {
  playerCount: number;
  includeDoctor: boolean;
  includeDetective: boolean;
  includeSheriff: boolean;
  includeDon: boolean;
  discussionTime: number;
  votingTime: number;
  nightTime: number;
}

type TimerPhase = 'ready' | 'discussion' | 'voting' | 'night';

export const MafiaHostTimer: React.FC<MafiaHostTimerProps> = ({ settings, onBack, onNewGame }) => {
  const [phase, setPhase] = useState<TimerPhase>('ready');
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);

  // Создание игры на сервере
  const createGameOnServer = async () => {
    try {
      const response = await fetch('https://mafia-backend-5z0e.onrender.com/api/mafia/generate-roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerCount: settings.playerCount,
          settings: {
            includeDoctor: settings.includeDoctor,
            includeDetective: settings.includeDetective,
            includeSheriff: settings.includeSheriff,
            includeDon: settings.includeDon
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setServerStatus(`✅ Роли созданы: ${data.mafiaCount} мафии, ${data.citizensCount} мирных`);
        setGameStarted(true);
      } else {
        setServerStatus('❌ Ошибка создания игры');
      }
    } catch (error) {
      setServerStatus('❌ Ошибка соединения с сервером');
    }
  };

  // Сброс игры на сервере
  const resetGameOnServer = async () => {
    try {
      await fetch('https://mafia-backend-5z0e.onrender.com/api/mafia/reset', {
        method: 'POST'
      });
      setServerStatus('🔄 Игра сброшена');
      setGameStarted(false);
    } catch (error) {
      setServerStatus('❌ Ошибка сброса игры');
    }
  };

  // Таймер
  useEffect(() => {
    let interval: number | null = null;
    
    if (isActive && timeLeft > 0) {
      interval = window.setInterval(() => {
        setTimeLeft(timeLeft => {
          if (timeLeft <= 1) {
            setIsActive(false);
            return 0;
          }
          return timeLeft - 1;
        });
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
    }

    return () => {
      if (interval) window.clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const startTimer = (newPhase: TimerPhase) => {
    let duration = 0;
    
    switch (newPhase) {
      case 'discussion':
        duration = settings.discussionTime;
        break;
      case 'voting':
        duration = settings.votingTime;
        break;
      case 'night':
        duration = settings.nightTime;
        break;
      default:
        return;
    }

    setPhase(newPhase);
    setTimeLeft(duration);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
    setPhase('ready');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getPhaseText = (): string => {
    switch (phase) {
      case 'discussion':
        return '💬 Обсуждение';
      case 'voting':
        return '🗳️ Голосование';
      case 'night':
        return '🌙 Ночь';
      default:
        return '⏸️ Готов к игре';
    }
  };

  const getPhaseColor = (): string => {
    switch (phase) {
      case 'discussion':
        return '#4CAF50';
      case 'voting':
        return '#FF9800';
      case 'night':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  return (
    <div className="mafia-host-timer">
      <div className="timer-header">
        <button onClick={onBack} className="back-button">← Настройки</button>
        <h2>🎭 Ведущий Мафии</h2>
        <p>Игроков: {settings.playerCount}</p>
      </div>

      <div className="server-status">
        {!gameStarted ? (
          <button onClick={createGameOnServer} className="create-game-button">
            🎯 Создать игру на сервере
          </button>
        ) : (
          <div className="game-info">
            <p>{serverStatus}</p>
            <div className="player-access-section">
              <h4>📱 Доступ для игроков:</h4>
              <button 
                onClick={() => setShowQRModal(true)}
                className="show-qr-button"
              >
                📱 Показать QR-код
              </button>
              <p className="access-hint">
                Игроки могут отсканировать QR-код или перейти по ссылке для получения ролей
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="timer-display" style={{ borderColor: getPhaseColor() }}>
        <div className="phase-name" style={{ color: getPhaseColor() }}>
          {getPhaseText()}
        </div>
        <div className="time-display">
          {formatTime(timeLeft)}
        </div>
        <div className="timer-status">
          {isActive ? '▶️ Активен' : '⏸️ Остановлен'}
        </div>
      </div>

      <div className="timer-controls">
        <div className="phase-buttons">
          <button 
            onClick={() => startTimer('discussion')}
            className="phase-button discussion"
            disabled={!gameStarted}
          >
            💬 Обсуждение<br/>
            <small>({formatTime(settings.discussionTime)})</small>
          </button>
          
          <button 
            onClick={() => startTimer('voting')}
            className="phase-button voting"
            disabled={!gameStarted}
          >
            🗳️ Голосование<br/>
            <small>({formatTime(settings.votingTime)})</small>
          </button>
          
          <button 
            onClick={() => startTimer('night')}
            className="phase-button night"
            disabled={!gameStarted}
          >
            🌙 Ночь<br/>
            <small>({formatTime(settings.nightTime)})</small>
          </button>
        </div>

        <div className="control-buttons">
          <button 
            onClick={stopTimer}
            className="control-button stop"
            disabled={!isActive}
          >
            ⏸️ Стоп
          </button>
          
          <button 
            onClick={resetTimer}
            className="control-button reset"
          >
            🔄 Сброс
          </button>
        </div>
      </div>

      <div className="game-management">
        <button onClick={resetGameOnServer} className="reset-game-button">
          🆕 Новая игра (сбросить роли)
        </button>
        
        <button onClick={onNewGame} className="new-setup-button">
          ⚙️ Новые настройки
        </button>
      </div>

      <div className="instructions">
        <h3>📝 Инструкции:</h3>
        <ul>
          <li>Сначала создайте игру на сервере</li>
          <li>Дайте игрокам ссылку для получения ролей</li>
          <li>Используйте таймеры для фаз игры</li>
          <li>Когда все роли розданы - начинайте игру</li>
        </ul>
      </div>

      <QRCodeModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
      />
    </div>
  );
};