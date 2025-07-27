import React, { useState } from 'react';
import type { ThisOrThatGameState } from '../../types/this-or-that';
import { THIS_OR_THAT_CATEGORY_INFO } from '../../types/this-or-that';
import './ThisOrThat.css';

interface ThisOrThatGameProps {
  gameState: ThisOrThatGameState;
  onAnswer: (playerId: string, choice: 'this' | 'that') => void;
  onSkip: (playerId: string) => void;
  onNextQuestion: () => void;
}

export const ThisOrThatGame: React.FC<ThisOrThatGameProps> = ({
  gameState,
  onAnswer,
  onSkip,
  onNextQuestion
}) => {
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  
  const currentQuestion = gameState.questions[gameState.currentQuestionIndex];
  const currentPlayer = gameState.players[currentPlayerIndex];
  const progress = ((gameState.currentQuestionIndex + 1) / gameState.questions.length) * 100;
  
  // Проверяем, ответил ли текущий игрок на текущий вопрос
  const hasAnswered = currentPlayer?.answers.some(answer => 
    answer.questionId === currentQuestion?.id
  );

  const handleAnswer = (choice: 'this' | 'that') => {
    if (!hasAnswered && currentPlayer && currentQuestion) {
      onAnswer(currentPlayer.id, choice);
      
      // Переходим к следующему игроку
      if (currentPlayerIndex < gameState.players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
        // Все игроки ответили, показываем результаты
        setShowResults(true);
      }
    }
  };

  const handleSkip = () => {
    if (!hasAnswered && currentPlayer && currentQuestion && gameState.settings.allowSkip) {
      onSkip(currentPlayer.id);
      
      // Переходим к следующему игроку
      if (currentPlayerIndex < gameState.players.length - 1) {
        setCurrentPlayerIndex(currentPlayerIndex + 1);
      } else {
        // Все игроки ответили, показываем результаты
        setShowResults(true);
      }
    }
  };

  const handleNextQuestion = () => {
    setCurrentPlayerIndex(0);
    setShowResults(false);
    onNextQuestion();
  };

  const getAnswerStats = () => {
    if (!currentQuestion) return { this: 0, that: 0, skip: 0 };
    
    const answers = gameState.players.flatMap(player => 
      player.answers.filter(answer => answer.questionId === currentQuestion.id)
    );
    
    return {
      this: answers.filter(answer => answer.choice === 'this').length,
      that: answers.filter(answer => answer.choice === 'that').length,
      skip: gameState.players.length - answers.length
    };
  };

  const formatQuestion = (question: string) => {
    // Разделяем вопрос на две части по ключевым словам
    const orRegex = /\s+или\s+/i;
    const parts = question.split(orRegex);
    
    if (parts.length === 2) {
      return {
        this: parts[0].trim(),
        that: parts[1].trim().replace(/\?$/, ''),
        isChoice: true
      };
    }
    
    return {
      this: question,
      that: '',
      isChoice: false
    };
  };

  if (!currentQuestion) {
    return (
      <div className="this-or-that-game">
        <div className="no-questions">
          <h2>Вопросы закончились!</h2>
          <p>Возможно, нужно изменить настройки категорий или интенсивности</p>
        </div>
      </div>
    );
  }

  const questionParts = formatQuestion(currentQuestion.question);
  const stats = getAnswerStats();

  return (
    <div className="this-or-that-game">
      <div className="game-header">
        <div className="progress-info">
          Вопрос {gameState.currentQuestionIndex + 1} из {gameState.questions.length}
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="current-player">
          Ходит: {currentPlayer?.name}
        </div>
      </div>

      {!showResults ? (
        <>
        <div className="question-card">
          <div className="question-content">
            <div className="question-category">
              {THIS_OR_THAT_CATEGORY_INFO[currentQuestion.category].name}
            </div>
            
            {questionParts.isChoice ? (
              <>
                <div className="question-text">
                  Что вы выберете?
                </div>
                <div className="choices-container">
                  <button 
                    className="choice-btn option-a"
                    onClick={() => handleAnswer('this')}
                    disabled={hasAnswered}
                  >
                    {questionParts.this}
                  </button>
                  
                  <button 
                    className="choice-btn option-b"
                    onClick={() => handleAnswer('that')}
                    disabled={hasAnswered}
                  >
                    {questionParts.that}
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="question-text">{currentQuestion.question}</div>
                <div className="choices-container">
                  <button 
                    className="choice-btn option-a"
                    onClick={() => handleAnswer('this')}
                    disabled={hasAnswered}
                  >
                    Да / Согласен
                  </button>
                  <button 
                    className="choice-btn option-b"
                    onClick={() => handleAnswer('that')}
                    disabled={hasAnswered}
                  >
                    Нет / Не согласен
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {gameState.settings.allowSkip && (
          <div className="skip-section">
            <button 
              className="skip-btn"
              onClick={handleSkip}
              disabled={hasAnswered}
            >
              Пропустить вопрос
            </button>
          </div>
        )}
        </>
      ) : (
        <div className="question-results">
          <h2>Результаты вопроса</h2>
          
          <div className="question-display">
            <h3>{currentQuestion.question}</h3>
          </div>

          {gameState.settings.showResults && (
            <div className="answer-stats">
              <div className="stat-bar">
                <div className="stat-item this-stat">
                  <span className="stat-label">
                    {questionParts.isChoice ? questionParts.this : 'Да / Согласен'}
                  </span>
                  <div className="stat-visual">
                    <div 
                      className="stat-fill this-fill" 
                      style={{ width: `${(stats.this / gameState.players.length) * 100}%` }}
                    />
                    <span className="stat-count">{stats.this}</span>
                  </div>
                </div>
                
                <div className="stat-item that-stat">
                  <span className="stat-label">
                    {questionParts.isChoice ? questionParts.that : 'Нет / Не согласен'}
                  </span>
                  <div className="stat-visual">
                    <div 
                      className="stat-fill that-fill" 
                      style={{ width: `${(stats.that / gameState.players.length) * 100}%` }}
                    />
                    <span className="stat-count">{stats.that}</span>
                  </div>
                </div>

                {stats.skip > 0 && (
                  <div className="stat-item skip-stat">
                    <span className="stat-label">Пропустили</span>
                    <div className="stat-visual">
                      <div 
                        className="stat-fill skip-fill" 
                        style={{ width: `${(stats.skip / gameState.players.length) * 100}%` }}
                      />
                      <span className="stat-count">{stats.skip}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="end-actions">
            <button 
              className="new-game-btn"
              onClick={handleNextQuestion}
            >
              {gameState.currentQuestionIndex < gameState.questions.length - 1 
                ? 'Следующий вопрос' 
                : 'Завершить игру'
              }
            </button>
          </div>
        </div>
      )}
    </div>
  );
};