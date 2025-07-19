import React from 'react';
import type { ThisOrThatGameState } from '../../types/this-or-that';
import { THIS_OR_THAT_CATEGORY_INFO, THIS_OR_THAT_INTENSITY_INFO } from '../../types/this-or-that';

interface ThisOrThatEndProps {
  gameState: ThisOrThatGameState;
  onNewGame: () => void;
}

export const ThisOrThatEnd: React.FC<ThisOrThatEndProps> = ({ gameState, onNewGame }) => {
  const totalQuestions = gameState.questions.length;
  const totalAnswers = gameState.players.reduce((sum, player) => sum + player.answers.length, 0);
  const totalSkipped = totalQuestions * gameState.players.length - totalAnswers;

  // Статистика по категориям
  const categoryStats = gameState.questions.reduce((stats, question) => {
    if (!stats[question.category]) {
      stats[question.category] = 0;
    }
    stats[question.category]++;
    return stats;
  }, {} as Record<string, number>);

  // Статистика по интенсивности
  const intensityStats = gameState.questions.reduce((stats, question) => {
    if (!stats[question.intensity]) {
      stats[question.intensity] = 0;
    }
    stats[question.intensity]++;
    return stats;
  }, {} as Record<string, number>);

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
      <h1>Игра завершена!</h1>
      <p className="subtitle">Время подводить итоги размышлений</p>

      <div className="game-summary">
        <div className="summary-stats">
          <div className="stat-card">
            <span className="stat-value">{totalQuestions}</span>
            <span className="stat-name">Вопросов обсуждено</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{totalAnswers}</span>
            <span className="stat-name">Ответов дано</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{gameState.players.length}</span>
            <span className="stat-name">Участников</span>
          </div>
          {totalSkipped > 0 && (
            <div className="stat-card">
              <span className="stat-value">{totalSkipped}</span>
              <span className="stat-name">Вопросов пропущено</span>
            </div>
          )}
        </div>
      </div>

      {gameState.settings.showResults && (
        <>
          <div className="players-analysis">
            <h3>Анализ участников</h3>
            <div className="players-grid">
              {playerAnalysis.map((player) => (
                <div key={player.id} className="player-card">
                  <div className="player-header">
                    <div className="player-avatar">
                      {player.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="player-info">
                      <h4>{player.name}</h4>
                      <p className="participation">Участие: {player.participationRate}%</p>
                    </div>
                  </div>
                  <div className="player-stats">
                    <div className="answer-distribution">
                      <div className="answer-bar">
                        <div 
                          className="this-segment" 
                          style={{ width: `${(player.thisAnswers / Math.max(player.thisAnswers + player.thatAnswers, 1)) * 100}%` }}
                        />
                        <div 
                          className="that-segment" 
                          style={{ width: `${(player.thatAnswers / Math.max(player.thisAnswers + player.thatAnswers, 1)) * 100}%` }}
                        />
                      </div>
                      <div className="answer-counts">
                        <span className="this-count">Первый вариант: {player.thisAnswers}</span>
                        <span className="that-count">Второй вариант: {player.thatAnswers}</span>
                        {player.skipped > 0 && (
                          <span className="skip-count">Пропущено: {player.skipped}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="category-breakdown">
            <h3>Распределение по категориям</h3>
            <div className="category-stats">
              {Object.entries(categoryStats).map(([category, count]) => (
                <div key={category} className="category-stat">
                  <span 
                    className="category-indicator"
                    style={{ backgroundColor: THIS_OR_THAT_CATEGORY_INFO[category as keyof typeof THIS_OR_THAT_CATEGORY_INFO]?.color }}
                  >
                    {THIS_OR_THAT_CATEGORY_INFO[category as keyof typeof THIS_OR_THAT_CATEGORY_INFO]?.emoji}
                  </span>
                  <span className="category-name">
                    {THIS_OR_THAT_CATEGORY_INFO[category as keyof typeof THIS_OR_THAT_CATEGORY_INFO]?.name}
                  </span>
                  <span className="category-count">{count} вопросов</span>
                </div>
              ))}
            </div>
          </div>

          <div className="intensity-breakdown">
            <h3>Уровни интенсивности</h3>
            <div className="intensity-stats">
              {Object.entries(intensityStats).map(([intensity, count]) => (
                <div key={intensity} className="intensity-stat">
                  <span 
                    className="intensity-indicator"
                    style={{ backgroundColor: THIS_OR_THAT_INTENSITY_INFO[intensity as keyof typeof THIS_OR_THAT_INTENSITY_INFO]?.color }}
                  />
                  <span className="intensity-name">
                    {THIS_OR_THAT_INTENSITY_INFO[intensity as keyof typeof THIS_OR_THAT_INTENSITY_INFO]?.name}
                  </span>
                  <span className="intensity-count">{count} вопросов</span>
                </div>
              ))}
            </div>
          </div>

          {controversialQuestions.length > 0 && (
            <div className="controversial-questions">
              <h3>🔥 Самые спорные вопросы</h3>
              <p className="section-subtitle">Вопросы, которые больше всего разделили мнения</p>
              <div className="questions-list">
                {controversialQuestions.map((item) => (
                  <div key={item!.question.id} className="question-result">
                    <p className="question-text">{item!.question.question}</p>
                    <div className="result-bar">
                      <div className="result-segment this-result" style={{ width: `${(item!.thisCount / item!.total) * 100}%` }}>
                        {item!.thisCount}
                      </div>
                      <div className="result-segment that-result" style={{ width: `${(item!.thatCount / item!.total) * 100}%` }}>
                        {item!.thatCount}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {unanimousQuestions.length > 0 && (
            <div className="unanimous-questions">
              <h3>🤝 Единогласные решения</h3>
              <p className="section-subtitle">Вопросы, где все участники выбрали одинаково</p>
              <div className="questions-list">
                {unanimousQuestions.map((item) => (
                  <div key={item!.question.id} className="question-result unanimous">
                    <p className="question-text">{item!.question.question}</p>
                    <div className="unanimous-indicator">
                      Все выбрали: {item!.choice === 'this' ? 'первый' : 'второй'} вариант
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      <div className="game-reflection">
        <h3>💭 Время для размышлений</h3>
        <p>
          Вы обсудили {totalQuestions} глубоких вопросов. Эти темы могут стать основой 
          для дальнейших интересных разговоров. Помните: нет правильных или неправильных 
          ответов - есть разные точки зрения, которые делают нас богаче.
        </p>
      </div>

      <button 
        className="new-game-button"
        onClick={onNewGame}
      >
        Новая игра
      </button>
    </div>
  );
};