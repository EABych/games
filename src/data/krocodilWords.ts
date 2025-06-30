import type { KrocodilWord, KrocodilSettings } from '../types/krocodil';

export const krocodilWords: KrocodilWord[] = [
  // ЛЕГКИЕ СЛОВА - Предметы
  { id: '1', word: 'стол', difficulty: 'easy', category: 'objects' },
  { id: '2', word: 'стул', difficulty: 'easy', category: 'objects' },
  { id: '3', word: 'книга', difficulty: 'easy', category: 'objects' },
  { id: '4', word: 'телефон', difficulty: 'easy', category: 'objects' },
  { id: '5', word: 'компьютер', difficulty: 'easy', category: 'objects' },
  { id: '6', word: 'машина', difficulty: 'easy', category: 'objects' },
  { id: '7', word: 'дом', difficulty: 'easy', category: 'objects' },
  { id: '8', word: 'дверь', difficulty: 'easy', category: 'objects' },
  { id: '9', word: 'окно', difficulty: 'easy', category: 'objects' },
  { id: '10', word: 'часы', difficulty: 'easy', category: 'objects' },
  { id: '11', word: 'ручка', difficulty: 'easy', category: 'objects' },
  { id: '12', word: 'тарелка', difficulty: 'easy', category: 'objects' },
  { id: '13', word: 'чашка', difficulty: 'easy', category: 'objects' },
  { id: '14', word: 'ложка', difficulty: 'easy', category: 'objects' },
  { id: '15', word: 'телевизор', difficulty: 'easy', category: 'objects' },

  // ЛЕГКИЕ СЛОВА - Животные
  { id: '16', word: 'собака', difficulty: 'easy', category: 'animals' },
  { id: '17', word: 'кошка', difficulty: 'easy', category: 'animals' },
  { id: '18', word: 'корова', difficulty: 'easy', category: 'animals' },
  { id: '19', word: 'лошадь', difficulty: 'easy', category: 'animals' },
  { id: '20', word: 'свинья', difficulty: 'easy', category: 'animals' },
  { id: '21', word: 'курица', difficulty: 'easy', category: 'animals' },
  { id: '22', word: 'рыба', difficulty: 'easy', category: 'animals' },
  { id: '23', word: 'птица', difficulty: 'easy', category: 'animals' },
  { id: '24', word: 'слон', difficulty: 'easy', category: 'animals' },
  { id: '25', word: 'лев', difficulty: 'easy', category: 'animals' },
  { id: '26', word: 'тигр', difficulty: 'easy', category: 'animals' },
  { id: '27', word: 'медведь', difficulty: 'easy', category: 'animals' },
  { id: '28', word: 'заяц', difficulty: 'easy', category: 'animals' },
  { id: '29', word: 'лиса', difficulty: 'easy', category: 'animals' },
  { id: '30', word: 'волк', difficulty: 'easy', category: 'animals' },

  // ЛЕГКИЕ СЛОВА - Действия
  { id: '31', word: 'бежать', difficulty: 'easy', category: 'actions' },
  { id: '32', word: 'идти', difficulty: 'easy', category: 'actions' },
  { id: '33', word: 'прыгать', difficulty: 'easy', category: 'actions' },
  { id: '34', word: 'спать', difficulty: 'easy', category: 'actions' },
  { id: '35', word: 'есть', difficulty: 'easy', category: 'actions' },
  { id: '36', word: 'пить', difficulty: 'easy', category: 'actions' },
  { id: '37', word: 'читать', difficulty: 'easy', category: 'actions' },
  { id: '38', word: 'писать', difficulty: 'easy', category: 'actions' },
  { id: '39', word: 'рисовать', difficulty: 'easy', category: 'actions' },
  { id: '40', word: 'танцевать', difficulty: 'easy', category: 'actions' },
  { id: '41', word: 'петь', difficulty: 'easy', category: 'actions' },
  { id: '42', word: 'играть', difficulty: 'easy', category: 'actions' },
  { id: '43', word: 'работать', difficulty: 'easy', category: 'actions' },
  { id: '44', word: 'готовить', difficulty: 'easy', category: 'actions' },
  { id: '45', word: 'убирать', difficulty: 'easy', category: 'actions' },

  // ЛЕГКИЕ СЛОВА - Профессии
  { id: '46', word: 'врач', difficulty: 'easy', category: 'professions' },
  { id: '47', word: 'учитель', difficulty: 'easy', category: 'professions' },
  { id: '48', word: 'водитель', difficulty: 'easy', category: 'professions' },
  { id: '49', word: 'повар', difficulty: 'easy', category: 'professions' },
  { id: '50', word: 'продавец', difficulty: 'easy', category: 'professions' },
  { id: '51', word: 'полицейский', difficulty: 'easy', category: 'professions' },
  { id: '52', word: 'пожарный', difficulty: 'easy', category: 'professions' },
  { id: '53', word: 'актёр', difficulty: 'easy', category: 'professions' },
  { id: '54', word: 'певец', difficulty: 'easy', category: 'professions' },
  { id: '55', word: 'танцор', difficulty: 'easy', category: 'professions' },

  // СРЕДНИЕ СЛОВА - Предметы
  { id: '56', word: 'холодильник', difficulty: 'medium', category: 'objects' },
  { id: '57', word: 'микроволновка', difficulty: 'medium', category: 'objects' },
  { id: '58', word: 'стиральная машина', difficulty: 'medium', category: 'objects' },
  { id: '59', word: 'пылесос', difficulty: 'medium', category: 'objects' },
  { id: '60', word: 'утюг', difficulty: 'medium', category: 'objects' },
  { id: '61', word: 'молоток', difficulty: 'medium', category: 'objects' },
  { id: '62', word: 'отвёртка', difficulty: 'medium', category: 'objects' },
  { id: '63', word: 'ножницы', difficulty: 'medium', category: 'objects' },
  { id: '64', word: 'фотоаппарат', difficulty: 'medium', category: 'objects' },
  { id: '65', word: 'наушники', difficulty: 'medium', category: 'objects' },
  { id: '66', word: 'рюкзак', difficulty: 'medium', category: 'objects' },
  { id: '67', word: 'зонт', difficulty: 'medium', category: 'objects' },
  { id: '68', word: 'калькулятор', difficulty: 'medium', category: 'objects' },
  { id: '69', word: 'термометр', difficulty: 'medium', category: 'objects' },
  { id: '70', word: 'компас', difficulty: 'medium', category: 'objects' },

  // СРЕДНИЕ СЛОВА - Животные
  { id: '71', word: 'жираф', difficulty: 'medium', category: 'animals' },
  { id: '72', word: 'бегемот', difficulty: 'medium', category: 'animals' },
  { id: '73', word: 'носорог', difficulty: 'medium', category: 'animals' },
  { id: '74', word: 'крокодил', difficulty: 'medium', category: 'animals' },
  { id: '75', word: 'пингвин', difficulty: 'medium', category: 'animals' },
  { id: '76', word: 'дельфин', difficulty: 'medium', category: 'animals' },
  { id: '77', word: 'акула', difficulty: 'medium', category: 'animals' },
  { id: '78', word: 'обезьяна', difficulty: 'medium', category: 'animals' },
  { id: '79', word: 'кенгуру', difficulty: 'medium', category: 'animals' },
  { id: '80', word: 'зебра', difficulty: 'medium', category: 'animals' },
  { id: '81', word: 'верблюд', difficulty: 'medium', category: 'animals' },
  { id: '82', word: 'панда', difficulty: 'medium', category: 'animals' },
  { id: '83', word: 'коала', difficulty: 'medium', category: 'animals' },
  { id: '84', word: 'ленивец', difficulty: 'medium', category: 'animals' },
  { id: '85', word: 'фламинго', difficulty: 'medium', category: 'animals' },

  // СРЕДНИЕ СЛОВА - Действия
  { id: '86', word: 'размышлять', difficulty: 'medium', category: 'actions' },
  { id: '87', word: 'сомневаться', difficulty: 'medium', category: 'actions' },
  { id: '88', word: 'объяснять', difficulty: 'medium', category: 'actions' },
  { id: '89', word: 'убеждать', difficulty: 'medium', category: 'actions' },
  { id: '90', word: 'фотографировать', difficulty: 'medium', category: 'actions' },
  { id: '91', word: 'программировать', difficulty: 'medium', category: 'actions' },
  { id: '92', word: 'медитировать', difficulty: 'medium', category: 'actions' },
  { id: '93', word: 'жонглировать', difficulty: 'medium', category: 'actions' },
  { id: '94', word: 'маршировать', difficulty: 'medium', category: 'actions' },
  { id: '95', word: 'импровизировать', difficulty: 'medium', category: 'actions' },

  // СРЕДНИЕ СЛОВА - Профессии
  { id: '96', word: 'архитектор', difficulty: 'medium', category: 'professions' },
  { id: '97', word: 'инженер', difficulty: 'medium', category: 'professions' },
  { id: '98', word: 'программист', difficulty: 'medium', category: 'professions' },
  { id: '99', word: 'дизайнер', difficulty: 'medium', category: 'professions' },
  { id: '100', word: 'журналист', difficulty: 'medium', category: 'professions' },
  { id: '101', word: 'фотограф', difficulty: 'medium', category: 'professions' },
  { id: '102', word: 'переводчик', difficulty: 'medium', category: 'professions' },
  { id: '103', word: 'психолог', difficulty: 'medium', category: 'professions' },
  { id: '104', word: 'ветеринар', difficulty: 'medium', category: 'professions' },
  { id: '105', word: 'стоматолог', difficulty: 'medium', category: 'professions' },

  // СРЕДНИЕ СЛОВА - Эмоции
  { id: '106', word: 'радость', difficulty: 'medium', category: 'emotions' },
  { id: '107', word: 'грусть', difficulty: 'medium', category: 'emotions' },
  { id: '108', word: 'удивление', difficulty: 'medium', category: 'emotions' },
  { id: '109', word: 'восторг', difficulty: 'medium', category: 'emotions' },
  { id: '110', word: 'разочарование', difficulty: 'medium', category: 'emotions' },
  { id: '111', word: 'смущение', difficulty: 'medium', category: 'emotions' },
  { id: '112', word: 'волнение', difficulty: 'medium', category: 'emotions' },
  { id: '113', word: 'спокойствие', difficulty: 'medium', category: 'emotions' },
  { id: '114', word: 'растерянность', difficulty: 'medium', category: 'emotions' },
  { id: '115', word: 'любопытство', difficulty: 'medium', category: 'emotions' },

  // СЛОЖНЫЕ СЛОВА - Предметы
  { id: '116', word: 'микроскоп', difficulty: 'hard', category: 'objects' },
  { id: '117', word: 'телескоп', difficulty: 'hard', category: 'objects' },
  { id: '118', word: 'стетоскоп', difficulty: 'hard', category: 'objects' },
  { id: '119', word: 'метроном', difficulty: 'hard', category: 'objects' },
  { id: '120', word: 'барометр', difficulty: 'hard', category: 'objects' },
  { id: '121', word: 'гигрометр', difficulty: 'hard', category: 'objects' },
  { id: '122', word: 'секстант', difficulty: 'hard', category: 'objects' },
  { id: '123', word: 'астролябия', difficulty: 'hard', category: 'objects' },
  { id: '124', word: 'эскалатор', difficulty: 'hard', category: 'objects' },
  { id: '125', word: 'турникет', difficulty: 'hard', category: 'objects' },

  // СЛОЖНЫЕ СЛОВА - Животные
  { id: '126', word: 'муравьед', difficulty: 'hard', category: 'animals' },
  { id: '127', word: 'броненосец', difficulty: 'hard', category: 'animals' },
  { id: '128', word: 'тарантул', difficulty: 'hard', category: 'animals' },
  { id: '129', word: 'хамелеон', difficulty: 'hard', category: 'animals' },
  { id: '130', word: 'игуана', difficulty: 'hard', category: 'animals' },
  { id: '131', word: 'морской конёк', difficulty: 'hard', category: 'animals' },
  { id: '132', word: 'скат', difficulty: 'hard', category: 'animals' },
  { id: '133', word: 'осьминог', difficulty: 'hard', category: 'animals' },
  { id: '134', word: 'кальмар', difficulty: 'hard', category: 'animals' },
  { id: '135', word: 'медуза', difficulty: 'hard', category: 'animals' },

  // СЛОЖНЫЕ СЛОВА - Действия
  { id: '136', word: 'философствовать', difficulty: 'hard', category: 'actions' },
  { id: '137', word: 'импровизировать', difficulty: 'hard', category: 'actions' },
  { id: '138', word: 'дирижировать', difficulty: 'hard', category: 'actions' },
  { id: '139', word: 'фехтовать', difficulty: 'hard', category: 'actions' },
  { id: '140', word: 'левитировать', difficulty: 'hard', category: 'actions' },
  { id: '141', word: 'гипнотизировать', difficulty: 'hard', category: 'actions' },
  { id: '142', word: 'маскироваться', difficulty: 'hard', category: 'actions' },
  { id: '143', word: 'телепортироваться', difficulty: 'hard', category: 'actions' },
  { id: '144', word: 'материализоваться', difficulty: 'hard', category: 'actions' },
  { id: '145', word: 'трансформироваться', difficulty: 'hard', category: 'actions' },

  // СЛОЖНЫЕ СЛОВА - Профессии
  { id: '146', word: 'сомелье', difficulty: 'hard', category: 'professions' },
  { id: '147', word: 'флорист', difficulty: 'hard', category: 'professions' },
  { id: '148', word: 'каскадёр', difficulty: 'hard', category: 'professions' },
  { id: '149', word: 'кукловод', difficulty: 'hard', category: 'professions' },
  { id: '150', word: 'дрессировщик', difficulty: 'hard', category: 'professions' },
  { id: '151', word: 'иллюзионист', difficulty: 'hard', category: 'professions' },
  { id: '152', word: 'парфюмер', difficulty: 'hard', category: 'professions' },
  { id: '153', word: 'реставратор', difficulty: 'hard', category: 'professions' },
  { id: '154', word: 'таксидермист', difficulty: 'hard', category: 'professions' },
  { id: '155', word: 'геммолог', difficulty: 'hard', category: 'professions' },

  // СЛОЖНЫЕ СЛОВА - Эмоции
  { id: '156', word: 'меланхолия', difficulty: 'hard', category: 'emotions' },
  { id: '157', word: 'эйфория', difficulty: 'hard', category: 'emotions' },
  { id: '158', word: 'апатия', difficulty: 'hard', category: 'emotions' },
  { id: '159', word: 'ностальгия', difficulty: 'hard', category: 'emotions' },
  { id: '160', word: 'эмпатия', difficulty: 'hard', category: 'emotions' },
  { id: '161', word: 'антипатия', difficulty: 'hard', category: 'emotions' },
  { id: '162', word: 'симпатия', difficulty: 'hard', category: 'emotions' },
  { id: '163', word: 'экстаз', difficulty: 'hard', category: 'emotions' },
  { id: '164', word: 'фрустрация', difficulty: 'hard', category: 'emotions' },
  { id: '165', word: 'инсайт', difficulty: 'hard', category: 'emotions' },

  // СЛОЖНЫЕ СЛОВА - Абстрактные понятия
  { id: '166', word: 'справедливость', difficulty: 'hard', category: 'abstract' },
  { id: '167', word: 'толерантность', difficulty: 'hard', category: 'abstract' },
  { id: '168', word: 'перфекционизм', difficulty: 'hard', category: 'abstract' },
  { id: '169', word: 'интуиция', difficulty: 'hard', category: 'abstract' },
  { id: '170', word: 'харизма', difficulty: 'hard', category: 'abstract' },
  { id: '171', word: 'метафора', difficulty: 'hard', category: 'abstract' },
  { id: '172', word: 'парадокс', difficulty: 'hard', category: 'abstract' },
  { id: '173', word: 'концепция', difficulty: 'hard', category: 'abstract' },
  { id: '174', word: 'гармония', difficulty: 'hard', category: 'abstract' },
  { id: '175', word: 'синергия', difficulty: 'hard', category: 'abstract' }
];

export const getRandomKrocodilWord = (
  usedWords: string[] = [], 
  settings: KrocodilSettings
): KrocodilWord | null => {
  const availableWords = krocodilWords.filter(word => 
    !usedWords.includes(word.id) &&
    settings.difficulties.includes(word.difficulty) &&
    (settings.categories.length === 0 || settings.categories.includes(word.category!))
  );
  
  if (availableWords.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * availableWords.length);
  return availableWords[randomIndex];
};