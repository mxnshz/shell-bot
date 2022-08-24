const { MessageEmbed, Permissions, MessageButton, MessageActionRow, ContextMenuInteraction } = require("discord.js");
const Admins = require('../../schemas/Admins')
const Temps = require('../../schemas/Temps')

module.exports = {
    name: "shop",
    description: "Увидеть доступные товары.",
    async run (bot, message, args) {
      let user_db = await Admins.findOne({ DiscordID: message.author.id })

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
      const embedMessage = await message.reply({
        embeds: [await generateEmbed(0)],
        components: canFitOnOnePage
          ? []
          : [new MessageActionRow({components: [forwardButton]})]
      })
      if (canFitOnOnePage) return

      const collector = embedMessage.createMessageComponentCollector({
        filter: ({user}) => user.id === message.author.id
      })

      await message.delete()

      let currentIndex = 0
      collector.on('collect', async interaction => {

        interaction.customId === backId ? (currentIndex -= 10) : (currentIndex += 10)

        await interaction.update({
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
    }
}
