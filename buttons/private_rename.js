const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const Users = require("../schemas/Users");
var categoryid = botconfig.private_category;

module.exports = async (bot, interaction) => {
    const message_interaction = interaction.message
    const guild_interaction = bot.guilds.cache.get(interaction.guildId); // Ищем гильдию в которой было совершено действие
    const member_interaction = await guild_interaction.members.fetch(interaction.user.id); // Юзер который нажал на кнопку
    const channel_interaction = await guild_interaction.channels.cache.get(interaction.channelId); // Канал в котором было произведено действие

    if(!interaction.member.voice.channel) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(interaction.member.voice.channel.parentId != categoryid) return interaction.reply({content: `**Вы не находитесь в приватном голосовом канале.**`, ephemeral: true})
    if(!interaction.member.permissionsIn(interaction.member.voice.channel?.id).has(`MANAGE_CHANNELS`)) return interaction.reply({content: `**Вы не владеете приватным голосовым каналом.**`, ephemeral: true})

    interaction.reply({content: `**Напишите новое название для канала в чат:**`, ephemeral: true})

    const filter = m => m.author.id == interaction.user.id
    const collector = interaction.channel.createMessageCollector({ filter, max: 1, time: 15000 });

    collector.on('collect', async (m) => {
      setTimeout(async () => {
        m.channel.send({content: `**${interaction.member}, вы переименовали свой приват в ${m.content}.**`})
        await Users.updateOne({ DiscordID: interaction.user.id }, {$set: { PrivateName: m.content }})
        await interaction.member.voice.channel?.edit({ name: m.content })
      },1000)
    })

}
