const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Admins = require('../../schemas/Admins')
const Temps = require('../../schemas/Temps')

module.exports = {
    name: "buy",
    description: "Купить что-то за админ-коины.",
    async run (bot, message, args) {
      const guild = await bot.guilds.cache.get(botconfig.guild_id)
      const channel = await guild.channels.cache.get(botconfig.accept_shop)
      let temp_db = await Temps.findOne({ DiscordID: message.author.id, Type: "Покупка товара" })
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

        if(!user_db){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Вы не найдены в базе, обратитесь к руководству.");
            return message.reply({ embeds: [err] });
        }

        if(temp_db){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Вы уже оставили заявку, дожидайтесь её рассмотрения.");
            return message.reply({ embeds: [err] });
        }

        if(!args[0]){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Укажите айди предмета для покупки.");
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

        if(item.price > user_db.Coins) {
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setColor(botconfig.color)
          .setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription("У вас недостаточно коинов.");
          return message.reply({ embeds: [err] });
        }

        await message.delete()

        const buy_accept = new MessageButton()
        .setStyle('SUCCESS')
        .setLabel("Одобрить")
        .setCustomId('buy_accept')
        const buy_deny = new MessageButton()
        .setStyle('DANGER')
        .setLabel("Отклонить")
        .setCustomId('buy_deny')

        const row = new MessageActionRow()
        .addComponents(buy_accept)
        .addComponents(buy_deny)

        let embed = new MessageEmbed()
          .setTitle("Запрос покупки товаров за коины")
          .setColor(botconfig.color)
          .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
      		.setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription(`${message.author} \`[${user_db.SteamID}]\` хочет купить товар \`${item.name}\` за \`${item.price}\` коинов.\nПроверьте все данные и произведите выдачу.`);
        let msg = await channel.send({ embeds: [embed], components: [row] });

        await Temps.create({
          DiscordID: message.author.id,
          SteamID: user_db.STEAM_ID,
          msg_id: msg.id,
          item: Number(args[0]),
          docs: args[1],
          Type: "Покупка товара"
        })
    }
}
