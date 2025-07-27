import React, { useState, useRef, useEffect } from 'react';
import type { AdultFantsPlayer, AdultFantsTask } from '../../types/adult-fants';
import { getRandomAdultFantsTask } from '../../data/adult-fants-tasks';
import './AdultFants.css';

interface AdultFantsSpinWheelProps {
  players: AdultFantsPlayer[];
  onTaskSelected: (player: AdultFantsPlayer, task: AdultFantsTask) => void;
  onBackToSetup: () => void;
}

export const AdultFantsSpinWheel: React.FC<AdultFantsSpinWheelProps> = ({ 
  players, 
  onTaskSelected,
  onBackToSetup 
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<AdultFantsPlayer | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  const playerCount = players.length;
  const sectorAngle = 360 / playerCount;

  const spinWheel = () => {
    if (isSpinning) return;

    console.log('=== НАЧАЛО АНИМАЦИИ ===');
    console.log('Количество игроков:', players.length);
    console.log('Угол сектора:', sectorAngle);
    console.log('Список игроков:', players.map((p, i) => `${i}: ${p.name}`));

    setIsSpinning(true);
    setSelectedPlayer(null);

    // Случайный игрок
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const selectedPlayer = players[randomPlayerIndex];

    // Случайное задание
    const task = getRandomAdultFantsTask();

    // Вычисляем угол для выбранного игрока
    // Первый сектор начинается сверху (0°), затем по часовой стрелке
    // Стрелка должна указать в центр выбранного сектора
    const sectorStartAngle = randomPlayerIndex * sectorAngle;
    const targetAngle = sectorStartAngle + (sectorAngle / 2);
    
    // Добавляем несколько полных оборотов для эффекта вращения
    const spins = 2 + Math.random() * 2; // 2-4 оборота (меньше чтоб протестировать)
    const finalAngle = spins * 360 + targetAngle;

    console.log(`Выбран игрок ${randomPlayerIndex} (${selectedPlayer.name})`);
    console.log(`Начальный угол сектора: ${sectorStartAngle}°`);
    console.log(`Целевой угол: ${targetAngle}°`);
    console.log(`Количество оборотов: ${spins}`);
    console.log(`Финальный угол: ${finalAngle}°`);
    
    // ТЕСТ: простая анимация на 90 градусов
    const testAngle = 90;
    console.log(`ТЕСТ: будем анимировать простой поворот на ${testAngle}°`);

    if (arrowRef.current) {
      console.log('Стрелка найдена, начинаем анимацию...');
      console.log('Текущий transform:', arrowRef.current.style.transform);
      
      // Сначала сбрасываем позицию стрелки
      arrowRef.current.style.transition = 'none';
      arrowRef.current.style.transform = 'translate(-50%, -50%) rotate(0deg)';
      console.log('Сброшено в 0°');
      
      // Принудительный reflow для применения изменений
      arrowRef.current.offsetHeight;
      
      // Затем запускаем анимацию с задержкой
      setTimeout(() => {
        if (arrowRef.current) {
          console.log('Запускаем ТЕСТОВУЮ анимацию к углу:', testAngle);
          arrowRef.current.style.transition = 'transform 2s ease-in-out';
          arrowRef.current.style.transform = `translate(-50%, -50%) rotate(${testAngle}deg)`;
          console.log('Новый transform:', arrowRef.current.style.transform);
          console.log('Transition:', arrowRef.current.style.transition);
        }
      }, 100);
    } else {
      console.log('ERROR: Стрелка не найдена!');
    }

    // После завершения анимации показываем результат
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedPlayer(selectedPlayer);
      
      // Через 3 секунды показываем модал с заданием
      setTimeout(() => {
        onTaskSelected(selectedPlayer, task);
      }, 3000);
    }, 4000);
  };

  const resetArrow = () => {
    console.log('=== СБРОС СТРЕЛКИ ===');
    if (arrowRef.current) {
      console.log('Сбрасываем стрелку в исходное положение');
      arrowRef.current.style.transition = 'none';
      arrowRef.current.style.transform = 'translate(-50%, -50%) rotate(0deg)';
      console.log('Стрелка сброшена');
    } else {
      console.log('ERROR: Стрелка не найдена при сбросе!');
    }
  };

  useEffect(() => {
    console.log('=== useEffect: изменились игроки ===');
    console.log('Новый список игроков:', players.map(p => p.name));
    // Сбрасываем стрелку при изменении игроков
    resetArrow();
  }, [players]);

  return (
    <div className="adult-fants-spin-wheel">
      <div className="wheel-header">
        <button 
          className="back-btn"
          onClick={onBackToSetup}
          disabled={isSpinning}
        >
          ← Назад
        </button>
        <h1>Взрослые Фанты 18+</h1>
        <div className="players-count">Игроков: {playerCount}</div>
      </div>

      <div className="wheel-container">
        <div className="wheel-wrapper">
          {/* Колесо с секторами */}
          <div ref={wheelRef} className="wheel">
            {players.map((player, index) => {
              const rotation = index * sectorAngle;
              return (
                <div
                  key={player.id}
                  className={`wheel-sector ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    backgroundColor: player.color,
                    '--sector-angle': `${sectorAngle}deg`
                  } as React.CSSProperties}
                >
                  <div className="sector-content">
                    <span className="player-name">{player.name}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Стрелка */}
          <div 
            ref={arrowRef}
            className={`wheel-arrow ${isSpinning ? 'spinning' : ''}`}
          ></div>

          {/* Центральная кнопка */}
          <button
            className={`spin-button ${isSpinning ? 'spinning' : ''}`}
            onClick={spinWheel}
            disabled={isSpinning}
          >
            {isSpinning ? (
              <>
                <div className="spin-icon">...</div>
                <span>Крутится</span>
              </>
            ) : (
              <>
                <div className="spin-icon">SPIN</div>
                <span>Крутить</span>
              </>
            )}
          </button>
        </div>

        {/* Результат */}
        {selectedPlayer && !isSpinning && (
          <div className="selection-result">
            <div className="result-animation">
              <div 
                className="selected-player-card"
                style={{ backgroundColor: selectedPlayer.color }}
              >
                <div className="player-avatar">
                  {selectedPlayer.name.charAt(0).toUpperCase()}
                </div>
                <div className="player-info">
                  <div className="player-name">{selectedPlayer.name}</div>
                  <div className="result-text">Выбран для задания!</div>
                </div>
              </div>
              <div className="countdown-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="wheel-instructions">
        <div className="instruction-item">
          <span className="instruction-icon">1</span>
          <span>Нажмите красную кнопку в центре для запуска</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-icon">2</span>
          <span>Подождите пока стрелка остановится</span>
        </div>
        <div className="instruction-item">
          <span className="instruction-icon">3</span>
          <span>Через 3 секунды откроется задание</span>
        </div>
      </div>
    </div>
  );
};