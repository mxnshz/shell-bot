const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const Admins = require('../../schemas/Admins')
const Temps = require('../../schemas/Temps')

module.exports = {
	type: "USER",
	data: new SlashCommandBuilder()
		.setName('shop')
		.setDescription('Каталог товаров.'),
	async execute(interaction, bot, args) {
    let user_db = await Admins.findOne({ DiscordID: interaction.member.id })

    if(!user_db){
        const err = new MessageEmbed()
        .setTitle("Ошибка")
        .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
        .setColor(botconfig.color)
        .setTimestamp()
        .setDescription("Вы не найдены в базе, обратитесь к руководству.");
        return interaction.reply({ embeds: [err], ephemeral: true });
    }

    const backId = 'back'
    const forwardId = 'forward'
    const backButton = new MessageButton({
      style: 'PRIMARY',
      label: 'Назад',
      emoji: '⬅️',
      customId: backId
    })
    const forwardButton = new MessageButton({
      style: 'PRIMARY',
      label: 'Вперёд',
      emoji: '➡️',
      customId: forwardId
    })

    const items = botconfig.items

    const generateEmbed = async start => {
    const current = items.slice(start, start + 10)

      return new MessageEmbed({
        title: `Каталог товаров ${start + 1}-${start + current.length} из ${items.length}`,
        description: `!info [ID] для подробной информации о товаре.`,
        color: botconfig.color,
        footer: {text: `Ваш баланс: ${user_db.Coins} коинов`},
        fields: await Promise.all(
          current.map(async items => ({
            name: items.name,
            value: `[ID: ${items.id}] Цена: ${items.price}`
          }))
        )
      })
    }

    const canFitOnOnePage = items.length <= 10
    const embedMessage = await interaction.reply({
      ephemeral: true,
      fetchReply: true,
      embeds: [await generateEmbed(0)],
      components: canFitOnOnePage
        ? []
        : [new MessageActionRow({components: [forwardButton]})]
    })
    if (canFitOnOnePage) return

    const collector = embedMessage.createMessageComponentCollector({
      filter: ({user}) => user.id === interaction.member.id
    })

    let currentIndex = 0
    collector.on('collect', async interaction => {

      interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)

      await interaction.update({
        ephemeral: true,
        fetchReply: true,
        embeds: [await generateEmbed(currentIndex)],
        components: [
          new MessageActionRow({
            components: [

              ...(currentIndex ? [backButton] : []),

              ...(currentIndex + 10 < items.length ? [forwardButton] : [])
            ]
          })
        ]
      })
    })
	},
};
