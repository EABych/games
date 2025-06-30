import React, { useState } from 'react';
import { ROLE_INFO } from '../../data/mafiaRoles';
import type { MafiaPlayer } from '../../types/mafia';

interface RoleRevealProps {
  players: MafiaPlayer[];
  onContinue: () => void;
}

export const RoleReveal: React.FC<RoleRevealProps> = ({ players, onContinue }) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [isRoleRevealed, setIsRoleRevealed] = useState(false);

  const currentPlayer = players[currentPlayerIndex];
  const roleInfo = ROLE_INFO[currentPlayer.role];

  const handleRevealRole = () => {
    setIsRoleRevealed(true);
  };

  const handleNext = () => {
    if (currentPlayerIndex < players.length - 1) {
      setCurrentPlayerIndex(currentPlayerIndex + 1);
      setIsRoleRevealed(false);
    } else {
      onContinue();
    }
  };

  return (
    <div className="role-reveal">
      <div className="role-reveal-card">
        <div className="player-info">
          <h2>{currentPlayer.name}</h2>
          <p>Игрок {currentPlayerIndex + 1} из {players.length}</p>
        </div>

        {!isRoleRevealed ? (
          <div className="role-hidden">
            <div className="role-card-back">
              <span className="role-icon">🎭</span>
              <p>Нажмите, чтобы узнать свою роль</p>
            </div>
            <button className="reveal-button" onClick={handleRevealRole}>
              Узнать роль
            </button>
          </div>
        ) : (
          <div className="role-revealed">
            <div 
              className="role-card"
              style={{ 
                backgroundColor: roleInfo.color,
                '--role-color': roleInfo.color 
              } as React.CSSProperties}
            >
              <div className="role-icon">{roleInfo.emoji}</div>
              <h3>{roleInfo.name}</h3>
              <p>{roleInfo.description}</p>
              <div className="team-indicator">
                Команда: {roleInfo.team === 'mafia' ? 'Мафия' : 'Мирные жители'}
              </div>
            </div>
            <button className="next-button" onClick={handleNext}>
              {currentPlayerIndex < players.length - 1 ? 'Следующий игрок' : 'Начать игру'}
            </button>
          </div>
        )}

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentPlayerIndex + 1) / players.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};