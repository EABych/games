import React, { useState } from 'react';

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

export const SpyPlayerScreen: React.FC = () => {
  const [playerRole, setPlayerRole] = useState<SpyRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const getRoleFromServer = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('https://mafia-backend-5z0e.onrender.com/api/spy/get-role');
      
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
    return isSpy ? '#e74c3c' : '#27ae60';
  };

  const getRoleEmoji = (isSpy: boolean): string => {
    return isSpy ? '🕵️' : '🏠';
  };

  if (playerRole) {
    return (
      <div className="spy-player-screen">
        <div className="role-card" style={{ borderColor: getRoleColor(playerRole.isSpy) }}>
          <div className="role-header">
            <div className="role-emoji">{getRoleEmoji(playerRole.isSpy)}</div>
            <h2 className="role-name" style={{ color: getRoleColor(playerRole.isSpy) }}>
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
            
            {playerRole.location && (
              <div className="location-info">
                <h3>📍 Локация:</h3>
                <div className="location-badge">
                  {playerRole.location}
                </div>
              </div>
            )}
            
            {playerRole.isSpy && (
              <div className="spy-tips">
                <h3>🕵️ Советы для шпиона:</h3>
                <ul>
                  <li>Слушайте внимательно вопросы других игроков</li>
                  <li>Задавайте общие вопросы, чтобы понять локацию</li>
                  <li>Не выдавайте себя слишком конкретными деталями</li>
                  <li>Попробуйте понять, где вы находитесь</li>
                </ul>
              </div>
            )}
            
            {!playerRole.isSpy && (
              <div className="resident-tips">
                <h3>👥 Советы для жителей:</h3>
                <ul>
                  <li>Задавайте вопросы о деталях локации</li>
                  <li>Ищите игрока, который отвечает уклончиво</li>
                  <li>Обращайте внимание на странное поведение</li>
                  <li>Голосуйте за исключение подозрительных</li>
                </ul>
              </div>
            )}
            
            <div className="instruction-info">
              <h3>💡 Инструкция:</h3>
              <p>{playerRole.roleInfo.instruction}</p>
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
    <div className="spy-player-screen">
      <div className="welcome-card">
        <div className="welcome-header">
          <h1>🕵️ Добро пожаловать в игру Шпион!</h1>
          <p>Нажмите кнопку ниже, чтобы получить свою роль</p>
        </div>
        
        <div className="welcome-content">
          {!isLoading && !error && (
            <>
              <div className="game-rules">
                <h3>📖 Правила игры:</h3>
                <ul>
                  <li>🏠 <strong>Жители:</strong> Знают локацию, ищут шпиона</li>
                  <li>🕵️ <strong>Шпион:</strong> Не знает локацию, должен её угадать</li>
                  <li>❓ <strong>Процесс:</strong> Задавайте вопросы друг другу</li>
                  <li>🏆 <strong>Победа:</strong> Найти шпиона или угадать локацию</li>
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