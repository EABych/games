import type { RoleInfo, MafiaRole } from '../types/mafia';

export const ROLE_INFO: Record<MafiaRole, RoleInfo> = {
  citizen: {
    name: 'Мирный житель',
    description: 'Ваша цель — найти и устранить всех мафиози. Голосуйте мудро!',
    team: 'citizens',
    color: '#34C759',
    emoji: '👨‍💼'
  },
  mafia: {
    name: 'Мафиози',
    description: 'Ваша цель — устранить всех мирных жителей. Действуйте скрытно!',
    team: 'mafia',
    color: '#FF3B30',
    emoji: '🕴️'
  },
  detective: {
    name: 'Детектив',
    description: 'Каждую ночь вы можете проверить одного игрока. Найдите мафию!',
    team: 'citizens',
    color: '#007AFF',
    emoji: '🕵️'
  },
  doctor: {
    name: 'Доктор',
    description: 'Каждую ночь вы можете защитить одного игрока от убийства.',
    team: 'citizens',
    color: '#5856D6',
    emoji: '👨‍⚕️'
  },
  moderator: {
    name: 'Ведущий',
    description: 'Вы управляете игрой и знаете все роли игроков.',
    team: 'citizens',
    color: '#FF9500',
    emoji: '🎭'
  }
};

export function getOptimalRoleDistribution(playerCount: number, enableDoctor: boolean = true, enableDetective: boolean = true): MafiaRole[] {
  if (playerCount < 4) {
    throw new Error('Минимум 4 игрока для игры в Мафию');
  }

  const roles: MafiaRole[] = [];
  
  // Добавляем модератора
  roles.push('moderator');
  const playingCount = playerCount - 1;

  // Рассчитываем количество мафии (примерно 1/3 от играющих)
  const mafiaCount = Math.floor(playingCount / 3);
  
  // Добавляем мафию
  for (let i = 0; i < mafiaCount; i++) {
    roles.push('mafia');
  }

  let remainingSlots = playingCount - mafiaCount;

  // Добавляем специальные роли
  if (enableDetective && remainingSlots > 0) {
    roles.push('detective');
    remainingSlots--;
  }

  if (enableDoctor && remainingSlots > 0) {
    roles.push('doctor');
    remainingSlots--;
  }

  // Остальные - мирные жители
  for (let i = 0; i < remainingSlots; i++) {
    roles.push('citizen');
  }

  return roles;
}

export function shuffleRoles(roles: MafiaRole[]): MafiaRole[] {
  const shuffled = [...roles];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}