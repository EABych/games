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
    currentGame: {
      totalRoles: currentRoles.length,
      rolesGiven: roleIndex,
      rolesRemaining: Math.max(0, currentRoles.length - roleIndex)
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

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🎭 Mafia Roles Server запущен на порту ${PORT}`);
  console.log(`📝 Доступные endpoints:`);
  console.log(`   POST /api/mafia/generate-roles - Создать список ролей`);
  console.log(`   GET  /api/mafia/get-role - Получить роль`);
  console.log(`   GET  /api/mafia/status - Статус игры`);
  console.log(`   POST /api/mafia/reset - Сбросить игру`);
});