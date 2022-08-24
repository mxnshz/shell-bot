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
  const item = botconfig.items.find(el => el.id === parseInt(temp_db.item))

	if(!user_db){
	   return interaction.reply({content: `Ошибка! Пользователь отсутствует в базе данных. Действие не может быть совершено.`, ephemeral: true})
	}

  if(!temp_db){
     return interaction.reply({content: `Ошибка! Запрос отсутствует в базе данных. Действие не может быть совершено.`, ephemeral: true})
  }

  await message_interaction.delete()
  await interaction.channel.send({content: `**Пользователю <@${temp_db.DiscordID}> \`${user_db.SteamID}\` было отказано в покупке товара \`${item.name}\` за \`${item.price}\` коинов.\nЗапрос отклонил ${member_interaction}.**`})
  await bot.users.cache.get(temp_db.DiscordID)?.send({ content: `**Вам было отказано в покупке товара \`${item.name}\` за \`${item.price}\` коинов.\nЗапрос отклонил ${member_interaction}.**` }).catch(() => null)

  await Temps.deleteOne({ msg_id: interaction.message.id })
}
