import React, { useState } from 'react';
import { ROLE_INFO } from '../../data/mafiaRoles';
import type { MafiaGameState } from '../../types/mafia';

interface NightPhaseProps {
  gameState: MafiaGameState;
  onSetNightAction: (action: 'mafia' | 'doctor' | 'detective', targetId: string) => void;
  onContinueToDay: () => void;
}

export const NightPhase: React.FC<NightPhaseProps> = ({ 
  gameState, 
  onSetNightAction, 
  onContinueToDay 
}) => {
  const [currentRole, setCurrentRole] = useState<'mafia' | 'doctor' | 'detective' | null>('mafia');
  
  const alivePlayers = gameState.players.filter(p => p.isAlive && p.role !== 'moderator');
  const aliveNonMafia = alivePlayers.filter(p => p.role !== 'mafia');
  
  const mafiaPlayers = alivePlayers.filter(p => p.role === 'mafia');
  const doctorPlayer = alivePlayers.find(p => p.role === 'doctor');
  const detectivePlayer = alivePlayers.find(p => p.role === 'detective');

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlayerSelect = (playerId: string) => {
    if (currentRole) {
      onSetNightAction(currentRole, playerId);
    }
  };

  const getCurrentRoleInfo = () => {
    if (!currentRole) return null;
    return ROLE_INFO[currentRole];
  };

  const getAvailableTargets = () => {
    if (!currentRole) return [];
    
    switch (currentRole) {
      case 'mafia':
        return aliveNonMafia;
      case 'doctor':
      case 'detective':
        return alivePlayers.filter(p => p.role !== currentRole);
      default:
        return [];
    }
  };

  const getActionText = () => {
    switch (currentRole) {
      case 'mafia':
        return 'Выберите цель для убийства';
      case 'doctor':
        return 'Выберите игрока для защиты';
      case 'detective':
        return 'Выберите игрока для проверки';
      default:
        return '';
    }
  };

  const hasSelectedAction = (role: 'mafia' | 'doctor' | 'detective') => {
    return Boolean(gameState.nightActions[`${role}Target`]);
  };

  const allActionsComplete = () => {
    const requiredActions: ('mafia' | 'doctor' | 'detective')[] = ['mafia'];
    
    if (doctorPlayer) requiredActions.push('doctor');
    if (detectivePlayer) requiredActions.push('detective');
    
    return requiredActions.every(role => hasSelectedAction(role));
  };

  return (
    <div className="night-phase">
      <div className="night-header">
        <h2>🌙 Ночь {gameState.currentRound}</h2>
        {gameState.timeRemaining > 0 && (
          <div className="timer">{formatTime(gameState.timeRemaining)}</div>
        )}
      </div>

      <div className="role-selector">
        <h3>Выберите роль для действия:</h3>
        <div className="role-buttons">
          {mafiaPlayers.length > 0 && (
            <button
              className={`role-button ${currentRole === 'mafia' ? 'active' : ''} ${hasSelectedAction('mafia') ? 'completed' : ''}`}
              onClick={() => setCurrentRole('mafia')}
            >
              🕴️ Мафия {hasSelectedAction('mafia') ? '✓' : ''}
            </button>
          )}
          
          {doctorPlayer && (
            <button
              className={`role-button ${currentRole === 'doctor' ? 'active' : ''} ${hasSelectedAction('doctor') ? 'completed' : ''}`}
              onClick={() => setCurrentRole('doctor')}
            >
              👨‍⚕️ Доктор {hasSelectedAction('doctor') ? '✓' : ''}
            </button>
          )}
          
          {detectivePlayer && (
            <button
              className={`role-button ${currentRole === 'detective' ? 'active' : ''} ${hasSelectedAction('detective') ? 'completed' : ''}`}
              onClick={() => setCurrentRole('detective')}
            >
              🕵️ Детектив {hasSelectedAction('detective') ? '✓' : ''}
            </button>
          )}
        </div>
      </div>

      {currentRole && (
        <div className="action-section">
          <div className="current-role-info">
            <h4>{getCurrentRoleInfo()?.name}</h4>
            <p>{getActionText()}</p>
          </div>

          <div className="player-grid">
            {getAvailableTargets().map((player) => (
              <button
                key={player.id}
                className={`player-card ${gameState.nightActions[`${currentRole}Target`] === player.id ? 'selected' : ''}`}
                onClick={() => handlePlayerSelect(player.id)}
              >
                <span className="player-name">{player.name}</span>
                <span className="player-role-indicator">
                  {ROLE_INFO[player.role].emoji}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {allActionsComplete() && (
        <button className="continue-button" onClick={onContinueToDay}>
          Перейти к дню
        </button>
      )}
    </div>
  );
};