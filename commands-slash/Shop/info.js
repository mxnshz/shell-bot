const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Admins = require('../../schemas/Admins')

module.exports = {
	type: "USER",
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Узнать информацию о товаре.')
		.addNumberOption(option =>
			option.setName('товар')
			.setDescription('Айди товара.')
			.setRequired(true)),
	async execute(interaction, bot, args) {
    const guild = await bot.guilds.cache.get(botconfig.guild_id)
    const channel = await guild.channels.cache.get(botconfig.accept_shop)
    let user_db = await Admins.findOne({ DiscordID: interaction.member.id })
    const item = botconfig.items.find(el => el.id === parseInt(interaction.options.getNumber('товар')))

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

    if(!item) {
      const err = new MessageEmbed()
      .setTitle("Ошибка")
      .setColor(botconfig.color)
      .setTimestamp()
      .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
      .setDescription("Указанный товар не был найден в каталоге.");
      return interaction.reply({ embeds: [err], ephemeral: true });
    }

    let embed = new MessageEmbed()
      .setTitle(`Подробная информация о товаре "${item.name}"`)
      .setColor(botconfig.color)
      .setTimestamp()
      .setImage(`${item.image}`)
      .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
      .setDescription(`Название: ${item.name}\nЦена: ${item.price}\n Описание: ${item.description}`);
    await interaction.reply({ embeds: [embed], ephemeral: true });

	},
};
