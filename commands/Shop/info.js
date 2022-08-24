const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Admins = require('../../schemas/Admins')
const Temps = require('../../schemas/Temps')

module.exports = {
    name: "info",
    description: "Информация о товаре",
    async run (bot, message, args) {
      const guild = await bot.guilds.cache.get(botconfig.guild_id)
      const channel = await guild.channels.cache.get(botconfig.accept_shop)
      let temp_db = await Temps.findOne({ DiscordID: message.author.id })
      let user_db = await Admins.findOne({ DiscordID: message.author.id })
      const item = botconfig.items.find(el => el.id === parseInt(args[0]))

        if(!message.member.roles.cache.some(r => botconfig.admin.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return message.reply({ embeds: [err] });
        }

        if(!args[0]){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Укажите айди товара.");
            return message.reply({ embeds: [err] });
        }

        if(!Number(args[0])) {
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setColor(botconfig.color)
          .setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription("Указанный аргумент №1 не соответствует числовому формату.");
          return message.reply({ embeds: [err] });
        }

        if(!item) {
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setColor(botconfig.color)
          .setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription("Указанный товар не был найден в каталоге.");
          return message.reply({ embeds: [err] });
        }

        await message.delete()

        let embed = new MessageEmbed()
          .setTitle(`Подробная информация о товаре "${item.name}"`)
          .setColor(botconfig.color)
      		.setTimestamp()
          .setImage(`${item.image}`)
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription(`Название: ${item.name}\nЦена: ${item.price}\n Описание: ${item.description}`);
        let msg = await channel.send({ embeds: [embed] });
    }
}
