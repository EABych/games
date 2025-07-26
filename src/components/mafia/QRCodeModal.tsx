import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId?: string;
  gameType?: 'mafia' | 'spy' | 'headwords';
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ isOpen, onClose, roomId, gameType }) => {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>('');

  useEffect(() => {
    if (isOpen && roomId && gameType) {
      // Генерируем ссылку для игроков в новом формате
      const playerUrl = `${window.location.origin}/games/player/${gameType}/${roomId}`;
      
      // Генерируем QR-код
      QRCode.toDataURL(playerUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#2c3e50',
          light: '#ffffff'
        }
      })
      .then(url => {
        setQrCodeDataURL(url);
      })
      .catch(err => {
        console.error('Ошибка генерации QR-кода:', err);
      });
    }
  }, [isOpen, roomId, gameType]);

  if (!isOpen) return null;

  // Генерируем ссылку для отображения
  const playerUrl = roomId && gameType 
    ? `${window.location.origin}/games/player/${gameType}/${roomId}`
    : '';

  return (
    <div className="qr-modal-overlay" onClick={onClose}>
      <div className="qr-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <h3>📱 QR-код для игроков</h3>
          <button onClick={onClose} className="qr-modal-close">✕</button>
        </div>
        
        <div className="qr-modal-body">
          <div className="qr-code-container">
            {qrCodeDataURL ? (
              <img 
                src={qrCodeDataURL} 
                alt="QR-код для присоединения к игре" 
                className="qr-code-image"
              />
            ) : (
              <div className="qr-code-loading">
                <div className="loading-spinner"></div>
                <p>Генерируем QR-код...</p>
              </div>
            )}
          </div>
          
          <div className="qr-instructions">
            <h4>📋 Инструкция для игроков:</h4>
            <ol>
              <li>Отсканируйте QR-код своим телефоном</li>
              <li>Или перейдите по ссылке:</li>
              <div className="player-url">
                <code>{playerUrl}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(playerUrl)}
                  className="copy-button"
                  title="Скопировать ссылку"
                >
                  📋
                </button>
              </div>
              <li>Нажмите "Получить роль" на открывшейся странице</li>
              <li>Запомните свою роль и начинайте игру!</li>
            </ol>
          </div>
        </div>
        
        <div className="qr-modal-footer">
          <button onClick={onClose} className="qr-modal-ok-button">
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
};