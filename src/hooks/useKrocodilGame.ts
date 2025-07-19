import { useState, useCallback, useEffect, useRef } from 'react';
import type { 
  KrocodilGameState, 
  KrocodilTeam, 
  KrocodilPlayer, 
  KrocodilSettings 
} from '../types/krocodil';
import { DEFAULT_KROCODIL_SETTINGS } from '../types/krocodil';
import { getRandomKrocodilWord } from '../data/krocodilWords';

const initialState: KrocodilGameState = {
  phase: 'setup',
  teams: [],
  players: [],
  currentTeamIndex: 0,
  currentPlayerIndex: 0,
  currentWord: null,
  usedWords: [],
  settings: DEFAULT_KROCODIL_SETTINGS,
  roundTimeLeft: 0,
  currentRound: 1,
  isTimerRunning: false
};

export const useKrocodilGame = () => {
  const [gameState, setGameState] = useState<KrocodilGameState>(initialState);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startNewGame = useCallback((teams: KrocodilTeam[], players: KrocodilPlayer[], settings: KrocodilSettings) => {
    const firstWord = getRandomKrocodilWord([], settings);
    
    setGameState({
      ...initialState,
      phase: 'playing',
      teams,
      players,
      settings,
      currentWord: firstWord,
      usedWords: firstWord ? [firstWord.id] : [],
      roundTimeLeft: settings.roundTime,
      currentRound: 1,
      isTimerRunning: true
    });
  }, []);



  const guessWord = useCallback(() => {
    setGameState(prev => {
      const updatedTeams = [...prev.teams];
      const currentTeam = updatedTeams[prev.currentTeamIndex];
      
      currentTeam.score += 1;
      currentTeam.guessedWords += 1;
      
      // Check if team won
      const isGameWon = currentTeam.score >= prev.settings.pointsToWin;
      
      if (isGameWon) {
        return {
          ...prev,
          teams: updatedTeams,
          phase: 'completed',
          isTimerRunning: false
        };
      }
      
      // Get next word
      const nextWord = getRandomKrocodilWord(prev.usedWords, prev.settings);
      
      return {
        ...prev,
        teams: updatedTeams,
        currentWord: nextWord,
        usedWords: nextWord ? [...prev.usedWords, nextWord.id] : prev.usedWords
      };
    });
  }, []);

  const skipWord = useCallback(() => {
    setGameState(prev => {
      const updatedTeams = [...prev.teams];
      updatedTeams[prev.currentTeamIndex].skippedWords += 1;
      
      // Get next word
      const nextWord = getRandomKrocodilWord(prev.usedWords, prev.settings);
      
      return {
        ...prev,
        teams: updatedTeams,
        currentWord: nextWord,
        usedWords: nextWord ? [...prev.usedWords, nextWord.id] : prev.usedWords
      };
    });
  }, []);

  const endRound = useCallback(() => {
    setGameState(prev => {
      const nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;
      const nextPlayerIndex = nextTeamIndex === 0 ? prev.currentPlayerIndex + 1 : prev.currentPlayerIndex;
      
      // Check if we need to go to next round or end game
      const isNewRound = nextTeamIndex === 0;
      const maxScore = Math.max(...prev.teams.map(team => team.score));
      
      // If someone reached the target score, end the game
      if (maxScore >= prev.settings.pointsToWin) {
        return {
          ...prev,
          phase: 'completed',
          isTimerRunning: false
        };
      }
      
      const nextWord = getRandomKrocodilWord(prev.usedWords, prev.settings);
      
      return {
        ...prev,
        phase: 'roundEnd',
        currentTeamIndex: nextTeamIndex,
        currentPlayerIndex: nextPlayerIndex,
        currentWord: nextWord,
        usedWords: nextWord ? [...prev.usedWords, nextWord.id] : prev.usedWords,
        roundTimeLeft: prev.settings.roundTime,
        currentRound: isNewRound ? prev.currentRound + 1 : prev.currentRound,
        isTimerRunning: false
      };
    });
  }, []);

  const startNextRound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'playing',
      roundTimeLeft: prev.settings.roundTime,
      isTimerRunning: true
    }));
  }, []);

  const resetGame = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setGameState(initialState);
  }, []);

  const addTeam = useCallback((name: string, players: string[]) => {
    const newTeam: KrocodilTeam = {
      id: Date.now().toString(),
      name,
      players,
      score: 0,
      guessedWords: 0,
      skippedWords: 0
    };
    
    setGameState(prev => ({
      ...prev,
      teams: [...prev.teams, newTeam]
    }));
  }, []);

  const removeTeam = useCallback((teamId: string) => {
    setGameState(prev => ({
      ...prev,
      teams: prev.teams.filter(team => team.id !== teamId)
    }));
  }, []);

  const addPlayer = useCallback((name: string, teamId: string) => {
    const newPlayer: KrocodilPlayer = {
      id: Date.now().toString(),
      name,
      teamId
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

  const updateSettings = useCallback((newSettings: KrocodilSettings) => {
    setGameState(prev => ({
      ...prev,
      settings: newSettings
    }));
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.isTimerRunning && gameState.roundTimeLeft > 0) {
      timerRef.current = setInterval(() => {
        setGameState(prev => {
          if (prev.roundTimeLeft <= 1) {
            return {
              ...prev,
              roundTimeLeft: 0,
              isTimerRunning: false
            };
          }
          return {
            ...prev,
            roundTimeLeft: prev.roundTimeLeft - 1
          };
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [gameState.isTimerRunning, gameState.roundTimeLeft]);

  // Auto end round when time is up
  useEffect(() => {
    if (gameState.roundTimeLeft === 0 && gameState.phase === 'playing') {
      endRound();
    }
  }, [gameState.roundTimeLeft, gameState.phase, endRound]);

  return {
    gameState,
    startNewGame,
    guessWord,
    skipWord,
    endRound,
    startNextRound,
    resetGame,
    addTeam,
    removeTeam,
    addPlayer,
    removePlayer,
    updateSettings
  };
};