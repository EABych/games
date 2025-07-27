import React, { useState } from 'react';
import './EveningRole.css';

interface EveningRoleSetupProps {
  onStartGame: (roomId: string) => void;
}

export const EveningRoleSetup: React.FC<EveningRoleSetupProps> = ({ onStartGame }) => {
  const [playerCount, setPlayerCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    setError(null);
  };

  const handleStartGame = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Создаем игру на сервере
      const response = await fetch('https://mafia-backend-fbm5.onrender.com/api/evening-role/generate-game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ playerCount }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Ошибка создания игры');
      }

      const data = await response.json();
      console.log('Игра создана на сервере:', data);
      
      onStartGame(data.roomId);
    } catch (err) {
      console.error('Ошибка создания игры:', err);
      setError(err instanceof Error ? err.message : 'Ошибка соединения с сервером');
    } finally {
      setIsLoading(false);
    }
  };

  const playerCountOptions = [3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20];

  return (
    <div className="evening-role-setup">
      <div className="setup-header">
        <h1>Роль на вечер</h1>
        <p className="subtitle">Веселые задания для взрослой компании</p>
      </div>

      <div className="setup-content">
        <div className="game-info">
          <div className="info-card">
            <h2>Как играть?</h2>
            <div className="info-text">
              <p><strong>Два режима игры:</strong></p>
              <ul>
                <li><strong>Индивидуальные роли:</strong> Каждый игрок получает свое забавное задание на весь вечер</li>
                <li><strong>Общие задания:</strong> Все участники выполняют групповые активности</li>
              </ul>
              
              <p><strong>Примеры заданий:</strong></p>
              <ul>
                <li>Говорить с грузинским акцентом весь вечер</li>
                <li>Приседать при упоминании определенных слов</li>
                <li>Повторять движения за другим игроком</li>
                <li>Пить только левой рукой</li>
              </ul>
              
              <p><strong>Веселые групповые активности:</strong></p>
              <ul>
                <li>Все аплодируют при определенных событиях</li>
                <li>Синхронные реакции на ключевые слова</li>
                <li>Общие танцевальные движения</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h2>Настройки игры</h2>
          
          <div className="setting-group">
            <h3>Количество игроков</h3>
            <div className="player-count-options">
              {playerCountOptions.map(count => (
                <button
                  key={count}
                  className={`count-option ${playerCount === count ? 'active' : ''}`}
                  onClick={() => handlePlayerCountChange(count)}
                  type="button"
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          <div className="game-features">
            <div className="feature-item">
              <div className="feature-icon">🎭</div>
              <div className="feature-text">
                <h4>Более 125 индивидуальных заданий</h4>
                <p>Уникальные роли для каждого игрока</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">👥</div>
              <div className="feature-text">
                <h4>60+ групповых активностей</h4>
                <p>Задания для всей компании</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">⏱️</div>
              <div className="feature-text">
                <h4>Таймеры для заданий</h4>
                <p>Автоматические напоминания</p>
              </div>
            </div>
            
            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <div className="feature-text">
                <h4>QR-коды для участников</h4>
                <p>Быстрое получение заданий</p>
              </div>
            </div>
          </div>
        </div>

        {playerCount < 3 && (
          <div className="warning-message">
            Минимальное количество игроков: 3 человека
          </div>
        )}

        {error && (
          <div className="warning-message">
            {error}
          </div>
        )}
      </div>

      <div className="setup-footer">
        <button 
          className="start-game-btn"
          onClick={handleStartGame}
          disabled={playerCount < 3 || isLoading}
        >
          {isLoading ? 'Создание игры...' : `Создать игру (${playerCount} игроков)`}
        </button>
      </div>
    </div>
  );
};