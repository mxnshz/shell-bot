const { MessageEmbed, Permissions, MessageActionRow, MessageButton } = require("discord.js");

module.exports = {
    name: "privates",
    run: async (bot, message, args) => {
        try {
            await message.delete()

            if(message.member.id != "279302975371870218") return

            const private_slots = new MessageButton()
            .setStyle('SECONDARY')
            .setCustomId('private_slots')
            .setLabel("⚙️")
            const private_rename = new MessageButton()
            .setStyle('SECONDARY')
            .setLabel("📝")
            .setCustomId('private_rename')
            const private_kick = new MessageButton()
            .setStyle('SECONDARY')
            .setLabel("🚫")
            .setCustomId('private_kick')
            const private_lock = new MessageButton()
            .setStyle('SECONDARY')
            .setLabel("🔒")
            .setCustomId('private_lock')
            const private_unlock = new MessageButton()
            .setStyle('SECONDARY')
            .setLabel("🔓")
            .setCustomId('private_unlock')
            const private_user = new MessageButton()
            .setStyle('SECONDARY')
            .setLabel("📥")
            .setCustomId('private_user')
            const private_unuser = new MessageButton()
            .setStyle('SECONDARY')
            .setLabel("📤")
            .setCustomId('private_unuser')
            const private_delete = new MessageButton()
            .setStyle('SECONDARY')
            .setLabel("🗑")
            .setCustomId('private_delete')

            const row = new MessageActionRow()
            .addComponents(private_slots)
            .addComponents(private_rename)
            .addComponents(private_kick)
            .addComponents(private_lock)

            const row2 = new MessageActionRow()
            .addComponents(private_unlock)
            .addComponents(private_user)
            .addComponents(private_unuser)
            .addComponents(private_delete)

            await message.channel.send({ embeds: [{
                title: 'Управление приватом',
                type: 'rich',
                description: '⚙️ - Изменить количество слотов\n📝 - Переименовать приват\n🚫 - Выгнать пользователя\n🔒 - Закрыть комнату для всех\n🔓 - Открыть комнату для всех\n📥 - Дать доступ пользователю (сможет заходить в закрытую или переполненную комнату)\n📤 - Убрать доступ у пользователя\n🗑 - Удалить приват',
                url: null,
                timestamp: null,
                color: botconfig.color,
                fields: [],
                thumbnail: null,
                image: null,
                author: null,
                footer: {
                text: message.guild.name,
                icon_url: message.guild.iconURL()
                }
            }], components: [row, row2] })
        } catch (err) {
            console.log(err);
        }
    },
};
