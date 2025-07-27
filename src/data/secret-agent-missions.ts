import type { SecretAgentMission } from '../types/secret-agent';
import { COVER_MISSION_CATEGORIES, MAIN_MISSION_CATEGORIES } from '../types/secret-agent';

// ЗАДАНИЯ ДЛЯ ПРИКРЫТИЯ (70+ заданий)
// Эти задания агент должен делать весь вечер незаметно
export const coverMissions: SecretAgentMission[] = [
  // СОЦИАЛЬНЫЕ ВЗАИМОДЕЙСТВИЯ
  {
    id: 'cover_social_1',
    type: 'cover',
    title: 'Тамада-провокатор',
    description: 'Всегда перехватывай инициативу при тостах и предлагай выпить первым',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'medium'
  },
  {
    id: 'cover_social_2',
    type: 'cover',
    title: 'Комплимент-машина',
    description: 'Делай комплимент каждому новому человеку, с которым начинаешь разговор',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'easy'
  },
  {
    id: 'cover_social_3',
    type: 'cover',
    title: 'Миротворец',
    description: 'При любом споре или разногласии предлагай компромисс и меняй тему',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'medium'
  },
  {
    id: 'cover_social_4',
    type: 'cover',
    title: 'Фотограф-энтузиаст',
    description: 'Постоянно предлагай сделать фото, особенно групповые снимки',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'easy'
  },
  {
    id: 'cover_social_5',
    type: 'cover',
    title: 'Знакомец универсальный',
    description: 'Представляй людей друг другу, если видишь что они не знакомы',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'easy'
  },
  {
    id: 'cover_social_6',
    type: 'cover',
    title: 'Историк-рассказчик',
    description: 'В каждом разговоре рассказывай интересную историю из жизни',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'medium'
  },
  {
    id: 'cover_social_7',
    type: 'cover',
    title: 'Хранитель секретов',
    description: 'Всегда говори "это между нами" после любой личной информации',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'easy'
  },
  {
    id: 'cover_social_8',
    type: 'cover',
    title: 'Организатор веселья',
    description: 'Постоянно предлагай новые активности: игры, танцы, развлечения',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'medium'
  },
  {
    id: 'cover_social_9',
    type: 'cover',
    title: 'Вопросник',
    description: 'Задавай много личных вопросов, проявляя искренний интерес к людям',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'easy'
  },
  {
    id: 'cover_social_10',
    type: 'cover',
    title: 'Хвалитель хозяев',
    description: 'Постоянно хвали организацию вечеринки, еду, музыку, обстановку',
    category: COVER_MISSION_CATEGORIES.SOCIAL,
    difficulty: 'easy'
  },

  // СВЯЗАННЫЕ С НАПИТКАМИ
  {
    id: 'cover_drinks_1',
    type: 'cover',
    title: 'Уличный курильщик',
    description: 'При каждом упоминании слова "выпьем" выходи покурить или подышать на балкон',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'medium'
  },
  {
    id: 'cover_drinks_2',
    type: 'cover',
    title: 'Бармен-консультант',
    description: 'Предлагай всем что выпить и рассказывай о напитках',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'easy'
  },
  {
    id: 'cover_drinks_3',
    type: 'cover',
    title: 'Водохлёб',
    description: 'Постоянно пей воду и предлагай другим не забывать пить воду',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'easy'
  },
  {
    id: 'cover_drinks_4',
    type: 'cover',
    title: 'Чокальщик',
    description: 'Всегда чокайся со всеми присутствующими при любом тосте',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'easy'
  },
  {
    id: 'cover_drinks_5',
    type: 'cover',
    title: 'Дегустатор',
    description: 'Пробуй все напитки и комментируй их вкус',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'easy'
  },
  {
    id: 'cover_drinks_6',
    type: 'cover',
    title: 'Миксолог',
    description: 'Предлагай смешивать напитки и создавать новые коктейли',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'medium'
  },
  {
    id: 'cover_drinks_7',
    type: 'cover',
    title: 'Тост-мастер',
    description: 'Предлагай тосты каждые 15-20 минут',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'medium'
  },
  {
    id: 'cover_drinks_8',
    type: 'cover',
    title: 'Ледяной агент',
    description: 'Постоянно следи чтобы у всех был лёд в напитках',
    category: COVER_MISSION_CATEGORIES.DRINKS,
    difficulty: 'easy'
  },

  // СВЯЗАННЫЕ С ЕДОЙ
  {
    id: 'cover_food_1',
    type: 'cover',
    title: 'Шеф-критик',
    description: 'Комментируй каждое блюдо как ресторанный критик',
    category: COVER_MISSION_CATEGORIES.FOOD,
    difficulty: 'easy'
  },
  {
    id: 'cover_food_2',
    type: 'cover',
    title: 'Угощатель',
    description: 'Постоянно предлагай всем что-то попробовать из еды',
    category: COVER_MISSION_CATEGORIES.FOOD,
    difficulty: 'easy'
  },
  {
    id: 'cover_food_3',
    type: 'cover',
    title: 'Помощник кухни',
    description: 'Всегда предлагай помочь с подачей блюд и уборкой посуды',
    category: COVER_MISSION_CATEGORIES.FOOD,
    difficulty: 'easy'
  },
  {
    id: 'cover_food_4',
    type: 'cover',
    title: 'Рецептоман',
    description: 'Спрашивай рецепты всех блюд и рассказывай свои',
    category: COVER_MISSION_CATEGORIES.FOOD,
    difficulty: 'easy'
  },
  {
    id: 'cover_food_5',
    type: 'cover',
    title: 'Калькулятор калорий',
    description: 'Считай и озвучивай калории в блюдах (можешь придумывать)',
    category: COVER_MISSION_CATEGORIES.FOOD,
    difficulty: 'medium'
  },
  {
    id: 'cover_food_6',
    type: 'cover',
    title: 'Фуд-блогер',
    description: 'Фотографируй каждое блюдо перед тем как его съесть',
    category: COVER_MISSION_CATEGORIES.FOOD,
    difficulty: 'easy'
  },
  {
    id: 'cover_food_7',
    type: 'cover',
    title: 'Закусочный эксперт',
    description: 'Предлагай идеальные сочетания закусок и напитков',
    category: COVER_MISSION_CATEGORIES.FOOD,
    difficulty: 'medium'
  },

  // РАЗГОВОРНЫЕ ПРИВЫЧКИ
  {
    id: 'cover_conversation_1',
    type: 'cover',
    title: 'Переводчик настроения',
    description: 'Постоянно говори "Я вижу ты в хорошем настроении" или наоборот',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'easy'
  },
  {
    id: 'cover_conversation_2',
    type: 'cover',
    title: 'Эхо-человек',
    description: 'Повторяй последние слова собеседника в виде вопроса',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'medium'
  },
  {
    id: 'cover_conversation_3',
    type: 'cover',
    title: 'Психолог-любитель',
    description: 'Анализируй поведение людей и делись наблюдениями',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'medium'
  },
  {
    id: 'cover_conversation_4',
    type: 'cover',
    title: 'Погодный сводчик',
    description: 'Регулярно комментируй погоду и её влияние на настроение',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'easy'
  },
  {
    id: 'cover_conversation_5',
    type: 'cover',
    title: 'Воспоминатель',
    description: 'Постоянно говори "А помнишь как..." и рассказывай общие воспоминания',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'easy'
  },
  {
    id: 'cover_conversation_6',
    type: 'cover',
    title: 'Планировщик будущего',
    description: 'Предлагай планы на следующие встречи и мероприятия',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'easy'
  },
  {
    id: 'cover_conversation_7',
    type: 'cover',
    title: 'Философ-мудрец',
    description: 'Превращай любую тему в философские размышления о жизни',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'hard'
  },
  {
    id: 'cover_conversation_8',
    type: 'cover',
    title: 'Источник позитива',
    description: 'Всегда находи позитивную сторону в любой ситуации',
    category: COVER_MISSION_CATEGORIES.CONVERSATION,
    difficulty: 'easy'
  },

  // ДВИЖЕНИЯ И ПОЗЫ
  {
    id: 'cover_movement_1',
    type: 'cover',
    title: 'Танцевальная машина',
    description: 'Качайся в такт любой музыке, даже фоновой',
    category: COVER_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'easy'
  },
  {
    id: 'cover_movement_2',
    type: 'cover',
    title: 'Растяжка-мастер',
    description: 'Периодически делай небольшие растяжки и предлагай другим',
    category: COVER_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'medium'
  },
  {
    id: 'cover_movement_3',
    type: 'cover',
    title: 'Обнимашка',
    description: 'Обнимай людей при встрече и прощании (если уместно)',
    category: COVER_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'easy'
  },
  {
    id: 'cover_movement_4',
    type: 'cover',
    title: 'Дирижёр эмоций',
    description: 'Активно жестикулируй и используй мимику при разговоре',
    category: COVER_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'easy'
  },
  {
    id: 'cover_movement_5',
    type: 'cover',
    title: 'Зеркало группы',
    description: 'Копируй позы и жесты других людей с небольшой задержкой',
    category: COVER_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'hard'
  },
  {
    id: 'cover_movement_6',
    type: 'cover',
    title: 'Массажист-энтузиаст',
    description: 'Предлагай массаж плеч уставшим людям',
    category: COVER_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'medium'
  },

  // СВЯЗАННЫЕ СО ВРЕМЕНЕМ
  {
    id: 'cover_timing_1',
    type: 'cover',
    title: 'Часовщик',
    description: 'Каждые 30 минут сообщай время и удивляйся как быстро оно летит',
    category: COVER_MISSION_CATEGORIES.TIMING,
    difficulty: 'easy'
  },
  {
    id: 'cover_timing_2',
    type: 'cover',
    title: 'Планировщик активностей',
    description: 'Предлагай расписание: "во сколько танцы?", "когда будем играть?"',
    category: COVER_MISSION_CATEGORIES.TIMING,
    difficulty: 'easy'
  },
  {
    id: 'cover_timing_3',
    type: 'cover',
    title: 'Ностальгик времени',
    description: 'Говори что раньше (год/месяц/неделю назад) было лучше/хуже',
    category: COVER_MISSION_CATEGORIES.TIMING,
    difficulty: 'easy'
  },

  // РЕАКЦИИ НА СОБЫТИЯ
  {
    id: 'cover_reactions_1',
    type: 'cover',
    title: 'Аплодисмент-машина',
    description: 'Аплодируй любым успехам, шуткам и достижениям других',
    category: COVER_MISSION_CATEGORIES.REACTIONS,
    difficulty: 'easy'
  },
  {
    id: 'cover_reactions_2',
    type: 'cover',
    title: 'Реакционер эмоций',
    description: 'Ярко реагируй на все события: удивляйся, восхищайся, сочувствуй',
    category: COVER_MISSION_CATEGORIES.REACTIONS,
    difficulty: 'easy'
  },
  {
    id: 'cover_reactions_3',
    type: 'cover',
    title: 'Повторяла классных моментов',
    description: 'Постоянно говори "а давайте ещё раз!" к понравившимся активностям',
    category: COVER_MISSION_CATEGORIES.REACTIONS,
    difficulty: 'easy'
  },
  {
    id: 'cover_reactions_4',
    type: 'cover',
    title: 'Запоминатель моментов',
    description: 'Говори "надо запомнить этот момент" и просить повторить классные фразы',
    category: COVER_MISSION_CATEGORIES.REACTIONS,
    difficulty: 'easy'
  }
];

