import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, Team } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { getRandomWord } from '../data/words';
import type { GameSettings } from '../types';
import { vibrateWarning, playWarningSound, playTimeUpSound, vibrateTimeUp } from '../utils/notifications';

const initialState: GameState = {
  phase: 'menu',
  teams: [],
  currentTeamIndex: 0,
  currentWord: '',
  usedWords: [],
  timer: DEFAULT_SETTINGS.roundTime,
  roundScore: 0,
  settings: DEFAULT_SETTINGS,
  currentRound: 1
};

export const useGameState = () => {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const intervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warningTriggeredRef = useRef<boolean>(false);

  const startNewGame = useCallback((teams: Team[], gameSettings?: Partial<GameSettings>) => {
    const newSettings = { 
      ...DEFAULT_SETTINGS, 
      ...gameSettings
    };
    warningTriggeredRef.current = false;
    setGameState({
      ...initialState,
      phase: 'playing',
      teams,
      currentWord: getRandomWord(newSettings.difficulty),
      timer: newSettings.roundTime,
      settings: newSettings,
      currentRound: 1
    });
  }, []);

  const nextWord = useCallback((guessed: boolean) => {
    setGameState(prev => {
      const newScore = guessed ? prev.roundScore + 1 : prev.roundScore - 1;
      const newUsedWords = [...prev.usedWords, prev.currentWord];
      
      let newWord = getRandomWord(prev.settings.difficulty);
      while (newUsedWords.includes(newWord)) {
        newWord = getRandomWord(prev.settings.difficulty);
      }

      return {
        ...prev,
        currentWord: newWord,
        usedWords: newUsedWords,
        roundScore: newScore
      };
    });
  }, []);

  const endRound = useCallback(() => {
    setGameState(prev => {
      const updatedTeams = [...prev.teams];
      updatedTeams[prev.currentTeamIndex].score += Math.max(0, prev.roundScore);
      
      // Check if game is complete
      // currentRound tracks total turns, so we need to check if we've completed all rounds
      const turnsPerRound = prev.teams.length;
      const completedRounds = Math.floor((prev.currentRound - 1) / turnsPerRound);
      const isLastTeamInRound = (prev.currentRound % turnsPerRound) === 0;
      const isGameComplete = isLastTeamInRound && completedRounds >= prev.settings.totalRounds;
      
      return {
        ...prev,
        phase: isGameComplete ? 'gameEnd' : 'roundEnd',
        teams: updatedTeams,
        timer: prev.settings.roundTime
      };
    });
  }, []);

  const nextTeam = useCallback(() => {
    warningTriggeredRef.current = false;
    setGameState(prev => {
      const nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;
      // Increment currentRound for each turn
      const newRound = prev.currentRound + 1;
      
      return {
        ...prev,
        phase: 'playing',
        currentTeamIndex: nextTeamIndex,
        currentWord: getRandomWord(prev.settings.difficulty),
        usedWords: [],
        roundScore: 0,
        timer: prev.settings.roundTime,
        currentRound: newRound
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(initialState);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const skipWord = useCallback(() => {
    nextWord(false);
  }, [nextWord]);

  const guessWord = useCallback(() => {
    nextWord(true);
  }, [nextWord]);

  useEffect(() => {
    if (gameState.phase === 'playing' && gameState.timer > 0) {
      intervalRef.current = setInterval(() => {
        setGameState(prev => {
          const newTimer = prev.timer - 1;
          
          // Warning notification at 10 seconds
          if (newTimer === 10 && !warningTriggeredRef.current) {
            warningTriggeredRef.current = true;
            vibrateWarning();
            playWarningSound();
          }
          
          // Time up notification
          if (newTimer <= 0) {
            vibrateTimeUp();
            playTimeUpSound();
            endRound();
            return prev;
          }
          
          return { ...prev, timer: newTimer };
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
  }, [gameState.phase, gameState.timer, endRound]);

  return {
    gameState,
    startNewGame,
    skipWord,
    guessWord,
    nextTeam,
    resetGame,
    setGameState
  };
};