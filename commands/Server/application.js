const {
  MessageEmbed,
  Permissions,
  MessageActionRow,
  MessageButton,
  Modal,
  TextInputComponent,
} = require('discord.js');

module.exports = {
  name: 'application',
  async run(bot, message, args) {
    await message.delete();

    if (message.author.id != '279302975371870218') return; // ID бота

    const application = new MessageButton()
      .setStyle('PRIMARY')
      .setLabel('Подать заявку')
      .setCustomId('application');

    const row = new MessageActionRow().addComponents(application);

    const embed = new MessageEmbed()
      .setTitle(`Набор в администрацию сервера`)
      .setColor(botconfig.color)
      .setTimestamp()
      .setDescription(
        `**Администрация следит за порядком на сервере. За работу вы будете получать награду в виде серверной валюты, смотря на ваш уровень администрирования.**\n\n**Вопросы на которые вы должны ответить**\n1) Сколько вам лет?\n2) Ознакомились ли вы с правилами сервера?\n3) Сколько вы готовы уделять серверу?\n4) Почему мы должны взять вас на роль администратора?\n5) Готовы ли вы пройти собеседование?\n\n**ВНИМАНИЕ Если заявление написано неправильно или написали ради забавы, мы сразу отклоняем эту заявку!`
      )
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });
    return message.channel.send({ embeds: [embed], components: [row] });
  },
};
