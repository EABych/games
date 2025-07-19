import React, { useState } from 'react';
import type { ThisOrThatGameState, ThisOrThatAnswer } from '../../types/this-or-that';
import { THIS_OR_THAT_CATEGORY_INFO, THIS_OR_THAT_INTENSITY_INFO } from '../../types/this-or-that';

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
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="progress-text">
            {gameState.currentQuestionIndex + 1} / {gameState.questions.length}
          </span>
        </div>

        <div className="question-info">
          <span 
            className="category-badge"
            style={{ backgroundColor: THIS_OR_THAT_CATEGORY_INFO[currentQuestion.category].color }}
          >
            {THIS_OR_THAT_CATEGORY_INFO[currentQuestion.category].emoji} {THIS_OR_THAT_CATEGORY_INFO[currentQuestion.category].name}
          </span>
          <span 
            className="intensity-badge"
            style={{ backgroundColor: THIS_OR_THAT_INTENSITY_INFO[currentQuestion.intensity].color }}
          >
            {THIS_OR_THAT_INTENSITY_INFO[currentQuestion.intensity].name}
          </span>
        </div>
      </div>

      {!showResults ? (
        <div className="question-section">
          <div className="current-player">
            <h2>Ходит: <span className="player-highlight">{currentPlayer?.name}</span></h2>
            <p className="turn-instruction">Выберите один из вариантов</p>
          </div>

          <div className="question-container">
            {questionParts.isChoice ? (
              <div className="choice-question">
                <h1 className="question-title">Что вы выберете?</h1>
                <div className="choices">
                  <button 
                    className="choice-btn this-choice"
                    onClick={() => handleAnswer('this')}
                    disabled={hasAnswered}
                  >
                    <span className="choice-label">ЭТО</span>
                    <span className="choice-text">{questionParts.this}</span>
                  </button>
                  
                  <div className="or-divider">ИЛИ</div>
                  
                  <button 
                    className="choice-btn that-choice"
                    onClick={() => handleAnswer('that')}
                    disabled={hasAnswered}
                  >
                    <span className="choice-label">ТО</span>
                    <span className="choice-text">{questionParts.that}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="single-question">
                <h1 className="question-text">{currentQuestion.question}</h1>
                <div className="answer-buttons">
                  <button 
                    className="answer-btn agree-btn"
                    onClick={() => handleAnswer('this')}
                    disabled={hasAnswered}
                  >
                    Да / Согласен
                  </button>
                  <button 
                    className="answer-btn disagree-btn"
                    onClick={() => handleAnswer('that')}
                    disabled={hasAnswered}
                  >
                    Нет / Не согласен
                  </button>
                </div>
              </div>
            )}
          </div>

          {gameState.settings.allowSkip && (
            <button 
              className="skip-btn"
              onClick={handleSkip}
              disabled={hasAnswered}
            >
              🤐 Пропустить вопрос
            </button>
          )}

          {hasAnswered && (
            <div className="waiting-message">
              <p>Ждём ответов других участников...</p>
            </div>
          )}
        </div>
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

          <button 
            className="next-question-btn"
            onClick={handleNextQuestion}
          >
            {gameState.currentQuestionIndex < gameState.questions.length - 1 
              ? 'Следующий вопрос' 
              : 'Завершить игру'
            }
          </button>
        </div>
      )}
    </div>
  );
};