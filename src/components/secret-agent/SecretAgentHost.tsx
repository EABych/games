import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import type { SecretAgentMission, SecretAgentSettings } from '../../types/secret-agent';
import './SecretAgent.css';

interface SecretAgentHostProps {
  roomId: string;
  settings: SecretAgentSettings;
  onBackToSetup: () => void;
}

export const SecretAgentHost: React.FC<SecretAgentHostProps> = ({ 
  roomId, 
  settings, 
  onBackToSetup 
}) => {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQR, setShowQR] = useState(false);
  const [hostMissions, setHostMissions] = useState<{cover: SecretAgentMission, main: SecretAgentMission} | null>(null);
  const [hasHostReceivedMissions, setHasHostReceivedMissions] = useState(false);
  const [isLoadingMissions, setIsLoadingMissions] = useState(false);
  const [gameStartTime] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Генерируем QR код для участников
    const generateQRCode = async () => {
      try {
        const playerUrl = `${window.location.origin}/player/secret-agent/${roomId}`;
        const qrDataUrl = await QRCode.toDataURL(playerUrl, {
          width: 256,
          margin: 2,
          color: {
            dark: '#1a1a2e',
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
    // Обновляем время каждую минуту
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleGetHostMissions = async () => {
    if (!settings.allowHostParticipation) return;
    
    setIsLoadingMissions(true);
    try {
      // Генерируем уникальный ID для хоста
      const hostUserId = `host_${roomId}`;
      
      const response = await fetch(`https://mafia-backend-5z0e.onrender.com/api/secret-agent/get-missions?roomId=${roomId}&userId=${hostUserId}`);
      if (response.ok) {
        const data = await response.json();
        setHostMissions({
          cover: data.coverMission,
          main: data.mainMission
        });
        setHasHostReceivedMissions(true);
      }
    } catch (error) {
      console.error('Ошибка получения миссий для хоста:', error);
    } finally {
      setIsLoadingMissions(false);
    }
  };

  const getGameTimeRemaining = () => {
    const elapsed = Math.floor((currentTime.getTime() - gameStartTime.getTime()) / (1000 * 60));
    const remaining = Math.max(0, settings.gameDuration - elapsed);
    const hours = Math.floor(remaining / 60);
    const minutes = remaining % 60;
    
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  const getGameProgress = () => {
    const elapsed = Math.floor((currentTime.getTime() - gameStartTime.getTime()) / (1000 * 60));
    return Math.min(100, (elapsed / settings.gameDuration) * 100);
  };

  return (
    <div className="secret-agent-host">
      <div className="host-header">
        <div className="room-info">
          <h1>Тайный агент</h1>
          <div className="room-details">
            <div className="room-id">
              <span className="detail-label">ID миссии:</span>
              <span className="detail-value">{roomId}</span>
            </div>
            <div className="game-timer">
              <span className="detail-label">⏰ Осталось:</span>
              <span className="detail-value">{getGameTimeRemaining()}</span>
            </div>
          </div>
        </div>
        
        <button 
          className="back-btn"
          onClick={onBackToSetup}
        >
          ← Назад к настройкам
        </button>
      </div>

      <div className="game-progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${getGameProgress()}%` }}
        ></div>
      </div>

      <div className="host-content">
        <div className="qr-section">
          <div className="qr-card">
            <h2>Агенты: получите свои миссии!</h2>
            
            {!showQR ? (
              <div className="qr-placeholder">
                <button 
                  className="show-qr-btn"
                  onClick={() => setShowQR(true)}
                >
                  Показать QR-код агентам
                </button>
                <p className="qr-instruction">
                  Покажите этот секретный QR-код агентам для получения их заданий
                </p>
              </div>
            ) : (
              <div className="qr-display">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt="Секретный QR код для агентов" 
                    className="qr-code"
                  />
                )}
                <p className="qr-instruction">
                  Отсканируйте QR-код или перейдите по ссылке для получения секретного задания
                </p>
                <div className="manual-link">
                  <span>Секретная ссылка:</span>
                  <code>{window.location.origin}/player/secret-agent/{roomId}</code>
                </div>
                <button 
                  className="hide-qr-btn"
                  onClick={() => setShowQR(false)}
                >
                  Скрыть секретный код
                </button>
              </div>
            )}
          </div>
        </div>

        {settings.allowHostParticipation && (
          <div className="host-missions-section">
            <div className="host-missions-card">
              <h2>Миссии для ведущего</h2>
              
              {!hasHostReceivedMissions ? (
                <div className="get-host-missions">
                  <p>Хотите присоединиться к операции?</p>
                  <button 
                    className="get-missions-btn"
                    onClick={handleGetHostMissions}
                    disabled={isLoadingMissions}
                  >
                    {isLoadingMissions ? 'Получение миссий...' : 'Получить секретные миссии'}
                  </button>
                </div>
              ) : (
                <div className="host-missions-display">
                  <div className="mission-card cover-mission">
                    <div className="mission-header">
                      <span className="mission-icon">🎭</span>
                      <span className="mission-type">Задание прикрытия</span>
                      <span className="mission-difficulty">{hostMissions?.cover.difficulty}</span>
                    </div>
                    <div className="mission-title">{hostMissions?.cover.title}</div>
                    <div className="mission-description">{hostMissions?.cover.description}</div>
                    <div className="mission-note">
                      💡 Выполняй незаметно всю игру
                    </div>
                  </div>

                  <div className="mission-card main-mission">
                    <div className="mission-header">
                      <span className="mission-icon">МИССИЯ</span>
                      <span className="mission-type">Главная миссия</span>
                      <span className="mission-difficulty">{hostMissions?.main.difficulty}</span>
                    </div>
                    <div className="mission-title">{hostMissions?.main.title}</div>
                    <div className="mission-description">{hostMissions?.main.description}</div>
                    <div className="mission-timer">
                      Время выполнения: {hostMissions?.main.timeLimit} минут
                    </div>
                    <div className="mission-note">
                      Выполни незаметно, никто не должен понять что ты делаешь 5 минут
                    </div>
                  </div>
                  
                  <div className="mission-final-note">
                    ✅ Ваши секретные миссии получены! Действуйте осторожно, агент.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="game-control-panel">
          <h3>Панель управления операцией</h3>
          <div className="control-grid">
            <div className="control-item">
              <div className="control-icon">ИГРОКИ</div>
              <div className="control-info">
                <div className="control-number">{settings.playerCount}</div>
                <div className="control-label">Агентов в миссии</div>
              </div>
            </div>
            <div className="control-item">
              <div className="control-icon">⏰</div>
              <div className="control-info">
                <div className="control-number">{Math.floor(settings.gameDuration / 60)}ч</div>
                <div className="control-label">Длительность операции</div>
              </div>
            </div>
            <div className="control-item">
              <div className="control-icon">МИССИЯ</div>
              <div className="control-info">
                <div className="control-number">2</div>
                <div className="control-label">Миссии на агента</div>
              </div>
            </div>
          </div>
        </div>

        <div className="game-tips">
          <h3>Инструкции для ведущего</h3>
          <div className="tips-list">
            <div className="tip-item">
              <span className="tip-icon">👀</span>
              <span>Наблюдайте за поведением агентов и ищите подозрительную активность</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🎭</span>
              <span>Поощряйте креативность в выполнении заданий прикрытия</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">1</span>
              <span>Главные миссии должны быть выполнены незаметно за 5 минут</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">🏆</span>
              <span>Агент побеждает если выполнит главную миссию или его не раскроют</span>
            </div>
            <div className="tip-item">
              <span className="tip-icon">2</span>
              <span>Позволяйте игрокам угадывать миссии других для разоблачения</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};