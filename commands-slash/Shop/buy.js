const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Admins = require('../../schemas/Admins')
const Temps = require('../../schemas/Temps')

module.exports = {
	type: "USER",
	data: new SlashCommandBuilder()
		.setName('buy')
		.setDescription('Купить что-то за коины.')
		.addNumberOption(option =>
			option.setName('товар')
			.setDescription('Айди товара.')
			.setRequired(true)),
	async execute(interaction, bot, args) {
    const guild = await bot.guilds.cache.get(botconfig.guild_id)
    const channel = await guild.channels.cache.get(botconfig.accept_shop)
    let temp_db = await Temps.findOne({ DiscordID: interaction.member.id })
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

    if(temp_db){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setColor(botconfig.color)
        .setTimestamp()
        .setDescription("Вы уже оставили заявку, дожидайтесь её рассмотрения.");
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

    if(item.price > user_db.Coins) {
      const err = new MessageEmbed()
      .setTitle("Ошибка")
      .setColor(botconfig.color)
      .setTimestamp()
      .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
      .setDescription("У вас недостаточно коинов.");
      return interaction.reply({ embeds: [err], ephemeral: true });
    }

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
      .setTimestamp()
      .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
      .setDescription(`${interaction.member} \`[${user_db.SteamID}]\` хочет купить товар \`${item.name}\` за \`${item.price}\` коинов.\nПроверьте все данные и произведите выдачу.`);
    let msg = await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: `Вы успешно оставили заявку на покупку товара \`${item.name}\` за \`${item.price}\` коинов.`, ephemeral: true });

    await Temps.create({
      DiscordID: interaction.member.id,
      SteamID: user_db.STEAM_ID,
      msg_id: msg.id,
      item: Number(args[0]),
      docs: args[1],
      Type: "Покупка товара"
    })
	},
};
