import React, { useState } from 'react';
import { QRCodeModal } from '../mafia/QRCodeModal';

interface SpyHostGameProps {
  settings: SpyGameSettings;
  onBack: () => void;
  onNewGame: () => void;
}

interface SpyGameSettings {
  playerCount: number;
}

export const SpyHostGame: React.FC<SpyHostGameProps> = ({ settings, onBack, onNewGame }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<any>(null);
  const [roomId, setRoomId] = useState<string>('');

  // Создание игры на сервере
  const createGameOnServer = async () => {
    try {
      const response = await fetch('https://mafia-backend-5z0e.onrender.com/api/spy/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          playerCount: settings.playerCount
        })
      });

      if (response.ok) {
        const data = await response.json();
        setServerStatus(`✅ Игра создана для ${data.playerCount} игроков. Локация: ${data.location}. ID комнаты: ${data.roomId}`);
        setRoomId(data.roomId);
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
      await fetch('https://mafia-backend-5z0e.onrender.com/api/spy/reset', {
        method: 'POST'
      });
      setServerStatus('🔄 Игра сброшена');
      setGameStarted(false);
      setCurrentRole(null);
      setRoomId('');
    } catch (error) {
      setServerStatus('❌ Ошибка сброса игры');
    }
  };

  // Получить роль на этом устройстве
  const getRoleOnThisDevice = async () => {
    try {
      const url = roomId 
        ? `https://mafia-backend-5z0e.onrender.com/api/spy/get-role?roomId=${roomId}`
        : 'https://mafia-backend-5z0e.onrender.com/api/spy/get-role';
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setCurrentRole(data);
      } else {
        const errorData = await response.json();
        setServerStatus(`❌ ${errorData.error}`);
      }
    } catch (error) {
      setServerStatus('❌ Ошибка получения роли');
    }
  };

  const getRoleColor = (isSpy: boolean): string => {
    return isSpy ? '#e74c3c' : '#27ae60';
  };

  const getRoleEmoji = (isSpy: boolean): string => {
    return isSpy ? '🕵️' : '🏠';
  };

  if (currentRole) {
    return (
      <div className="spy-host-game">
        <div className="role-display">
          <div className="host-role-card">
            {currentRole.location ? (
              <div className="location-display">
                <div className="location-badge">
                  {currentRole.location}
                </div>
              </div>
            ) : (
              <div className="spy-display">
                <h1 className="spy-indicator">ШПИОН</h1>
              </div>
            )}
            
            <div className="close-actions">
              <button onClick={() => setCurrentRole(null)} className="close-button">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="spy-host-game">
      <div className="game-header">
        <h2>Ведущий Шпиона</h2>
        <p>Игроков: {settings.playerCount}</p>
      </div>

      <div className="game-body">
        <div className="server-status">
        {!gameStarted ? (
          <button onClick={createGameOnServer} className="create-game-button">
            Создать игру на сервере
          </button>
        ) : (
          <div className="game-info">
            <p>{serverStatus}</p>
            <div className="player-access-section">
              <h4>Доступ для игроков:</h4>
              <div className="access-buttons">
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="show-qr-button"
                >
                  Показать QR-код
                </button>
                
                <button 
                  onClick={getRoleOnThisDevice}
                  className="get-role-here-button"
                >
                  Показать роль игроку
                </button>
              </div>
              <p className="access-hint">
                Игроки могут отсканировать QR-код или получить роль на этом устройстве
              </p>
            </div>
          </div>
        )}
        </div>

        <div className="instructions">
          <h3>Инструкции:</h3>
          <ul>
            <li>Сначала создайте игру на сервере</li>
            <li>Дайте игрокам доступ к ролям через QR-код или на этом устройстве</li>
            <li>Когда все роли розданы - начинайте игру</li>
            <li>Игроки задают друг другу вопросы о локации</li>
            <li>Цель: найти шпиона или угадать локацию</li>
          </ul>
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

      <QRCodeModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        roomId={roomId}
        gameType="spy"
      />
    </div>
  );
};