import React, { useState } from 'react';

interface HeadwordsRole {
  playerNumber: number;
  totalPlayers: number;
  role: string;
  category: string;
  isLastPlayer: boolean;
  roomId?: string;
}

interface HeadwordsPlayerScreenProps {
  roomId?: string | null;
}

export const HeadwordsPlayerScreen: React.FC<HeadwordsPlayerScreenProps> = ({ roomId }) => {
  const [playerRole, setPlayerRole] = useState<HeadwordsRole | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(0);
  const [isCountingDown, setIsCountingDown] = useState<boolean>(false);

  const getRoleFromServer = async () => {
    setIsLoading(true);
    setError('');

    try {
      const url = roomId
        ? `https://mafia-backend-5z0e.onrender.com/api/headwords/get-role?roomId=${roomId}`
        : 'https://mafia-backend-5z0e.onrender.com/api/headwords/get-role';

      const response = await fetch(url);

      if (response.ok) {
        const data = await response.json();
        // Начинаем обратный отсчет перед показом роли
        startCountdown(data);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Ошибка получения роли');
        setIsLoading(false);
      }
    } catch (err) {
      setError('Ошибка соединения с сервером');
      setIsLoading(false);
      console.log(err)
    }
  };

  const startCountdown = (roleData: HeadwordsRole) => {
    setIsCountingDown(true);
    setCountdown(5);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsCountingDown(false);
          setIsLoading(false);
          setPlayerRole(roleData);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
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

  const getCategoryEmoji = (categoryId: string): string => {
    const emojis: Record<string, string> = {
      celebrities: '⭐',
      cartoons: '🎬',
      movies: '🎭',
      animals: '🐾',
      professions: '💼',
      objects: '🔧'
    };

    return emojis[categoryId] || '🎯';
  };

  // Обратный отсчет
  if (isCountingDown) {
    return (
      <div className="headwords-player-screen countdown-screen">
        <div className="countdown-container">
          <div className="countdown-header">
            <h1>🎭 Приготовьтесь!</h1>
            <p>Приложите телефон ко лбу горизонтально</p>
          </div>

          <div className="countdown-timer">
            <div className="countdown-number">{countdown}</div>
          </div>

          <div className="countdown-instruction">
            <p>📱 Поверните телефон горизонтально</p>
            <p>🤚 Прижмите к лбу экраном наружу</p>
            <p>👥 Пусть другие видят экран</p>
          </div>
        </div>
      </div>
    );
  }

  // Показ роли
  if (playerRole) {
    return (
      <div className="headwords-player-screen role-screen">
        <div className="role-container">
          <div className="role-category">
            {getCategoryEmoji(playerRole.category)} {getCategoryDisplayName(playerRole.category)}
          </div>

          <div className="role-main">
            {playerRole.role}
          </div>

          <div className="role-footer">
            <div className="player-info">
              Игрок {playerRole.playerNumber} из {playerRole.totalPlayers}
            </div>
          </div>
        </div>

        {/* Инструкция внизу экрана (для владельца телефона) */}
        <div className="role-instructions">
          <p>❓ Задавайте вопросы "да/нет", чтобы угадать свою роль</p>
          <p>🚫 Не смотрите на экран! Держите телефон так, чтобы видели только другие</p>
        </div>
      </div>
    );
  }

  // Экран получения роли
  return (
    <div className="headwords-player-screen welcome-screen">
      <div className="welcome-card">
        <div className="welcome-header">
          <h1>🎭 Добро пожаловать в "Слова на лоб"!</h1>
          <p>Нажмите кнопку ниже, чтобы получить свою роль</p>
        </div>

        <div className="welcome-content">
          {!isLoading && !error && (
            <>
              <div className="game-rules">
                <h3>📖 Правила игры:</h3>
                <ul>
                  <li>🎲 <strong>Получение роли:</strong> Нажмите кнопку и получите роль</li>
                  <li>📱 <strong>Таймер:</strong> У вас будет 5 секунд, чтобы приложить телефон ко лбу</li>
                  <li>🔄 <strong>Поворот:</strong> Поверните телефон горизонтально для лучшей видимости</li>
                  <li>❓ <strong>Вопросы:</strong> Задавайте вопросы "да/нет", чтобы угадать роль</li>
                  <li>🎯 <strong>Цель:</strong> Угадать, кто вы, не глядя на экран</li>
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
