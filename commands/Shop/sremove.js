const { MessageEmbed, Permissions } = require("discord.js");
const Admins = require('../../schemas/Admins')

module.exports = {
    name: "sremove",
    description: "Удаляет админ-коины у администратора.",
    async run (bot, message, args) {
      let member = message.mentions.members.first()
      const id = member?.id ?? args[0]

        if(!message.member.roles.cache.some(r => botconfig.mainadmin.some(role => r.id == role))){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Недостаточно прав!");
            return message.reply({ embeds: [err] });
        }

        if(!id){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Укажите, кому вы хотите снять коины. \"@user\"");
            return message.reply({ embeds: [err] });
        }

        if(!args[1]){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setColor(botconfig.color)
            .setTimestamp()
            .setDescription("Укажите количетсво коинов для снятия пользователю.");
            return message.reply({ embeds: [err] });
        }

        if(!Number(args[1])) {
          const err = new MessageEmbed()
          .setTitle("Ошибка")
          .setColor(botconfig.color)
          .setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription("Указанный аргумент не соответствует числовому формату.");
          return message.reply({ embeds: [err] });
        }

				let user_db = await Admins.findOne({ DiscordID: id })

        if(!user_db){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(botconfig.color)
            .setTimestamp()
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setDescription("Данный администратор отсутствует в базе.");
            return message.reply({ embeds: [err] });
        }

        if(user_db.Coins - Number(args[1]) < 0){
            const err = new MessageEmbed()
            .setTitle("Ошибка")
            .setColor(botconfig.color)
            .setTimestamp()
            .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
            .setDescription(`При вычите \`${Number(args[1])}\` коинов у администратора - у него останется отрицательное число коинов.`);
            return message.reply({ embeds: [err] });
        }

        await message.delete()

        user_db.Coins -= Number(args[1])
        user_db.save()

        let embed = new MessageEmbed()
          .setTitle("Снятие коинов")
          .setColor(botconfig.color)
          .setAuthor({ "iconURL": message.author.avatarURL(), "name": message.author.tag })
      		.setTimestamp()
          .setFooter({text:message.guild.name, iconURL: message.guild.iconURL()})
          .setDescription(`Пользователю <@${id}> сняли \`${args[1]}\` коинов.`);
        await message.channel.send({ embeds: [embed] });
    }
}
