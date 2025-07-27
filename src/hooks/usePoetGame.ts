import { useState, useCallback } from 'react';
import type { 
  PoetGameState, 
  PoetPlayer, 
  PoetSettings,
  PoetTask
} from '../types/poet';
import { POET_FIRST_LINES } from '../data/poet-lines';

export const usePoetGame = () => {
  const [gameState, setGameState] = useState<PoetGameState>({
    phase: 'setup',
    players: [],
    settings: {
      roundsCount: 10,
      categories: ['life', 'love', 'nature', 'wisdom', 'humor'],
      difficulty: ['easy', 'medium'],
      pointsForSuccess: 1,
      pointsForFailure: 0
    },
    currentRound: 0,
    currentPlayerIndex: 0,
    currentFirstLine: null,
    completedTasks: [],
    leaderboard: []
  });

  const startNewGame = useCallback((players: PoetPlayer[], settings: PoetSettings) => {
    const resetPlayers = players.map(player => ({
      ...player,
      score: 0,
      completed: 0,
      failed: 0
    }));

    // Выбираем первую строку для первого хода
    const filteredLines = POET_FIRST_LINES.filter(line =>
      settings.categories.includes(line.category) &&
      settings.difficulty.includes(line.difficulty)
    );
    const randomLine = filteredLines[Math.floor(Math.random() * filteredLines.length)];

    setGameState({
      phase: 'playing',
      players: resetPlayers,
      settings,
      currentRound: 1,
      currentPlayerIndex: 0,
      currentFirstLine: randomLine,
      completedTasks: [],
      leaderboard: resetPlayers
    });
  }, []);


  const confirmTask = useCallback((success: boolean) => {
    setGameState(prev => {
      if (!prev.currentFirstLine || prev.phase !== 'playing') return prev;

      const currentPlayer = prev.players[prev.currentPlayerIndex];
      if (!currentPlayer) return prev;

      // Создаем новую задачу
      const newTask: PoetTask = {
        id: `${currentPlayer.id}_${prev.currentRound}_${Date.now()}`,
        playerId: currentPlayer.id,
        playerName: currentPlayer.name,
        firstLine: prev.currentFirstLine.text,
        success,
        timestamp: Date.now(),
        round: prev.currentRound
      };

      // Обновляем статистику игрока
      const updatedPlayers = prev.players.map(player => 
        player.id === currentPlayer.id 
          ? { 
              ...player, 
              score: player.score + (success ? prev.settings.pointsForSuccess : prev.settings.pointsForFailure),
              completed: success ? player.completed + 1 : player.completed,
              failed: success ? player.failed : player.failed + 1
            }
          : player
      );

      const updatedTasks = [...prev.completedTasks, newTask];
      const nextPlayerIndex = (prev.currentPlayerIndex + 1) % prev.players.length;
      const isRoundComplete = nextPlayerIndex === 0;
      const nextRound = isRoundComplete ? prev.currentRound + 1 : prev.currentRound;
      const isGameComplete = nextRound > prev.settings.roundsCount;

      if (isGameComplete) {
        const leaderboard = [...updatedPlayers].sort((a, b) => b.score - a.score);
        return {
          ...prev,
          phase: 'completed',
          players: updatedPlayers,
          completedTasks: updatedTasks,
          leaderboard
        };
      }

      if (isRoundComplete) {
        const leaderboard = [...updatedPlayers].sort((a, b) => b.score - a.score);
        return {
          ...prev,
          phase: 'results',
          players: updatedPlayers,
          completedTasks: updatedTasks,
          currentRound: nextRound,
          leaderboard
        };
      }

      // Выбираем новую строку для следующего игрока
      const filteredLines = POET_FIRST_LINES.filter(line =>
        prev.settings.categories.includes(line.category) &&
        prev.settings.difficulty.includes(line.difficulty)
      );
      const randomLine = filteredLines[Math.floor(Math.random() * filteredLines.length)];

      return {
        ...prev,
        players: updatedPlayers,
        completedTasks: updatedTasks,
        currentPlayerIndex: nextPlayerIndex,
        currentFirstLine: randomLine
      };
    });
  }, []);

  const nextRound = useCallback(() => {
    setGameState(prev => {
      if (prev.phase !== 'results') return prev;

      // Выбираем новую строку для нового раунда
      const filteredLines = POET_FIRST_LINES.filter(line =>
        prev.settings.categories.includes(line.category) &&
        prev.settings.difficulty.includes(line.difficulty)
      );
      const randomLine = filteredLines[Math.floor(Math.random() * filteredLines.length)];

      return {
        ...prev,
        phase: 'playing',
        currentPlayerIndex: 0,
        currentFirstLine: randomLine
      };
    });
  }, []);





  const resetGame = useCallback(() => {
    setGameState({
      phase: 'setup',
      players: [],
      settings: {
        roundsCount: 10,
        categories: ['life', 'love', 'nature', 'wisdom', 'humor'],
        difficulty: ['easy', 'medium'],
        pointsForSuccess: 1,
        pointsForFailure: 0
      },
      currentRound: 0,
      currentPlayerIndex: 0,
      currentFirstLine: null,
      completedTasks: [],
      leaderboard: []
    });
  }, []);

  return {
    gameState,
    startNewGame,
    confirmTask,
    nextRound,
    resetGame
  };
};