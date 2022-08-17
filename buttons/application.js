const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton, Modal, TextInputComponent } = require('discord.js');

module.exports = async (bot, interaction) => {
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    const modal = new Modal()
    .setCustomId('application_modal')
    .setTitle('Заявка в администрацию');

    const discord = new TextInputComponent()
      .setCustomId('discord')
      .setLabel("Укажите ваш Discord аккаунт")
      .setStyle('SHORT')
      .setPlaceholder(`nickname#0001`)
      .setRequired();

    const age = new TextInputComponent()
      .setCustomId('age')
      .setLabel("Сколько вам лет?")
      .setStyle('SHORT')
      .setPlaceholder(`Берем от 14 лет`)
      .setRequired();

    const rules = new TextInputComponent()
      .setCustomId('rules')
      .setLabel("Ознакомились ли вы с правилами сервера?")
      .setStyle('SHORT')
      .setPlaceholder(`Да или нет`)
      .setRequired();

    const time = new TextInputComponent()
      .setCustomId('time')
      .setLabel("Сколько времени вы готовы уделять серверу?")
      .setStyle('SHORT')
      .setPlaceholder(`Указывать в часах. Например: 2-3 часа`)
      .setRequired();

    const about = new TextInputComponent()
      .setCustomId('about')
      .setLabel("Почему мы должны взять вас в администрацию?")
      .setStyle('PARAGRAPH')
      .setPlaceholder(`Опишите себя`)
      .setRequired();

    const firstActionRow = new MessageActionRow().addComponents(discord);
    const secondActionRow = new MessageActionRow().addComponents(age);
    const thirdActionRow = new MessageActionRow().addComponents(rules);
    const fourthActionRow = new MessageActionRow().addComponents(time);
    const fifthActionRow = new MessageActionRow().addComponents(about);

    modal.addComponents(firstActionRow);
    modal.addComponents(secondActionRow);
    modal.addComponents(thirdActionRow);
    modal.addComponents(fourthActionRow);
    modal.addComponents(fifthActionRow);

    await interaction.showModal(modal);

}