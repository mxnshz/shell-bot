const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Admins = require('../../schemas/Admins')
const Temps = require('../../schemas/Temps')

module.exports = {
	type: "USER",
	data: new SlashCommandBuilder()
		.setName('send')
		.setDescription('Запросить выдачу количества коинов за жалобы.')
		.addNumberOption(option =>
			option.setName('количетсво')
			.setDescription('Количество коинов.')
			.setRequired(true))
    .addStringOption(option =>
      option.setName('доказательства')
      .setDescription('Скриншот с количеством ваших жалоб.')
      .setRequired(true)),
	async execute(interaction, bot, args) {
    const guild = await bot.guilds.cache.get(botconfig.guild_id)
    const channel = await guild.channels.cache.get(botconfig.accept_shop)
    var regexp = /^https?:\/\/.*\.(?:jpe?g|gif|png)$/gi;
    let temp_db = await Temps.findOne({ DiscordID: interaction.member.id })
    let user_db = await Admins.findOne({ DiscordID: interaction.member.id })

    if(!interaction.member.roles.cache.some(r => botconfig.admin.some(role => r.id == role))){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setColor(botconfig.color)
        .setTimestamp()
        .setDescription("Недостаточно прав!");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    if(!user_db){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setColor(botconfig.color)
        .setTimestamp()
        .setDescription("Вы не найдены в базе, обратитесь к руководству.");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    if(temp_db){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setColor(botconfig.color)
        .setTimestamp()
        .setDescription("Вы уже оставили заявку, дожидайтесь её рассмотрения.");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    if(!interaction.options.getString('доказательства').match(regexp)) {
      const err = new MessageEmbed()
      .setTitle("Ошибка")
      .setColor(botconfig.color)
      .setTimestamp()
      .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
      .setDescription("Указанный аргумент не соответствует формату ссылки на изображение.");
      return interaction.reply({ embeds: [err], ephemeral: true });
    }

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
      .setTimestamp()
      .setImage(`${interaction.options.getString('доказательства')}`)
      .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
      .setDescription(`Пользователь ${interaction.member} запросил выдачу \`${interaction.options.getNumber('количетсво') * botconfig.index}\` коинов за \`${interaction.options.getNumber('количетсво')}\` жалоб.\nSTEAM_ID: \`${user_db.SteamID}\``);
    let msg = await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `Вы успешно оставили заявку на выдачу коинов.`, ephemeral: true })

    await Temps.create({
      DiscordID: interaction.member.id,
      SteamID: user_db.STEAM_ID,
      msg_id: msg.id,
      amount: interaction.options.getNumber('количетсво'),
      docs: interaction.options.getString('доказательства'),
      Type: "Выдача коинов"
    })
	},
};
