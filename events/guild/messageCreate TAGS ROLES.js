const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const RoleTemps = require('../../schemas/RoleTemps');
const tags = require('../../config').tags;

class giveRole {
  constructor() {
    this.role = null;
  }

  setRole(role_id) {
    this.role = role_id;
  }

  getRole() {
    return this.role;
  }
}

module.exports = async (bot, message, args) => {
  if (message.channel.id != botconfig.roles) return;
  const msg_split = message.content.toLowerCase().split(' ');

  if (message.author.id == botconfig.client_id) return;

  if (message.member.nickname == null) {
    return message.delete();
  }

  if (!message.content.toLowerCase().valueOf('роль')) {
    return message.delete();
  }

  const name_split = message.member.nickname.split(' | ');

  if (!tags[name_split[0]]) {
    return message.delete();
  }

  let req_db = await RoleTemps.findOne({ DiscordID: message.author.id });
  if (req_db) {
    return message.delete();
  }

  if (msg_split[0] == 'снять' && msg_split[1] == 'роль' && msg_split.length == 2) {
    const result_filter0 = await tags[name_split[0]].roles.filter((x) => x.checkRole == '0');
    let role_m = new giveRole();

    if (result_filter0[0]) {
      role_m.setRole(result_filter0[0].giveRole);

      await message.member.roles.cache.map(async (role) => {
        if (!message.member.roles.cache.get(result_filter0[0].giveRole)) return;
        role_m.setRole(result_filter0[0].giveRole);

        if (role_m.getRole() == null || !role_m.getRole()) {
          return message.delete();
        }
      });
    } else {
      await message.member.roles.cache.map(async (role) => {
        const result = await tags[name_split[0]].roles.filter((x) => x.checkRole == role.id);

        if (result[0] != null) {
          if (message.member.roles.cache.get(result[0].giveRole)) return;
          role_m.setRole(result[0].giveRole);

          if (role_m.getRole() == null || !role_m.getRole()) {
            return;
            message.delete();
          }
        }
      });
    }

    await message.react('👀');

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId(`accept_request_del.${role_m.getRole()}`)
          .setLabel(`Одобрить`)
          .setStyle('SUCCESS')
      )
      .addComponents(
        new MessageButton()
          .setCustomId(`cancel_request_del.${role_m.getRole()}`)
          .setLabel(`Отклонить`)
          .setStyle('DANGER')
      )
      .addComponents(
        new MessageButton()
          .setCustomId(`delete_request_del.${role_m.getRole()}`)
          .setLabel(`Удалить`)
          .setStyle('DANGER')
      );

    let embed_req = new MessageEmbed()
      .setAuthor({ iconURL: message.author.avatarURL(), name: message.author.tag })
      .setTitle('Запрос на снятие ролей')
      .setColor(botconfig.color)
      .setDescription(
        `Пользователь запросил снятие всех ролей.\nЕго никнейм на сервере: \`${
          message.member.nickname == null ? message.author.username : message.member.nickname
        }\``
      )
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
      .setTimestamp();

    await bot.channels.cache
      .get(botconfig.accept_roles)
      .send({ embeds: [embed_req], components: [row] })
      .then(async (msg) => {
        await RoleTemps.create({
          DiscordID: message.author.id,
          created_at: Date.now(),
          created_msg: message.id,
          mod_msg: msg.id,
        });

        await msg.pin();
      });
  }

  if (msg_split[0] == 'роль' && msg_split.length == 1) {
    const result_filter0 = await tags[name_split[0]].roles.filter((x) => x.checkRole == '0');
    let role_m = new giveRole();

    if (result_filter0[0]) {
      role_m.setRole(result_filter0[0].giveRole);

      await message.member.roles.cache.map(async (role) => {
        if (message.member.roles.cache.get(result_filter0[0].giveRole)) return;
        role_m.setRole(result_filter0[0].giveRole);

        if (role_m.getRole() == null || !role_m.getRole()) {
          return message.delete();
        }
      });
    } else {
      await message.member.roles.cache.map(async (role) => {
        const result = await tags[name_split[0]].roles.filter((x) => x.checkRole == role.id);

        if (result[0] != null) {
          if (message.member.roles.cache.get(result[0].giveRole)) return;
          role_m.setRole(result[0].giveRole);

          if (role_m.getRole() == null || !role_m.getRole()) {
            return message.delete();
          }
        }
      });
    }

    await message.react('👀');

    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId(`accept_request.${role_m.getRole()}`)
          .setLabel(`Одобрить`)
          .setStyle('SUCCESS')
      )
      .addComponents(
        new MessageButton()
          .setCustomId(`cancel_request.${role_m.getRole()}`)
          .setLabel(`Отклонить`)
          .setStyle('DANGER')
      )
      .addComponents(
        new MessageButton()
          .setCustomId(`delete_request.${role_m.getRole()}`)
          .setLabel(`Удалить`)
          .setStyle('DANGER')
      );

    let embed_req = new MessageEmbed()
      .setAuthor({ iconURL: message.author.avatarURL(), name: message.author.tag })
      .setTitle('Запрос роли')
      .setColor(botconfig.color)
      .setDescription(
        `Пользователь запросил роль <@&${role_m.getRole()}>.\nЕго никнейм на сервере: \`${
          message.member.nickname == null ? message.author.username : message.member.nickname
        }\``
      )
      .setFooter({ text: message.guild.name, iconURL: message.guild.iconURL() })
      .setTimestamp();

    await bot.channels.cache
      .get(botconfig.accept_roles)
      .send({ embeds: [embed_req], components: [row] })
      .then(async (msg) => {
        await RoleTemps.create({
          DiscordID: message.author.id,
          created_at: Date.now(),
          created_msg: message.id,
          mod_msg: msg.id,
        });

        await msg.pin();
      });
  }
};
