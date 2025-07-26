# Mafia Roles Server

Упрощенный сервер для распределения ролей в игре Мафия.

## Функциональность

Сервер работает по простому принципу:
1. Получает запрос на генерацию списка ролей заданной длины
2. Принимает X запросов на получение роли (по одному от каждого игрока)
3. Последующий запрос на генерацию удаляет прошлый список и создает новый

## API Endpoints

### POST `/api/mafia/generate-roles`
Создает новый список ролей (удаляет предыдущий если был).

**Тело запроса:**
```json
{
  "playerCount": 8,
  "settings": {
    "includeDoctor": true,
    "includeDetective": true,
    "includeSheriff": false,
    "includeDon": false
  }
}
```

**Ответ:**
```json
{
  "success": true,
  "message": "Роли сгенерированы для 8 игроков",
  "playerCount": 8,
  "totalRoles": 8,
  "mafiaCount": 2,
  "citizensCount": 6
}
```

### GET `/api/mafia/get-role`
Получить следующую роль из списка.

**Ответ:**
```json
{
  "role": "detective",
  "roleInfo": {
    "name": "Детектив",
    "description": "Проверяйте игроков ночью на принадлежность к мафии",
    "team": "citizens",
    "nightAction": true
  },
  "playerNumber": 3,
  "totalPlayers": 8,
  "isLastPlayer": false
}
```

### GET `/api/mafia/status`
Проверить статус текущей игры.

**Ответ:**
```json
{
  "hasActiveGame": true,
  "totalRoles": 8,
  "rolesGiven": 3,
  "rolesRemaining": 5,
  "allRolesGiven": false
}
```

### POST `/api/mafia/reset`
Сбросить текущую игру.

## Правила распределения ролей

- **Мафия**: ~1/3 от общего количества игроков
- **Дон мафии**: заменяет одного мафиози (опционально)
- **Доктор**: добавляется при 6+ игроков
- **Детектив**: добавляется при 5+ игроков
- **Шериф**: альтернатива детективу
- **Мирные жители**: заполняют оставшиеся места

## Запуск

### Локально
```bash
npm install
npm run dev
```

### Продакшн
```bash
npm start
```

## Деплой на Render.com

1. Создайте Web Service на Render
2. Подключите GitHub репозиторий
3. Настройки:
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `mafia-backend` (важно!)

## Пример использования

1. **Создание игры:**
   ```bash
   curl -X POST https://your-server.com/api/mafia/generate-roles \
     -H "Content-Type: application/json" \
     -d '{"playerCount": 6}'
   ```

2. **Получение ролей (каждый игрок):**
   ```bash
   curl https://your-server.com/api/mafia/get-role
   ```

3. **Новая игра:**
   ```bash
   curl -X POST https://your-server.com/api/mafia/generate-roles \
     -H "Content-Type: application/json" \
     -d '{"playerCount": 8}'
   ```