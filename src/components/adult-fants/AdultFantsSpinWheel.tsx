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

    console.log('=== НОВАЯ ДВУХФАЗНАЯ АНИМАЦИЯ ===');
    console.log('Количество игроков:', players.length);
    console.log('Угол сектора:', sectorAngle);

    setIsSpinning(true);
    setSelectedPlayer(null);

    // Случайный игрок
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const selectedPlayer = players[randomPlayerIndex];

    // Случайное задание
    const task = getRandomAdultFantsTask();

    // Вычисляем точный угол остановки на выбранном игроке
    const targetAngle = randomPlayerIndex * sectorAngle + (sectorAngle / 2);
    
    console.log(`Выбран игрок ${randomPlayerIndex} (${selectedPlayer.name})`);
    console.log(`Будем останавливаться на угле: ${targetAngle}°`);

    if (arrowRef.current) {
      // Сбрасываем стрелку в исходное положение
      arrowRef.current.style.transition = 'none';
      arrowRef.current.style.transform = 'translateX(-50%) translateY(-100%) rotate(0deg)';
      arrowRef.current.offsetHeight; // force reflow
      
      console.log('ФАЗА 1: Быстрое вращение 3 секунды');
      
      // ФАЗА 1: Быстрое вращение (3 секунды, много оборотов)
      setTimeout(() => {
        if (arrowRef.current) {
          arrowRef.current.style.transition = 'transform 3s linear';
          arrowRef.current.style.transform = 'translateX(-50%) translateY(-100%) rotate(1080deg)'; // 3 оборота
        }
      }, 50);

      // ФАЗА 2: Замедление до остановки на выбранном игроке
      setTimeout(() => {
        console.log('ФАЗА 2: Замедление до остановки');
        
        if (arrowRef.current) {
          // Случайное время замедления (1-3 секунды)
          const slowdownTime = 1.5 + Math.random() * 1.5;
          console.log(`Время замедления: ${slowdownTime.toFixed(1)} сек`);
          
          // Добавляем еще немного оборотов + точную остановку
          const additionalSpins = 1 + Math.random(); // 1-2 доп. оборота
          const finalAngle = 1080 + (additionalSpins * 360) + targetAngle;
          
          console.log(`Финальный угол остановки: ${finalAngle}°`);
          
          arrowRef.current.style.transition = `transform ${slowdownTime}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
          arrowRef.current.style.transform = `translateX(-50%) translateY(-100%) rotate(${finalAngle}deg)`;
        }
        
        // Показываем результат после завершения замедления
        setTimeout(() => {
          setIsSpinning(false);
          setSelectedPlayer(selectedPlayer);
          
          setTimeout(() => {
            onTaskSelected(selectedPlayer, task);
          }, 2000);
        }, (1.5 + Math.random() * 1.5) * 1000 + 500); // время замедления + 0.5 сек
        
      }, 3000); // после завершения быстрого вращения
      
    } else {
      console.log('ERROR: Стрелка не найдена!');
    }

  };

  const resetArrow = () => {
    console.log('=== СБРОС СТРЕЛКИ ===');
    if (arrowRef.current) {
      console.log('Сбрасываем стрелку в исходное положение');
      arrowRef.current.style.transition = 'none';
      arrowRef.current.style.transform = 'translateX(-50%) translateY(-100%) rotate(0deg)';
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