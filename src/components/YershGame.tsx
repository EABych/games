import React, { useState } from 'react';
import './YershGame.css';

interface Card {
  id: string;
  type: 'task' | 'bonus' | 'bear';
  content: string;
  imagePath?: string;
}

interface GameState {
  deck: Card[];
  playerHand: Card[];
  completedTasks: number;
  gameStarted: boolean;
  gameEnded: boolean;
  currentCard: Card | null;
  showCardBack: boolean;
}

interface YershGameProps {}

export const YershGame: React.FC<YershGameProps> = () => {
  const [gameState, setGameState] = useState<GameState>({
    deck: [],
    playerHand: [],
    completedTasks: 0,
    gameStarted: false,
    gameEnded: false,
    currentCard: null,
    showCardBack: true
  });

  const [showBearAlert, setShowBearAlert] = useState(false);

  // Generate deck with task, bonus and bear cards
  const generateDeck = (): Card[] => {
    const taskCards: Card[] = [];
    const bonusCards: Card[] = [];
    const bearCards: Card[] = [];

    // Task cards from different sets
    for (let set = 1; set <= 9; set++) {
      for (let cardNum = 1; cardNum <= 9; cardNum++) {
        if (set <= 3) {
          taskCards.push({
            id: `task${set}-${cardNum}`,
            type: 'task',
            content: `Задание ${set}-${cardNum}`,
            imagePath: `/task${set}-card-${cardNum.toString().padStart(2, '0')}.jpg`
          });
        }
      }
    }

    // Bonus cards from bonus sets
    for (let set = 1; set <= 6; set++) {
      for (let cardNum = 1; cardNum <= 9; cardNum++) {
        bonusCards.push({
          id: `bonus${set}-${cardNum}`,
          type: 'bonus',
          content: `Бонус ${set}-${cardNum}`,
          imagePath: `/bonus${set}-card-${cardNum.toString().padStart(2, '0')}.jpg`
        });
      }
    }

    // Bear cards (special cards)
    for (let i = 1; i <= 5; i++) {
      bearCards.push({
        id: `bear-${i}`,
        type: 'bear',
        content: '🐻 Медведь! Все под стол!',
      });
    }

    // Shuffle task cards with bear cards (one bear at bottom, others in middle)
    const shuffledTasks = [...taskCards].sort(() => Math.random() - 0.5);
    const shuffledBears = [...bearCards].sort(() => Math.random() - 0.5);
    
    // Place one bear at the bottom
    const bottomBear = shuffledBears.pop()!;
    
    // Insert other bears in the middle portion of task cards
    const middleStart = Math.floor(shuffledTasks.length * 0.3);
    const middleEnd = Math.floor(shuffledTasks.length * 0.8);
    
    shuffledBears.forEach((bear) => {
      const insertPosition = middleStart + Math.floor((middleEnd - middleStart) * Math.random());
      shuffledTasks.splice(insertPosition, 0, bear);
    });

    // Add the bottom bear at the end
    shuffledTasks.push(bottomBear);

    return shuffledTasks;
  };

  const initializeGame = () => {
    const deck = generateDeck();
    setGameState({
      deck,
      playerHand: [],
      completedTasks: 0,
      gameStarted: true,
      gameEnded: false,
      currentCard: null,
      showCardBack: true
    });
  };

  const drawCard = () => {
    if (gameState.deck.length === 0) {
      setGameState(prev => ({ ...prev, gameEnded: true }));
      return;
    }

    const newCard = gameState.deck[0];
    const newDeck = gameState.deck.slice(1);

    setGameState(prev => ({
      ...prev,
      deck: newDeck,
      currentCard: newCard,
      showCardBack: false
    }));

    if (newCard.type === 'bear') {
      setShowBearAlert(true);
      setTimeout(() => setShowBearAlert(false), 3000);
    }
  };

  const completeTask = () => {
    if (gameState.currentCard?.type === 'task') {
      // Award 2 random bonus cards from remaining deck
      const bonusCards = gameState.deck.filter(card => card.type === 'bonus').slice(0, 2);
      const remainingDeck = gameState.deck.filter(card => !bonusCards.includes(card));

      setGameState(prev => ({
        ...prev,
        completedTasks: prev.completedTasks + 1,
        playerHand: [...prev.playerHand, ...bonusCards],
        deck: remainingDeck,
        currentCard: null,
        showCardBack: true
      }));
    }
  };

  const skipTask = () => {
    if (gameState.currentCard?.type === 'task') {
      // Lose all bonus cards
      setGameState(prev => ({
        ...prev,
        playerHand: prev.playerHand.filter(card => card.type !== 'bonus'),
        currentCard: null,
        showCardBack: true
      }));
    }
  };

  const addCardToHand = (cardType: 'bonus' | 'task') => {
    const newCard: Card = {
      id: `manual-${Date.now()}`,
      type: cardType,
      content: cardType === 'bonus' ? 'Переданный бонус' : 'Переданное задание'
    };

    setGameState(prev => ({
      ...prev,
      playerHand: [...prev.playerHand, newCard]
    }));
  };

  const removeCardFromHand = (cardId: string) => {
    setGameState(prev => ({
      ...prev,
      playerHand: prev.playerHand.filter(card => card.id !== cardId)
    }));
  };

  const calculateScore = () => {
    const taskScore = gameState.completedTasks;
    const bonusScore = gameState.playerHand.filter(card => card.type === 'bonus').length;
    return taskScore + bonusScore;
  };

  if (!gameState.gameStarted) {
    return (
      <div className="yersh-game">
        <div className="game-header">
          <h1>Игра Ерш</h1>
          <a 
            href="https://tesera.ru/images/items/1449810/Rules-erch-rus.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            className="rules-link"
          >
            📖 Правила
          </a>
        </div>

        <div className="game-rules">
          <h2>Правила игры</h2>
          <div className="rules-content">
            <p><strong>Цель:</strong> Выполнять задания и собирать бонусные карточки</p>
            <ul>
              <li>Тяните карточки по очереди</li>
              <li>Выполните задание → получите 2 бонусные карточки</li>
              <li>Откажитесь от задания → потеряете все бонусы</li>
              <li>Карточка с медведем → все под стол!</li>
              <li>Очки: задания + бонусные карточки</li>
            </ul>
          </div>
          <button className="start-button" onClick={initializeGame}>
            Начать игру
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="yersh-game landscape">
      {showBearAlert && (
        <div className="bear-alert">
          <h2>🐻 МЕДВЕДЬ!</h2>
          <p>Все под стол!</p>
        </div>
      )}

      <div className="game-header">
        <div className="game-stats">
          <span>Выполнено заданий: {gameState.completedTasks}</span>
          <span>Карт в колоде: {gameState.deck.length}</span>
          <span>Очки: {calculateScore()}</span>
        </div>
        <a 
          href="https://tesera.ru/images/items/1449810/Rules-erch-rus.pdf" 
          target="_blank" 
          rel="noopener noreferrer"
          className="rules-link"
        >
          📖
        </a>
      </div>

      <div className="game-board">
        <div className="deck-area">
          <div className="deck-card" onClick={drawCard}>
            {gameState.showCardBack ? (
              <div className="card-back">
                <h3>Ерш</h3>
                <p>Нажмите чтобы взять карту</p>
              </div>
            ) : gameState.currentCard ? (
              <div className={`card ${gameState.currentCard.type}`}>
                {gameState.currentCard.imagePath ? (
                  <img src={gameState.currentCard.imagePath} alt={gameState.currentCard.content} />
                ) : (
                  <>
                    <h3>{gameState.currentCard.content}</h3>
                    {gameState.currentCard.type === 'task' && (
                      <div className="task-actions">
                        <button className="complete-btn" onClick={completeTask}>
                          Выполнил (+2 бонуса)
                        </button>
                        <button className="skip-btn" onClick={skipTask}>
                          Не могу (штраф)
                        </button>
                      </div>
                    )}
                    {gameState.currentCard.type === 'bear' && (
                      <button className="next-btn" onClick={() => setGameState(prev => ({ ...prev, currentCard: null, showCardBack: true }))}>
                        Продолжить
                      </button>
                    )}
                  </>
                )}
              </div>
            ) : null}
          </div>
        </div>

        <div className="player-area">
          <h3>Моя рука ({gameState.playerHand.length} карт)</h3>
          <div className="hand-controls">
            <button onClick={() => addCardToHand('bonus')}>+ Бонус</button>
            <button onClick={() => addCardToHand('task')}>+ Задание</button>
          </div>
          <div className="player-hand">
            {gameState.playerHand.map((card) => (
              <div key={card.id} className={`hand-card ${card.type}`}>
                <span>{card.type === 'bonus' ? '🎁' : '📝'}</span>
                <button onClick={() => removeCardFromHand(card.id)}>✖</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {gameState.gameEnded && (
        <div className="game-over">
          <h2>Игра завершена!</h2>
          <p>Ваш счёт: {calculateScore()} очков</p>
          <p>Выполнено заданий: {gameState.completedTasks}</p>
          <p>Бонусных карт: {gameState.playerHand.filter(card => card.type === 'bonus').length}</p>
          <button onClick={initializeGame}>Играть снова</button>
        </div>
      )}
    </div>
  );
};