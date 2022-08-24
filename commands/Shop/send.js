const { MessageEmbed, Permissions, MessageButton, MessageActionRow } = require("discord.js");
const Admins = require('../../schemas/Admins')
const Temps = require('../../schemas/Temps')

module.exports = {
    name: "send",
    description: "Запросить коины за решенные жалобы.",
    async run (bot, message, args) {
      const guild = await bot.guilds.cache.get(botconfig.guild_id)
      const channel = await guild.channels.cache.get(botconfig.accept_shop)
      var regexp = /^https?:\/\/.*\.(?:jpe?g|gif|png)$/gi;
      let temp_db = await Temps.findOne({ DiscordID: message.author.id, Type: "Выдача коинов" })
      let user_db = await Admins.findOne({ DiscordID: message.author.id })

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

        if(!args[1]){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Укажите количетсво жалоб для получения коинов.");
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

        if(!args[1]){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Укажите ссылку на скриншот.");
            return message.reply({ embeds: [err] });
        }

        if(!args[1].match(regexp)) {
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setColor(botconfig.color)
          .setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription("Указанный аргумент не соответствует формату ссылки на изображение.");
          return message.reply({ embeds: [err] });
        }

        await message.delete()

        const shop_accept = new MessageButton()
        .setStyle('SUCCESS')
        .setLabel("Одобрить")
        .setCustomId('shop_accept')
        const shop_deny = new MessageButton()
        .setStyle('DANGER')
        .setLabel("Отклонить")
        .setCustomId('shop_deny')
        const shop_delete = new MessageButton()
        .setStyle('DANGER')
        .setLabel("Удалить")
        .setCustomId('shop_delete')

        const row = new MessageActionRow()
        .addComponents(shop_accept)
        .addComponents(shop_deny)
        .addComponents(shop_delete)

        let embed = new MessageEmbed()
          .setTitle("Запрос выдачи коинов за жалобы")
          .setColor(botconfig.color)
          .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
      		.setTimestamp()
          .setImage(`${args[1]}`)
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription(`Пользователь ${message.author} запросил выдачу \`${args[0] * botconfig.index}\` коинов за \`${args[0]}\` жалоб.\nSTEAM_ID: \`${user_db.SteamID}\``);
        let msg = await channel.send({ embeds: [embed], components: [row] });

        await Temps.create({
          DiscordID: message.author.id,
          SteamID: user_db.STEAM_ID,
          msg_id: msg.id,
          amount: Number(args[0]),
          docs: args[1],
          Type: "Выдача коинов"
        })
    }
}
