import React, { useEffect, useState, useCallback } from 'react';
import './App.css';
import { useGameState } from './hooks/useGameState';
import { useFantsGame } from './hooks/useFantsGame';
import { useKrocodilGame } from './hooks/useKrocodilGame';
import { useThisOrThatGame } from './hooks/useThisOrThatGame';
import { usePoetGame } from './hooks/usePoetGame';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { HomePage } from './components/HomePage';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { RoundEnd } from './components/RoundEnd';
import { GameEnd } from './components/GameEnd';
import { ConfirmModal } from './components/ConfirmModal';
import { FantsSetup } from './components/fants/FantsSetup';
import { FantsGame } from './components/fants/FantsGame';
import { FantsEnd } from './components/fants/FantsEnd';
import { KrocodilSetup } from './components/krocodil/KrocodilSetup';
import { KrocodilGame } from './components/krocodil/KrocodilGame';
import { KrocodilEnd } from './components/krocodil/KrocodilEnd';
import { KrocodilRoundEnd } from './components/krocodil/KrocodilRoundEnd';
import { ThisOrThatSetup } from './components/this-or-that/ThisOrThatSetup';
import { ThisOrThatGame } from './components/this-or-that/ThisOrThatGame';
import { ThisOrThatEnd } from './components/this-or-that/ThisOrThatEnd';
import { PoetSetup } from './components/poet/PoetSetup';
import { PoetGame } from './components/poet/PoetGame';
import { PoetRoundEnd } from './components/poet/PoetRoundEnd';
import { PoetEnd } from './components/poet/PoetEnd';
import { YershGame } from './components/YershGame';
import { AuthScreen } from './components/AuthScreen';
import { MafiaGame } from './components/mafia/MafiaGame';
import { SpyGame } from './components/spy/SpyGame';
import { SpyPlayerScreen } from './components/spy/SpyPlayerScreen';
import { MafiaPlayerScreen } from './components/mafia/MafiaPlayerScreen';
import { HeadwordsGame } from './components/headwords/HeadwordsGame';
import { HeadwordsPlayerScreen } from './components/headwords/HeadwordsPlayerScreen';
import './components/mafia/MafiaHost.css';
import './components/mafia/MafiaPlayer.css';
import './components/spy/Spy.css';
import './components/headwords/Headwords.css';

