const { Intents, Client, MessageEmbed, Collection, MessageActionRow, MessageButton, MessageSelectMenu, MessageMentions } = require("discord.js");
const tags = require('./config').tags
const { readdirSync } = require("fs");
const fs = require('fs')

const bot = new Client({
	intents: [
		Intents.FLAGS.DIRECT_MESSAGES,
		Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
		Intents.FLAGS.DIRECT_MESSAGE_TYPING,
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_BANS,
		Intents.FLAGS.GUILD_EMOJIS_AND_STICKERS,
		Intents.FLAGS.GUILD_INTEGRATIONS,
		Intents.FLAGS.GUILD_INVITES,
		Intents.FLAGS.GUILD_MEMBERS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
		Intents.FLAGS.GUILD_MESSAGE_TYPING,
		Intents.FLAGS.GUILD_PRESENCES,
		Intents.FLAGS.GUILD_VOICE_STATES,
		Intents.FLAGS.GUILD_WEBHOOKS
	],
	allowedMentions: {
		parse: [
			'users',
			'roles',
		],
		repliedUser: true
	},
	partials: [
		'MESSAGE',
		'CHANNEL',
		'REACTION',
		'USER',
		'GUILD_MEMBER'
	]
});

global.botconfig = require("./config"); // Привязка файла конфига
global.mongoose = require('mongoose');
global.mongooseDynamic = require ('mongoose-dynamic-schemas');
const wait = require('util').promisify(setTimeout);

mongoose.connect(botconfig.mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected',()=>{
  console.log('DATABASE | Успешно подключено!')
})

const Temps = require('./schemas/Temps');
const Users = require('./schemas/Users');

bot.commandsSlash = new Collection(); // Собираем команды в коллекцию
bot.commands = new Collection();
bot.aliases = new Collection();

["command", "events", "slash-commands"].forEach(handler => {
	require(`./handler/${handler}`)(bot)
})

function getUserFromMention(mention) {
	if (!mention) return;
	if (mention.startsWith('<@') && mention.endsWith('>')) {
		mention = mention.slice(2, -1);
		if (mention.startsWith('!')) {
			mention = mention.slice(1);
		}
		return mention;
	} else if(!mention.startsWith('<@') && !mention.endsWith('>')) {
	return mention;
  }
}

bot.on('messageCreate', async(message) => {
	if(message.channel.id != botconfig.private_text) return
	setTimeout(async () => {
		await message?.delete().catch(() => null)
	},2000)
})

bot.on('messageCreate', async(message) => {
	if(message.author.bot) return

	let user_db = await Users.findOne({ DiscordID: message.author.id })
	if(!user_db){
		await Users.create({
			DiscordID: message.author.id,
			PrivateName: `Приват ${message.author.tag}`
		})
	}
})

bot.on('messageCreate', async(message) => {
	var prefix = botconfig.prefix;
	if (!message.content.startsWith(prefix)) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();

	const cmd = bot.commands.get(command) || bot.aliases.get(command);

	if (!cmd) return;

	cmd.run(bot, message, args);
})

bot.on('ready', async() => {

    bot.user.setStatus(botconfig.status);
    bot.user.setActivity(botconfig.activity, {type: botconfig.activity_type});

    setInterval(async() => {

    bot.user.setStatus(botconfig.status);
    bot.user.setActivity(botconfig.activity, {type: botconfig.activity_type});

    }, 600000)
});

/* Embed функция в боте */
bot.embed = function({ content }) {
	if(content == undefined) return console.error(`ERROR | Неверное использование функции, проверьте аргументы!`)

	let embed = new MessageEmbed()
	.setColor(botconfig.color)
	.setDescription(`**${content}**`)
	return embed;
}

bot.login(botconfig.token);
