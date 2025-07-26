import React, { useState, useEffect } from 'react';

export interface HeadwordsGameSettings {
  playerCount: number;
  categories: string[];
}

interface HeadwordsCategory {
  id: string;
  name: string;
  rolesCount: number;
}

interface HeadwordsHostSetupProps {
  onGameStart: (settings: HeadwordsGameSettings) => void;
}

export const HeadwordsHostSetup: React.FC<HeadwordsHostSetupProps> = ({ onGameStart }) => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<HeadwordsCategory[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('https://mafia-backend-5z0e.onrender.com/api/headwords/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
        if (data.categories.length > 0) {
          console.log('Загружены категории:', data.categories);
          setSelectedCategories([data.categories[0].id]);
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    }
  };

  const handlePlayerCountChange = (delta: number) => {
    const newCount = playerCount + delta;
    if (newCount >= 2 && newCount <= 20) {
      setPlayerCount(newCount);
    }
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleStartGame = () => {
    if (selectedCategories.length === 0) return;
    
    const gameSettings = {
      playerCount,
      categories: selectedCategories
    };
    
    console.log('Настройки игры:', gameSettings);
    setIsLoading(true);
    onGameStart(gameSettings);
  };

  // Подсчитываем общее количество доступных ролей в выбранных категориях
  const selectedCategoriesData = categories.filter(cat => selectedCategories.includes(cat.id));
  const totalAvailableRoles = selectedCategoriesData.reduce((total, cat) => total + cat.rolesCount, 0);
  // Убираем возможные дубликаты (примерная оценка)
  const estimatedUniqueRoles = Math.min(totalAvailableRoles, selectedCategories.length > 1 ? totalAvailableRoles * 0.9 : totalAvailableRoles);
  
  const canStart = selectedCategories.length > 0 && playerCount >= 2 && playerCount <= 20 && 
                   playerCount <= estimatedUniqueRoles;

  return (
    <div className="headwords-host-setup">
      <div className="setup-header">
        <h2>🎭 Слова на лоб</h2>
        <p>Настройте параметры игры</p>
      </div>

      <div className="setup-content">
        <div className="setting-section">
          <h3>👥 Количество игроков</h3>
          <div className="player-count-controls">
            <button 
              onClick={() => handlePlayerCountChange(-1)}
              className="count-button"
              disabled={playerCount <= 2}
            >
              −
            </button>
            <span className="player-count">{playerCount}</span>
            <button 
              onClick={() => handlePlayerCountChange(1)}
              className="count-button"
              disabled={playerCount >= 20 || playerCount >= estimatedUniqueRoles}
            >
              +
            </button>
          </div>
          <p className="player-count-hint">
            От 2 до {Math.min(20, Math.floor(estimatedUniqueRoles))} игроков
            {selectedCategories.length > 0 && ` (доступно ~${Math.floor(estimatedUniqueRoles)} уникальных ролей)`}
          </p>
        </div>

        <div className="setting-section">
          <h3>🎯 Категории</h3>
          <p className="multi-select-hint">Можно выбрать несколько категорий для большего разнообразия</p>
          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => toggleCategory(category.id)}
                className={`category-button ${selectedCategories.includes(category.id) ? 'selected' : ''}`}
              >
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.rolesCount} ролей</div>
                {selectedCategories.includes(category.id) && (
                  <div className="category-checkmark">✓</div>
                )}
              </button>
            ))}
          </div>
          {selectedCategories.length > 0 && (
            <p className="category-hint">
              Выбрано категорий: {selectedCategoriesData.map(cat => cat.name).join(', ')}
              <br />
              Общее количество ролей: ~{Math.floor(estimatedUniqueRoles)} уникальных
            </p>
          )}
          {selectedCategories.length === 0 && (
            <p className="warning-message">
              Выберите хотя бы одну категорию
            </p>
          )}
        </div>

        <div className="game-rules">
          <h3>📖 Как играть:</h3>
          <ul>
            <li>📱 Каждый игрок получает роль через QR-код</li>
            <li>⏰ Есть таймер, чтобы приложить телефон ко лбу</li>
            <li>👁️ Все видят роль игрока, кроме него самого</li>
            <li>❓ Игрок задает вопросы, чтобы угадать свою роль</li>
            <li>🎯 Цель: угадать, кто ты, задавая вопросы "да/нет"</li>
          </ul>
        </div>

        <div className="start-section">
          <button 
            onClick={handleStartGame}
            disabled={!canStart || isLoading}
            className="start-game-button"
          >
            {isLoading ? '🔄 Создание...' : '🎮 Создать игру'}
          </button>
          
          {!canStart && (
            <p className="warning-message">
              {selectedCategories.length === 0 
                ? 'Выберите хотя бы одну категорию'
                : playerCount > estimatedUniqueRoles 
                ? `В выбранных категориях недостаточно уникальных ролей для ${playerCount} игроков (доступно: ~${Math.floor(estimatedUniqueRoles)})`
                : 'Настройте параметры игры'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};