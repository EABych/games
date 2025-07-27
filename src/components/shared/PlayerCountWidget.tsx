import React from 'react';
import './PlayerCountWidget.css';

interface PlayerCountWidgetProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  hint?: string;
  disabled?: boolean;
}

export const PlayerCountWidget: React.FC<PlayerCountWidgetProps> = ({
  value,
  min,
  max,
  onChange,
  label = "Количество игроков",
  hint,
  disabled = false
}) => {
  const handleDecrement = () => {
    if (value > min && !disabled) {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value < max && !disabled) {
      onChange(value + 1);
    }
  };

  return (
    <div className="player-count-widget">
      {label && <h3 className="widget-label">{label}</h3>}
      
      <div className="player-count-controls">
        <button 
          onClick={handleDecrement}
          className="count-button"
          disabled={value <= min || disabled}
          aria-label="Уменьшить количество игроков"
        >
          −
        </button>
        
        <span className="player-count" aria-label={`${value} игроков`}>
          {value}
        </span>
        
        <button 
          onClick={handleIncrement}
          className="count-button"
          disabled={value >= max || disabled}
          aria-label="Увеличить количество игроков"
        >
          +
        </button>
      </div>
      
      {hint && (
        <p className="player-count-hint">{hint}</p>
      )}
    </div>
  );
};