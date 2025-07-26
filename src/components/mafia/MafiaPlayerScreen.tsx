import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface MafiaRole {
  role: string;
  roleInfo: {
    name: string;
    description: string;
    team: string;
    nightAction: boolean;
  };
  playerNumber: number;
  totalPlayers: number;
  isLastPlayer: boolean;
}

interface MafiaPlayerScreenProps {
  roomId?: string | null;
}

export const MafiaPlayerScreen: React.FC<MafiaPlayerScreenProps> = ({ roomId: propRoomId }) => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const roomId = propRoomId || paramRoomId;
  const [playerRole, setPlayerRole] = useState<MafiaRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getRoleFromServer = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const url = roomId 
        ? `https://mafia-backend-5z0e.onrender.com/api/mafia/get-role?roomId=${roomId}`
        : 'https://mafia-backend-5z0e.onrender.com/api/mafia/get-role';
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        setPlayerRole(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка получения роли');
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleColor = (role: string): string => {
    switch (role) {
      case 'mafia':
      case 'don':
        return '#e74c3c';
      case 'citizen':
        return '#27ae60';
      case 'doctor':
        return '#3498db';
      case 'detective':
      case 'sheriff':
        return '#f39c12';
      default:
        return '#95a5a6';
    }
  };

  const getRoleEmoji = (role: string): string => {
    switch (role) {
      case 'mafia':
        return '🔫';
      case 'don':
        return '👑';
      case 'citizen':
        return '👥';
      case 'doctor':
        return '👨‍⚕️';
      case 'detective':
        return '🕵️';
      case 'sheriff':
        return '🤠';
      default:
        return '🎭';
    }
  };

  if (playerRole) {
    return (
      <div className="mafia-player-screen">
        <div className="role-card" style={{ borderColor: getRoleColor(playerRole.role) }}>
          <div className="role-header">
            <div className="role-emoji">{getRoleEmoji(playerRole.role)}</div>
            <h2 className="role-name" style={{ color: getRoleColor(playerRole.role) }}>
              {playerRole.roleInfo.name}
            </h2>
            <div className="player-info">
              Игрок {playerRole.playerNumber} из {playerRole.totalPlayers}
            </div>
          </div>
          
          <div className="role-content">
            <div className="role-description">
              <h3>📋 Ваша задача:</h3>
              <p>{playerRole.roleInfo.description}</p>
            </div>
            
            <div className="role-team">
              <h3>⚡ Команда:</h3>
              <div className={`team-badge ${playerRole.roleInfo.team}`}>
                {playerRole.roleInfo.team === 'mafia' ? '🔴 Мафия' : '🔵 Мирные жители'}
              </div>
            </div>
            
            {playerRole.roleInfo.nightAction && (
              <div className="night-action-info">
                <h3>🌙 Ночные действия:</h3>
                <p>Вы можете совершать действия ночью</p>
              </div>
            )}
            
            <div className="game-tips">
              <h3>💡 Советы:</h3>
              <ul>
                {playerRole.roleInfo.team === 'mafia' ? (
                  <>
                    <li>Скрывайте свою роль от мирных жителей</li>
                    <li>Координируйтесь с другими мафиози</li>
                    <li>Убивайте активных игроков ночью</li>
                  </>
                ) : (
                  <>
                    <li>Внимательно слушайте других игроков</li>
                    <li>Ищите подозрительное поведение</li>
                    <li>Голосуйте за исключение мафии</li>
                  </>
                )}
              </ul>
            </div>
          </div>
          
          <div className="role-footer">
            <div className="warning-message">
              ⚠️ Запомните свою роль и не показывайте её другим игрокам!
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mafia-player-screen">
      <div className="welcome-card">
        <div className="welcome-header">
          <h1>🎭 Добро пожаловать в Мафию!</h1>
          <p>Нажмите кнопку ниже, чтобы получить свою роль</p>
        </div>
        
        <div className="welcome-content">
          {!isLoading && !error && (
            <>
              <div className="game-rules">
                <h3>📖 Правила игры:</h3>
                <ul>
                  <li>🌙 <strong>Ночь:</strong> Мафия выбирает жертву</li>
                  <li>☀️ <strong>День:</strong> Все обсуждают и голосуют</li>
                  <li>🎯 <strong>Цель мафии:</strong> Стать большинством</li>
                  <li>🏆 <strong>Цель мирных:</strong> Найти всю мафию</li>
                </ul>
              </div>
              
              <button 
                onClick={getRoleFromServer}
                className="get-role-button"
              >
                🎲 Получить роль
              </button>
            </>
          )}
          
          {isLoading && (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Получаем роль...</p>
            </div>
          )}
          
          {error && (
            <div className="error-state">
              <div className="error-icon">❌</div>
              <h3>Ошибка</h3>
              <p>{error}</p>
              <button 
                onClick={getRoleFromServer}
                className="retry-button"
              >
                🔄 Попробовать снова
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};