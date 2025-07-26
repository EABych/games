import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import './MafiaPlayerScreen.css';

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
        return '#DC2626'; // Строгий красный
      case 'citizen':
        return '#059669'; // Элегантный зеленый
      case 'doctor':
        return '#2563EB'; // Профессиональный синий
      case 'detective':
      case 'sheriff':
        return '#D97706'; // Благородный янтарный
      default:
        return '#6B7280';
    }
  };

  if (playerRole) {
    return (
      <div className="mafia-player-screen dark">
        <div className="role-card">
          <div className="role-header">
            <h1 className="role-name" style={{ color: getRoleColor(playerRole.role) }}>
              {playerRole.roleInfo.name}
            </h1>
            <div className="role-team">
              <span className={`team-indicator ${playerRole.roleInfo.team}`}>
                {playerRole.roleInfo.team === 'mafia' ? 'Мафия' : 'Мирные жители'}
              </span>
            </div>
          </div>
          
          <div className="role-description">
            <p>{playerRole.roleInfo.description}</p>
          </div>
          
          <div className="role-footer">
            <div className="privacy-notice">
              Не показывайте экран другим игрокам
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mafia-player-screen dark">
      <div className="welcome-card">
        {!isLoading && !error && (
          <>
            <h1>Мафия</h1>
            <p>Получите свою роль для начала игры</p>
            <button 
              onClick={getRoleFromServer}
              className="get-role-button"
            >
              Получить роль
            </button>
          </>
        )}
        
        {isLoading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Получение роли...</p>
          </div>
        )}
        
        {error && (
          <div className="error-state">
            <h3>Ошибка</h3>
            <p>{error}</p>
            <button 
              onClick={getRoleFromServer}
              className="retry-button"
            >
              Повторить
            </button>
          </div>
        )}
      </div>
    </div>
  );
};