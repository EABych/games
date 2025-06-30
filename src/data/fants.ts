import type { Fant } from '../types/fants';

export const FANTS: Fant[] = [
  // Творческие - легкие
  {
    id: 'cr-1',
    text: 'Нарисуй автопортрет с закрытыми глазами',
    category: 'creative',
    difficulty: 'easy'
  },
  {
    id: 'cr-2',
    text: 'Сочини четверостишие о любом предмете в комнате',
    category: 'creative',
    difficulty: 'easy'
  },
  {
    id: 'cr-3',
    text: 'Изобрази любое животное звуками и движениями',
    category: 'creative',
    difficulty: 'easy'
  },
  {
    id: 'cr-4',
    text: 'Придумай новое применение для обычной ложки',
    category: 'creative',
    difficulty: 'easy'
  },
  {
    id: 'cr-5',
    text: 'Нарисуй дом своей мечты за 30 секунд',
    category: 'creative',
    difficulty: 'easy'
  },

  // Творческие - средние
  {
    id: 'cr-6',
    text: 'Сочини и спой песню про то, что видишь вокруг',
    category: 'creative',
    difficulty: 'medium'
  },
  {
    id: 'cr-7',
    text: 'Расскажи историю, где каждое предложение начинается с новой буквы алфавита',
    category: 'creative',
    difficulty: 'medium'
  },
  {
    id: 'cr-8',
    text: 'Создай скульптуру из подручных предметов',
    category: 'creative',
    difficulty: 'medium'
  },

  // Весёлые - легкие
  {
    id: 'fn-1',
    text: 'Говори в течение минуты только рифмованными фразами',
    category: 'funny',
    difficulty: 'easy'
  },
  {
    id: 'fn-2',
    text: 'Изобрази робота, который сломался',
    category: 'funny',
    difficulty: 'easy'
  },
  {
    id: 'fn-3',
    text: 'Расскажи анекдот, меняя голос на каждом слове',
    category: 'funny',
    difficulty: 'easy'
  },
  {
    id: 'fn-4',
    text: 'Покажи, как выглядит твоё утро без будильника',
    category: 'funny',
    difficulty: 'easy'
  },
  {
    id: 'fn-5',
    text: 'Поговори с воображаемым попугаем 30 секунд',
    category: 'funny',
    difficulty: 'easy'
  },
  {
    id: 'fn-6',
    text: 'Изобрази, как ты ешь лимон',
    category: 'funny',
    difficulty: 'easy'
  },

  // Весёлые - средние
  {
    id: 'fn-7',
    text: 'Проведи интервью с предметом мебели',
    category: 'funny',
    difficulty: 'medium'
  },
  {
    id: 'fn-8',
    text: 'Изобрази известного человека, не называя его имени',
    category: 'funny',
    difficulty: 'medium'
  },

  // Активные - легкие
  {
    id: 'ac-1',
    text: 'Попрыгай на одной ноге 10 раз',
    category: 'active',
    difficulty: 'easy'
  },
  {
    id: 'ac-2',
    text: 'Сделай 5 приседаний',
    category: 'active',
    difficulty: 'easy'
  },
  {
    id: 'ac-3',
    text: 'Станцуй танец маленьких утят',
    category: 'active',
    difficulty: 'easy'
  },
  {
    id: 'ac-4',
    text: 'Покружись вокруг себя 5 раз',
    category: 'active',
    difficulty: 'easy'
  },
  {
    id: 'ac-5',
    text: 'Изобрази йогу, которую делает кот',
    category: 'active',
    difficulty: 'easy'
  },

  // Активные - средние
  {
    id: 'ac-6',
    text: 'Станцуй танец дождя',
    category: 'active',
    difficulty: 'medium'
  },
  {
    id: 'ac-7',
    text: 'Покажи, как ходят разные животные (5 животных)',
    category: 'active',
    difficulty: 'medium'
  },
  {
    id: 'ac-8',
    text: 'Сделай зарядку для всей компании',
    category: 'active',
    difficulty: 'medium'
  },

  // Социальные - легкие
  {
    id: 'sc-1',
    text: 'Сделай комплимент каждому игроку',
    category: 'social',
    difficulty: 'easy'
  },
  {
    id: 'sc-2',
    text: 'Расскажи о своём самом смешном воспоминании',
    category: 'social',
    difficulty: 'easy'
  },
  {
    id: 'sc-3',
    text: 'Задай каждому игроку интересный вопрос',
    category: 'social',
    difficulty: 'easy'
  },
  {
    id: 'sc-4',
    text: 'Изобрази эмоцию, а остальные должны угадать',
    category: 'social',
    difficulty: 'easy'
  },
  {
    id: 'sc-5',
    text: 'Расскажи, за что ты благодарен сегодня',
    category: 'social',
    difficulty: 'easy'
  },

  // Социальные - средние
  {
    id: 'sc-6',
    text: 'Проведи мини-интервью с каждым игроком (по 1 вопросу)',
    category: 'social',
    difficulty: 'medium'
  },
  {
    id: 'sc-7',
    text: 'Устрой групповое селфи с необычными позами',
    category: 'social',
    difficulty: 'medium'
  },

  // Размышления - легкие
  {
    id: 'th-1',
    text: 'Назови 10 вещей красного цвета',
    category: 'thinking',
    difficulty: 'easy'
  },
  {
    id: 'th-2',
    text: 'Перечисли алфавит наоборот',
    category: 'thinking',
    difficulty: 'easy'
  },
  {
    id: 'th-3',
    text: 'Реши: что тяжелее - килограмм железа или килограмм пуха?',
    category: 'thinking',
    difficulty: 'easy'
  },
  {
    id: 'th-4',
    text: 'Придумай 5 слов, которые начинаются и заканчиваются на одну букву',
    category: 'thinking',
    difficulty: 'easy'
  },

  // Размышления - средние
  {
    id: 'th-5',
    text: 'Объясни, как сварить борщ, но не используя кулинарные термины',
    category: 'thinking',
    difficulty: 'medium'
  },
  {
    id: 'th-6',
    text: 'Придумай историю, где все слова начинаются на одну букву',
    category: 'thinking',
    difficulty: 'medium'
  },

  // Сложные задания
  {
    id: 'cr-9',
    text: 'Создай и исполни оперу про поход в магазин',
    category: 'creative',
    difficulty: 'hard'
  },
  {
    id: 'fn-9',
    text: 'Проведи стендап выступление на 2 минуты',
    category: 'funny',
    difficulty: 'hard'
  },
  {
    id: 'ac-9',
    text: 'Научи всех новому танцу собственного сочинения',
    category: 'active',
    difficulty: 'hard'
  },
  {
    id: 'sc-8',
    text: 'Организуй групповую игру для всех участников',
    category: 'social',
    difficulty: 'hard'
  },
  {
    id: 'th-7',
    text: 'Объясни сложную научную концепцию простыми словами',
    category: 'thinking',
    difficulty: 'hard'
  }
];

export const getRandomFant = (usedIds: string[], settings: { categories: string[]; difficulty: string[] }): Fant | null => {
  const availableFants = FANTS.filter(fant => 
    !usedIds.includes(fant.id) &&
    settings.categories.includes(fant.category) &&
    settings.difficulty.includes(fant.difficulty)
  );
  
  if (availableFants.length === 0) return null;
  
  const randomIndex = Math.floor(Math.random() * availableFants.length);
  return availableFants[randomIndex];
};