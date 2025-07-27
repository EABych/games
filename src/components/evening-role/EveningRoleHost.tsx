import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getRandomGroupTask } from '../../data/evening-role-tasks';
import type { EveningRoleTask } from '../../types/evening-role';
import './EveningRole.css';

interface EveningRoleHostProps {
  roomId: string;
  onBackToSetup: () => void;
}

export const EveningRoleHost: React.FC<EveningRoleHostProps> = ({ roomId, onBackToSetup }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [groupTask, setGroupTask] = useState<EveningRoleTask | null>(null);

  useEffect(() => {
    // Генерируем QR код для участников
    const generateQRCode = async () => {
      try {
        const playerUrl = `${window.location.origin}/player/evening-role/${roomId}`;
        const qrDataUrl = await QRCode.toDataURL(playerUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1d1d1f',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(qrDataUrl);
      } catch (error) {
        console.error('Ошибка генерации QR кода:', error);
      }
    };

    generateQRCode();
  }, [roomId]);

  useEffect(() => {
    // Генерируем первое групповое задание при загрузке
    const initialGroupTask = getRandomGroupTask();
    setGroupTask(initialGroupTask);
  }, []);

  const handleGenerateNewGroupTask = () => {
    const newGroupTask = getRandomGroupTask();
    setGroupTask(newGroupTask);
  };

  return (
    <div className="evening-role-host">
      <div className="host-header">
        <div className="room-info">
          <h1>Роль на вечер</h1>
          <div className="room-id">ID комнаты: <span>{roomId}</span></div>
        </div>
        
        <button 
          className="back-btn"
          onClick={onBackToSetup}
        >
          Назад к настройкам
        </button>
      </div>

      <div className="host-content">
        <div className="qr-section">
          <div className="qr-card">
            <h2>Участники: получите свою роль!</h2>
            
            {!showQR ? (
              <div className="qr-placeholder">
                <button 
                  className="show-qr-btn"
                  onClick={() => setShowQR(true)}
                >
                  📱 Показать QR-код участникам
                </button>
                <p className="qr-instruction">
                  Покажите этот QR-код участникам для получения их индивидуальных заданий
                </p>
              </div>
            ) : (
              <div className="qr-display">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="QR код для участников" 
                    className="qr-code"
                  />
                )}
                <p className="qr-instruction">
                  Отсканируйте QR-код или перейдите по ссылке для получения своего задания
                </p>
                <div className="manual-link">
                  <span>Или перейдите по ссылке:</span>
                  <code>{window.location.origin}/player/evening-role/{roomId}</code>
                </div>
                <button 
                  className="hide-qr-btn"
                  onClick={() => setShowQR(false)}
                >
                  Скрыть QR-код
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="group-task-section">
          <div className="group-task-card">
            <h2>Общее задание для всей компании</h2>
            
            {groupTask ? (
              <div className="current-group-task">
                <div className="task-content">
                  <p className="task-text">{groupTask.text}</p>
                  {groupTask.hasTimer && groupTask.timerDuration && (
                    <div className="task-timer-info">
                      ⏱️ Задание с таймером: {Math.round(groupTask.timerDuration / 60)} мин
                    </div>
                  )}
                </div>
                
                <button 
                  className="new-group-task-btn"
                  onClick={handleGenerateNewGroupTask}
                >
                  🎲 Новое общее задание
                </button>
              </div>
            ) : (
              <div className="no-group-task">
                <p>Загрузка общего задания...</p>
              </div>
            )}
          </div>
        </div>

        <div className="game-stats">
          <h3>Информация об игре</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Индивидуальных заданий</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">60+</div>
              <div className="stat-label">Групповых заданий</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">{roomId}</div>
              <div className="stat-label">ID комнаты</div>
            </div>
          </div>
        </div>

        <div className="game-tips">
          <h3>Советы ведущему</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">💡</span>
              <span>Следите за выполнением общего задания всей компанией</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎭</span>
              <span>Поощряйте креативность в выполнении индивидуальных ролей</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">⏰</span>
              <span>Некоторые задания имеют таймеры - участники увидят их на своих экранах</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🔄</span>
              <span>Можете генерировать новые общие задания в любой момент</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};