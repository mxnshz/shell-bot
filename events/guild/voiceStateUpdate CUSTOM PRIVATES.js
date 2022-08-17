const { Discord, MessageActionRow, MessageButton, MessageEmbed } = require("discord.js");
const Users = require('../../schemas/Users')
var categoryid = botconfig.private_category;
var channelid = botconfig.private;

module.exports = async (bot, oldState, newState) => {
  if(newState.channel?.id == channelid){
    let user_db = await Users.findOne({ DiscordID: newState.member.id })

    if (user_db.PrivateIsLocked == `false`){
      newState.guild.channels.create(`${user_db.PrivateName}`,{
          type:'GUILD_VOICE',
          parent:categoryid,
          userLimit:user_db.PrivateSlots,
          permissionOverwrites:[{
              id:newState.member.id,
              allow: ["MANAGE_CHANNELS","MOVE_MEMBERS","DEAFEN_MEMBERS", "MUTE_MEMBERS"]
          },
          {
            id:newState.guild.roles.everyone.id,
            deny: ["VIEW_CHANNEL","CONNECT", "MOVE_MEMBERS"]
          },
            {
              id:botconfig.user,
              allow: ["VIEW_CHANNEL","CONNECT"]
            }
            ]
      }).then(async(channel) => {
          newState.setChannel(channel)
      })
    }
    if (user_db.PrivateIsLocked == `true`){
      newState.guild.channels.create(`${user_db.PrivateName}`,{
          type:'GUILD_VOICE',
          parent:categoryid,
          userLimit:user_db.PrivateSlots,
          permissionOverwrites:[
            {
              id:newState.member.id,
              allow: ["MANAGE_CHANNELS","MOVE_MEMBERS","DEAFEN_MEMBERS", "MUTE_MEMBERS"]
            },
            {
              id:newState.guild.roles.everyone.id,
              deny: ["VIEW_CHANNEL","CONNECT", "MOVE_MEMBERS"]
            },
            {
              id:botconfig.user,
              deny: ["VIEW_CHANNEL","CONNECT", "MOVE_MEMBERS"]
            }
        ]
      }).then(async(channel) => {
          newState.setChannel(channel)
      })
    }
  }
  if(oldState.channel?.id != channelid && oldState.channel?.parent?.id == categoryid && !oldState.channel?.members.size) oldState.channel.delete();
}
