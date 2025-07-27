import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onSelectGame?: (game: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onSelectGame }) => {
  const navigate = useNavigate();
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
      description: 'Провокационные дилеммы \n для взрослых'
    },
    {
      id: 'poet',
      title: 'Поэт',
      description: 'Придумай рифму к строке стиха'
    },
    // {
    //   id: 'yersh',
    //   title: 'Ерш',
    //   description: 'Весёлая карточная игра с заданиями'
    // },
    {
      id: 'mafia',
      title: 'Мафия',
      description: 'Ролевая игра на дедукцию'
    },
    {
      id: 'spy',
      title: 'Шпион',
      description: 'Найди шпиона или угадай локацию'
    },
    {
      id: 'headwords',
      title: 'Кто я?',
      description: 'Угадай роль, держа телефон на лбу'
    },
    {
      id: 'evening-role',
      title: 'Роль на вечер',
      description: 'Веселые задания для всей вечеринки'
    },
    {
      id: 'adult-fants',
      title: 'Взрослые Фанты 18+',
      description: 'Пикантные задания для взрослой компании'
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
            onClick={() => {
              if (onSelectGame) {
                onSelectGame(game.id);
              } else {
                navigate(`/${game.id}`);
              }
            }}
          >
            <h3>{game.title}</h3>
            <p>{game.description}</p>
            {(game.id === 'alias' || game.id === 'fants' || game.id === 'krocodil' || game.id === 'this-or-that' || game.id === 'poet' || game.id === 'yersh') && <span className="available-badge">Доступно</span>}
            {game.id === 'this-or-that' && <span className="adult-badge">18+</span>}
            {(game.id === 'mafia' || game.id === 'spy' || game.id === 'headwords' || game.id === 'evening-role' || game.id === 'adult-fants') && <span className="available-badge">Доступно</span>}
            {(game.id === 'evening-role' || game.id === 'adult-fants') && <span className="adult-badge">18+</span>}
          </button>
        ))}
      </div>
    </div>
  );
};
