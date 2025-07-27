import React, { useState } from 'react';
import { AdultFantsSetup } from './AdultFantsSetup';
import { AdultFantsSpinWheel } from './AdultFantsSpinWheel';
import { AdultFantsTaskModal } from './AdultFantsTaskModal';
import type { AdultFantsPlayer, AdultFantsTask, AdultFantsGameState } from '../../types/adult-fants';
import './AdultFants.css';

export const AdultFants: React.FC = () => {
  const [gameState, setGameState] = useState<AdultFantsGameState>({
    players: [],
    isSpinning: false,
    isGameStarted: false,
    completedTasks: []
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<AdultFantsTask | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<AdultFantsPlayer | null>(null);

  const handleStartGame = (players: AdultFantsPlayer[]) => {
    setGameState({
      players,
      isSpinning: false,
      isGameStarted: true,
      completedTasks: []
    });
  };

  const handleBackToSetup = () => {
    setGameState({
      players: [],
      isSpinning: false,
      isGameStarted: false,
      completedTasks: []
    });
    setShowTaskModal(false);
    setCurrentTask(null);
    setCurrentPlayer(null);
  };

  const handleTaskSelected = (player: AdultFantsPlayer, task: AdultFantsTask) => {
    setCurrentPlayer(player);
    setCurrentTask(task);
    setShowTaskModal(true);
  };

  const handleTaskComplete = () => {
    if (currentTask) {
      setGameState(prev => ({
        ...prev,
        completedTasks: [...prev.completedTasks, currentTask.id]
      }));
    }
    
    setShowTaskModal(false);
    setCurrentTask(null);
    setCurrentPlayer(null);
  };

  const handleTaskSkip = () => {
    setShowTaskModal(false);
    setCurrentTask(null);
    setCurrentPlayer(null);
  };

  if (!gameState.isGameStarted) {
    return <AdultFantsSetup onStartGame={handleStartGame} />;
  }

  return (
    <div className="adult-fants-game">
      <AdultFantsSpinWheel
        players={gameState.players}
        onTaskSelected={handleTaskSelected}
        onBackToSetup={handleBackToSetup}
      />
      
      {showTaskModal && currentPlayer && currentTask && (
        <AdultFantsTaskModal
          player={currentPlayer}
          task={currentTask}
          isOpen={showTaskModal}
          onComplete={handleTaskComplete}
          onSkip={handleTaskSkip}
        />
      )}
    </div>
  );
};