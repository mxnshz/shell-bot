const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require('discord.js');
const Gamedig = require('gamedig');

module.exports = async (bot) => {
  const guild = await bot.guilds.cache.get(botconfig.guild_id);
  const channel = await guild.channels.cache.get(botconfig.stats_channel);
  const message = await channel.messages.fetch(botconfig.stats_msg);

  setTimeout(function () {
    Gamedig.query({
      type: 'garrysmod',
      host: '46.174.53.130',
    }).then((state) => {
      let Players = state.players
        .filter((f) => f.name != ``)
        .map((x) => `+ ${x.name}`)
        .join(`\n`);
      let Time = state.players
        .filter((f) => f.name != ``)
        .map((x) => `${~~(x.raw.time / 60)} минут`)
        .join(`\n`);

      const embed = new MessageEmbed()
        .setTitle(state.name)
        .setColor(botconfig.color)
        .setTimestamp()
        .addFields(
          { name: '> IP Адрес', value: `\`${state.connect}\``, inline: true },
          { name: '> Онлайн', value: `\`${state.players.length} человек\``, inline: true },
          { name: '> Карта', value: `\`${state.map}\``, inline: true },
          { name: '**Игроки онлайн**', value: `\`\`\`diff\n${Players}\`\`\``, inline: true },
          { name: '**Время онлайна игроков**', value: `\`\`\`arm\n${Time}\`\`\``, inline: true }
        )
        .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() });
      message.edit({ embeds: [embed] });
    });
  }, 300000);
};
