import { useState, useCallback, useEffect, useRef } from 'react';
import type { MafiaGameState, MafiaPlayer, MafiaSettings } from '../types/mafia';
import { DEFAULT_MAFIA_SETTINGS } from '../types/mafia';
import { getOptimalRoleDistribution, shuffleRoles } from '../data/mafiaRoles';

const initialState: MafiaGameState = {
  phase: 'setup',
  players: [],
  currentRound: 1,
  timeRemaining: 0,
  nightActions: {},
  votingResults: {},
  winner: null,
  settings: DEFAULT_MAFIA_SETTINGS
};

export const useMafiaGame = () => {
  const [gameState, setGameState] = useState<MafiaGameState>(initialState);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNewGame = useCallback((playerNames: string[], settings: Partial<MafiaSettings> = {}) => {
    const finalSettings = { ...DEFAULT_MAFIA_SETTINGS, ...settings };
    const roles = getOptimalRoleDistribution(
      playerNames.length, 
      finalSettings.enableDoctor, 
      finalSettings.enableDetective
    );
    const shuffledRoles = shuffleRoles(roles);

    const players: MafiaPlayer[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      role: shuffledRoles[index],
      isAlive: true,
      isRevealed: false,
      votes: 0
    }));

    setGameState({
      ...initialState,
      players,
      settings: finalSettings,
      phase: 'night',
      timeRemaining: 0, // Первая ночь без таймера для ознакомления с ролями
    });
  }, []);

  const startNightPhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'night',
      timeRemaining: 60, // 1 минута на ночные действия
      nightActions: {}
    }));
  }, []);

  const startDiscussionPhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'discussion',
      timeRemaining: prev.settings.discussionTime,
      votingResults: {}
    }));
  }, []);

  const startVotingPhase = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'voting',
      timeRemaining: prev.settings.votingTime,
      votingResults: {}
    }));
  }, []);

  const setNightAction = useCallback((action: 'mafia' | 'doctor' | 'detective', targetId: string) => {
    setGameState(prev => ({
      ...prev,
      nightActions: {
        ...prev.nightActions,
        [`${action}Target`]: targetId
      }
    }));
  }, []);

  const processNightActions = useCallback(() => {
    setGameState(prev => {
      const { mafiaTarget, doctorTarget } = prev.nightActions;
      let newPlayers = [...prev.players];

      // Мафия убивает
      if (mafiaTarget && mafiaTarget !== doctorTarget) {
        newPlayers = newPlayers.map(player => 
          player.id === mafiaTarget 
            ? { ...player, isAlive: false }
            : player
        );
      }

      return {
        ...prev,
        players: newPlayers,
        currentRound: prev.currentRound + 1
      };
    });
  }, []);

  const voteForPlayer = useCallback((targetId: string) => {
    setGameState(prev => ({
      ...prev,
      votingResults: {
        ...prev.votingResults,
        [targetId]: (prev.votingResults[targetId] || 0) + 1
      }
    }));
  }, []);

  const processVoting = useCallback(() => {
    setGameState(prev => {
      const votes = prev.votingResults;
      const maxVotes = Math.max(...Object.values(votes));
      const playersWithMaxVotes = Object.keys(votes).filter(id => votes[id] === maxVotes);

      let newPlayers = [...prev.players];

      // Если есть явный лидер по голосам, исключаем его
      if (playersWithMaxVotes.length === 1 && maxVotes > 0) {
        const eliminatedId = playersWithMaxVotes[0];
        newPlayers = newPlayers.map(player => 
          player.id === eliminatedId 
            ? { ...player, isAlive: false, isRevealed: true }
            : player
        );
      }

      return {
        ...prev,
        players: newPlayers,
        votingResults: {}
      };
    });
  }, []);

  const checkWinCondition = useCallback(() => {
    setGameState(prev => {
      const alivePlayers = prev.players.filter(p => p.isAlive && p.role !== 'moderator');
      const aliveMafia = alivePlayers.filter(p => p.role === 'mafia');
      const aliveCitizens = alivePlayers.filter(p => p.role !== 'mafia');

      let winner: 'mafia' | 'citizens' | null = null;

      if (aliveMafia.length === 0) {
        winner = 'citizens';
      } else if (aliveMafia.length >= aliveCitizens.length) {
        winner = 'mafia';
      }

      return {
        ...prev,
        winner,
        phase: winner ? 'gameEnd' : prev.phase
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  // Таймер
  useEffect(() => {
    if (gameState.timeRemaining > 0 && ['night', 'discussion', 'voting'].includes(gameState.phase)) {
      intervalRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.timeRemaining <= 1) {
            // Время вышло, переходим к следующей фазе
            if (prev.phase === 'night') {
              processNightActions();
              return { ...prev, timeRemaining: 0 };
            } else if (prev.phase === 'discussion') {
              return { ...prev, timeRemaining: 0 };
            } else if (prev.phase === 'voting') {
              processVoting();
              return { ...prev, timeRemaining: 0 };
            }
          }
          return { ...prev, timeRemaining: prev.timeRemaining - 1 };
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [gameState.timeRemaining, gameState.phase, processNightActions, processVoting]);

  // Проверка условий победы после каждого изменения игроков
  useEffect(() => {
    if (gameState.phase !== 'setup' && gameState.phase !== 'gameEnd') {
      checkWinCondition();
    }
  }, [gameState.players, gameState.phase, checkWinCondition]);

  return {
    gameState,
    startNewGame,
    startNightPhase,
    startDiscussionPhase,
    startVotingPhase,
    setNightAction,
    voteForPlayer,
    processNightActions,
    processVoting,
    resetGame,
    setGameState
  };
};