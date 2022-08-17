const { readdirSync } = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const ascii = require('ascii-table');
const wait = require('util').promisify(setTimeout);
const botconfig = require('../config');

let table = new ascii('Загрузка команд');
table.setHeading('Slash команды', 'Статус загрузки');

module.exports = async (bot) => {
  const commandss = [];

  const clientId = botconfig.client_id;
  const guildId = botconfig.guild_id;

  readdirSync('./commands-slash/').forEach(async (dir) => {
    const commands = readdirSync(`./commands-slash/${dir}/`).filter((file) => file.endsWith('.js'));
    for (let file of commands) {
      let command = require(`../commands-slash/${dir}/${file}`);
      if (command.data.name) {
        if (['MESSAGE', 'USER'].includes(command.type)) delete command.description;

        bot.commandsSlash.set(command.data.name, command);

        commandss.push(command.data.toJSON());
        table.addRow(file, '✅');
      } else {
        table.addRow(file, `❌  -> ошибка, файл не был загружен.`);
        continue;
      }
    }
  });
  const rest = new REST({ version: '9' }).setToken(botconfig.token);

  (async () => {
    try {
      console.log(`HANDLER | Подгрузка Slash-Command, пожалуйста подождите...`);

      await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commandss });

      console.log(`HANDLER | Slash-Command, были успешно подгружены!`);

      await wait(5000);
      const commandsInteraction = await bot.guilds.cache.get(guildId)?.commands.fetch();
      readdirSync('./commands-slash/')
        .filter((x) => x != 'Модерация')
        .forEach(async (dir) => {
          const commands = readdirSync(`./commands-slash/${dir}/`).filter((file) =>
            file.endsWith('.js')
          );
          for (let file of commands) {
            let commandd = require(`../commands-slash/${dir}/${file}`);
          }
        });
    } catch (error) {
      console.error(error);
    }
  })();

  console.log(table.toString());
};
