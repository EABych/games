import { useState, useCallback } from 'react';
import type { FantGameState, FantPlayer, FantSettings } from '../types/fants';
import { DEFAULT_FANT_SETTINGS } from '../types/fants';
import { getRandomFant } from '../data/fants';

const initialState: FantGameState = {
  phase: 'setup',
  players: [],
  currentPlayerIndex: 0,
  currentFant: null,
  usedFants: [],
  settings: DEFAULT_FANT_SETTINGS,
  totalFants: 0
};

export const useFantsGame = () => {
  const [gameState, setGameState] = useState<FantGameState>(initialState);

  const startNewGame = useCallback((players: FantPlayer[], settings: FantSettings) => {
    const totalFants = players.length * settings.fantsPerPlayer;
    const firstFant = getRandomFant([], settings);
    
    setGameState({
      ...initialState,
      phase: 'playing',
      players,
      settings,
      totalFants,
      currentFant: firstFant,
      usedFants: firstFant ? [firstFant.id] : []
    });
  }, []);

  const completeFant = useCallback(() => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex].completedFants += 1;
      
      return {
        ...prev,
        players: updatedPlayers
      };
    });
    nextPlayer();
  }, []);

  const skipFant = useCallback(() => {
    setGameState(prev => {
      const updatedPlayers = [...prev.players];
      updatedPlayers[prev.currentPlayerIndex].skippedFants += 1;
      
      return {
        ...prev,
        players: updatedPlayers
      };
    });
    nextPlayer();
  }, []);

  const nextPlayer = useCallback(() => {
    setGameState(prev => {
      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      
      // Check if we've completed all fants
      const totalCompleted = prev.players.reduce((sum, player) => sum + player.completedFants + player.skippedFants, 0) + 1;
      const isGameComplete = totalCompleted >= prev.totalFants;
      
      if (isGameComplete) {
        return {
          ...prev,
          phase: 'completed',
          currentPlayerIndex: nextPlayerIndex
        };
      }
      
      // Get next fant
      const nextFant = getRandomFant(prev.usedFants, prev.settings);
      
      return {
        ...prev,
        currentPlayerIndex: nextPlayerIndex,
        currentFant: nextFant,
        usedFants: nextFant ? [...prev.usedFants, nextFant.id] : prev.usedFants
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
  }, []);

  const addPlayer = useCallback((name: string) => {
    const newPlayer: FantPlayer = {
      id: Date.now().toString(),
      name,
      completedFants: 0,
      skippedFants: 0
    };
    
    setGameState(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  }, []);

  const removePlayer = useCallback((playerId: string) => {
    setGameState(prev => ({
      ...prev,
      players: prev.players.filter(player => player.id !== playerId)
    }));
  }, []);

  const updateSettings = useCallback((newSettings: FantSettings) => {
    setGameState(prev => ({
      ...prev,
      settings: newSettings
    }));
  }, []);

  return {
    gameState,
    startNewGame,
    completeFant,
    skipFant,
    resetGame,
    addPlayer,
    removePlayer,
    updateSettings
  };
};