const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = async (bot, interaction, args) => {

  if(interaction.isButton()){
		const customId = interaction.customId;
		const customIdArgs = customId.split(".")
		if(customIdArgs.length == 1){
			try {
				const functionButton = require(`../../buttons/${interaction.customId}`);
				if(functionButton){
					functionButton(bot, interaction);
				}
			} catch (e) {
				console.log(e)
			}
		} else {
			readdirSync("./buttons-customId/").forEach(async(dir) => {
				try {
					const functionButtonArg = require(`../../buttons-customId/${dir}/${customIdArgs[0]}`);
					if(functionButtonArg){
						functionButtonArg(bot, interaction, customIdArgs[1]);
					}
				} catch (e) {
					console.log(e)
				}
			})
		}
    }

}
