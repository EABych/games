import React, { useState, useEffect } from 'react';
import { HeadwordsGameSettings } from './types';

interface HeadwordsCategory {
  id: string;
  name: string;
  rolesCount: number;
}

interface HeadwordsHostSetupProps {
  onGameStart: (settings: HeadwordsGameSettings) => void;
  onBack: () => void;
}

export const HeadwordsHostSetup: React.FC<HeadwordsHostSetupProps> = ({ onGameStart, onBack }) => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
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
          setSelectedCategory(data.categories[0].id);
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

  const handleStartGame = () => {
    if (!selectedCategory) return;
    
    setIsLoading(true);
    onGameStart({
      playerCount,
      category: selectedCategory
    });
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);
  const canStart = selectedCategory && playerCount >= 2 && playerCount <= 20 && 
                   selectedCategoryData && playerCount <= selectedCategoryData.rolesCount;

  return (
    <div className="headwords-host-setup">
      <div className="setup-header">
        <button onClick={onBack} className="back-button">← Игры</button>
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
              disabled={playerCount >= 20 || (selectedCategoryData && playerCount >= selectedCategoryData.rolesCount)}
            >
              +
            </button>
          </div>
          <p className="player-count-hint">
            От 2 до {selectedCategoryData ? Math.min(20, selectedCategoryData.rolesCount) : 20} игроков
          </p>
        </div>

        <div className="setting-section">
          <h3>🎯 Категория</h3>
          <div className="category-grid">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`category-button ${selectedCategory === category.id ? 'selected' : ''}`}
              >
                <div className="category-name">{category.name}</div>
                <div className="category-count">{category.rolesCount} ролей</div>
              </button>
            ))}
          </div>
          {selectedCategoryData && (
            <p className="category-hint">
              Выбрана категория "{selectedCategoryData.name}" - {selectedCategoryData.rolesCount} уникальных ролей
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
          
          {!canStart && selectedCategory && (
            <p className="warning-message">
              {playerCount > (selectedCategoryData?.rolesCount || 0) 
                ? `В категории "${selectedCategoryData?.name}" недостаточно ролей для ${playerCount} игроков`
                : 'Выберите категорию и количество игроков'
              }
            </p>
          )}
        </div>
      </div>
    </div>
  );
};