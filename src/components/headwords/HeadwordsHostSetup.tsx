import React, { useState, useEffect } from 'react';
import { PlayerCountWidget } from '../shared';
import { CategorySelectorWidget, type Category } from '../shared';

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
          <h2>Кто я?</h2>
          <p>Настройте параметры игры</p>
        </div>

        <div className="setup-content">
          <div className="setting-section">
            <PlayerCountWidget
                value={playerCount}
                min={2}
                max={Math.min(20, Math.floor(estimatedUniqueRoles))}
                onChange={setPlayerCount}
                hint={`От 2 до ${Math.min(20, Math.floor(estimatedUniqueRoles))} игроков${selectedCategories.length > 0 ? ` (доступно ~${Math.floor(estimatedUniqueRoles)} уникальных ролей)` : ''}`}
            />
          </div>

          <div className="setting-section">
            <CategorySelectorWidget
                categories={categories.map(cat => ({
                  id: cat.id,
                  name: cat.name,
                  count: cat.rolesCount
                } as Category))}
                selectedCategories={selectedCategories}
                onSelectionChange={setSelectedCategories}
                hint="Можно выбрать несколько категорий для большего разнообразия"
            />
            {selectedCategories.length > 0 && (
                <p className="category-stats">
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
            <h3>Как играть:</h3>
            <ul>
              <li>Каждый игрок получает роль через QR-код</li>
              <li>Есть таймер, чтобы приложить телефон ко лбу</li>
              <li>Все видят роль игрока, кроме него самого</li>
              <li>Игрок задает вопросы, чтобы угадать свою роль</li>
              <li>Цель: угадать, кто ты, задавая вопросы "да/нет"</li>
            </ul>
          </div>
        </div>
        <div className="setup-actions">
          <button
              onClick={handleStartGame}
              disabled={!canStart || isLoading}
              className="start-game-button"
          >
            {isLoading ? 'Создание...' : 'Создать игру'}
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
  );
};
