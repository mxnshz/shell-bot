const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const Admins = require('../../schemas/Admins');

module.exports = async (bot, oldMember, newMember) => {
  if (newMember.roles.cache.some((r) => botconfig.admin.some((role) => r.id == role))) {
    const guild = await bot.guilds.cache.get(botconfig.guild_id);

    const logs = await guild.fetchAuditLogs({ type: 'MEMBER_ROLE_UPDATE' }).then(async (audit) => {
      let user_db = await Admins.findOne({ DiscordID: newMember.id });
      if (user_db) return;
      const channel = await guild.channels.cache.get(botconfig.accept_shop);
      const err = new MessageEmbed()
        .setTitle('Назначение Администратора')
        .setColor(botconfig.color)
        .setDescription(
          `Вы выдали пользователю ${newMember} роль Администратора. Для внесения в базу данных - следующим сообщением введите его STEAM_ID.\nУ вас есть 15 секунд.\nSTEAM_ID можно будет поменять командой \`!steam\``
        );
      channel.send({ content: `<@${audit.entries.first().executor.id}>`, embeds: [err] });

      const filter = (m) => m.author.id == audit.entries.first().executor.id;
      const collector = channel.createMessageCollector({ filter, max: 1, time: 15000 });

      collector.on('collect', async (m) => {
        var regexp = /^STEAM_[0-5]:[0-1]:[0-9]*$/;
        if (!m.content.match(regexp)) {
          await newMember.roles.remove(botconfig.admin);
          m.channel.send(
            `${m.author}, введенные вами данные не соответствуют STEAM_ID. Роли пользователя были сняты. Попробуйте вновь.`
          );
          return;
        }
        await channel.bulkDelete(2);
        m.channel.send(`${newMember} был успешно внесён в базу данных. STEAM_ID: ${m.content}`);
        await Admins.create({
          DiscordID: newMember.id,
          SteamID: m.content,
        });
      });
    });
  }
};
