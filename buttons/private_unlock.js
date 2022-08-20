const { MessageEmbed, Permissions, MessageAttachment, MessageActionRow, MessageButton } = require('discord.js');
const botconfig = require('../config')
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

    interaction.member.voice.channel?.permissionOverwrites.edit(interaction.guild.roles.everyone.id, {
        "VIEW_CHANNEL": false,
        "CONNECT": false,
    })
    interaction.member.voice.channel?.permissionOverwrites.edit(botconfig.user, {
        "VIEW_CHANNEL": true,
        "CONNECT": true,
    }).then(() => {
      interaction.reply({content: `**Вы открыли ваш приват.**`, ephemeral: true})
})
await Users.updateOne({ DiscordID: interaction.user.id }, {$set: { PrivateIsLocked: false   }})

}