// Main App component with game logic
const MainApp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Определяем текущую игру по URL
  const getCurrentGameFromPath = useCallback((): 'home' | 'alias' | 'fants' | 'krocodil' | 'this-or-that' | 'poet' | 'yersh' | 'mafia' | 'spy' | 'headwords' => {
    const path = location.pathname;
    console.log('Current path:', path); // Отладка
    if (path === '/alias') return 'alias';
    if (path === '/fants') return 'fants';
    if (path === '/krocodil') return 'krocodil';
    if (path === '/this-or-that') return 'this-or-that';
    if (path === '/poet') return 'poet';
    if (path === '/yersh') return 'yersh';
    if (path === '/mafia') return 'mafia';
    if (path === '/spy') return 'spy';
    if (path === '/headwords') return 'headwords';
    return 'home';
  }, [location.pathname]);

  const [appPhase, setAppPhase] = useState<'home' | 'alias' | 'fants' | 'krocodil' | 'this-or-that' | 'poet' | 'yersh' | 'mafia' | 'spy' | 'headwords'>(getCurrentGameFromPath());
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Обновляем appPhase при изменении URL
  useEffect(() => {
    const newPhase = getCurrentGameFromPath();
    console.log('Setting appPhase to:', newPhase); // Отладка
    setAppPhase(newPhase);
  }, [getCurrentGameFromPath]);
  
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

  const {
    gameState: krocodilGameState,
    startNewGame: startKrocodilGame,
    guessWord: guessKrocodilWord,
    skipWord: skipKrocodilWord,
    endRound,
    startNextRound,
    resetGame: resetKrocodilGame
  } = useKrocodilGame();

  const {
    gameState: thisOrThatGameState,
    startNewGame: startThisOrThatGame,
    addAnswer: addThisOrThatAnswer,
    skipQuestion: skipThisOrThatQuestion,
    nextQuestion: nextThisOrThatQuestion,
    resetGame: resetThisOrThatGame
  } = useThisOrThatGame();

  const {
    gameState: poetGameState,
    startNewGame: startPoetGame,
    confirmTask,
    nextRound: nextPoetRound,
    resetGame: resetPoetGame
  } = usePoetGame();

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
    navigate(`/${game}`);
    // setAppPhase будет обновлен автоматически через useEffect
  };

  const handleBackToHome = () => {
    resetGame();
    resetFantsGame();
    resetKrocodilGame();
    resetThisOrThatGame();
    resetPoetGame();
    navigate('/');
    // setAppPhase будет обновлен автоматически через useEffect
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
    return <AuthScreen onAuth={handleAuth} />;
  }

  return (
    <>
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

      {appPhase === 'krocodil' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {krocodilGameState.phase === 'setup' && (
            <KrocodilSetup onStartGame={startKrocodilGame} />
          )}
          
          {krocodilGameState.phase === 'playing' && (
            <KrocodilGame 
              gameState={krocodilGameState}
              onGuessWord={guessKrocodilWord}
              onSkipWord={skipKrocodilWord}
              onEndRound={endRound}
            />
          )}
          
          {krocodilGameState.phase === 'roundEnd' && (
            <KrocodilRoundEnd 
              gameState={krocodilGameState}
              onStartNextRound={startNextRound}
            />
          )}
          
          {krocodilGameState.phase === 'completed' && (
            <KrocodilEnd 
              gameState={krocodilGameState}
              onNewGame={resetKrocodilGame}
            />
          )}
        </>
      )}

      {appPhase === 'this-or-that' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {thisOrThatGameState.phase === 'setup' && (
            <ThisOrThatSetup onStartGame={startThisOrThatGame} />
          )}
          
          {thisOrThatGameState.phase === 'playing' && (
            <ThisOrThatGame 
              gameState={thisOrThatGameState}
              onAnswer={addThisOrThatAnswer}
              onSkip={skipThisOrThatQuestion}
              onNextQuestion={nextThisOrThatQuestion}
            />
          )}
          
          {thisOrThatGameState.phase === 'completed' && (
            <ThisOrThatEnd 
              gameState={thisOrThatGameState}
              onNewGame={resetThisOrThatGame}
            />
          )}
        </>
      )}

      {appPhase === 'poet' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          {poetGameState.phase === 'setup' && (
            <PoetSetup onStartGame={startPoetGame} />
          )}
          
          {poetGameState.phase === 'playing' && (
            <PoetGame 
              gameState={poetGameState}
              onConfirmTask={confirmTask}
            />
          )}
          
          {poetGameState.phase === 'results' && (
            <PoetRoundEnd 
              gameState={poetGameState}
              onNextRound={nextPoetRound}
            />
          )}
          
          {poetGameState.phase === 'completed' && (
            <PoetEnd 
              gameState={poetGameState}
              onNewGame={resetPoetGame}
            />
          )}
        </>
      )}

      {appPhase === 'yersh' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <YershGame />
        </>
      )}

      {appPhase === 'mafia' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <MafiaGame />
        </>
      )}

      {appPhase === 'spy' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <SpyGame />
        </>
      )}

      {appPhase === 'headwords' && (
        <>
          <button className="home-button" onClick={handleHomeClick}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <HeadwordsGame />
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
    </>
  );
};

function App() {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Player screens (public routes) - должны быть первыми */}
          <Route path="/player/mafia/:roomId" element={<MafiaPlayerScreen />} />
          <Route path="/player/spy/:roomId" element={<SpyPlayerScreen />} />
          <Route path="/player/headwords/:roomId" element={<HeadwordsPlayerScreen />} />
          
          {/* Main app routes */}
          <Route path="/*" element={<MainApp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};


export default App