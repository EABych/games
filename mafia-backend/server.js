import express from 'express';
import cors from 'cors';

const app = express();

// CORS настройки для GitHub Pages
app.use(cors({
  origin: ['https://elenabyckova.github.io', 'http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Хранилище для текущего списка ролей
let currentRoles = [];
let roleIndex = 0;

// Хранилище для игры Шпион
let currentSpyGame = {
  location: '',
  spyPlayerIndex: -1,
  playerCount: 0,
  rolesGiven: 0
};

// Локации для игры Шпион
const spyLocations = [
  'Самолёт', 'Банк', 'Пляж', 'Казино', 'Кафе', 'Цирк', 'Больница', 'Отель',
  'Школа', 'Ресторан', 'Театр', 'Зоопарк', 'Музей', 'Библиотека', 'Парк',
  'Магазин', 'Аптека', 'Спортзал', 'Бассейн', 'Кинотеатр', 'Автобус', 'Поезд',
  'Метро', 'Такси', 'Корабль', 'Яхта', 'Лодка', 'Велосипед', 'Мотоцикл',
  'Автомобиль', 'Гараж', 'Парковка', 'Заправка', 'Автомойка', 'СТО',
  'Офис', 'Завод', 'Фабрика', 'Склад', 'Магазин одежды', 'Обувной магазин',
  'Продуктовый магазин', 'Книжный магазин', 'Цветочный магазин', 'Пекарня',
  'Мясная лавка', 'Рыбный магазин', 'Ювелирный магазин', 'Часовой магазин',
  'Парикмахерская', 'Салон красоты', 'Массажный салон', 'Солярий', 'Сауна',
  'Баня', 'Бильярдная', 'Боулинг', 'Караоке', 'Клуб', 'Бар', 'Паб',
  'Пиццерия', 'Фастфуд', 'Суши-бар', 'Кондитерская', 'Мороженое', 'Буфет',
  'Столовая', 'Кухня', 'Гостиная', 'Спальня', 'Ванная', 'Туалет', 'Прихожая',
  'Балкон', 'Терраса', 'Сад', 'Огород', 'Теплица', 'Сарай', 'Погреб',
  'Чердак', 'Подвал', 'Гараж', 'Двор', 'Забор', 'Ворота', 'Калитка',
  'Дорога', 'Тротуар', 'Перекрёсток', 'Мост', 'Туннель', 'Лестница', 'Лифт',
  'Эскалатор', 'Коридор', 'Холл', 'Вестибюль', 'Рецепция', 'Гардероб',
  'Раздевалка', 'Душевая', 'Туалет', 'Кладовка', 'Подсобка', 'Кабинет',
  'Переговорная', 'Конференц-зал', 'Актовый зал', 'Спортзал', 'Мастерская',
  'Лаборатория', 'Операционная', 'Палата', 'Приёмная', 'Регистратура',
  'Аудитория', 'Класс', 'Столовая', 'Буфет', 'Учительская', 'Директорская',
  'Секретариат', 'Канцелярия', 'Архив', 'Склад', 'Подвал', 'Чердак',
  'Крыша', 'Балкон', 'Лоджия', 'Веранда', 'Беседка', 'Терраса', 'Патио',
  'Площадка', 'Сцена', 'Арена', 'Стадион', 'Ипподром', 'Трек', 'Поле',
  'Корт', 'Каток', 'Горка', 'Трамплин', 'Подъёмник', 'Канатная дорога',
  'Фуникулёр', 'Эскалатор', 'Лифт', 'Лестница', 'Пандус', 'Проход',
  'Выход', 'Вход', 'Дверь', 'Окно', 'Витрина', 'Прилавок', 'Касса',
  'Стойка', 'Барная стойка', 'Стол', 'Стул', 'Кресло', 'Диван', 'Кровать',
  'Шкаф', 'Комод', 'Тумбочка', 'Полка', 'Стеллаж', 'Вешалка', 'Зеркало',
  'Картина', 'Фотография', 'Постер', 'Плакат', 'Карта', 'Схема', 'План',
  'Календарь', 'Часы', 'Телефон', 'Компьютер', 'Ноутбук', 'Планшет',
  'Телевизор', 'Радио', 'Магнитофон', 'Проигрыватель', 'Колонки', 'Наушники',
  'Микрофон', 'Камера', 'Фотоаппарат', 'Видеокамера', 'Проектор', 'Экран',
  'Доска', 'Мел', 'Маркер', 'Ручка', 'Карандаш', 'Тетрадь', 'Блокнот',
  'Книга', 'Журнал', 'Газета', 'Брошюра', 'Листовка', 'Объявление',
  'Вывеска', 'Табличка', 'Указатель', 'Знак', 'Символ', 'Логотип',
  'Эмблема', 'Герб', 'Флаг', 'Баннер', 'Рекламный щит', 'Билборд',
  'Витрина', 'Стенд', 'Павильон', 'Киоск', 'Ларёк', 'Палатка', 'Навес',
  'Тент', 'Зонт', 'Шатёр', 'Каркас', 'Конструкция', 'Сооружение', 'Здание',
  'Дом', 'Коттедж', 'Вилла', 'Особняк', 'Дача', 'Бунгало', 'Шале',
  'Хижина', 'Избушка', 'Сарай', 'Амбар', 'Конюшня', 'Хлев', 'Курятник',
  'Теплица', 'Оранжерея', 'Зимний сад', 'Консерватория', 'Павильон',
  'Беседка', 'Ротонда', 'Пергола', 'Арка', 'Колоннада', 'Портик',
  'Крыльцо', 'Терраса', 'Балкон', 'Лоджия', 'Веранда', 'Патио',
  'Дворик', 'Садик', 'Палисадник', 'Клумба', 'Газон', 'Лужайка',
  'Поляна', 'Опушка', 'Тропа', 'Дорожка', 'Аллея', 'Бульвар',
  'Проспект', 'Улица', 'Переулок', 'Тупик', 'Площадь', 'Сквер',
  'Парк', 'Сад', 'Роща', 'Лес', 'Поле', 'Луг', 'Степь', 'Пустыня',
  'Оазис', 'Болото', 'Озеро', 'Пруд', 'Река', 'Ручей', 'Водопад',
  'Источник', 'Родник', 'Колодец', 'Фонтан', 'Бассейн', 'Пляж',
  'Берег', 'Набережная', 'Пристань', 'Причал', 'Порт', 'Гавань',
  'Залив', 'Бухта', 'Море', 'Океан', 'Остров', 'Полуостров',
  'Мыс', 'Коса', 'Отмель', 'Риф', 'Скала', 'Утёс', 'Гора',
  'Холм', 'Возвышенность', 'Склон', 'Вершина', 'Пик', 'Перевал',
  'Ущелье', 'Каньон', 'Долина', 'Котловина', 'Низина', 'Впадина',
  'Пещера', 'Грот', 'Расщелина', 'Трещина', 'Яма', 'Воронка',
  'Кратер', 'Карьер', 'Шахта', 'Рудник', 'Забой', 'Штольня',
  'Туннель', 'Подземелье', 'Катакомбы', 'Лабиринт', 'Коридор',
  'Галерея', 'Зал', 'Комната', 'Помещение', 'Пространство', 'Зона',
  'Участок', 'Территория', 'Область', 'Район', 'Квартал', 'Микрорайон',
  'Посёлок', 'Деревня', 'Село', 'Городок', 'Город', 'Мегаполис',
  'Столица', 'Провинция', 'Регион', 'Страна', 'Континент', 'Планета',
  'Космос', 'Вселенная', 'Галактика', 'Звезда', 'Планета', 'Спутник',
  'Комета', 'Астероид', 'Метеорит', 'Космический корабль', 'Станция',
  'Обсерватория', 'Планетарий', 'Лаборатория', 'Институт', 'Университет',
  'Академия', 'Колледж', 'Техникум', 'Училище', 'Курсы', 'Центр',
  'Клуб', 'Секция', 'Кружок', 'Студия', 'Мастерская', 'Ателье',
  'Салон', 'Бутик', 'Галерея', 'Выставка', 'Экспозиция', 'Музей',
  'Театр', 'Опера', 'Балет', 'Филармония', 'Консерватория', 'Концерт',
  'Фестиваль', 'Конкурс', 'Соревнование', 'Турнир', 'Чемпионат',
  'Олимпиада', 'Спартакиада', 'Марафон', 'Кросс', 'Забег', 'Эстафета',
  'Гонка', 'Ралли', 'Трек', 'Автодром', 'Картинг', 'Мотокросс',
  'BMX', 'Скейтпарк', 'Роллердром', 'Каток', 'Хоккей', 'Футбол',
  'Баскетбол', 'Волейбол', 'Теннис', 'Бадминтон', 'Настольный теннис',
  'Бильярд', 'Снукер', 'Дартс', 'Боулинг', 'Кегли', 'Городки',
  'Лапта', 'Крикет', 'Бейсбол', 'Софтбол', 'Регби', 'Американский футбол',
  'Австралийский футбол', 'Гандбол', 'Водное поло', 'Плавание', 'Прыжки в воду',
  'Синхронное плавание', 'Гребля', 'Каякинг', 'Рафтинг', 'Сёрфинг',
  'Виндсёрфинг', 'Кайтсёрфинг', 'Парусный спорт', 'Яхтинг', 'Рыбалка',
  'Охота', 'Туризм', 'Альпинизм', 'Скалолазание', 'Спелеология',
  'Дельтапланеризм', 'Парашютный спорт', 'Бейсджампинг', 'Банджи',
  'Зорбинг', 'Картинг', 'Квадроциклы', 'Снегоходы', 'Лыжи', 'Сноуборд',
  'Фигурное катание', 'Конькобежный спорт', 'Кёрлинг', 'Биатлон',
  'Лыжные гонки', 'Горные лыжи', 'Фристайл', 'Сноубординг', 'Бобслей',
  'Санный спорт', 'Скелетон', 'Прыжки с трамплина', 'Лыжное двоеборье',
  'Горнолыжный спорт', 'Альпийские лыжи', 'Беговые лыжи', 'Водные лыжи'
];

// Функция генерации ролей по правилам Мафии
function generateRoles(playerCount, settings = {}) {
  const {
    includeDoctor = true,
    includeDetective = true,
    includeSheriff = false,
    includeDon = false
  } = settings;

  if (playerCount < 4 || playerCount > 20) {
    throw new Error('Количество игроков должно быть от 4 до 20');
  }

  const roles = [];
  
  // Рассчитываем количество мафии (примерно 1/3)
  const mafiaCount = Math.floor(playerCount / 3);
  
  // Добавляем мафию
  for (let i = 0; i < mafiaCount; i++) {
    if (i === 0 && includeDon) {
      roles.push('don'); // Дон мафии
    } else {
      roles.push('mafia');
    }
  }
  
  // Добавляем специальные роли
  let specialRolesAdded = 0;
  
  if (includeDetective && playerCount >= 5) {
    roles.push('detective');
    specialRolesAdded++;
  }
  
  if (includeSheriff && playerCount >= 6 && !includeDetective) {
    roles.push('sheriff');
    specialRolesAdded++;
  }
  
  if (includeDoctor && playerCount >= 6) {
    roles.push('doctor');
    specialRolesAdded++;
  }
  
  // Заполняем остальные места мирными жителями
  const citizensNeeded = playerCount - mafiaCount - specialRolesAdded;
  for (let i = 0; i < citizensNeeded; i++) {
    roles.push('citizen');
  }
  
  // Перемешиваем роли
  return roles.sort(() => Math.random() - 0.5);
}

// Получение информации о роли
function getRoleInfo(role) {
  const roleDescriptions = {
    'citizen': {
      name: 'Мирный житель',
      description: 'Ваша задача - найти и устранить всю мафию',
      team: 'citizens',
      nightAction: false
    },
    'mafia': {
      name: 'Мафия',
      description: 'Убивайте мирных жителей ночью и скрывайтесь днем',
      team: 'mafia',
      nightAction: true
    },
    'don': {
      name: 'Дон мафии',
      description: 'Лидер мафии. Координируйте действия команды',
      team: 'mafia',
      nightAction: true
    },
    'doctor': {
      name: 'Доктор',
      description: 'Лечите игроков ночью, можете спасти от убийства',
      team: 'citizens',
      nightAction: true
    },
    'detective': {
      name: 'Детектив',
      description: 'Проверяйте игроков ночью на принадлежность к мафии',
      team: 'citizens',
      nightAction: true
    },
    'sheriff': {
      name: 'Шериф',
      description: 'Проверяйте игроков ночью и защищайте город',
      team: 'citizens',
      nightAction: true
    }
  };
  
  return roleDescriptions[role] || roleDescriptions['citizen'];
}

// Health check endpoint для Render
app.get('/', (req, res) => {
  res.json({ 
    status: 'online',
    games: {
      mafia: {
        totalRoles: currentRoles.length,
        rolesGiven: roleIndex,
        rolesRemaining: Math.max(0, currentRoles.length - roleIndex)
      },
      spy: {
        hasGame: !!currentSpyGame.location,
        location: currentSpyGame.location || null,
        playerCount: currentSpyGame.playerCount,
        rolesGiven: currentSpyGame.rolesGiven,
        rolesRemaining: Math.max(0, currentSpyGame.playerCount - currentSpyGame.rolesGiven)
      }
    },
    timestamp: new Date().toISOString()
  });
});

// Создать новый список ролей
app.post('/api/mafia/generate-roles', (req, res) => {
  try {
    const { playerCount, settings = {} } = req.body;
    
    if (!playerCount || typeof playerCount !== 'number') {
      return res.status(400).json({ 
        error: 'Требуется указать количество игроков' 
      });
    }
    
    // Генерируем новый список ролей (удаляем старый)
    currentRoles = generateRoles(playerCount, settings);
    roleIndex = 0;
    
    console.log(`Сгенерированы роли для ${playerCount} игроков:`, currentRoles);
    
    res.json({
      success: true,
      message: `Роли сгенерированы для ${playerCount} игроков`,
      playerCount,
      totalRoles: currentRoles.length,
      mafiaCount: currentRoles.filter(role => role === 'mafia' || role === 'don').length,
      citizensCount: currentRoles.filter(role => ['citizen', 'doctor', 'detective', 'sheriff'].includes(role)).length
    });
    
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// Получить свою роль
app.get('/api/mafia/get-role', (req, res) => {
  try {
    if (currentRoles.length === 0) {
      return res.status(404).json({ 
        error: 'Роли не были сгенерированы. Сначала создайте список ролей.' 
      });
    }
    
    if (roleIndex >= currentRoles.length) {
      return res.status(404).json({ 
        error: 'Все роли уже розданы. Создайте новый список ролей.' 
      });
    }
    
    const role = currentRoles[roleIndex];
    const roleInfo = getRoleInfo(role);
    roleIndex++;
    
    console.log(`Выдана роль: ${role} (${roleIndex}/${currentRoles.length})`);
    
    res.json({
      role,
      roleInfo,
      playerNumber: roleIndex,
      totalPlayers: currentRoles.length,
      isLastPlayer: roleIndex === currentRoles.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении роли' 
    });
  }
});

// Получить статус текущей игры
app.get('/api/mafia/status', (req, res) => {
  res.json({
    hasActiveGame: currentRoles.length > 0,
    totalRoles: currentRoles.length,
    rolesGiven: roleIndex,
    rolesRemaining: Math.max(0, currentRoles.length - roleIndex),
    allRolesGiven: roleIndex >= currentRoles.length
  });
});

// Сбросить текущую игру
app.post('/api/mafia/reset', (req, res) => {
  currentRoles = [];
  roleIndex = 0;
  
  console.log('Игра сброшена');
  
  res.json({
    success: true,
    message: 'Игра сброшена'
  });
});

// === ЭНДПОИНТЫ ДЛЯ ИГРЫ ШПИОН ===

// Создать новую игру Шпион
app.post('/api/spy/generate-game', (req, res) => {
  try {
    const { playerCount } = req.body;
    
    if (!playerCount || typeof playerCount !== 'number') {
      return res.status(400).json({ 
        error: 'Требуется указать количество игроков' 
      });
    }
    
    if (playerCount < 3 || playerCount > 20) {
      return res.status(400).json({ 
        error: 'Количество игроков должно быть от 3 до 20' 
      });
    }
    
    // Выбираем случайную локацию
    const randomLocationIndex = Math.floor(Math.random() * spyLocations.length);
    const selectedLocation = spyLocations[randomLocationIndex];
    
    // Выбираем случайного шпиона (игрок с индексом от 0 до playerCount-1)
    const spyIndex = Math.floor(Math.random() * playerCount);
    
    // Обновляем состояние игры
    currentSpyGame = {
      location: selectedLocation,
      spyPlayerIndex: spyIndex,
      playerCount: playerCount,
      rolesGiven: 0
    };
    
    console.log(`Создана игра Шпион: локация "${selectedLocation}", шпион - игрок ${spyIndex + 1}/${playerCount}`);
    
    res.json({
      success: true,
      message: `Игра Шпион создана для ${playerCount} игроков`,
      playerCount,
      location: selectedLocation,
      spyPlayerIndex: spyIndex
    });
    
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// Получить свою роль в игре Шпион
app.get('/api/spy/get-role', (req, res) => {
  try {
    if (!currentSpyGame.location) {
      return res.status(404).json({ 
        error: 'Игра Шпион не была создана. Сначала создайте игру.' 
      });
    }
    
    if (currentSpyGame.rolesGiven >= currentSpyGame.playerCount) {
      return res.status(404).json({ 
        error: 'Все роли уже розданы. Создайте новую игру.' 
      });
    }
    
    const currentPlayerIndex = currentSpyGame.rolesGiven;
    const isSpy = currentPlayerIndex === currentSpyGame.spyPlayerIndex;
    
    currentSpyGame.rolesGiven++;
    
    console.log(`Выдана роль в игре Шпион: игрок ${currentPlayerIndex + 1} - ${isSpy ? 'ШПИОН' : `житель локации "${currentSpyGame.location}"`}`);
    
    const response = {
      playerNumber: currentPlayerIndex + 1,
      totalPlayers: currentSpyGame.playerCount,
      isSpy: isSpy,
      isLastPlayer: currentSpyGame.rolesGiven === currentSpyGame.playerCount
    };
    
    if (isSpy) {
      response.role = 'spy';
      response.roleInfo = {
        name: 'Шпион',
        description: 'Вы шпион! Ваша задача - угадать локацию, не выдав себя',
        instruction: 'Слушайте других игроков и попытайтесь понять, где вы находитесь'
      };
    } else {
      response.role = 'resident';
      response.location = currentSpyGame.location;
      response.roleInfo = {
        name: 'Житель локации',
        description: `Вы находитесь в локации: ${currentSpyGame.location}`,
        instruction: 'Ваша задача - найти шпиона среди игроков'
      };
    }
    
    res.json(response);
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении роли' 
    });
  }
});

// Получить статус игры Шпион
app.get('/api/spy/status', (req, res) => {
  res.json({
    hasActiveGame: !!currentSpyGame.location,
    location: currentSpyGame.location || null,
    playerCount: currentSpyGame.playerCount,
    rolesGiven: currentSpyGame.rolesGiven,
    rolesRemaining: Math.max(0, currentSpyGame.playerCount - currentSpyGame.rolesGiven),
    allRolesGiven: currentSpyGame.rolesGiven >= currentSpyGame.playerCount
  });
});

// Сбросить игру Шпион
app.post('/api/spy/reset', (req, res) => {
  currentSpyGame = {
    location: '',
    spyPlayerIndex: -1,
    playerCount: 0,
    rolesGiven: 0
  };
  
  console.log('Игра Шпион сброшена');
  
  res.json({
    success: true,
    message: 'Игра Шпион сброшена'
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🎮 Games Server запущен на порту ${PORT}`);
  console.log(`📝 Доступные endpoints:`);
  console.log(`   === МАФИЯ ===`);
  console.log(`   POST /api/mafia/generate-roles - Создать список ролей`);
  console.log(`   GET  /api/mafia/get-role - Получить роль`);
  console.log(`   GET  /api/mafia/status - Статус игры`);
  console.log(`   POST /api/mafia/reset - Сбросить игру`);
  console.log(`   === ШПИОН ===`);
  console.log(`   POST /api/spy/generate-game - Создать игру Шпион`);
  console.log(`   GET  /api/spy/get-role - Получить роль`);
  console.log(`   GET  /api/spy/status - Статус игры`);
  console.log(`   POST /api/spy/reset - Сбросить игру`);
});