import React, { useState } from 'react';
import { QRCodeModal } from '../mafia/QRCodeModal';
import type { HeadwordsGameSettings } from './HeadwordsHostSetup';

interface HeadwordsHostGameProps {
  settings: HeadwordsGameSettings;
  onBack: () => void;
  onNewGame: () => void;
}

export const HeadwordsHostGame: React.FC<HeadwordsHostGameProps> = ({ settings, onBack, onNewGame }) => {
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<string>('');
  const [showQRModal, setShowQRModal] = useState<boolean>(false);
  const [roomId, setRoomId] = useState<string>('');

  // Создание игры на сервере
  const createGameOnServer = async () => {
    try {
      // Поддерживаем обратную совместимость
      let requestData;
      if (Array.isArray(settings.categories)) {
        requestData = {
          playerCount: settings.playerCount,
          categories: settings.categories
        };
      } else if ((settings as any).category) {
        // Старый формат
        requestData = {
          playerCount: settings.playerCount,
          category: (settings as any).category
        };
      } else {
        console.error('Некорректный формат настроек:', settings);
        setServerStatus('❌ Ошибка: некорректные настройки игры');
        return;
      }
      
      console.log('Отправляем запрос на создание игры:', requestData);
      
      const response = await fetch('https://mafia-backend-5z0e.onrender.com/api/headwords/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData)
      });

      if (response.ok) {
        const data = await response.json();
        setServerStatus(`✅ Игра создана для ${data.playerCount} игроков. Категории: ${data.categoriesDisplay}. ID комнаты: ${data.roomId}`);
        setRoomId(data.roomId);
        setGameStarted(true);
      } else {
        const errorData = await response.json();
        console.error('Ошибка создания игры:', errorData);
        setServerStatus(`❌ Ошибка: ${errorData.error}`);
      }
    } catch (error) {
      setServerStatus('❌ Ошибка соединения с сервером');
    }
  };

  // Сброс игры на сервере
  const resetGameOnServer = async () => {
    try {
      await fetch('https://mafia-backend-5z0e.onrender.com/api/headwords/reset', {
        method: 'POST'
      });
      setServerStatus('🔄 Игра сброшена');
      setGameStarted(false);
      setRoomId('');
    } catch (error) {
      setServerStatus('❌ Ошибка сброса игры');
    }
  };

  // Открыть роль для игрока в новом окне
  const openRoleInNewWindow = () => {
    if (roomId) {
      const playerUrl = `${window.location.origin}/player/headwords/${roomId}`;
      window.open(playerUrl, '_blank', 'width=400,height=700,menubar=no,toolbar=no,location=no,status=no');
    } else {
      setServerStatus('❌ Ошибка: ID комнаты не найден');
    }
  };

  const getCategoryDisplayName = (categoryId: string): string => {
    const displayNames: Record<string, string> = {
      celebrities: 'Знаменитости',
      cartoons: 'Мультфильмы',
      movies: 'Кино и сериалы',
      animals: 'Животные',
      professions: 'Профессии',
      objects: 'Предметы'
    };
    
    return displayNames[categoryId] || categoryId;
  };


  return (
    <div className="headwords-host-game">
      <div className="game-header">
        <button onClick={onBack} className="back-button">← Настройки</button>
        <h2>🎭 Ведущий "Слова на лоб"</h2>
        <p>Игроков: {settings.playerCount} | Категории: {settings.categories.map(cat => getCategoryDisplayName(cat)).join(', ')}</p>
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
              <div className="access-buttons">
                <button 
                  onClick={() => setShowQRModal(true)}
                  className="show-qr-button"
                >
                  📱 Показать QR-код
                </button>
                
                <button 
                  onClick={openRoleInNewWindow}
                  className="get-role-here-button"
                >
                  🎲 Показать роль игроку
                </button>
              </div>
              <p className="access-hint">
                Игроки могут отсканировать QR-код или нажать кнопку для открытия роли в новом окне
              </p>
            </div>
          </div>
        )}
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
          <li>Дайте игрокам доступ к ролям через QR-код или откройте в новом окне</li>
          <li>Игроки увидят таймер, затем роль появится на экране</li>
          <li>Игрок должен приложить телефон ко лбу горизонтально</li>
          <li>Остальные видят роль и отвечают на вопросы игрока</li>
        </ul>
      </div>

      <QRCodeModal 
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        roomId={roomId}
        gameType="headwords"
      />
    </div>
  );
};