// ГЛАВНЫЕ МИССИИ (50+ заданий)
// Эти задания нужно выполнить незаметно в течение 5 минут
export const mainMissions: SecretAgentMission[] = [
  // ВЗАИМОДЕЙСТВИЕ С ЛЮДЬМИ
  {
    id: 'main_interaction_1',
    type: 'main',
    title: 'Танец равенства',
    description: 'Станцуй медленный танец с человеком своего пола',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_interaction_2',
    type: 'main',
    title: 'Объятия пятёрки',
    description: 'Обними 5 разных людей в течение 5 минут',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'easy',
    timeLimit: 5
  },
  {
    id: 'main_interaction_3',
    type: 'main',
    title: 'Массаж-цепочка',
    description: 'Сделай массаж плеч трём разным людям',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_interaction_4',
    type: 'main',
    title: 'Комплимент каждому',
    description: 'Сделай персональный комплимент каждому присутствующему',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_interaction_5',
    type: 'main',
    title: 'Селфи со всеми',
    description: 'Сделай селфи с каждым человеком на вечеринке',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'easy',
    timeLimit: 5
  },
  {
    id: 'main_interaction_6',
    type: 'main',
    title: 'Секретный шепот',
    description: 'Шепни на ухо каждому что-то смешное или приятное',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'easy',
    timeLimit: 5
  },
  {
    id: 'main_interaction_7',
    type: 'main',
    title: 'Рука помощи',
    description: 'Предложи помощь каждому человеку (принести, сделать, помочь)',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'easy',
    timeLimit: 5
  },
  {
    id: 'main_interaction_8',
    type: 'main',
    title: 'Дуэт-партнёр',
    description: 'Спой дуэтом с кем-то из присутствующих',
    category: MAIN_MISSION_CATEGORIES.INTERACTION,
    difficulty: 'medium',
    timeLimit: 5
  },

  // НЕБОЛЬШИЕ ВЫСТУПЛЕНИЯ
  {
    id: 'main_performance_1',
    type: 'main',
    title: 'Стенд-ап комик',
    description: 'Расскажи смешную историю, чтобы все засмеялись',
    category: MAIN_MISSION_CATEGORIES.PERFORMANCE,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_performance_2',
    type: 'main',
    title: 'Певец настроения',
    description: 'Спой куплет любимой песни компании',
    category: MAIN_MISSION_CATEGORIES.PERFORMANCE,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_performance_3',
    type: 'main',
    title: 'Танцор-импровизатор',
    description: 'Станцуй танец под любую музыку минимум 2 минуты',
    category: MAIN_MISSION_CATEGORIES.PERFORMANCE,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_performance_4',
    type: 'main',
    title: 'Мим-артист',
    description: 'Покажи пантомиму, чтобы остальные угадали что ты изображаешь',
    category: MAIN_MISSION_CATEGORIES.PERFORMANCE,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_performance_5',
    type: 'main',
    title: 'Стихотворец',
    description: 'Сочини и расскажи короткий стих про сегодняшний вечер',
    category: MAIN_MISSION_CATEGORIES.PERFORMANCE,
    difficulty: 'hard',
    timeLimit: 5
  },
  {
    id: 'main_performance_6',
    type: 'main',
    title: 'Ведущий-аниматор',
    description: 'Проведи любую мини-игру для всей компании',
    category: MAIN_MISSION_CATEGORIES.PERFORMANCE,
    difficulty: 'hard',
    timeLimit: 5
  },
  {
    id: 'main_performance_7',
    type: 'main',
    title: 'Акробат-любитель',
    description: 'Покажи любой акробатический трюк (колесо, стойка, шпагат)',
    category: MAIN_MISSION_CATEGORIES.PERFORMANCE,
    difficulty: 'hard',
    timeLimit: 5
  },

  // СБОР ЧЕГО-ЛИБО
  {
    id: 'main_collection_1',
    type: 'main',
    title: 'Коллекционер улыбок',
    description: 'Сфотографируй улыбку каждого присутствующего',
    category: MAIN_MISSION_CATEGORIES.COLLECTION,
    difficulty: 'easy',
    timeLimit: 5
  },
  {
    id: 'main_collection_2',
    type: 'main',
    title: 'Собиратель секретов',
    description: 'Узнай один интересный факт о каждом человеке',
    category: MAIN_MISSION_CATEGORIES.COLLECTION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_collection_3',
    type: 'main',
    title: 'Архивариус тостов',
    description: 'Предложи всем произнести по тосту и запиши их на телефон',
    category: MAIN_MISSION_CATEGORIES.COLLECTION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_collection_4',
    type: 'main',
    title: 'Охотник за подписями',
    description: 'Собери автографы всех присутствующих на салфетке',
    category: MAIN_MISSION_CATEGORIES.COLLECTION,
    difficulty: 'easy',
    timeLimit: 5
  },
  {
    id: 'main_collection_5',
    type: 'main',
    title: 'Летописец веселья',
    description: 'Попроси каждого сказать одно слово для описания вечера',
    category: MAIN_MISSION_CATEGORIES.COLLECTION,
    difficulty: 'easy',
    timeLimit: 5
  },

  // ФИЗИЧЕСКИЕ ДЕЙСТВИЯ
  {
    id: 'main_movement_1',
    type: 'main',
    title: 'Йога-инструктор',
    description: 'Проведи 3-минутную групповую растяжку',
    category: MAIN_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_movement_2',
    type: 'main',
    title: 'Массажист группы',
    description: 'Сделай расслабляющий массаж шеи всем желающим',
    category: MAIN_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'easy',
    timeLimit: 5
  },
  {
    id: 'main_movement_3',
    type: 'main',
    title: 'Учитель танцев',
    description: 'Научи всех простому танцевальному движению',
    category: MAIN_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_movement_4',
    type: 'main',
    title: 'Групповое фото',
    description: 'Организуй красивую групповую фотосессию',
    category: MAIN_MISSION_CATEGORIES.MOVEMENT,
    difficulty: 'easy',
    timeLimit: 5
  },

  // ОБЩЕНИЕ
  {
    id: 'main_communication_1',
    type: 'main',
    title: 'Переводчик настроений',
    description: 'Угадай и озвучь настроение каждого человека',
    category: MAIN_MISSION_CATEGORIES.COMMUNICATION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_communication_2',
    type: 'main',
    title: 'Психолог-любитель',
    description: 'Дай дружеский совет каждому присутствующему',
    category: MAIN_MISSION_CATEGORIES.COMMUNICATION,
    difficulty: 'hard',
    timeLimit: 5
  },
  {
    id: 'main_communication_3',
    type: 'main',
    title: 'Предсказатель будущего',
    description: 'Сделай позитивное предсказание на будущее каждому',
    category: MAIN_MISSION_CATEGORIES.COMMUNICATION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_communication_4',
    type: 'main',
    title: 'Интервьюер',
    description: 'Возьми короткое интервью у каждого о лучшем моменте вечера',
    category: MAIN_MISSION_CATEGORIES.COMMUNICATION,
    difficulty: 'medium',
    timeLimit: 5
  },

  // ТВОРЧЕСКИЕ ЗАДАНИЯ
  {
    id: 'main_creative_1',
    type: 'main',
    title: 'Художник портретов',
    description: 'Нарисуй быстрый портрет каждого присутствующего',
    category: MAIN_MISSION_CATEGORIES.CREATIVE,
    difficulty: 'hard',
    timeLimit: 5
  },
  {
    id: 'main_creative_2',
    type: 'main',
    title: 'Режиссёр клипа',
    description: 'Сними короткий видеоклип с участием всех',
    category: MAIN_MISSION_CATEGORIES.CREATIVE,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_creative_3',
    type: 'main',
    title: 'Декоратор пространства',
    description: 'Укрась помещение подручными материалами',
    category: MAIN_MISSION_CATEGORIES.CREATIVE,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_creative_4',
    type: 'main',
    title: 'Композитор мелодий',
    description: 'Сочини простую мелодию и научи всех её напевать',
    category: MAIN_MISSION_CATEGORIES.CREATIVE,
    difficulty: 'hard',
    timeLimit: 5
  },

  // НАБЛЮДЕНИЕ И АНАЛИЗ
  {
    id: 'main_observation_1',
    type: 'main',
    title: 'Детектив привычек',
    description: 'Назови уникальную привычку или особенность каждого',
    category: MAIN_MISSION_CATEGORIES.OBSERVATION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_observation_2',
    type: 'main',
    title: 'Аналитик совместимости',
    description: 'Определи и объяви самую совместимую пару на вечеринке',
    category: MAIN_MISSION_CATEGORIES.OBSERVATION,
    difficulty: 'medium',
    timeLimit: 5
  },
  {
    id: 'main_observation_3',
    type: 'main',
    title: 'Хранитель статистики',
    description: 'Подсчитай и объяви интересную статистику вечера',
    category: MAIN_MISSION_CATEGORIES.OBSERVATION,
    difficulty: 'medium',
    timeLimit: 5
  }
];

// Функции для получения случайных миссий
export const getRandomCoverMission = (): SecretAgentMission => {
  const randomIndex = Math.floor(Math.random() * coverMissions.length);
  return { ...coverMissions[randomIndex] };
};

export const getRandomMainMission = (): SecretAgentMission => {
  const randomIndex = Math.floor(Math.random() * mainMissions.length);
  return { ...mainMissions[randomIndex] };
};

// Функция для получения миссий по сложности
export const getMissionsByDifficulty = (type: 'cover' | 'main', difficulty: 'easy' | 'medium' | 'hard'): SecretAgentMission[] => {
  const missions = type === 'cover' ? coverMissions : mainMissions;
  return missions.filter(mission => mission.difficulty === difficulty);
};

// Функция для получения миссий по категории
export const getMissionsByCategory = (type: 'cover' | 'main', category: string): SecretAgentMission[] => {
  const missions = type === 'cover' ? coverMissions : mainMissions;
  return missions.filter(mission => mission.category === category);
};