const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Admins = require("../schemas/Admins");
const Temps = require("../schemas/Temps");

module.exports = async (bot, interaction) => {
  const message_interaction = interaction.message
  const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
  const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
  const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

  let user_db = await Admins.findOne({ DiscordID: interaction.user.id })
  let temp_db = await Temps.findOne({ msg_id: interaction.message.id })

  await message_interaction.delete()
  await interaction.channel.send({content: `**Заявка от пользователя <@${temp_db.DiscordID}> была удалена.\nЗапрос удалил ${member_interaction}.**`})

  await Temps.deleteOne({ msg_id: interaction.message.id })
}
