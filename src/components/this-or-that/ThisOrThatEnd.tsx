import React from 'react';
import type { ThisOrThatGameState } from '../../types/this-or-that';
import './ThisOrThat.css';

interface ThisOrThatEndProps {
  gameState: ThisOrThatGameState;
  onNewGame: () => void;
}

export const ThisOrThatEnd: React.FC<ThisOrThatEndProps> = ({ gameState, onNewGame }) => {
  const totalQuestions = gameState.questions.length;

  // Анализ ответов игроков
  const playerAnalysis = gameState.players.map(player => {
    const thisAnswers = player.answers.filter(answer => answer.choice === 'this').length;
    const thatAnswers = player.answers.filter(answer => answer.choice === 'that').length;
    const skipped = totalQuestions - player.answers.length;
    
    return {
      ...player,
      thisAnswers,
      thatAnswers,
      skipped,
      participationRate: Math.round((player.answers.length / totalQuestions) * 100)
    };
  });

  // Самые спорные вопросы (где мнения разделились)
  const controversialQuestions = gameState.questions
    .map(question => {
      const answers = gameState.players
        .flatMap(player => player.answers)
        .filter(answer => answer.questionId === question.id);
      
      const thisCount = answers.filter(a => a.choice === 'this').length;
      const thatCount = answers.filter(a => a.choice === 'that').length;
      const total = thisCount + thatCount;
      
      if (total === 0) return null;
      
      const balance = Math.abs(thisCount - thatCount) / total;
      
      return {
        question,
        thisCount,
        thatCount,
        balance, // чем меньше, тем спорнее
        total
      };
    })
    .filter(Boolean)
    .sort((a, b) => a!.balance - b!.balance)
    .slice(0, 3);

  // Единогласные вопросы
  const unanimousQuestions = gameState.questions
    .map(question => {
      const answers = gameState.players
        .flatMap(player => player.answers)
        .filter(answer => answer.questionId === question.id);
      
      const thisCount = answers.filter(a => a.choice === 'this').length;
      const thatCount = answers.filter(a => a.choice === 'that').length;
      const total = thisCount + thatCount;
      
      if (total === 0) return null;
      
      const isUnanimous = thisCount === 0 || thatCount === 0;
      
      return isUnanimous ? {
        question,
        thisCount,
        thatCount,
        choice: thisCount > 0 ? 'this' : 'that'
      } : null;
    })
    .filter(Boolean)
    .slice(0, 3);

  return (
    <div className="this-or-that-end">
      <div className="end-header">
        <h1>Игра завершена</h1>
        <div className="game-summary">
          <span className="summary-text">{totalQuestions} вопросов обсуждено</span>
        </div>
      </div>

      <div className="player-stats">
        <h2>Статистика участников</h2>
        <div className="stats-grid">
          {playerAnalysis.map((player) => (
            <div key={player.id} className="player-card">
              <div className="player-name">{player.name}</div>
              <div className="player-metric">
                <span className="metric-label">Отвечено</span>
                <span className="metric-value">{player.answers.length}</span>
              </div>
              <div className="player-metric">
                <span className="metric-label">Первый вариант</span>
                <span className="metric-value">{player.thisAnswers}</span>
              </div>
              <div className="player-metric">
                <span className="metric-label">Второй вариант</span>
                <span className="metric-value">{player.thatAnswers}</span>
              </div>
              {player.skipped > 0 && (
                <div className="player-metric">
                  <span className="metric-label">Пропущено</span>
                  <span className="metric-value">{player.skipped}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {gameState.settings.showResults && (

        <div className="question-analysis">

          {controversialQuestions.length > 0 && (
            <div className="analysis-section">
              <div className="analysis-title">Самые спорные вопросы</div>
              <div className="question-list">
                {controversialQuestions.map((item) => (
                  <div key={item!.question.id} className="question-item controversial">
                    <div className="question-item-text">{item!.question.question}</div>
                    <div className="question-stats">
                      <span className="vote-distribution">
                        {item!.thisCount} / {item!.thatCount}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unanimousQuestions.length > 0 && (
            <div className="analysis-section">
              <div className="analysis-title">Единогласные решения</div>
              <div className="question-list">
                {unanimousQuestions.map((item) => (
                  <div key={item!.question.id} className="question-item unanimous">
                    <div className="question-item-text">{item!.question.question}</div>
                    <div className="question-stats">
                      <span className="vote-distribution">
                        Все выбрали: {item!.choice === 'this' ? 'первый' : 'второй'} вариант
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="end-actions">
        <button 
          className="new-game-btn"
          onClick={onNewGame}
        >
          Новая игра
        </button>
      </div>
    </div>
  );
};