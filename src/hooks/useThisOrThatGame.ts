import { useState, useCallback } from 'react';
import type { 
  ThisOrThatGameState, 
  ThisOrThatPlayer, 
  ThisOrThatSettings, 
  ThisOrThatQuestion,
  ThisOrThatAnswer 
} from '../types/this-or-that';
import { THIS_OR_THAT_QUESTIONS } from '../data/this-or-that-questions';

export const useThisOrThatGame = () => {
  const [gameState, setGameState] = useState<ThisOrThatGameState>({
    phase: 'setup',
    players: [],
    currentQuestionIndex: 0,
    questions: [],
    settings: {
      questionsCount: 20,
      categories: ['philosophy', 'psychology', 'ethics', 'relationships'],
      intensities: ['mild', 'medium'],
      allowSkip: true,
      showResults: true
    },
    completedQuestions: []
  });

  const startNewGame = useCallback((players: ThisOrThatPlayer[], settings: ThisOrThatSettings) => {
    // Фильтруем вопросы по настройкам
    const filteredQuestions = THIS_OR_THAT_QUESTIONS.filter(question =>
      settings.categories.includes(question.category) &&
      settings.intensities.includes(question.intensity)
    );

    // Перемешиваем и выбираем нужное количество вопросов
    const shuffledQuestions = [...filteredQuestions].sort(() => Math.random() - 0.5);
    const selectedQuestions = shuffledQuestions.slice(0, settings.questionsCount);

    setGameState({
      phase: 'playing',
      players: players.map(player => ({ ...player, answers: [] })),
      currentQuestionIndex: 0,
      questions: selectedQuestions,
      settings,
      completedQuestions: []
    });
  }, []);

  const addAnswer = useCallback((playerId: string, choice: 'this' | 'that') => {
    setGameState(prev => {
      const currentQuestion = prev.questions[prev.currentQuestionIndex];
      if (!currentQuestion) return prev;

      const newAnswer: ThisOrThatAnswer = {
        questionId: currentQuestion.id,
        choice,
        timestamp: Date.now()
      };

      return {
        ...prev,
        players: prev.players.map(player =>
          player.id === playerId
            ? {
                ...player,
                answers: [...player.answers.filter(a => a.questionId !== currentQuestion.id), newAnswer]
              }
            : player
        )
      };
    });
  }, []);

  const skipQuestion = useCallback((playerId: string) => {
    // Пропуск означает, что игрок не добавляет ответ для этого вопроса
    // Ничего не делаем, просто позволяем игре продолжиться
  }, []);

  const nextQuestion = useCallback(() => {
    setGameState(prev => {
      const nextIndex = prev.currentQuestionIndex + 1;
      
      if (nextIndex >= prev.questions.length) {
        // Игра завершена
        return {
          ...prev,
          phase: 'completed'
        };
      }

      return {
        ...prev,
        currentQuestionIndex: nextIndex,
        completedQuestions: [...prev.completedQuestions, prev.questions[prev.currentQuestionIndex].id]
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      phase: 'setup',
      players: [],
      currentQuestionIndex: 0,
      questions: [],
      completedQuestions: []
    }));
  }, []);

  return {
    gameState,
    startNewGame,
    addAnswer,
    skipQuestion,
    nextQuestion,
    resetGame
  };
};