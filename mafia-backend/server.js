import express from 'express';
import cors from 'cors';

const app = express();

// CORS настройки для развертывания
app.use(cors({
  origin: [
    'https://elenabyckova.github.io', 
    'https://eabych.github.io', 
    'https://games-lfke.onrender.com',
    'http://localhost:5173', 
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Хранилище для всех активных игр
let activeGames = new Map();

// Генерация уникального ID комнаты
function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

// Создание структуры игры Мафия
function createMafiaGame(roomId, roles) {
  return {
    id: roomId,
    type: 'mafia',
    roles: roles,
    roleIndex: 0,
    createdAt: new Date()
  };
}

// Создание структуры игры Шпион
function createSpyGame(roomId, location, spyPlayerIndex, playerCount) {
  return {
    id: roomId,
    type: 'spy',
    location: location,
    spyPlayerIndex: spyPlayerIndex,
    playerCount: playerCount,
    rolesGiven: 0,
    createdAt: new Date()
  };
}

// Совместимость со старым API (временно)
let currentRoles = [];
let roleIndex = 0;
let currentSpyGame = {
  location: '',
  spyPlayerIndex: -1,
  playerCount: 0,
  rolesGiven: 0
};

// Локации для игры Шпион (расширенный список)
const spyLocations = [
  // Оригинальные разнообразные локации
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
  'Чердак', 'Подвал', 'Двор', 'Забор', 'Ворота', 'Калитка',
  'Дорога', 'Тротуар', 'Перекрёсток', 'Мост', 'Туннель', 'Лестница', 'Лифт',
  'Эскалатор', 'Коридор', 'Холл', 'Вестибюль', 'Рецепция', 'Гардероб',
  'Раздевалка', 'Душевая', 'Кладовка', 'Подсобка', 'Кабинет',
  'Переговорная', 'Конференц-зал', 'Актовый зал', 'Спортзал', 'Мастерская',
  'Лаборатория', 'Операционная', 'Палата', 'Приёмная', 'Регистратура',
  'Аудитория', 'Класс', 'Учительская', 'Директорская',
  'Секретариат', 'Канцелярия', 'Архив', 'Крыша', 'Лоджия', 'Веранда', 'Беседка', 'Патио',
  'Площадка', 'Сцена', 'Арена', 'Стадион', 'Ипподром', 'Трек', 'Поле',
  'Корт', 'Каток', 'Горка', 'Трамплин', 'Подъёмник', 'Канатная дорога',
  'Фуникулёр', 'Пандус', 'Проход', 'Выход', 'Вход', 'Дверь', 'Окно', 'Витрина', 'Прилавок', 'Касса',
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
  'Стенд', 'Павильон', 'Киоск', 'Ларёк', 'Палатка', 'Навес',
  'Тент', 'Зонт', 'Шатёр', 'Каркас', 'Конструкция', 'Сооружение', 'Здание',
  'Дом', 'Коттедж', 'Вилла', 'Особняк', 'Дача', 'Бунгало', 'Шале',
  'Хижина', 'Избушка', 'Амбар', 'Конюшня', 'Хлев', 'Курятник',
  'Оранжерея', 'Зимний сад', 'Консерватория',
  'Ротонда', 'Пергола', 'Арка', 'Колоннада', 'Портик', 'Крыльцо',
  'Дворик', 'Садик', 'Палисадник', 'Клумба', 'Газон', 'Лужайка',
  'Поляна', 'Опушка', 'Тропа', 'Дорожка', 'Аллея', 'Бульвар',
  'Проспект', 'Улица', 'Переулок', 'Тупик', 'Площадь', 'Сквер',
  'Роща', 'Лес', 'Луг', 'Степь', 'Пустыня',
  'Оазис', 'Болото', 'Озеро', 'Пруд', 'Река', 'Ручей', 'Водопад',
  'Источник', 'Родник', 'Колодец', 'Фонтан',
  'Берег', 'Набережная', 'Пристань', 'Причал', 'Порт', 'Гавань',
  'Залив', 'Бухта', 'Море', 'Океан', 'Остров', 'Полуостров',
  'Мыс', 'Коса', 'Отмель', 'Риф', 'Скала', 'Утёс', 'Гора',
  'Холм', 'Возвышенность', 'Склон', 'Вершина', 'Пик', 'Перевал',
  'Ущелье', 'Каньон', 'Долина', 'Котловина', 'Низина', 'Впадина',
  'Пещера', 'Грот', 'Расщелина', 'Трещина', 'Яма', 'Воронка',
  'Кратер', 'Карьер', 'Шахта', 'Рудник', 'Забой', 'Штольня',
  'Подземелье', 'Катакомбы', 'Лабиринт',
  'Галерея', 'Зал', 'Комната', 'Помещение', 'Пространство', 'Зона',
  'Участок', 'Территория', 'Область', 'Район', 'Квартал', 'Микрорайон',
  'Посёлок', 'Деревня', 'Село', 'Городок', 'Город', 'Мегаполис',
  'Столица', 'Провинция', 'Регион', 'Страна', 'Континент', 'Планета',
  'Космос', 'Вселенная', 'Галактика', 'Звезда', 'Спутник',
  'Комета', 'Астероид', 'Метеорит', 'Космический корабль', 'Станция',
  'Обсерватория', 'Планетарий', 'Институт', 'Университет',
  'Академия', 'Колледж', 'Техникум', 'Училище', 'Курсы', 'Центр',
  'Секция', 'Кружок', 'Студия', 'Ателье',
  'Салон', 'Бутик', 'Галерея', 'Выставка', 'Экспозиция',
  'Опера', 'Балет', 'Филармония', 'Консерватория', 'Концерт',
  'Фестиваль', 'Конкурс', 'Соревнование', 'Турнир', 'Чемпионат',
  'Олимпиада', 'Спартакиада', 'Марафон', 'Кросс', 'Забег', 'Эстафета',
  'Гонка', 'Ралли', 'Автодром', 'Картинг', 'Мотокросс',
  'BMX', 'Скейтпарк', 'Роллердром', 'Хоккей', 'Футбол',
  'Баскетбол', 'Волейбол', 'Теннис', 'Бадминтон', 'Настольный теннис',
  'Бильярд', 'Снукер', 'Дартс', 'Кегли', 'Городки',
  'Лапта', 'Крикет', 'Бейсбол', 'Софтбол', 'Регби', 'Американский футбол',
  'Австралийский футбол', 'Гандбол', 'Водное поло', 'Плавание', 'Прыжки в воду',
  'Синхронное плавание', 'Гребля', 'Каякинг', 'Рафтинг', 'Сёрфинг',
  'Виндсёрфинг', 'Кайтсёрфинг', 'Парусный спорт', 'Яхтинг', 'Рыбалка',
  'Охота', 'Туризм', 'Альпинизм', 'Скалолазание', 'Спелеология',
  'Дельтапланеризм', 'Парашютный спорт', 'Бейсджампинг', 'Банджи',
  'Зорбинг', 'Квадроциклы', 'Снегоходы', 'Лыжи', 'Сноуборд',
  'Фигурное катание', 'Конькобежный спорт', 'Кёрлинг', 'Биатлон',
  'Лыжные гонки', 'Горные лыжи', 'Фристайл', 'Сноубординг', 'Бобслей',
  'Санный спорт', 'Скелетон', 'Прыжки с трамплина', 'Лыжное двоеборье',
  'Горнолыжный спорт', 'Альпийские лыжи', 'Беговые лыжи', 'Водные лыжи',
  
  // Дополнительные локации из вашего файла
  'Пожарная станция', 'Автосалон', 'Арктическая станция', 'Космическая станция',
  'Аквапарк', 'Почта', 'Прачечная', 'Кухня ресторана', 'Парк аттракционов',
  'Тату-салон', 'Крематорий', 'Тренажёрный зал', 'Полицейский участок',
  'Лунапарк', 'Ферма', 'Тюрьма', 'Квартира', 'Ночной клуб',
  'Гостиница', 'Суд', 'Кладбище', 'Рыбный рынок',
  'Секретная лаборатория', 'Телестудия', 'Аэропорт', 'Церковь',
  'Вокзал', 'Супермаркет', 'Военная база', 'Магазин игрушек'
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
      },
      headwords: {
        hasGame: !!currentHeadwordsGame.category,
        category: currentHeadwordsGame.category || null,
        playerCount: currentHeadwordsGame.playerCount,
        rolesGiven: currentHeadwordsGame.rolesGiven,
        rolesRemaining: Math.max(0, currentHeadwordsGame.playerCount - currentHeadwordsGame.rolesGiven)
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
    
    // Генерируем новый список ролей и создаем комнату
    const roles = generateRoles(playerCount, settings);
    const roomId = generateRoomId();
    const mafiaGame = createMafiaGame(roomId, roles);
    
    // Сохраняем игру в активных играх
    activeGames.set(roomId, mafiaGame);
    
    // Обновляем старые переменные для совместимости
    currentRoles = roles;
    roleIndex = 0;
    
    console.log(`Создана игра Мафия ${roomId} для ${playerCount} игроков:`, roles);
    
    res.json({
      success: true,
      message: `Роли сгенерированы для ${playerCount} игроков`,
      roomId: roomId,
      playerCount,
      totalRoles: roles.length,
      mafiaCount: roles.filter(role => role === 'mafia' || role === 'don').length,
      citizensCount: roles.filter(role => ['citizen', 'doctor', 'detective', 'sheriff'].includes(role)).length
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
    const { roomId } = req.query;
    
    if (roomId) {
      // Новый API с roomId
      const game = activeGames.get(roomId);
      if (!game || game.type !== 'mafia') {
        return res.status(404).json({ 
          error: 'Игра Мафия не найдена. Проверьте ID комнаты.' 
        });
      }
      
      if (game.roleIndex >= game.roles.length) {
        return res.status(404).json({ 
          error: 'Все роли уже розданы. Создайте новую игру.' 
        });
      }
      
      const role = game.roles[game.roleIndex];
      const roleInfo = getRoleInfo(role);
      game.roleIndex++;
      
      console.log(`Выдана роль в комнате ${roomId}: ${role} (${game.roleIndex}/${game.roles.length})`);
      
      res.json({
        role,
        roleInfo,
        playerNumber: game.roleIndex,
        totalPlayers: game.roles.length,
        isLastPlayer: game.roleIndex === game.roles.length,
        roomId: roomId
      });
    } else {
      // Старый API для совместимости
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
    }
    
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

// === ЭНДПОИНТЫ ДЛЯ ИГРЫ СЛОВА НА ЛОБ ===

// Категории ролей для игры "Кто я?"
const headwordsCategories = {
  celebrities: [
    // Политики и лидеры
    'Владимир Путин', 'Дональд Трамп', 'Барак Обама', 'Джо Байден', 'Ангела Меркель',
    'Эммануэль Макрон', 'Борис Джонсон', 'Си Цзиньпин', 'Нарендра Моди', 'Реджеп Эрдоган',
    
    // Голливудские звезды (самые известные)
    'Анджелина Джоли', 'Леонардо ДиКаприо', 'Том Круз', 'Брэд Питт', 'Джонни Депп',
    'Роберт Дауни мл.', 'Скарлетт Йоханссон', 'Джулия Робертс', 'Мерил Стрип', 'Уилл Смит',
    'Том Хэнкс', 'Николь Кидман', 'Сандра Буллок', 'Джордж Клуни', 'Дженнифер Лоуренс',
    'Морган Фриман', 'Энтони Хопкинс', 'Киану Ривз', 'Дэниэл Крейг', 'Хью Джекман',
    'Мэтт Дэймон', 'Бен Аффлек', 'Эдди Мерфи', 'Джим Керри', 'Адам Сэндлер',
    'Арнольд Шварценеггер', 'Сильвестр Сталлоне', 'Брюс Уиллис', 'Харрисон Форд', 'Сэмюэл Л. Джексон',
    
    // Российские звезды (самые известные)
    'Константин Хабенский', 'Сергей Безруков', 'Владимир Машков', 'Данила Козловский', 'Евгений Миронов',
    'Чулпан Хаматова', 'Рената Литвинова', 'Светлана Ходченкова', 'Екатерина Климова', 'Ирина Горбачева',
    'Никита Михалков', 'Федор Бондарчук', 'Андрей Тарковский', 'Алексей Балабанов', 'Гоша Куценко',
    'Филипп Киркоров', 'Алла Пугачева', 'Максим Галкин', 'Иван Ургант', 'Андрей Малахов',
    
    // Музыканты-легенды (всех знают)
    'Майкл Джексон', 'Элвис Пресли', 'Джон Леннон', 'Пол Маккартни', 'Фредди Меркьюри',
    'Дэвид Боуи', 'Боб Дилан', 'Мадонна', 'Бейонсе', 'Тейлор Свифт',
    'Уитни Хьюстон', 'Селин Дион', 'Бритни Спирс', 'Леди Гага', 'Эминем',
    'Queen', 'The Beatles', 'Rolling Stones', 'Pink Floyd', 'Led Zeppelin',
    'AC/DC', 'Metallica', 'U2', 'Coldplay', 'Radiohead',
    
    // Российская музыка (хиты)
    'Алла Пугачева', 'Валерий Леонтьев', 'Иосиф Кобзон', 'Лев Лещенко', 'София Ротару',
    'Филипп Киркоров', 'Григорий Лепс', 'Николай Басков', 'Земфира', 'Валерий Меладзе',
    'Дима Билан', 'Полина Гагарина', 'Сергей Шнуров', 'Баста', 'Тимати',
    
    // Спорт (мегазвезды)
    'Криштиану Роналду', 'Лионель Месси', 'Майкл Джордан', 'Майк Тайсон', 'Мохаммед Али',
    'Усэйн Болт', 'Майкл Фелпс', 'Леброн Джеймс', 'Роджер Федерер', 'Рафаэль Надаль',
    'Новак Джокович', 'Серена Уильямс', 'Мария Шарапова', 'Александр Овечкин', 'Хабиб Нурмагомедов',
    'Конор МакГрегор', 'Флойд Мейвезер', 'Федор Емельяненко', 'Елена Исинбаева', 'Евгения Медведева',
    
    // Исторические личности (всех эпох)
    'Наполеон Бонапарт', 'Юлий Цезарь', 'Александр Македонский', 'Чингисхан', 'Клеопатра',
    'Екатерина Великая', 'Петр Первый', 'Иван Грозный', 'Александр Невский', 'Владимир Ленин',
    'Иосиф Сталин', 'Адольф Гитлер', 'Мао Цзэдун', 'Фидель Кастро', 'Че Гевара',
    'Нельсон Мандела', 'Мартин Лютер Кинг', 'Махатма Ганди', 'Уинстон Черчилль', 'Джон Кеннеди',
    'Авраам Линкольн', 'Джордж Вашингтон', 'Королева Елизавета II', 'Принцесса Диана', 'Михаил Горбачев',
    
    // Ученые и изобретатели (гении человечества)
    'Альберт Эйнштейн', 'Исаак Ньютон', 'Чарльз Дарвин', 'Галилео Галилей', 'Николай Коперник',
    'Мария Кюри', 'Томас Эдисон', 'Никола Тесла', 'Стив Джобс', 'Билл Гейтс',
    'Марк Цукерберг', 'Элон Мск', 'Джефф Безос', 'Уолт Дисней', 'Генри Форд',
    'Дмитрий Менделеев', 'Иван Павлов', 'Константин Циолковский', 'Сергей Королев', 'Андрей Сахаров',
    
    // Писатели (классики мировой литературы)
    'Уильям Шекспир', 'Лев Толстой', 'Федор Достоевский', 'Антон Чехов', 'Александр Пушкин',
    'Михаил Лермонтов', 'Сергей Есенин', 'Владимир Маяковский', 'Анна Ахматова', 'Борис Пастернак',
    'Джоан Роулинг', 'Стивен Кинг', 'Агата Кристи', 'Артур Конан Дойл', 'Жюль Верн',
    'Эрнест Хемингуэй', 'Марк Твен', 'Чарльз Диккенс', 'Джордж Оруэлл', 'Александр Солженицын',
    
    // Художники (мировые гении)
    'Леонардо да Винчи', 'Микеланджело', 'Винсент ван Гог', 'Пабло Пикассо', 'Сальвадор Дали',
    'Клод Моне', 'Анри Матисс', 'Илья Репин', 'Иван Айвазовский', 'Виктор Васнецов',
    'Казимир Малевич', 'Василий Кандинский', 'Марк Шагал', 'Энди Уорхол', 'Фрида Кало',
    
    // Режиссеры (классики кино)
    'Стивен Спилберг', 'Мартин Скорсезе', 'Квентин Тарантино', 'Альфред Хичкок', 'Стэнли Кубрик',
    'Джордж Лукас', 'Джеймс Кэмерон', 'Питер Джексон', 'Тим Бертон', 'Клинт Иствуд',
    'Сергей Эйзенштейн', 'Андрей Тарковский', 'Никита Михалков', 'Алексей Балабанов', 'Вуди Аллен',
    
    // Комики и телеведущие (мировые звезды)
    'Чарли Чаплин', 'Мистер Бин', 'Джим Керри', 'Робин Уильямс', 'Эдди Мерфи',
    'Джерри Сайнфелд', 'Эллен ДеДженерес', 'Опра Уинфри', 'Джимми Фэллон', 'Стивен Колберт',
    'Иван Ургант', 'Максим Галкин', 'Гарик Харламов', 'Павел Воля', 'Тимур Батрутдинов',
    
    // Знаменитости (самые известные лица)
    'Ким Кардашьян', 'Париж Хилтон', 'Кендалл Дженнер', 'Кайли Дженнер', 'Гордон Рамзи'
  ],
  cartoons: [
    'Микки Маус', 'Спанч Боб', 'Том и Джерри', 'Багз Банни', 'Покемон Пикачу',
    'Шрек', 'Симпсоны Гомер', 'Винни-Пух', 'Дональд Дак', 'Скуби-Ду',
    'Гарфилд', 'Розовая Пантера', 'Лунтик', 'Маша и Медведь', 'Чебурашка',
    'Крокодил Гена', 'Карлсон', 'Незнайка', 'Буратино', 'Колобок',
    'Три поросенка', 'Красная Шапочка', 'Золушка', 'Белоснежка', 'Русалочка',
    'Алладин', 'Симба', 'Немо', 'Валли', 'Бэтмен'
  ],
  movies: [
    'Гарри Поттер', 'Дарт Вейдер', 'Джеймс Бонд', 'Индиана Джонс', 'Терминатор',
    'Рэмбо', 'Рокки Бальбоа', 'Форрест Гамп', 'Джокер', 'Бэтмен',
    'Супермен', 'Человек-паук', 'Железный человек', 'Капитан Америка', 'Тор',
    'Халк', 'Дэдпул', 'Росомаха', 'Черная вдова', 'Чудо-женщина',
    'Гендальф', 'Фродо', 'Леголас', 'Арагорн', 'Голлум',
    'Люк Скайуокер', 'Принцесса Лея', 'Хан Соло', 'Йода', 'Чубакка'
  ],
  animals: [
    'Лев', 'Тигр', 'Слон', 'Жираф', 'Бегемот',
    'Крокодил', 'Зебра', 'Кенгуру', 'Панда', 'Коала',
    'Пингвин', 'Фламинго', 'Орел', 'Попугай', 'Сова',
    'Дельфин', 'Акула', 'Кит', 'Осьминог', 'Медуза',
    'Собака', 'Кот', 'Хомяк', 'Кролик', 'Лошадь',
    'Корова', 'Свинья', 'Овца', 'Коза', 'Петух'
  ],
  professions: [
    'Врач', 'Учитель', 'Полицейский', 'Пожарный', 'Пилот',
    'Программист', 'Дизайнер', 'Повар', 'Официант', 'Продавец',
    'Строитель', 'Электрик', 'Сантехник', 'Механик', 'Водитель',
    'Журналист', 'Фотограф', 'Актер', 'Музыкант', 'Художник',
    'Юрист', 'Бухгалтер', 'Менеджер', 'Секретарь', 'Уборщик',
    'Охранник', 'Массажист', 'Парикмахер', 'Стоматолог', 'Ветеринар'
  ],
  objects: [
    'Телефон', 'Компьютер', 'Телевизор', 'Холодильник', 'Микроволновка',
    'Стиральная машина', 'Пылесос', 'Утюг', 'Фен', 'Тостер',
    'Чайник', 'Кофеварка', 'Блендер', 'Миксер', 'Духовка',
    'Автомобиль', 'Велосипед', 'Самолет', 'Поезд', 'Корабль',
    'Часы', 'Очки', 'Шляпа', 'Сумка', 'Рюкзак',
    'Книга', 'Ручка', 'Карандаш', 'Ножницы', 'Линейка'
  ]
};

// Совместимость со старым API (временно)
let currentHeadwordsGame = {
  category: '',
  roles: [],
  playerCount: 0,
  rolesGiven: 0
};

// Создание структуры игры "Кто я?"
function createHeadwordsGame(roomId, categories, roles, playerCount) {
  return {
    id: roomId,
    type: 'headwords',
    categories: categories, // теперь массив категорий
    roles: roles,
    playerCount: playerCount,
    rolesGiven: 0,
    createdAt: new Date()
  };
}

// Создать новую игру "Кто я?"
app.post('/api/headwords/generate-game', (req, res) => {
  try {
    console.log('Получен запрос на создание игры Headwords:', req.body);
    const { playerCount, categories } = req.body;
    
    if (!playerCount || typeof playerCount !== 'number') {
      return res.status(400).json({ 
        error: 'Требуется указать количество игроков' 
      });
    }
    
    if (playerCount < 2 || playerCount > 20) {
      return res.status(400).json({ 
        error: 'Количество игроков должно быть от 2 до 20' 
      });
    }
    
    // Поддерживаем как старый формат (category), так и новый (categories)
    let selectedCategories = [];
    if (req.body.category) {
      // Обратная совместимость
      selectedCategories = [req.body.category];
      console.log('Используем старый формат category:', selectedCategories);
    } else if (categories && Array.isArray(categories) && categories.length > 0) {
      selectedCategories = categories;
      console.log('Используем новый формат categories:', selectedCategories);
    } else {
      console.log('Не найдены категории:', { category: req.body.category, categories });
      return res.status(400).json({ 
        error: 'Требуется указать хотя бы одну категорию' 
      });
    }
    
    // Проверяем валидность всех категорий
    console.log('Проверяем категории:', selectedCategories);
    console.log('Доступные категории:', Object.keys(headwordsCategories));
    
    for (const category of selectedCategories) {
      if (!headwordsCategories[category]) {
        console.log(`Категория "${category}" не найдена в headwordsCategories`);
        return res.status(400).json({ 
          error: `Неизвестная категория: ${category}. Доступные: ${Object.keys(headwordsCategories).join(', ')}` 
        });
      }
    }
    
    // Собираем роли из всех выбранных категорий
    let availableRoles = [];
    selectedCategories.forEach(category => {
      availableRoles.push(...headwordsCategories[category]);
    });
    
    // Удаляем дубликаты (если роль есть в нескольких категориях)
    availableRoles = [...new Set(availableRoles)];
    
    if (playerCount > availableRoles.length) {
      const categoryNames = selectedCategories.map(cat => getCategoryDisplayName(cat)).join(', ');
      return res.status(400).json({ 
        error: `В выбранных категориях (${categoryNames}) недостаточно уникальных ролей для ${playerCount} игроков (доступно: ${availableRoles.length})` 
      });
    }
    
    // Перемешиваем и выбираем нужное количество уникальных ролей
    const selectedRoles = [];
    const rolesPool = [...availableRoles]; // копируем массив
    
    for (let i = 0; i < playerCount; i++) {
      const randomIndex = Math.floor(Math.random() * rolesPool.length);
      selectedRoles.push(rolesPool.splice(randomIndex, 1)[0]);
    }
    
    // Создаем комнату
    const roomId = generateRoomId();
    const headwordsGame = createHeadwordsGame(roomId, selectedCategories, selectedRoles, playerCount);
    
    // Сохраняем игру в активных играх
    activeGames.set(roomId, headwordsGame);
    
    // Обновляем старые переменные для совместимости
    currentHeadwordsGame = {
      category: selectedCategories.join(', '), // для совместимости со старым API
      categories: selectedCategories,
      roles: selectedRoles,
      playerCount: playerCount,
      rolesGiven: 0
    };
    
    const categoryNames = selectedCategories.map(cat => getCategoryDisplayName(cat)).join(', ');
    console.log(`Создана игра "Кто я?" ${roomId}: категории "${categoryNames}", ${playerCount} игроков`);
    
    res.json({
      success: true,
      message: `Игра "Кто я?" создана для ${playerCount} игроков`,
      roomId: roomId,
      playerCount,
      categories: selectedCategories,
      categoriesDisplay: categoryNames,
      rolesCount: selectedRoles.length,
      availableRoles: availableRoles.length
    });
    
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// Получить свою роль в игре "Кто я?"
app.get('/api/headwords/get-role', (req, res) => {
  try {
    const { roomId } = req.query;
    
    if (roomId) {
      // Новый API с roomId
      const game = activeGames.get(roomId);
      if (!game || game.type !== 'headwords') {
        return res.status(404).json({ 
          error: 'Игра "Кто я?" не найдена. Проверьте ID комнаты.' 
        });
      }
      
      if (game.rolesGiven >= game.playerCount) {
        return res.status(404).json({ 
          error: 'Все роли уже розданы. Создайте новую игру.' 
        });
      }
      
      const currentPlayerIndex = game.rolesGiven;
      const role = game.roles[currentPlayerIndex];
      
      game.rolesGiven++;
      
      console.log(`Выдана роль в комнате ${roomId}: игрок ${currentPlayerIndex + 1} - "${role}"`);
      
      // Поддерживаем как старый формат (category), так и новый (categories)
      const categoriesDisplay = game.categories 
        ? game.categories.map(cat => getCategoryDisplayName(cat)).join(', ')
        : getCategoryDisplayName(game.category || 'unknown');
        
      const response = {
        playerNumber: currentPlayerIndex + 1,
        totalPlayers: game.playerCount,
        role: role,
        categories: game.categories || [game.category],
        categoriesDisplay: categoriesDisplay,
        // Обратная совместимость
        category: game.categories ? game.categories.join(', ') : game.category,
        isLastPlayer: game.rolesGiven === game.playerCount,
        roomId: roomId
      };
      
      res.json(response);
    } else {
      // Старый API для совместимости
      if (!currentHeadwordsGame.category || currentHeadwordsGame.roles.length === 0) {
        return res.status(404).json({ 
          error: 'Игра "Кто я?" не была создана. Сначала создайте игру.' 
        });
      }
      
      if (currentHeadwordsGame.rolesGiven >= currentHeadwordsGame.playerCount) {
        return res.status(404).json({ 
          error: 'Все роли уже розданы. Создайте новую игру.' 
        });
      }
      
      const currentPlayerIndex = currentHeadwordsGame.rolesGiven;
      const role = currentHeadwordsGame.roles[currentPlayerIndex];
      
      currentHeadwordsGame.rolesGiven++;
      
      console.log(`Выдана роль в игре "Кто я?": игрок ${currentPlayerIndex + 1} - "${role}"`);
      
      const response = {
        playerNumber: currentPlayerIndex + 1,
        totalPlayers: currentHeadwordsGame.playerCount,
        role: role,
        category: currentHeadwordsGame.category,
        isLastPlayer: currentHeadwordsGame.rolesGiven === currentHeadwordsGame.playerCount
      };
      
      res.json(response);
    }
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении роли' 
    });
  }
});

// Получить список доступных категорий
app.get('/api/headwords/categories', (req, res) => {
  console.log('Запрос категорий. Доступные категории:', Object.keys(headwordsCategories));
  
  const categories = Object.keys(headwordsCategories).map(key => ({
    id: key,
    name: getCategoryDisplayName(key),
    rolesCount: headwordsCategories[key].length
  }));
  
  console.log('Отправляем категории:', categories);
  
  res.json({
    categories: categories
  });
});

// Получить статус игры "Кто я?"
app.get('/api/headwords/status', (req, res) => {
  res.json({
    hasActiveGame: !!currentHeadwordsGame.category,
    category: currentHeadwordsGame.category || null,
    playerCount: currentHeadwordsGame.playerCount,
    rolesGiven: currentHeadwordsGame.rolesGiven,
    rolesRemaining: Math.max(0, currentHeadwordsGame.playerCount - currentHeadwordsGame.rolesGiven),
    allRolesGiven: currentHeadwordsGame.rolesGiven >= currentHeadwordsGame.playerCount
  });
});

// Сбросить игру "Кто я?"
app.post('/api/headwords/reset', (req, res) => {
  currentHeadwordsGame = {
    category: '',
    roles: [],
    playerCount: 0,
    rolesGiven: 0
  };
  
  console.log('Игра "Кто я?" сброшена');
  
  res.json({
    success: true,
    message: 'Игра "Кто я?" сброшена'
  });
});

// Функция для получения отображаемого имени категории
function getCategoryDisplayName(categoryId) {
  const displayNames = {
    celebrities: 'Знаменитости',
    cartoons: 'Мультфильмы',
    movies: 'Кино и сериалы',
    animals: 'Животные',
    professions: 'Профессии',
    objects: 'Предметы'
  };
  
  return displayNames[categoryId] || categoryId;
}

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
    
    // Создаем комнату
    const roomId = generateRoomId();
    const spyGame = createSpyGame(roomId, selectedLocation, spyIndex, playerCount);
    
    // Сохраняем игру в активных играх
    activeGames.set(roomId, spyGame);
    
    // Обновляем старые переменные для совместимости
    currentSpyGame = {
      location: selectedLocation,
      spyPlayerIndex: spyIndex,
      playerCount: playerCount,
      rolesGiven: 0
    };
    
    console.log(`Создана игра Шпион ${roomId}: локация "${selectedLocation}", шпион - игрок ${spyIndex + 1}/${playerCount}`);
    
    res.json({
      success: true,
      message: `Игра Шпион создана для ${playerCount} игроков`,
      roomId: roomId,
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
    const { roomId } = req.query;
    
    if (roomId) {
      // Новый API с roomId
      const game = activeGames.get(roomId);
      if (!game || game.type !== 'spy') {
        return res.status(404).json({ 
          error: 'Игра Шпион не найдена. Проверьте ID комнаты.' 
        });
      }
      
      if (game.rolesGiven >= game.playerCount) {
        return res.status(404).json({ 
          error: 'Все роли уже розданы. Создайте новую игру.' 
        });
      }
      
      const currentPlayerIndex = game.rolesGiven;
      const isSpy = currentPlayerIndex === game.spyPlayerIndex;
      
      game.rolesGiven++;
      
      console.log(`Выдана роль в комнате ${roomId}: игрок ${currentPlayerIndex + 1} - ${isSpy ? 'ШПИОН' : `житель локации "${game.location}"`}`);
      
      const response = {
        playerNumber: currentPlayerIndex + 1,
        totalPlayers: game.playerCount,
        isSpy: isSpy,
        isLastPlayer: game.rolesGiven === game.playerCount,
        roomId: roomId
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
        response.location = game.location;
        response.roleInfo = {
          name: 'Житель локации',
          description: `Вы находитесь в локации: ${game.location}`,
          instruction: 'Ваша задача - найти шпиона среди игроков'
        };
      }
      
      res.json(response);
    } else {
      // Старый API для совместимости
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
    }
    
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

// === ЭНДПОИНТЫ ДЛЯ ИГРЫ РОЛЬ НА ВЕЧЕР ===

// Категории заданий для игры "Роль на вечер"
const eveningRoleCategories = {
  ACCENT: 'accent',
  MOVEMENT: 'movement',
  DRINK: 'drink',
  SOCIAL: 'social',
  CREATIVE: 'creative',
  REACTION: 'reaction',
  ROLEPLAY: 'roleplay',
  PHONE: 'phone',
  CLOTHING: 'clothing',
  MAKEUP: 'makeup'
};

// База индивидуальных заданий (используем из клиентского кода)
const eveningRoleIndividualTasks = [
  // Акценты
  { id: 'accent_1', text: 'Говори весь вечер с грузинским акцентом, друг мой!', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_2', text: 'Используй французский акцент во всех разговорах, mon ami', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_3', text: 'Говори с британским акцентом, как настоящий джентльмен', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_4', text: 'Подражай американскому акценту из фильмов', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_5', text: 'Имитируй итальянский акцент с активной жестикуляцией', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_6', text: 'Говори с испанским акцентом с характерными раскатами', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_7', text: 'Используй немецкий акцент с характерной интонацией', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_8', text: 'Подражай одесскому говору с характерными фразочками', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_9', text: 'Говори как персонаж из мультфильма с забавным голосом', type: 'individual', category: eveningRoleCategories.ACCENT },
  { id: 'accent_10', text: 'Имитируй голос робота с механическими паузами', type: 'individual', category: eveningRoleCategories.ACCENT },

  // Движения и жесты
  { id: 'movement_1', text: 'Каждые 10 минут делай 5 приседаний где бы ты ни был', type: 'individual', category: eveningRoleCategories.MOVEMENT, hasTimer: true, timerDuration: 600 },
  { id: 'movement_2', text: 'Разговаривай только стоя, никогда не садись', type: 'individual', category: eveningRoleCategories.MOVEMENT },
  { id: 'movement_3', text: 'При каждом смехе делай танцевальное движение', type: 'individual', category: eveningRoleCategories.MOVEMENT },
  { id: 'movement_4', text: 'Ходи везде исключительно мелкими шажками', type: 'individual', category: eveningRoleCategories.MOVEMENT },
  { id: 'movement_5', text: 'Жестикулируй только левой рукой, правую держи за спиной', type: 'individual', category: eveningRoleCategories.MOVEMENT },
  { id: 'movement_6', text: 'При каждом новом предложении меняй позу', type: 'individual', category: eveningRoleCategories.MOVEMENT },
  { id: 'movement_7', text: 'Каждые 15 минут выполняй растяжку на 30 секунд', type: 'individual', category: eveningRoleCategories.MOVEMENT, hasTimer: true, timerDuration: 900 },
  { id: 'movement_8', text: 'Показывай пальцем на того, с кем говоришь', type: 'individual', category: eveningRoleCategories.MOVEMENT },
  { id: 'movement_9', text: 'Делай один оборот вокруг себя перед каждым ответом', type: 'individual', category: eveningRoleCategories.MOVEMENT },
  { id: 'movement_10', text: 'Сиди только на краешке стула или дивана', type: 'individual', category: eveningRoleCategories.MOVEMENT },

  // Питье и еда
  { id: 'drink_1', text: 'Пей только через трубочку весь вечер', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_2', text: 'Держи напиток двумя руками как ценную реликвию', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_3', text: 'Перед каждым глотком говори "За здоровье!"', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_4', text: 'Пей только когда кто-то другой тоже пьет', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_5', text: 'Комментируй вкус каждого напитка как сомелье', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_6', text: 'Ешь все только маленькими кусочками и медленно', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_7', text: 'Предлагай всем попробовать то, что ешь сам', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_8', text: 'Пей только из самого красивого стакана', type: 'individual', category: eveningRoleCategories.DRINK },
  { id: 'drink_9', text: 'Каждые 20 минут предлагай всем тост', type: 'individual', category: eveningRoleCategories.DRINK, hasTimer: true, timerDuration: 1200 },
  { id: 'drink_10', text: 'Ешь десерт в первую очередь, потом основное', type: 'individual', category: eveningRoleCategories.DRINK },

  // Социальное взаимодействие
  { id: 'social_1', text: 'Называй каждого человека только по имени + комплимент', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_2', text: 'Задавай каждому встречному один личный вопрос', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_3', text: 'Соглашайся со всем, что говорят другие', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_4', text: 'Постоянно хвали чью-то одежду или аксессуары', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_5', text: 'Представляйся каждому как старый знакомый', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_6', text: 'Рассказывай всем интересные факты о животных', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_7', text: 'Будь экспертом по любой теме разговора', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_8', text: 'Предлагай помощь каждые 10 минут кому-нибудь', type: 'individual', category: eveningRoleCategories.SOCIAL, hasTimer: true, timerDuration: 600 },
  { id: 'social_9', text: 'Запоминай и повторяй имена всех новых людей', type: 'individual', category: eveningRoleCategories.SOCIAL },
  { id: 'social_10', text: 'Благодари за каждую мелочь очень эмоционально', type: 'individual', category: eveningRoleCategories.SOCIAL },

  // Творческие задания
  { id: 'creative_1', text: 'Придумай рифму к каждому третьему предложению', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_2', text: 'Рассказывай все истории как сказки с зачином', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_3', text: 'Пой свои ответы вместо обычной речи', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_4', text: 'Изображай эмоции другого человека зеркально', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_5', text: 'Переводи все на язык жестов и мимики', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_6', text: 'Рисуй в воздухе то, о чем говоришь', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_7', text: 'Каждые 15 минут сочиняй короткое стихотворение', type: 'individual', category: eveningRoleCategories.CREATIVE, hasTimer: true, timerDuration: 900 },
  { id: 'creative_8', text: 'Изображай животное в зависимости от темы разговора', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_9', text: 'Превращай все в музыкальные инструменты и играй', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_10', text: 'Рассказывай истории только в жанре детектива', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_11', text: 'Нарисуй на руке временную татуировку в виде якоря', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_12', text: 'Разрисуй ногти в разные цвета подручными средствами', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_13', text: 'Нарисуй на ладони смайлик и разговаривай с ним', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_14', text: 'Создай боди-арт на руке в виде змеи или дракона', type: 'individual', category: eveningRoleCategories.CREATIVE },
  { id: 'creative_15', text: 'Нарисуй на лбу корону и веди себя как король/королева', type: 'individual', category: eveningRoleCategories.CREATIVE },

  // Реакции
  { id: 'reaction_1', text: 'Хлопай в ладоши при каждом удивлении', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_2', text: 'Смейся только беззвучно, показывая эмоции', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_3', text: 'Реагируй на все как на самую смешную шутку', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_4', text: 'Удивляйся каждому третьему факту очень эмоционально', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_5', text: 'Качай головой в ритм любой музыки', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_6', text: 'Подпрыгивай от радости при хороших новостях', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_7', text: 'Закрывай лицо руками при смущении', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_8', text: 'Делай широкие глаза при любом удивлении', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_9', text: 'Касайся сердца при каждом трогательном моменте', type: 'individual', category: eveningRoleCategories.REACTION },
  { id: 'reaction_10', text: 'Машь руками как бабочка при волнении', type: 'individual', category: eveningRoleCategories.REACTION },

  // Ролевые игры
  { id: 'roleplay_1', text: 'Веди себя как детектив, ищущий улики во всем', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_2', text: 'Будь корреспондентом, берущим интервью у всех', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_3', text: 'Изображай критика, оценивающего все происходящее', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_4', text: 'Веди себя как турист, восхищающийся всем новым', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_5', text: 'Будь тренером, мотивирующим всех вокруг', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_6', text: 'Изображай психолога, анализирующего поведение', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_7', text: 'Веди себя как телеведущий развлекательного шоу', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_8', text: 'Будь экскурсоводом, рассказывающим обо всем', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_9', text: 'Изображай шпиона, замечающего все детали', type: 'individual', category: eveningRoleCategories.ROLEPLAY },
  { id: 'roleplay_10', text: 'Веди себя как аристократ из прошлого века', type: 'individual', category: eveningRoleCategories.ROLEPLAY },

  // Телефон и технологии  
  { id: 'phone_1', text: 'Используй телефон только для фотографирования еды', type: 'individual', category: eveningRoleCategories.PHONE },
  { id: 'phone_2', text: 'Делай селфи с каждым новым собеседником', type: 'individual', category: eveningRoleCategories.PHONE },
  { id: 'phone_3', text: 'Проверяй время на телефоне каждые 7 минут', type: 'individual', category: eveningRoleCategories.PHONE, hasTimer: true, timerDuration: 420 },
  { id: 'phone_4', text: 'Отвечай на любые сообщения только голосовыми', type: 'individual', category: eveningRoleCategories.PHONE },
  { id: 'phone_5', text: 'Фотографируй каждый красивый момент вечера', type: 'individual', category: eveningRoleCategories.PHONE },
  { id: 'phone_6', text: 'Включай музыку для создания настроения каждые 20 минут', type: 'individual', category: eveningRoleCategories.PHONE, hasTimer: true, timerDuration: 1200 },
  { id: 'phone_7', text: 'Записывай голосовые заметки о впечатлениях', type: 'individual', category: eveningRoleCategories.PHONE },
  { id: 'phone_8', text: 'Показывай всем смешные мемы каждые 15 минут', type: 'individual', category: eveningRoleCategories.PHONE, hasTimer: true, timerDuration: 900 },
  { id: 'phone_9', text: 'Используй переводчик для общения на иностранном языке', type: 'individual', category: eveningRoleCategories.PHONE },
  { id: 'phone_10', text: 'Делай таймлапс видео из разных углов', type: 'individual', category: eveningRoleCategories.PHONE },

  // Одежда и стиль
  { id: 'clothing_1', text: 'Каждый час меняй один элемент в своем образе', type: 'individual', category: eveningRoleCategories.CLOTHING, hasTimer: true, timerDuration: 3600 },
  { id: 'clothing_2', text: 'Носи что-то на голове весь вечер', type: 'individual', category: eveningRoleCategories.CLOTHING },
  { id: 'clothing_3', text: 'Завязывай что-нибудь в бантик каждые 30 минут', type: 'individual', category: eveningRoleCategories.CLOTHING, hasTimer: true, timerDuration: 1800 },
  { id: 'clothing_4', text: 'Меняйся аксессуарами с другими каждый час', type: 'individual', category: eveningRoleCategories.CLOTHING, hasTimer: true, timerDuration: 3600, requiresOtherPlayer: true },
  { id: 'clothing_5', text: 'Носи все украшения на одной руке', type: 'individual', category: eveningRoleCategories.CLOTHING },
  { id: 'clothing_6', text: 'Делай необычные прически из подручных средств', type: 'individual', category: eveningRoleCategories.CLOTHING },
  { id: 'clothing_7', text: 'Используй салфетки как модные аксессуары', type: 'individual', category: eveningRoleCategories.CLOTHING },
  { id: 'clothing_8', text: 'Завязывай шнурки на обуви необычными способами', type: 'individual', category: eveningRoleCategories.CLOTHING },
  { id: 'clothing_9', text: 'Носи одежду наизнанку (один элемент)', type: 'individual', category: eveningRoleCategories.CLOTHING },
  { id: 'clothing_10', text: 'Создавай образы в стиле разных эпох', type: 'individual', category: eveningRoleCategories.CLOTHING },

  // Макияж и внешность
  { id: 'makeup_1', text: 'Нарисуй на лице усы и бороду как у настоящего пирата', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_2', text: 'Сделай себе кошачий макияж: усы, нос и полоски на щеках', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_3', text: 'Нарисуй на щеках румянец как у матрешки', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_4', text: 'Сделай себе макияж клоуна: красный нос и улыбку', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_5', text: 'Нарисуй на лице боевую раскраску индейца', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_6', text: 'Изобрази на лице макияж вампира с клыками', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_7', text: 'Нарисуй себе третий глаз на лбу', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_8', text: 'Сделай макияж супергероя с маской вокруг глаз', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_9', text: 'Нарисуй на щеке большое родимое пятно в форме сердца', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_10', text: 'Изобрази на лице старческие морщины и седые брови', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_11', text: 'Нарисуй на носу черную точку как у собачки', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_12', text: 'Сделай себе макияж зомби с синяками и шрамами', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_13', text: 'Нарисуй на лице узоры как у африканского племени', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_14', text: 'Изобрази макияж робота с металлическими деталями', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_15', text: 'Нарисуй на лице веснушки как у Пеппи Длинныйчулок', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_16', text: 'Сделай макияж панды: черные круги вокруг глаз', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_17', text: 'Нарисуй на щеках розовые яблочки как у куклы', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_18', text: 'Изобрази на лице макияж мима с белым лицом', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_19', text: 'Нарисуй себе монобровь как у Фриды Кало', type: 'individual', category: eveningRoleCategories.MAKEUP },
  { id: 'makeup_20', text: 'Сделай макияж дракона с чешуйками на висках', type: 'individual', category: eveningRoleCategories.MAKEUP }
];

// База групповых заданий
const eveningRoleGroupTasks = [
  { id: 'group_1', text: 'Вся компания должна одновременно произнести тост и чокнуться', type: 'group' },
  { id: 'group_2', text: 'Создайте живую цепочку: все встаньте и возьмитесь за руки на 2 минуты', type: 'group', hasTimer: true, timerDuration: 120 },
  { id: 'group_3', text: 'Устройте конкурс комплиментов: каждый говорит комплимент человеку справа', type: 'group' },
  { id: 'group_4', text: 'Сделайте общее селфи в самой необычной позе', type: 'group' },
  { id: 'group_5', text: 'Станцуйте все вместе любой танец в течение 1 минуты', type: 'group', hasTimer: true, timerDuration: 60 },
  { id: 'group_6', text: 'Поочередно расскажите по одному предложению общую историю', type: 'group' },
  { id: 'group_7', text: 'Создайте пирамиду из людей (безопасно!)', type: 'group' },
  { id: 'group_8', text: 'Спойте хором любую известную песню', type: 'group' },
  { id: 'group_9', text: 'Устройте конкурс на самую смешную рожицу', type: 'group' },
  { id: 'group_10', text: 'Поменяйтесь местами так, чтобы все сидели в алфавитном порядке имен', type: 'group' },
  { id: 'group_11', text: 'Создайте живой оркестр: каждый изображает музыкальный инструмент', type: 'group' },
  { id: 'group_12', text: 'Устройте молчаливый театр: покажите сценку без слов', type: 'group', hasTimer: true, timerDuration: 180 },
  { id: 'group_13', text: 'Передавайте по кругу невидимый мяч, следите за его траекторией', type: 'group' },
  { id: 'group_14', text: 'Составьте из себя буквы и напишите слово "ДРУЖБА"', type: 'group' },
  { id: 'group_15', text: 'Поочередно назовите 20 предметов красного цвета', type: 'group' },
  { id: 'group_16', text: 'Создайте самую длинную цепочку из одежды и аксессуаров', type: 'group' },
  { id: 'group_17', text: 'Устройте конкурс скороговорок: каждый должен сказать одну', type: 'group' },
  { id: 'group_18', text: 'Сделайте массовую зарядку: каждый показывает одно упражнение', type: 'group' },
  { id: 'group_19', text: 'Создайте художественную композицию из салфеток и посуды', type: 'group' },
  { id: 'group_20', text: 'Расскажите анекдоты по кругу, каждый по одному', type: 'group' }
];

// Создание структуры игры "Роль на вечер"
function createEveningRoleGame(roomId, playerCount) {
  return {
    id: roomId,
    type: 'evening-role',
    playerCount: playerCount,
    assignedTasks: new Map(), // userId -> task
    usedTaskIds: new Set(), // для уникальности
    playerRoleChanges: new Map(), // userId -> количество смен ролей
    createdAt: new Date()
  };
}

// Функция получения случайного индивидуального задания
function getRandomIndividualTaskServer(game) {
  const availableTasks = eveningRoleIndividualTasks.filter(task => 
    !game.usedTaskIds.has(task.id)
  );
  
  if (availableTasks.length === 0) {
    // Если все задания использованы, сбрасываем и начинаем заново
    game.usedTaskIds.clear();
    return eveningRoleIndividualTasks[Math.floor(Math.random() * eveningRoleIndividualTasks.length)];
  }
  
  return availableTasks[Math.floor(Math.random() * availableTasks.length)];
}

// Функция получения случайного группового задания
function getRandomGroupTaskServer() {
  return eveningRoleGroupTasks[Math.floor(Math.random() * eveningRoleGroupTasks.length)];
}

// Создать новую игру "Роль на вечер"
app.post('/api/evening-role/generate-game', (req, res) => {
  try {
    const { playerCount } = req.body;
    
    if (!playerCount || typeof playerCount !== 'number') {
      return res.status(400).json({ 
        error: 'Требуется указать количество игроков' 
      });
    }
    
    if (playerCount < 2 || playerCount > 50) {
      return res.status(400).json({ 
        error: 'Количество игроков должно быть от 2 до 50' 
      });
    }
    
    // Создаем комнату
    const roomId = generateRoomId();
    const eveningRoleGame = createEveningRoleGame(roomId, playerCount);
    
    // Сохраняем игру в активных играх
    activeGames.set(roomId, eveningRoleGame);
    
    console.log(`Создана игра "Роль на вечер" ${roomId} для ${playerCount} игроков`);
    
    res.json({
      success: true,
      message: `Игра "Роль на вечер" создана для ${playerCount} игроков`,
      roomId: roomId,
      playerCount,
      individualTasksCount: eveningRoleIndividualTasks.length,
      groupTasksCount: eveningRoleGroupTasks.length
    });
    
  } catch (error) {
    res.status(400).json({ 
      error: error.message 
    });
  }
});

// Получить индивидуальное задание
app.get('/api/evening-role/get-task', (req, res) => {
  try {
    const { roomId, userId } = req.query;
    
    if (!roomId) {
      return res.status(400).json({ 
        error: 'Требуется указать ID комнаты' 
      });
    }
    
    if (!userId) {
      return res.status(400).json({ 
        error: 'Требуется указать ID пользователя' 
      });
    }
    
    const game = activeGames.get(roomId);
    if (!game || game.type !== 'evening-role') {
      return res.status(404).json({ 
        error: 'Игра "Роль на вечер" не найдена. Проверьте ID комнаты.' 
      });
    }
    
    // Проверяем, есть ли уже задание у этого пользователя
    if (game.assignedTasks.has(userId)) {
      const existingTask = game.assignedTasks.get(userId);
      console.log(`Возвращаем существующее задание для пользователя ${userId} в комнате ${roomId}`);
      
      res.json({
        task: existingTask,
        canChangeRole: (game.playerRoleChanges.get(userId) || 0) < 1,
        roomId: roomId
      });
      return;
    }
    
    // Генерируем новое уникальное задание
    const task = getRandomIndividualTaskServer(game);
    
    // Сохраняем задание за пользователем
    game.assignedTasks.set(userId, task);
    game.usedTaskIds.add(task.id);
    
    // Инициализируем счетчик смен ролей
    if (!game.playerRoleChanges.has(userId)) {
      game.playerRoleChanges.set(userId, 0);
    }
    
    console.log(`Выдано новое задание пользователю ${userId} в комнате ${roomId}: "${task.text}"`);
    
    res.json({
      task: task,
      canChangeRole: true,
      roomId: roomId
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении задания' 
    });
  }
});

// Сменить роль (только один раз)
app.post('/api/evening-role/change-task', (req, res) => {
  try {
    const { roomId, userId } = req.body;
    
    if (!roomId || !userId) {
      return res.status(400).json({ 
        error: 'Требуется указать ID комнаты и пользователя' 
      });
    }
    
    const game = activeGames.get(roomId);
    if (!game || game.type !== 'evening-role') {
      return res.status(404).json({ 
        error: 'Игра "Роль на вечер" не найдена. Проверьте ID комнаты.' 
      });
    }
    
    // Проверяем, может ли пользователь сменить роль
    const roleChanges = game.playerRoleChanges.get(userId) || 0;
    if (roleChanges >= 1) {
      return res.status(403).json({ 
        error: 'Вы уже использовали свою возможность сменить роль' 
      });
    }
    
    // Удаляем старое задание из использованных (если было)
    const oldTask = game.assignedTasks.get(userId);
    if (oldTask) {
      game.usedTaskIds.delete(oldTask.id);
    }
    
    // Генерируем новое задание
    const newTask = getRandomIndividualTaskServer(game);
    
    // Сохраняем новое задание
    game.assignedTasks.set(userId, newTask);
    game.usedTaskIds.add(newTask.id);
    game.playerRoleChanges.set(userId, roleChanges + 1);
    
    console.log(`Пользователь ${userId} сменил роль в комнате ${roomId}: "${newTask.text}"`);
    
    res.json({
      task: newTask,
      canChangeRole: false,
      roomId: roomId
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при смене роли' 
    });
  }
});

// Получить групповое задание
app.get('/api/evening-role/get-group-task', (req, res) => {
  try {
    const task = getRandomGroupTaskServer();
    
    res.json({
      task: task
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении группового задания' 
    });
  }
});

// Получить статус игры "Роль на вечер"
app.get('/api/evening-role/status', (req, res) => {
  try {
    const { roomId } = req.query;
    
    if (!roomId) {
      return res.status(400).json({ 
        error: 'Требуется указать ID комнаты' 
      });
    }
    
    const game = activeGames.get(roomId);
    if (!game || game.type !== 'evening-role') {
      return res.status(404).json({ 
        error: 'Игра не найдена' 
      });
    }
    
    res.json({
      hasActiveGame: true,
      roomId: roomId,
      playerCount: game.playerCount,
      assignedTasksCount: game.assignedTasks.size,
      usedTasksCount: game.usedTaskIds.size,
      totalIndividualTasks: eveningRoleIndividualTasks.length,
      totalGroupTasks: eveningRoleGroupTasks.length
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении статуса игры' 
    });
  }
});

// === ЭНДПОИНТЫ ДЛЯ ИГРЫ ТАЙНЫЙ АГЕНТ ===

// Миссии для прикрытия (аналогично заданиям из Evening Role)
const secretAgentCoverMissions = [
  // СОЦИАЛЬНЫЕ ВЗАИМОДЕЙСТВИЯ
  { id: 'cover_social_1', type: 'cover', title: 'Тамада-провокатор', description: 'Всегда перехватывай инициативу при тостах и предлагай выпить первым', category: 'social', difficulty: 'medium' },
  { id: 'cover_social_2', type: 'cover', title: 'Комплимент-машина', description: 'Делай комплимент каждому новому человеку, с которым начинаешь разговор', category: 'social', difficulty: 'easy' },
  { id: 'cover_social_3', type: 'cover', title: 'Миротворец', description: 'При любом споре или разногласии предлагай компромисс и меняй тему', category: 'social', difficulty: 'medium' },
  { id: 'cover_social_4', type: 'cover', title: 'Фотограф-энтузиаст', description: 'Постоянно предлагай сделать фото, особенно групповые снимки', category: 'social', difficulty: 'easy' },
  { id: 'cover_social_5', type: 'cover', title: 'Знакомец универсальный', description: 'Представляй людей друг другу, если видишь что они не знакомы', category: 'social', difficulty: 'easy' },
  { id: 'cover_social_6', type: 'cover', title: 'Историк-рассказчик', description: 'В каждом разговоре рассказывай интересную историю из жизни', category: 'social', difficulty: 'medium' },
  
  // СВЯЗАННЫЕ С НАПИТКАМИ
  { id: 'cover_drinks_1', type: 'cover', title: 'Уличный курильщик', description: 'При каждом упоминании слова "выпьем" выходи покурить или подышать на балкон', category: 'drinks', difficulty: 'medium' },
  { id: 'cover_drinks_2', type: 'cover', title: 'Бармен-консультант', description: 'Предлагай всем что выпить и рассказывай о напитках', category: 'drinks', difficulty: 'easy' },
  { id: 'cover_drinks_3', type: 'cover', title: 'Водохлёб', description: 'Постоянно пей воду и предлагай другим не забывать пить воду', category: 'drinks', difficulty: 'easy' },
  { id: 'cover_drinks_4', type: 'cover', title: 'Чокальщик', description: 'Всегда чокайся со всеми присутствующими при любом тосте', category: 'drinks', difficulty: 'easy' },
  
  // РАЗГОВОРНЫЕ ПРИВЫЧКИ
  { id: 'cover_conversation_1', type: 'cover', title: 'Переводчик настроения', description: 'Постоянно говори "Я вижу ты в хорошем настроении" или наоборот', category: 'conversation', difficulty: 'easy' },
  { id: 'cover_conversation_2', type: 'cover', title: 'Эхо-человек', description: 'Повторяй последние слова собеседника в виде вопроса', category: 'conversation', difficulty: 'medium' },
  { id: 'cover_conversation_3', type: 'cover', title: 'Психолог-любитель', description: 'Анализируй поведение людей и делись наблюдениями', category: 'conversation', difficulty: 'medium' },
  
  // ДВИЖЕНИЯ И ЖЕСТЫ
  { id: 'cover_movement_1', type: 'cover', title: 'Танцевальная машина', description: 'Качайся в такт любой музыке, даже фоновой', category: 'movement', difficulty: 'easy' },
  { id: 'cover_movement_2', type: 'cover', title: 'Обнимашка', description: 'Обнимай людей при встрече и прощании (если уместно)', category: 'movement', difficulty: 'easy' },
  { id: 'cover_movement_3', type: 'cover', title: 'Дирижёр эмоций', description: 'Активно жестикулируй и используй мимику при разговоре', category: 'movement', difficulty: 'easy' }
];

// Главные миссии
const secretAgentMainMissions = [
  // ВЗАИМОДЕЙСТВИЕ С ЛЮДЬМИ
  { id: 'main_interaction_1', type: 'main', title: 'Танец равенства', description: 'Станцуй медленный танец с человеком своего пола', category: 'interaction', difficulty: 'medium', timeLimit: 5 },
  { id: 'main_interaction_2', type: 'main', title: 'Объятия пятёрки', description: 'Обними 5 разных людей в течение 5 минут', category: 'interaction', difficulty: 'easy', timeLimit: 5 },
  { id: 'main_interaction_3', type: 'main', title: 'Массаж-цепочка', description: 'Сделай массаж плеч трём разным людям', category: 'interaction', difficulty: 'medium', timeLimit: 5 },
  { id: 'main_interaction_4', type: 'main', title: 'Комплимент каждому', description: 'Сделай персональный комплимент каждому присутствующему', category: 'interaction', difficulty: 'medium', timeLimit: 5 },
  
  // НЕБОЛЬШИЕ ВЫСТУПЛЕНИЯ
  { id: 'main_performance_1', type: 'main', title: 'Стенд-ап комик', description: 'Расскажи смешную историю, чтобы все засмеялись', category: 'performance', difficulty: 'medium', timeLimit: 5 },
  { id: 'main_performance_2', type: 'main', title: 'Певец настроения', description: 'Спой куплет любимой песни компании', category: 'performance', difficulty: 'medium', timeLimit: 5 },
  { id: 'main_performance_3', type: 'main', title: 'Танцор-импровизатор', description: 'Станцуй танец под любую музыку минимум 2 минуты', category: 'performance', difficulty: 'medium', timeLimit: 5 },
  
  // СБОР ЧЕГО-ЛИБО
  { id: 'main_collection_1', type: 'main', title: 'Коллекционер улыбок', description: 'Сфотографируй улыбку каждого присутствующего', category: 'collection', difficulty: 'easy', timeLimit: 5 },
  { id: 'main_collection_2', type: 'main', title: 'Собиратель секретов', description: 'Узнай один интересный факт о каждом человеке', category: 'collection', difficulty: 'medium', timeLimit: 5 },
  
  // ОБЩЕНИЕ
  { id: 'main_communication_1', type: 'main', title: 'Переводчик настроений', description: 'Угадай и озвучь настроение каждого человека', category: 'communication', difficulty: 'medium', timeLimit: 5 },
  { id: 'main_communication_2', type: 'main', title: 'Предсказатель будущего', description: 'Сделай позитивное предсказание на будущее каждому', category: 'communication', difficulty: 'medium', timeLimit: 5 }
];

// Создание структуры игры Тайный агент
function createSecretAgentGame(roomId, playerCount, gameDuration, allowHostParticipation) {
  return {
    id: roomId,
    type: 'secret-agent',
    playerCount: playerCount,
    gameDuration: gameDuration,
    allowHostParticipation: allowHostParticipation,
    assignedMissions: new Map(), // userId -> {cover: mission, main: mission}
    usedCoverMissionIds: new Set(),
    usedMainMissionIds: new Set(),
    createdAt: new Date()
  };
}

// Функция для получения случайной миссии прикрытия
function getRandomCoverMission(game) {
  const availableMissions = secretAgentCoverMissions.filter(mission => 
    !game.usedCoverMissionIds.has(mission.id)
  );
  
  if (availableMissions.length === 0) {
    // Если все миссии использованы, сбрасываем и начинаем заново
    game.usedCoverMissionIds.clear();
    return secretAgentCoverMissions[Math.floor(Math.random() * secretAgentCoverMissions.length)];
  }
  
  const randomIndex = Math.floor(Math.random() * availableMissions.length);
  const selectedMission = availableMissions[randomIndex];
  game.usedCoverMissionIds.add(selectedMission.id);
  
  return selectedMission;
}

// Функция для получения случайной главной миссии
function getRandomMainMission(game) {
  const availableMissions = secretAgentMainMissions.filter(mission => 
    !game.usedMainMissionIds.has(mission.id)
  );
  
  if (availableMissions.length === 0) {
    // Если все миссии использованы, сбрасываем и начинаем заново
    game.usedMainMissionIds.clear();
    return secretAgentMainMissions[Math.floor(Math.random() * secretAgentMainMissions.length)];
  }
  
  const randomIndex = Math.floor(Math.random() * availableMissions.length);
  const selectedMission = availableMissions[randomIndex];
  game.usedMainMissionIds.add(selectedMission.id);
  
  return selectedMission;
}

// Создать новую игру Тайный агент
app.post('/api/secret-agent/create-game', (req, res) => {
  try {
    const { roomId, playerCount, gameDuration, allowHostParticipation } = req.body;
    
    if (!roomId || !playerCount || !gameDuration) {
      return res.status(400).json({ 
        error: 'Требуются параметры: roomId, playerCount, gameDuration' 
      });
    }
    
    if (playerCount < 3 || playerCount > 15) {
      return res.status(400).json({ 
        error: 'Количество игроков должно быть от 3 до 15' 
      });
    }
    
    // Создаем игру
    const secretAgentGame = createSecretAgentGame(roomId, playerCount, gameDuration, allowHostParticipation);
    
    // Сохраняем игру в активных играх
    activeGames.set(roomId, secretAgentGame);
    
    console.log(`✅ Создана игра "Тайный агент" с ID: ${roomId}, игроков: ${playerCount}`);
    
    res.json({
      success: true,
      roomId: roomId,
      message: 'Игра "Тайный агент" создана успешно'
    });
    
  } catch (error) {
    console.error('Ошибка создания игры "Тайный агент":', error);
    res.status(500).json({ 
      error: 'Ошибка при создании игры' 
    });
  }
});

// Получить миссии для игрока
app.get('/api/secret-agent/get-missions', (req, res) => {
  try {
    const { roomId, userId, playerName } = req.query;
    
    if (!roomId || !userId) {
      return res.status(400).json({ 
        error: 'Требуются параметры: roomId, userId' 
      });
    }
    
    const game = activeGames.get(roomId);
    if (!game || game.type !== 'secret-agent') {
      return res.status(404).json({ 
        error: 'Игра не найдена' 
      });
    }
    
    // Проверяем, есть ли уже миссии для этого пользователя
    if (game.assignedMissions.has(userId)) {
      const missions = game.assignedMissions.get(userId);
      return res.json({
        coverMission: missions.cover,
        mainMission: missions.main,
        playerName: missions.playerName || playerName
      });
    }
    
    // Генерируем новые миссии
    const coverMission = getRandomCoverMission(game);
    const mainMission = getRandomMainMission(game);
    
    // Сохраняем миссии для пользователя
    game.assignedMissions.set(userId, {
      cover: coverMission,
      main: mainMission,
      playerName: playerName || 'Агент',
      assignedAt: new Date()
    });
    
    console.log(`🕵️ Игрок ${playerName} (${userId}) получил миссии в комнате ${roomId}`);
    
    res.json({
      coverMission: coverMission,
      mainMission: mainMission,
      playerName: playerName
    });
    
  } catch (error) {
    console.error('Ошибка получения миссий:', error);
    res.status(500).json({ 
      error: 'Ошибка при получении миссий' 
    });
  }
});

// Получить статус игры
app.get('/api/secret-agent/status/:roomId', (req, res) => {
  try {
    const { roomId } = req.params;
    
    const game = activeGames.get(roomId);
    if (!game || game.type !== 'secret-agent') {
      return res.status(404).json({ 
        error: 'Игра не найдена' 
      });
    }
    
    res.json({
      hasActiveGame: true,
      roomId: roomId,
      playerCount: game.playerCount,
      gameDuration: game.gameDuration,
      allowHostParticipation: game.allowHostParticipation,
      assignedMissionsCount: game.assignedMissions.size,
      usedCoverMissionsCount: game.usedCoverMissionIds.size,
      usedMainMissionsCount: game.usedMainMissionIds.size,
      totalCoverMissions: secretAgentCoverMissions.length,
      totalMainMissions: secretAgentMainMissions.length,
      createdAt: game.createdAt
    });
    
  } catch (error) {
    res.status(500).json({ 
      error: 'Ошибка при получении статуса игры' 
    });
  }
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
  console.log(`   === КТО Я? ===`);
  console.log(`   POST /api/headwords/generate-game - Создать игру "Кто я?"`);
  console.log(`   GET  /api/headwords/get-role - Получить роль`);
  console.log(`   GET  /api/headwords/categories - Получить категории`);
  console.log(`   GET  /api/headwords/status - Статус игры`);
  console.log(`   POST /api/headwords/reset - Сбросить игру`);
  console.log(`   === РОЛЬ НА ВЕЧЕР ===`);
  console.log(`   POST /api/evening-role/generate-game - Создать игру "Роль на вечер"`);
  console.log(`   GET  /api/evening-role/get-task - Получить индивидуальное задание`);
  console.log(`   POST /api/evening-role/change-task - Сменить роль (один раз)`);
  console.log(`   GET  /api/evening-role/get-group-task - Получить групповое задание`);
  console.log(`   GET  /api/evening-role/status - Статус игры`);
  console.log(`   === ТАЙНЫЙ АГЕНТ ===`);
  console.log(`   POST /api/secret-agent/create-game - Создать игру "Тайный агент"`);
  console.log(`   GET  /api/secret-agent/get-missions - Получить миссии`);
  console.log(`   GET  /api/secret-agent/status/:roomId - Статус игры`);
});