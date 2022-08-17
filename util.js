const { MessageEmbed } = require('discord.js');

exports.shuffle = (array) => {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};
exports.embed = ({ interaction }) => {
  return new MessageEmbed()
    .setColor(botconfig.color)
    .setTitle('👤 Верификация')
    .setDescription(
      'Выберите значение, которое соответствует тому, что вы видите на картинке \n  Время на решение **60 секунд**.'
    )
    .setFooter({ text: 'https://minimalproject.ru' })
    .setTimestamp();
};

exports.errorEmbed = ({ interaction }) => {
  return new MessageEmbed()
    .setColor(botconfig.color)
    .setTitle('❌ Доступ запрещён ❌')
    .setDescription('Вы выбрали не правильное значение. \n')
    .setFooter({ text: 'https://minimalproject.ru' })
    .setTimestamp();
};
