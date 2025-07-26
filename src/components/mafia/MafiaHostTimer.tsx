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
  const [isCreatingGame, setIsCreatingGame] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>('');

  // Создание игры на сервере
  const createGameOnServer = async () => {
    if (isCreatingGame) return;
    
    setIsCreatingGame(true);
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
        setServerStatus(`Роли созданы: ${data.mafiaCount} мафии, ${data.citizensCount} мирных. ID комнаты: ${data.roomId}`);
        setRoomId(data.roomId);
        setGameStarted(true);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Неизвестная ошибка' }));
        setServerStatus(`Ошибка создания игры: ${errorData.error || response.statusText}`);
        setGameStarted(false); // Сбрасываем состояние при ошибке
      }
    } catch (error) {
      setServerStatus('Ошибка соединения с сервером');
      setGameStarted(false); // Сбрасываем состояние при ошибке
    } finally {
      setIsCreatingGame(false);
    }
  };

  // Сброс игры на сервере
  const resetGameOnServer = async () => {
    try {
      await fetch('https://mafia-backend-5z0e.onrender.com/api/mafia/reset', {
        method: 'POST'
      });
      setServerStatus('Игра сброшена');
      setGameStarted(false);
      setRoomId('');
    } catch (error) {
      setServerStatus('Ошибка сброса игры');
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
        return 'Обсуждение';
      case 'voting':
        return 'Голосование';
      case 'night':
        return 'Ночь';
      default:
        return 'Готов к игре';
    }
  };

  const getPhaseColor = (): string => {
    switch (phase) {
      case 'discussion':
        return '#355E3B'; // Pantone Forest Biome
      case 'voting':
        return '#DD4124'; // Pantone Tangerine Tango
      case 'night':
        return '#34568B'; // Pantone Classic Blue
      default:
        return '#8E8E93'; // Нейтральный серый
    }
  };

  return (
    <div className="mafia-host-timer">
      <div className="timer-header">
        <h2>Ведущий Мафии</h2>
        <p>Игроков: {settings.playerCount}</p>
      </div>

      <div className="timer-content">

      <div className="server-status">
        {!gameStarted ? (
          <button 
            onClick={createGameOnServer} 
            className="create-game-button"
            disabled={isCreatingGame}
          >
            {isCreatingGame ? (
              <>
                <div className="spinner"></div>
                Создание игры...
              </>
            ) : (
              'Создать игру на сервере'
            )}
          </button>
        ) : (
          <div className="game-info-section">
            <div className="player-access-card">
              <div className="access-header">
                <h4>Доступ для игроков</h4>
                <p className="access-description">
                  Игроки могут отсканировать QR-код или перейти по ссылке для получения ролей
                </p>
              </div>
              <button 
                onClick={() => setShowQRModal(true)}
                className="show-qr-button"
              >
                <span>Показать QR-код</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="5" height="5"/>
                  <rect x="16" y="3" width="5" height="5"/>
                  <rect x="3" y="16" width="5" height="5"/>
                  <path d="M21 16h-3a2 2 0 0 0-2 2v3"/>
                  <path d="M21 21v.01"/>
                  <path d="M12 7v3a2 2 0 0 1-2 2H7"/>
                  <path d="M3 12h.01"/>
                  <path d="M12 3h.01"/>
                  <path d="M12 16v.01"/>
                  <path d="M16 12h1"/>
                  <path d="M21 12v.01"/>
                  <path d="M12 21v-1"/>
                </svg>
              </button>
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
          {isActive ? 'Активен' : 'Остановлен'}
        </div>
      </div>

      <div className="timer-controls">
        <div className="phase-buttons">
          <button 
            onClick={() => startTimer('discussion')}
            className="phase-button discussion"
            disabled={!gameStarted}
          >
            Обсуждение<br/>
            <small>({formatTime(settings.discussionTime)})</small>
          </button>
          
          <button 
            onClick={() => startTimer('voting')}
            className="phase-button voting"
            disabled={!gameStarted}
          >
            Голосование<br/>
            <small>({formatTime(settings.votingTime)})</small>
          </button>
          
          <button 
            onClick={() => startTimer('night')}
            className="phase-button night"
            disabled={!gameStarted}
          >
            Ночь<br/>
            <small>({formatTime(settings.nightTime)})</small>
          </button>
        </div>

        <div className="control-buttons">
          <button 
            onClick={stopTimer}
            className="control-button stop"
            disabled={!isActive}
          >
            Стоп
          </button>
          
          <button 
            onClick={resetTimer}
            className="control-button reset"
          >
            Сброс
          </button>
        </div>
      </div>

      <div className="game-management">
        <button onClick={resetGameOnServer} className="reset-game-button">
          Новая игра (сбросить роли)
        </button>
        
        <button onClick={onNewGame} className="new-setup-button">
          Новые настройки
        </button>
      </div>

        <div className="instructions">
          <h3>Инструкции:</h3>
          <ul>
            <li>Сначала создайте игру на сервере</li>
            <li>Дайте игрокам ссылку для получения ролей</li>
            <li>Используйте таймеры для фаз игры</li>
            <li>Когда все роли розданы - начинайте игру</li>
          </ul>
        </div>
      </div>

      <QRCodeModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        roomId={roomId}
        gameType="mafia"
      />
    </div>
  );
};