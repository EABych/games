import React, { useState } from 'react';
import { useEveningRoleGame } from '../../hooks/useEveningRoleGame';
import './EveningRole.css';

interface EveningRoleSetupProps {
  onStartGame: (roomId: string) => void;
}

export const EveningRoleSetup: React.FC<EveningRoleSetupProps> = ({ onStartGame }) => {
  const { settings, updateSettings, createRoom } = useEveningRoleGame();
  const [playerCount, setPlayerCount] = useState(settings.playerCount);

  const handlePlayerCountChange = (count: number) => {
    setPlayerCount(count);
    updateSettings({ playerCount: count });
  };

  const handleStartGame = () => {
    const roomId = createRoom();
    onStartGame(roomId);
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
                <h4>Более 150 индивидуальных заданий</h4>
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
      </div>

      <div className="setup-footer">
        <button 
          className="start-game-btn"
          onClick={handleStartGame}
          disabled={playerCount < 3}
        >
          Создать игру ({playerCount} игроков)
        </button>
      </div>
    </div>
  );
};