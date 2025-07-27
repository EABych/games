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
  const [highlightedSector, setHighlightedSector] = useState<number>(-1);
  const wheelRef = useRef<HTMLDivElement>(null);

  const playerCount = players.length;
  const sectorAngle = 360 / playerCount;

  const spinWheel = () => {
    if (isSpinning) return;

    console.log('=== АНИМАЦИЯ ПОДСВЕТКИ СЕКТОРОВ ===');
    console.log('Количество игроков:', players.length);

    setIsSpinning(true);
    setSelectedPlayer(null);
    setHighlightedSector(-1);

    // Случайный игрок
    const randomPlayerIndex = Math.floor(Math.random() * players.length);
    const selectedPlayer = players[randomPlayerIndex];

    // Случайное задание
    const task = getRandomAdultFantsTask();
    
    console.log(`Выбран игрок ${randomPlayerIndex} (${selectedPlayer.name})`);

    // ФАЗА 1: Быстрая подсветка секторов (3 секунды)
    console.log('ФАЗА 1: Быстрая подсветка секторов');
    let currentSector = 0;
    let fastInterval = 100; // начальная скорость 100ms

    const fastSpin = setInterval(() => {
      setHighlightedSector(currentSector);
      currentSector = (currentSector + 1) % players.length;
    }, fastInterval);

    // ФАЗА 2: Замедление подсветки до остановки на выбранном игроке
    setTimeout(() => {
      clearInterval(fastSpin);
      console.log('ФАЗА 2: Замедление подсветки');
      
      // Корректируем текущий сектор - он может быть неточным после быстрой фазы
      currentSector = currentSector % players.length;
      
      let slowInterval = 150; // начальная скорость замедления
      const slowdownFactor = 1.15; // коэффициент замедления
      const maxSlowInterval = 800; // максимальная задержка
      
      // Сколько дополнительных оборотов сделать в фазе замедления
      const additionalSpins = 2 + Math.floor(Math.random() * 2); // 2-3 оборота
      
      // Рассчитываем сколько шагов нужно до целевого игрока
      const stepsToTarget = (randomPlayerIndex - currentSector + players.length) % players.length;
      
      // Общее количество шагов = дополнительные обороты + точное попадание
      const totalSteps = additionalSpins * players.length + stepsToTarget;
      let remainingSteps = totalSteps;
      
      console.log(`Текущий сектор: ${currentSector}, целевой: ${randomPlayerIndex}`);
      console.log(`Шагов до цели: ${stepsToTarget}, дополнительных оборотов: ${additionalSpins}`);
      console.log(`Всего шагов: ${totalSteps}`);
      
      const slowSpin = () => {
        // Сначала уменьшаем счетчик и переходим к следующему сектору
        remainingSteps--;
        currentSector = (currentSector + 1) % players.length;
        
        console.log(`Подсвечиваем сектор ${currentSector}, осталось шагов: ${remainingSteps}`);
        setHighlightedSector(currentSector);
        
        if (remainingSteps <= 0) {
          // Остановились - сейчас должны быть на целевом игроке
          console.log(`ОСТАНОВКА: текущий сектор ${currentSector}, целевой игрок ${randomPlayerIndex} (${selectedPlayer.name})`);
          
          // Проверим что мы действительно на правильном секторе
          if (currentSector !== randomPlayerIndex) {
            console.log(`ОШИБКА: остановились на ${currentSector}, а должны на ${randomPlayerIndex}`);
            console.log(`Принудительно устанавливаем подсветку на ${randomPlayerIndex}`);
            setHighlightedSector(randomPlayerIndex);
          }
          
          setIsSpinning(false);
          setSelectedPlayer(selectedPlayer);
          
          setTimeout(() => {
            onTaskSelected(selectedPlayer, task);
          }, 2000);
          return;
        }
        
        // Увеличиваем интервал (замедляем)
        slowInterval = Math.min(slowInterval * slowdownFactor, maxSlowInterval);
        setTimeout(slowSpin, slowInterval);
      };
      
      setTimeout(slowSpin, slowInterval);
      
    }, 3000); // после 3 секунд быстрой подсветки

  };

  useEffect(() => {
    console.log('=== useEffect: изменились игроки ===');
    console.log('Новый список игроков:', players.map(p => p.name));
    // Сбрасываем подсветку при изменении игроков
    setHighlightedSector(-1);
    setSelectedPlayer(null);
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
              const isHighlighted = highlightedSector === index;
              const isSelected = selectedPlayer?.id === player.id;
              
              return (
                <div
                  key={player.id}
                  className={`wheel-sector ${isHighlighted ? 'highlighted' : ''} ${isSelected ? 'selected' : ''}`}
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