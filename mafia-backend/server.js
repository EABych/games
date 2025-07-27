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
  console.log(`   === СЛОВА НА ЛОБ ===`);
  console.log(`   POST /api/headwords/generate-game - Создать игру "Кто я?"`);
  console.log(`   GET  /api/headwords/get-role - Получить роль`);
  console.log(`   GET  /api/headwords/categories - Получить категории`);
  console.log(`   GET  /api/headwords/status - Статус игры`);
  console.log(`   POST /api/headwords/reset - Сбросить игру`);
});