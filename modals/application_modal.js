const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const buttonCooldown = new Set()

module.exports = async (bot, interaction, args) => {
  await interaction.deferReply({ephemeral: true})
  const message_interaction = interaction.message
  const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
  const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
  const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

  const channel = await bot.channels.fetch(botconfig.application_channel);

  if(buttonCooldown.has(interaction.user.id)) {
    await interaction.editReply({ content: `На выполнение этого действия действует кулдаун 30 секунд, повторите попытку позже.`, ephemeral: true })
  }

  buttonCooldown.add(interaction.user.id)
    setTimeout(() => buttonCooldown.delete(interaction.user.id), 30000)

  await interaction.editReply({ content: `Заявление будет рассмотрено в течение 3 дней.`, ephemeral: true })

  let embed = new MessageEmbed()
    .setTitle("Заявление в администрацию")
    .setColor(botconfig.color)
    .setFooter({ "text": interaction.guild.name, "iconURL": interaction.guild.iconURL() })
    .setTimestamp()
    .addFields(
    		{ name: 'Discord аккаунт', value: `${interaction.fields.getTextInputValue('discord')}` },
    		{ name: 'Сколько вам лет?', value: `${interaction.fields.getTextInputValue('age')}` },
        { name: 'Ознакомились ли вы с правилами сервера?', value: `${interaction.fields.getTextInputValue('rules')}` },
        { name: 'Сколько вы готовы уделять серверу?', value: `${interaction.fields.getTextInputValue('time')}` },
        { name: 'Почему мы должны взять вас в администрацию?', value: `${interaction.fields.getTextInputValue('about')}` },
    	);
  await channel.send({ embeds: [embed] });
}
