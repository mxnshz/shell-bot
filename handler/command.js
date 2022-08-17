const { readdirSync } = require("fs");

module.exports = (bot) => {
    readdirSync("./commands/").forEach(dir => {
        const commands = readdirSync(`./commands/${dir}/`).filter(f => f.endsWith(".js"));

        for (let file of commands) {
            var pull = require(`../commands/${dir}/${file}`);
            bot.commands.set(pull.name, pull);

            if (pull.aliases) for (const alias of pull.aliases) {
                bot.aliases.set(alias, pull);
            }
        }
    });
};
