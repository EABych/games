import React from 'react';

interface HomePageProps {
  onSelectGame: (game: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'alias',
      title: 'Alias',
      description: 'Объясни слово своей команде'
    },
    {
      id: 'krocodil',
      title: 'Крокодил',
      description: 'Покажи слово без слов'
    },
    {
      id: 'fants',
      title: 'Фанты',
      description: 'Весёлые задания для компании'
    },
    {
      id: 'this-or-that',
      title: 'То или То',
      description: 'Провокационные дилеммы для взрослых'
    },
    {
      id: 'mafia',
      title: 'Мафия',
      description: 'Ролевая игра на дедукцию'
    }
  ];

  return (
    <div className="home-page">
      <div className="home-header">
        <h1>Игры для компании</h1>
        <p>Выберите игру для веселого времяпрепровождения</p>
      </div>
      
      <div className="games-grid">
        {games.map((game) => (
          <button
            key={game.id}
            className="game-card"
            onClick={() => onSelectGame(game.id)}
          >
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            {(game.id === 'alias' || game.id === 'fants' || game.id === 'krocodil' || game.id === 'this-or-that') && <span className="available-badge">Доступно</span>}
            {game.id === 'this-or-that' && <span className="adult-badge">18+</span>}
            {game.id === 'mafia' && <span className="coming-soon-badge">Скоро</span>}
          </button>
        ))}
      </div>
    </div>
  );
};