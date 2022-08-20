const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed, ContextMenuInteraction, MessageButton, MessageActionRow } = require('discord.js')
const { shuffle, embed, errorEmbed } = require("../../util.js");

module.exports = {
	type: "USER",
	data: new SlashCommandBuilder()
		.setName('auth')
		.setDescription('Верификация.'),
	async execute(interaction, bot, args) {


      let [buttonList, codeList] = [[], []]; 
      let fontList = [ // Подгоняем рандомный шрифт для текста в кнопках - для разнообразия
        "lato",
        "lora",
        "montserrat",
        "open-sans",
        "oswald",
        "playfair-display",
        "pt-sans",
        "raleway",
        "roboto",
        "source-sans-pro"
      ]
      for (let i = 0; i < 8; i++) {
        let code = Math.random().toString(36).slice(-8).toUpperCase();
        codeList.push(code)
        buttonList.push(
          new MessageButton()
            .setStyle('PRIMARY')
            .setLabel(code)
            .setCustomId(`ACTION_${i === 0 ? 'SUCCESS' : 'ERROR_' + i}`)
        )
      }
      let buttonListShuffle = shuffle(buttonList);

      interaction.reply({
        embeds: [
          embed({ interaction }).setImage(`https://placehold.co/390x120@3x/2f3136/FFF.png?text=${codeList[0]}&font=${shuffle(fontList)[0]}`) // Сайт через который берутся детали для создания кнопки
        ],
        components: [
          new MessageActionRow().addComponents(buttonListShuffle.slice(0, 4)),
          new MessageActionRow().addComponents(buttonListShuffle.slice(4, 8)),
        ],
      }).then(async () => {
        let error = () => {
          interaction.editReply({
            embeds: [errorEmbed({
              color: botconfig.color,
              interaction
            })],
            components: []
          });
        }
        let clickButton = false;
        let fetch = await interaction.fetchReply();

        fetch
          .createMessageComponentCollector({
            componentType: 'BUTTON',
            filter: (clicker) => clicker.user.id == interaction.user.id
          })
          .on('collect', async (button) => {
            if (button.customId === "ACTION_SUCCESS") {
              clickButton = true;
              interaction.deleteReply();

              interaction.member.roles.add('761649969681530882') // Роль которая выдаёт доступ к каналам
              // Успешно
            } else {
              error();
              setTimeout(() => {
                interaction.deleteReply();
              }, 5000);
              // Провал
            }
          })

        setTimeout(() => !clickButton && error(), 60 * 1000)
      })

	},
};
