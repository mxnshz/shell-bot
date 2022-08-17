const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");

module.exports = async (bot, interaction, args) => {

  if(interaction.isModalSubmit()){
    const customId = interaction.customId;
    const customIdArgs = customId.split(".")
    if(customIdArgs.length == 1){
      try {
        const functionModal = require(`../../modals/${interaction.customId}`);
        if(functionModal){
          functionModal(bot, interaction);
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
