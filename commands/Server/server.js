const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "server",
    async run (bot, message, args) {
            await message.delete()

            if(message.author.id != "279302975371870218") return

            const server_info = new MessageButton()
            .setStyle('PRIMARY')
            .setLabel("Статистика сервера")
            .setCustomId('server_info')

            const row = new MessageActionRow()
            .addComponents(server_info)

            const embed = new MessageEmbed()
              .setTitle(`Информация о сервере`)
              .setColor(botconfig.color)
              .setTimestamp()
              .setDescription(`В данном канале, нажав на соответствующую кнопку "Статистика сервера" - Вы можете посмотреть статистику сервера.`)
              .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            return message.channel.send({ embeds: [embed], components: [row] });
      }
}
