const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction } = require('discord.js')
const Admins = require('../../schemas/Admins')

module.exports = {
	type: "USER",
	data: new SlashCommandBuilder()
		.setName('sgive')
		.setDescription('Выдать определённое количество коинов администратору.')
		.addUserOption(option =>
			option.setName('пользователь')
			.setDescription('Пользователь, которому нужно выдать коины.')
			.setRequired(true))
		.addNumberOption(option =>
			option.setName('количетсво')
			.setDescription('Количество коинов.')
			.setRequired(true)),
	async execute(interaction, bot, args) {

		let member = interaction.options.getUser('пользователь')
		const id = member.id;
		let user_db = await Admins.findOne({ DiscordID: id })

		if(!user_db){
				const err = new MessageEmbed()
				.setTitle("Ошибка")
				.setColor(botconfig.color)
				.setTimestamp()
				.setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
				.setDescription("Данный администратор отсутствует в базе.");
				return interaction.reply({ embeds: [err], ephemeral: true });
		}

		user_db.Coins += interaction.options.getNumber('количетсво')
		user_db.save()

		let embed = new MessageEmbed()
			.setTitle("Выдача коинов")
			.setColor(botconfig.color)
			.setTimestamp()
			.setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
			.setDescription(`Пользователю <@${id}> выдали \`${interaction.options.getNumber('количетсво')}\` коинов.`);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	},
};
