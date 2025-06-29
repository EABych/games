import React from 'react';

interface HomePageProps {
  onSelectGame: (game: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const games = [
    {
      id: 'alias',
      title: 'Alias',
      description: 'Объясни слово своей команде',
      color: '#007AFF',
      emoji: '🗣️'
    },
    {
      id: 'mafia',
      title: 'Мафия',
      description: 'Ролевая игра на дедукцию',
      color: '#5856D6',
      emoji: '🕵️'
    },
    {
      id: 'fants',
      title: 'Фанты',
      description: 'Весёлые задания для компании',
      color: '#FF9500',
      emoji: '🎭'
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
            style={{ '--game-color': game.color } as React.CSSProperties}
          >
            <div className="game-emoji">{game.emoji}</div>
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            {(game.id === 'alias' || game.id === 'fants') && <span className="available-badge">Доступно</span>}
            {game.id === 'mafia' && <span className="coming-soon-badge">Скоро</span>}
          </button>
        ))}
      </div>
    </div>
  );
};