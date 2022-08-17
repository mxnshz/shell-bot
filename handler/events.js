const { readdirSync } = require("fs")
const ascii = require("ascii-table");
let table = new ascii("Загрузка ивентов");
const fs = require('fs')
table.setHeading("Ивент", "Статус загрузки");

module.exports = (bot) => {
    const load = dirs => {
        const events = readdirSync(`./events/${dirs}/`).filter(d => d.endsWith('.js'));
        for (let file of events) {
            const evt = require(`../events/${dirs}/${file}`);
            const eventName = file.split(" ")[0];
            table.addRow(file, '✅');
            bot.on(eventName, evt.bind(null, bot));
        };
    };
        ["client", "guild"].forEach(x => load(x));
    console.log(table.toString());
};
