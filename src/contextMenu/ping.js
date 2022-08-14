require('dotenv').config()
const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js')

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Ping')
		.setType(ApplicationCommandType.Message), 
	async execute(interaction, client) {
        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                .setColor("Aqua")
                .setDescription(`Ping do bot: **${client.ws.ping}ms**`)
            ],
            ephemeral: true
        })
	},
}