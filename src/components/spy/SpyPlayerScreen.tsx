import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface SpyRole {
  playerNumber: number;
  totalPlayers: number;
  isSpy: boolean;
  isLastPlayer: boolean;
  role: string;
  location?: string;
  roleInfo: {
    name: string;
    description: string;
    instruction: string;
  };
}

interface SpyPlayerScreenProps {
  roomId?: string | null;
}

export const SpyPlayerScreen: React.FC<SpyPlayerScreenProps> = ({ roomId: propRoomId }) => {
  const { roomId: paramRoomId } = useParams<{ roomId: string }>();
  const roomId = propRoomId || paramRoomId;
  const [playerRole, setPlayerRole] = useState<SpyRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getRoleFromServer = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const url = roomId 
        ? `https://mafia-backend-5z0e.onrender.com/api/spy/get-role?roomId=${roomId}`
        : 'https://mafia-backend-5z0e.onrender.com/api/spy/get-role';
      
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

  const getRoleColor = (isSpy: boolean): string => {
    return isSpy ? '#DC2626' : '#059669';
  };


  if (playerRole) {
    return (
      <div className="spy-player-screen dark">
        <div className="role-card">
          <div className="role-header">
            <h1 className="role-name" style={{ color: getRoleColor(playerRole.isSpy) }}>
              {playerRole.roleInfo.name}
            </h1>
            <div className="role-team">
              <span className={`team-indicator ${playerRole.isSpy ? 'spy' : 'resident'}`}>
                {playerRole.isSpy ? 'Шпион' : 'Житель'}
              </span>
            </div>
          </div>
          
          <div className="role-description">
            <p>{playerRole.roleInfo.description}</p>
          </div>
          
          {playerRole.location && (
            <div className="location-display">
              <div className="location-badge">
                {playerRole.location}
              </div>
            </div>
          )}
          
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
    <div className="spy-player-screen dark">
      <div className="welcome-card">
        {!isLoading && !error && (
          <>
            <h1>Шпион</h1>
            <p>{roomId ? 'Получите свою роль для начала игры' : 'Узнайте локацию для начала игры'}</p>
            <button 
              onClick={getRoleFromServer}
              className="get-role-button"
            >
              {roomId ? 'Получить роль' : 'Узнать локацию'}
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