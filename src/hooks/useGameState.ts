import { useState, useCallback, useEffect, useRef } from 'react';
import type { GameState, Team } from '../types';
import { DEFAULT_SETTINGS } from '../types';
import { getRandomWord } from '../data/words';

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

  const startNewGame = useCallback((teams: Team[], roundTime?: number, totalRounds?: number) => {
    const newSettings = { 
      ...DEFAULT_SETTINGS, 
      ...(roundTime && { roundTime }), 
      ...(totalRounds && { totalRounds }) 
    };
    setGameState({
      ...initialState,
      phase: 'playing',
      teams,
      currentWord: getRandomWord(),
      timer: newSettings.roundTime,
      settings: newSettings,
      currentRound: 1
    });
  }, []);

  const nextWord = useCallback((guessed: boolean) => {
    setGameState(prev => {
      const newScore = guessed ? prev.roundScore + 1 : prev.roundScore - 1;
      const newUsedWords = [...prev.usedWords, prev.currentWord];
      
      let newWord = getRandomWord();
      while (newUsedWords.includes(newWord)) {
        newWord = getRandomWord();
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
      
      // Check if this is the last team in the current round
      const isLastTeamInRound = prev.currentTeamIndex === prev.teams.length - 1;
      // Calculate the actual round number (how many complete cycles we've had)
      const actualRoundNumber = Math.floor(prev.currentRound / prev.teams.length) + (isLastTeamInRound ? 1 : 0);
      const isGameComplete = actualRoundNumber >= prev.settings.totalRounds;
      
      return {
        ...prev,
        phase: isGameComplete ? 'gameEnd' : 'roundEnd',
        teams: updatedTeams,
        timer: prev.settings.roundTime
      };
    });
  }, []);

  const nextTeam = useCallback(() => {
    setGameState(prev => {
      const nextTeamIndex = (prev.currentTeamIndex + 1) % prev.teams.length;
      const newRound = nextTeamIndex === 0 ? prev.currentRound + 1 : prev.currentRound;
      
      return {
        ...prev,
        phase: 'playing',
        currentTeamIndex: nextTeamIndex,
        currentWord: getRandomWord(),
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
          if (prev.timer <= 1) {
            endRound();
            return prev;
          }
          return { ...prev, timer: prev.timer - 1 };
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