require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Mostra o ping do Bot.'),
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
};