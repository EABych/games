import { useState, useCallback } from 'react';
import type { EveningRoleGameState, EveningRoleTask, EveningRoleSettings } from '../types/evening-role';
import { getRandomIndividualTask, getRandomGroupTask } from '../data/evening-role-tasks';

export const useEveningRoleGame = () => {
  const [gameState, setGameState] = useState<EveningRoleGameState>({
    players: [],
    isGameStarted: false,
    roomId: ''
  });

  const [settings, setSettings] = useState<EveningRoleSettings>({
    playerCount: 3,
    allowExplicitTasks: true
  });

  // Создание комнаты и генерация ID
  const createRoom = useCallback(() => {
    const roomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGameState(prev => ({
      ...prev,
      roomId,
      players: Array.from({ length: settings.playerCount }, (_, index) => ({
        id: `player_${index + 1}`,
        name: `Игрок ${index + 1}`,
        hasReceivedTask: false
      }))
    }));
    return roomId;
  }, [settings.playerCount]);

  // Начало игры с генерацией группового задания
  const startGame = useCallback(() => {
    const groupTask = getRandomGroupTask();
    
    setGameState(prev => ({
      ...prev,
      isGameStarted: true,
      groupTask
    }));
  }, []);

  // Выдача задания игроку
  const assignTaskToPlayer = useCallback((playerId: string): EveningRoleTask | null => {
    const task = getRandomIndividualTask();
    
    setGameState(prev => ({
      ...prev,
      players: prev.players.map(player => 
        player.id === playerId 
          ? { ...player, task, hasReceivedTask: true }
          : player
      )
    }));
    
    return task;
  }, []);

  // Генерация нового группового задания
  const generateNewGroupTask = useCallback(() => {
    const newGroupTask = getRandomGroupTask();
    
    setGameState(prev => ({
      ...prev,
      groupTask: newGroupTask
    }));
    
    return newGroupTask;
  }, []);

  // Сброс игры
  const resetGame = useCallback(() => {
    setGameState({
      players: [],
      isGameStarted: false,
      roomId: ''
    });
  }, []);

  // Обновление настроек
  const updateSettings = useCallback((newSettings: Partial<EveningRoleSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  // Получение игрока по ID
  const getPlayerById = useCallback((playerId: string) => {
    return gameState.players.find(player => player.id === playerId);
  }, [gameState.players]);

  // Проверка, получил ли игрок задание
  const hasPlayerReceivedTask = useCallback((playerId: string) => {
    const player = getPlayerById(playerId);
    return player?.hasReceivedTask || false;
  }, [getPlayerById]);

  // Получение статистики игры
  const getGameStats = useCallback(() => {
    const totalPlayers = gameState.players.length;
    const playersWithTasks = gameState.players.filter(p => p.hasReceivedTask).length;
    
    return {
      totalPlayers,
      playersWithTasks,
      hasGroupTask: !!gameState.groupTask,
      completionPercentage: totalPlayers > 0 ? Math.round((playersWithTasks / totalPlayers) * 100) : 0
    };
  }, [gameState.players, gameState.groupTask]);

  return {
    gameState,
    settings,
    createRoom,
    startGame,
    assignTaskToPlayer,
    generateNewGroupTask,
    resetGame,
    updateSettings,
    getPlayerById,
    hasPlayerReceivedTask,
    getGameStats
  };
};