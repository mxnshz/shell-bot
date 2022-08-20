const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");
const Gamedig = require('gamedig'); // подробнее будет на странице этой npm библиотеки

module.exports = async (bot, interaction) => {
  await interaction.deferReply({ ephemeral: true })
  Gamedig.query({
      type: 'garrysmod', // игра в которой работает сервер
      host: '46.174.53.130' // IP сервера, который отслеживается
  }).then(async(state) => {
    let Players = state.players.filter(f => f.name != ``).map((x) => `+ ${x.name}`).join(`\n`)
    let Time = state.players.filter(f => f.name != ``).map((x) => `${~~(x.raw.time/60)} минут`).join(`\n`)

    const embed = new MessageEmbed()
    .setTitle(state.name)
    .setColor(botconfig.color)
    .setTimestamp()
    .addFields(
      { name: '> IP Адрес', value: `\`${state.connect}\``, inline: true },
      { name: '> Онлайн', value: `\`${state.players.length} человек\``, inline: true },
      { name: '> Карта', value: `\`${state.map}\``, inline: true },
      { name: '**Игроки онлайн**', value: `\`\`\`diff\n${Players}\`\`\``, inline: true },
      { name: '**Время онлайна игроков**', value: `\`\`\`arm\n${Time}\`\`\``, inline: true },
    )
    .setFooter({text:interaction.guild.name, iconURL: interaction.guild.iconURL()})
    await interaction.editReply({ embeds: [embed], ephemeral: true });
  })
}
