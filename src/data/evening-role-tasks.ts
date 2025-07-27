import type { EveningRoleTask } from '../types/evening-role';
import { EVENING_ROLE_CATEGORIES } from '../types/evening-role';

// Индивидуальные задания для игроков (150+ заданий)
export const individualTasks: EveningRoleTask[] = [
  // АКЦЕНТЫ И РЕЧЬ
  {
    id: 'accent_1',
    text: 'Говори весь вечер с грузинским акцентом, друг мой!',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_2', 
    text: 'Разговаривай только шёпотом, как будто рассказываешь государственную тайну',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_3',
    text: 'Говори только рифмами, как поэт на сцене',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_4',
    text: 'После каждого предложения добавляй "Гениально!" с восторгом',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_5',
    text: 'Говори как будто ты ведущий новостей, очень серьёзно и официально',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_6',
    text: 'Весь вечер говори только вопросами, даже когда отвечаешь',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_7',
    text: 'Заканчивай каждую фразу словами "...если понимаешь, о чём я"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_8',
    text: 'Говори как робот: монотонно и добавляй "БИП-БОП" между фразами',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_9',
    text: 'Разговаривай как будто ты звезда реалити-шоу: драматично и с претензией',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },
  {
    id: 'accent_10',
    text: 'Говори только комплименты всем присутствующим, даже в обычных фразах',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ACCENT
  },

  // ДВИЖЕНИЯ И ЖЕСТЫ
  {
    id: 'movement_1',
    text: 'При слове "выпьем" делай 3 приседания',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_2',
    text: 'Каждые 10 минут делай "танец робота" в течение 30 секунд',
    type: 'individual',
    hasTimer: true,
    timerDuration: 600,
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_3',
    text: 'Когда смеёшься, делай это как злодей из фильма: "Му-ха-ха-ха!"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_4',
    text: 'Ходи по комнате только задом наперёд, как будто время идёт в обратную сторону',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_5',
    text: 'При каждом упоминании алкоголя делай реверанс как аристократ',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_6',
    text: 'Сиди только на краешке стула, как будто готов в любой момент вскочить',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_7',
    text: 'Каждый раз, когда встаёшь, делай пируэт',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_8',
    text: 'Жестикулируй как итальянец: активно и эмоционально при каждом слове',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_9',
    text: 'При любом тосте поднимай обе руки вверх и кричи "Виват!"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'movement_10',
    text: 'Ходи как модель по подиуму: выпрямившись и делая паузы для "фото"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },

  // АЛКОГОЛЬНЫЕ ЗАДАНИЯ
  {
    id: 'drinking_1',
    text: 'Выбери другого игрока. Пей дополнительный глоток каждый раз, когда он пьёт',
    type: 'individual',
    requiresOtherPlayer: true,
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_2',
    text: 'Пей только левой рукой весь вечер',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_3',
    text: 'Перед каждым глотком говори тост на выдуманном языке',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_4',
    text: 'Держи рюмку/стакан только мизинцем, как аристократ',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_5',
    text: 'После каждого глотка издавай звук "Ааааа!" как в рекламе',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_6',
    text: 'Пей только стоя на одной ноге',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_7',
    text: 'Каждый раз перед тем как выпить, скажи "За науку!" и сделай серьёзное лицо',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_8',
    text: 'Пей только через соломинку (если нет - попроси салфетку и сверни трубочкой)',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_9',
    text: 'После каждого глотка делай вид, что это очень горькое лекарство',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'drinking_10',
    text: 'Пей только когда никто на тебя не смотрит, как шпион',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },

  // СОЦИАЛЬНЫЕ ВЗАИМОДЕЙСТВИЯ
  {
    id: 'social_1',
    text: 'Молчи 1 минуту после того, как заговорит выбранный тобой участник',
    type: 'individual',
    hasTimer: true,
    timerDuration: 60,
    requiresOtherPlayer: true,
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_2',
    text: 'Повторяй последнее слово каждой фразы других людей, как эхо',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_3',
    text: 'Отвечай на все вопросы встречными вопросами',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_4',
    text: 'Делай комплименты всем, но только в виде сравнений с едой ("ты как ароматный борщ")',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_5',
    text: 'Каждые 5 минут подходи к разным людям и шепчи им "секретную" информацию',
    type: 'individual',
    hasTimer: true,
    timerDuration: 300,
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_6',
    text: 'Говори о себе только в третьем лице ("Иван думает, что...")',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_7',
    text: 'Соглашайся со всем, что говорят, даже с противоречиями',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_8',
    text: 'Каждому новому собеседнику представляйся новым именем и профессией',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_9',
    text: 'Отвечай на всё как будто ты эксперт в данной области',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'social_10',
    text: 'Каждые 7 минут меняй настроение кардинально (грустный-весёлый-злой-удивлённый)',
    type: 'individual',
    hasTimer: true,
    timerDuration: 420,
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },

  // ТВОРЧЕСКИЕ ЗАДАНИЯ
  {
    id: 'creative_1',
    text: 'Каждые 15 минут сочиняй и рассказывай короткий стишок о происходящем',
    type: 'individual',
    hasTimer: true,
    timerDuration: 900,
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_2',
    text: 'Общайся только цитатами из известных фильмов (можешь выдумывать)',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_3',
    text: 'Каждую шутку сопровождай барабанной дробью голосом "Та-да-дам-тс!"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_4',
    text: 'Рассказывай обо всём происходящем как спортивный комментатор',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_5',
    text: 'Каждые 20 минут устраивай "показ мод" с предметами одежды присутствующих',
    type: 'individual',
    hasTimer: true,
    timerDuration: 1200,
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_6',
    text: 'Превращай все обычные фразы в рекламные слоганы',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_7',
    text: 'Каждый предмет в комнате называй новым выдуманным именем',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_8',
    text: 'Разговаривай как ведущий кулинарного шоу, описывая всё происходящее',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_9',
    text: 'Каждые 10 минут изображай статую на 30 секунд в самой драматичной позе',
    type: 'individual',
    hasTimer: true,
    timerDuration: 600,
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'creative_10',
    text: 'Комментируй происходящее как закадровый голос в документальном фильме',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },

  // РЕАКЦИИ НА СОБЫТИЯ
  {
    id: 'reaction_1',
    text: 'При слове "да" хлопай в ладоши три раза',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_2',
    text: 'Каждый раз, когда кто-то смеётся, говори "И мне тоже смешно!" с серьёзным лицом',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_3',
    text: 'При упоминании еды облизывай губы и говори "М-м-м, вкуснятина!"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_4',
    text: 'Каждый раз, когда звонит телефон, кричи "Это не для меня!"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_5',
    text: 'При слове "время" смотри на запястье, даже если там нет часов',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_6',
    text: 'Каждый раз, когда кто-то встаёт, аплодируй как на концерте',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_7',
    text: 'При любом громком звуке делай вид, что очень испугался',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_8',
    text: 'Каждый раз, когда слышишь своё имя, салютуй как военный',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_9',
    text: 'При слове "нет" качай головой очень медленно и печально',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'reaction_10',
    text: 'Каждый раз, когда кто-то чихает, кричи "Благословение дракона на тебя!"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },

  // РОЛЕВЫЕ ИГРЫ
  {
    id: 'roleplay_1',
    text: 'Веди себя как секретный агент: говори загадками и оглядывайся по сторонам',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_2',
    text: 'Притворяйся, что ты турист и видишь всё впервые: удивляйся обычным вещам',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_3',
    text: 'Веди себя как дворецкий: обслуживай всех очень формально и вежливо',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_4',
    text: 'Притворяйся знаменитостью: раздавай автографы на салфетках',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_5',
    text: 'Веди себя как учёный: анализируй всё происходящее и делай "научные" выводы',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_6',
    text: 'Притворяйся, что ты репортёр, и "берёшь интервью" у всех присутствующих',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_7',
    text: 'Веди себя как психолог: анализируй поведение других и давай "советы"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_8',
    text: 'Притворяйся, что ты из будущего, и удивляйся "примитивным" технологиям',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_9',
    text: 'Веди себя как критик: оценивай всё происходящее от 1 до 10 с обоснованием',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'roleplay_10',
    text: 'Притворяйся, что ты магистр древней магии: говори заклинания над напитками',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },

  // ТЕЛЕФОН И ТЕХНОЛОГИИ
  {
    id: 'phone_1',
    text: 'Каждые 8 минут делай селфи с каждым присутствующим по очереди',
    type: 'individual',
    hasTimer: true,
    timerDuration: 480,
    category: EVENING_ROLE_CATEGORIES.PHONE
  },
  {
    id: 'phone_2',
    text: 'Говори в телефон как в рацию: "Приём! Приём! Как слышно? Приём!"',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.PHONE
  },
  {
    id: 'phone_3',
    text: 'Держи телефон только двумя руками, как священную реликвию',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.PHONE
  },
  {
    id: 'phone_4',
    text: 'Каждые 12 минут включай музыку и устраивай 30-секундную дискотеку',
    type: 'individual',
    hasTimer: true,
    timerDuration: 720,
    category: EVENING_ROLE_CATEGORIES.PHONE
  },
  {
    id: 'phone_5',
    text: 'Фотографируй каждый бокал/стакан перед тем, как кто-то выпьет',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.PHONE
  },

  // ОДЕЖДА И АКСЕССУАРЫ
  {
    id: 'clothing_1',
    text: 'Носи чужую куртку/кофту поверх своей одежды весь вечер',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CLOTHING
  },
  {
    id: 'clothing_2',
    text: 'Каждые 15 минут меняйся аксессуарами с кем-то из присутствующих',
    type: 'individual',
    hasTimer: true,
    timerDuration: 900,
    category: EVENING_ROLE_CATEGORIES.CLOTHING
  },
  {
    id: 'clothing_3',
    text: 'Сделай из салфетки "корону" и носи её с достоинством',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CLOTHING
  },
  {
    id: 'clothing_4',
    text: 'Засучи один рукав и ходи так весь вечер',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CLOTHING
  },
  {
    id: 'clothing_5',
    text: 'Носи обувь на неправильных ногах',
    type: 'individual',
    category: EVENING_ROLE_CATEGORIES.CLOTHING
  },

  // ЗАДАНИЯ С ТАЙМЕРОМ
  {
    id: 'timing_1',
    text: 'Каждые 6 минут замирай на 20 секунд в той позе, в которой застал таймер',
    type: 'individual',
    hasTimer: true,
    timerDuration: 360,
    category: EVENING_ROLE_CATEGORIES.TIMING
  },
  {
    id: 'timing_2',
    text: 'Каждые 11 минут рассказывай анекдот (можешь выдумывать)',
    type: 'individual',
    hasTimer: true,
    timerDuration: 660,
    category: EVENING_ROLE_CATEGORIES.TIMING
  },
  {
    id: 'timing_3',
    text: 'Каждые 9 минут устраивай минуту молчания "в память о хорошо проведённом времени"',
    type: 'individual',
    hasTimer: true,
    timerDuration: 540,
    category: EVENING_ROLE_CATEGORIES.TIMING
  },
  {
    id: 'timing_4',
    text: 'Каждые 13 минут подходи к окну и философски смотри в даль 30 секунд',
    type: 'individual',
    hasTimer: true,
    timerDuration: 780,
    category: EVENING_ROLE_CATEGORIES.TIMING
  },
  {
    id: 'timing_5',
    text: 'Каждые 7 минут считай вслух до 10 на любом иностранном языке',
    type: 'individual',
    hasTimer: true,
    timerDuration: 420,
    category: EVENING_ROLE_CATEGORIES.TIMING
  }
];

// Групповые задания для всей компании (60+ заданий)
export const groupTasks: EveningRoleTask[] = [
  {
    id: 'group_1',
    text: 'Все приседают, когда кто-то произносит мат',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_2',
    text: 'При слове "здоровье" все чокаются, даже если у кого-то нет бокала',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'group_3',
    text: 'Каждый раз, когда кто-то выпивает, все остальные говорят "Аминь!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'group_4',
    text: 'При слове "любовь" все берутся за руки на 10 секунд',
    type: 'group',
    hasTimer: true,
    timerDuration: 10,
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_5',
    text: 'Когда кто-то чихает, все кричат "Будь здоров!" на разных языках',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_6',
    text: 'При упоминании работы все дружно стонут "О нет, не говорим о работе!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_7',
    text: 'Каждые 20 минут все встают и аплодируют самому младшему в компании',
    type: 'group',
    hasTimer: true,
    timerDuration: 1200,
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_8',
    text: 'При слове "деньги" все показывают пустые карманы и вздыхают',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_9',
    text: 'Когда кто-то смотрит в телефон, все хором говорят "Мы тебя теряем!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_10',
    text: 'При слове "музыка" все качают головой в ритм 10 секунд',
    type: 'group',
    hasTimer: true,
    timerDuration: 10,
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_11',
    text: 'Каждый раз, когда звонит телефон, все замирают как статуи до окончания звонка',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_12',
    text: 'При слове "еда" все гладят животы и говорят "М-м-м!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_13',
    text: 'Когда кто-то встаёт, все провожают его аплодисментами',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_14',
    text: 'При упоминании спорта все показывают мышцы',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_15',
    text: 'Каждые 15 минут все одновременно делают селфи',
    type: 'group',
    hasTimer: true,
    timerDuration: 900,
    category: EVENING_ROLE_CATEGORIES.PHONE
  },
  {
    id: 'group_16',
    text: 'При слове "танцы" все делают одно танцевальное движение',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_17',
    text: 'Когда кто-то кашляет, все говорят "Лечись!" с заботливым видом',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_18',
    text: 'При слове "погода" все смотрят в окно или на потолок',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_19',
    text: 'Каждый раз, когда кто-то садится, все говорят "Добро пожаловать обратно!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_20',
    text: 'При упоминании животных все издают звуки любых животных',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.CREATIVE
  },
  {
    id: 'group_21',
    text: 'Когда кто-то зевает, все заражаются зевотой',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_22',
    text: 'При слове "путешествие" все показывают рукой направление "туда"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_23',
    text: 'Каждые 18 минут все хором кричат "Ура хорошему времяпрепровождению!"',
    type: 'group',
    hasTimer: true,
    timerDuration: 1080,
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_24',
    text: 'При слове "секрет" все наклоняются друг к другу, как будто слушают тайну',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_25',
    text: 'Когда кто-то ошибается в словах, все хором говорят "Переводчик сломался!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_26',
    text: 'При упоминании возраста все делают вид, что считают на пальцах',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_27',
    text: 'Каждый раз, когда кто-то говорит "я не помню", все показывают на голову',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_28',
    text: 'При слове "красота" все наводят красоту: поправляют волосы, одежду',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_29',
    text: 'Когда кто-то извиняется, все хором отвечают "Прощено!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_30',
    text: 'При упоминании времени все синхронно смотрят на часы (реальные или воображаемые)',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_31',
    text: 'Каждые 25 минут все меняются местами по часовой стрелке',
    type: 'group',
    hasTimer: true,
    timerDuration: 1500,
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_32',
    text: 'При слове "удача" все постукивают по дереву (или по голове, если дерева нет)',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_33',
    text: 'Когда кто-то говорит комплимент, все аплодируют комплименту',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_34',
    text: 'При упоминании сна все зевают и потягиваются',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_35',
    text: 'Каждый раз, когда кто-то говорит "точно", все кивают очень уверенно',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.REACTION
  },
  {
    id: 'group_36',
    text: 'При слове "магия" все делают "магические" пассы руками',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.MOVEMENT
  },
  {
    id: 'group_37',
    text: 'Когда кто-то делает паузу в речи, все хором говорят "И что дальше?"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.SOCIAL
  },
  {
    id: 'group_38',
    text: 'При упоминании детства все делают детские лица и голоса на 5 секунд',
    type: 'group',
    hasTimer: true,
    timerDuration: 5,
    category: EVENING_ROLE_CATEGORIES.ROLEPLAY
  },
  {
    id: 'group_39',
    text: 'Каждый раз, когда кто-то пьет воду, все говорят "Будь здоров, водохлёб!"',
    type: 'group',
    category: EVENING_ROLE_CATEGORIES.DRINKING
  },
  {
    id: 'group_40',
    text: 'При слове "мечта" все закрывают глаза и мечтательно улыбаются 3 секунды',
    type: 'group',
    hasTimer: true,
    timerDuration: 3,
    category: EVENING_ROLE_CATEGORIES.REACTION
  }
];

// Функция для получения случайного индивидуального задания
export const getRandomIndividualTask = (): EveningRoleTask => {
  const randomIndex = Math.floor(Math.random() * individualTasks.length);
  return individualTasks[randomIndex];
};

// Функция для получения случайного группового задания  
export const getRandomGroupTask = (): EveningRoleTask => {
  const randomIndex = Math.floor(Math.random() * groupTasks.length);
  return groupTasks[randomIndex];
};