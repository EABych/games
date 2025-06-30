import { useEffect, useState } from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import { useFantsGame } from './hooks/useFantsGame';
import { HomePage } from './components/HomePage';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { RoundEnd } from './components/RoundEnd';
import { GameEnd } from './components/GameEnd';
import { ConfirmModal } from './components/ConfirmModal';
import { FantsSetup } from './components/fants/FantsSetup';
import { FantsGame } from './components/fants/FantsGame';
import { FantsEnd } from './components/fants/FantsEnd';
import { AuthScreen } from './components/AuthScreen';

type AppPhase = 'home' | 'alias' | 'fants';

function App() {
  const [appPhase, setAppPhase] = useState<AppPhase>('home');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { 
    gameState, 
    startNewGame, 
    skipWord, 
    guessWord, 
    nextTeam, 
    resetGame 
  } = useGameState();

  const { 
    gameState: fantsGameState,
    startNewGame: startFantsGame,
    completeFant,
    skipFant,
    resetGame: resetFantsGame
  } = useFantsGame();

  // Check authentication on app load
  useEffect(() => {
    const authStatus = localStorage.getItem('games_auth_status') === 'true';
    setIsAuthenticated(authStatus);
  }, []);

  // Update body class based on game phase
  useEffect(() => {
    if (gameState.phase === 'playing') {
      document.body.classList.add('game-mode');
    } else {
      document.body.classList.remove('game-mode');
    }
    
    // Cleanup on unmount
    return () => {
      document.body.classList.remove('game-mode');
    };
  }, [gameState.phase]);

  const handleAuth = () => {
    setIsAuthenticated(true);
  };

  const handleSelectGame = (game: string) => {
    if (game === 'alias') {
      setAppPhase('alias');
    } else if (game === 'fants') {
      setAppPhase('fants');
    }
  };

  const handleBackToHome = () => {
    setAppPhase('home');
    resetGame();
    resetFantsGame();
  };

  const handleHomeClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmHome = () => {
    setShowConfirmModal(false);
    handleBackToHome();
  };

  const handleCancelModal = () => {
    setShowConfirmModal(false);
  };

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="app">
        <AuthScreen onAuth={handleAuth} />
      </div>
    );
  }

  return (
    <div className="app">
      {appPhase === 'home' && (
        <HomePage onSelectGame={handleSelectGame} />
      )}
      
      {appPhase === 'alias' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {gameState.phase === 'menu' && (
            <MainMenu onStartGame={(teams, gameSettings) => startNewGame(teams, gameSettings)} />
          )}
          
          {gameState.phase === 'playing' && (
            <GameScreen 
              gameState={gameState}
              onGuess={guessWord}
              onSkip={skipWord}
            />
          )}
          
          {gameState.phase === 'roundEnd' && (
            <RoundEnd 
              gameState={gameState}
              onNextRound={nextTeam}
            />
          )}
          
          {gameState.phase === 'gameEnd' && (
            <GameEnd 
              gameState={gameState}
              onNewGame={resetGame}
            />
          )}
        </>
      )}

      {appPhase === 'fants' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {fantsGameState.phase === 'setup' && (
            <FantsSetup onStartGame={startFantsGame} />
          )}
          
          {fantsGameState.phase === 'playing' && (
            <FantsGame 
              gameState={fantsGameState}
              onComplete={completeFant}
              onSkip={skipFant}
            />
          )}
          
          {fantsGameState.phase === 'completed' && (
            <FantsEnd 
              gameState={fantsGameState}
              onNewGame={resetFantsGame}
            />
          )}
        </>
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Выйти из игры?"
        message="Текущий прогресс будет потерян. Вы уверены, что хотите вернуться на главную страницу?"
        confirmText="Выйти"
        cancelText="Отмена"
        onConfirm={handleConfirmHome}
        onCancel={handleCancelModal}
      />
    </div>
  );
}

export default App