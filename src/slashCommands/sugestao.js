require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('sugestao')
		.setDescription('Envia uma sugestão para o servidor.')
        .addStringOption(option => option.setName('sugestao').setDescription('Sugestão.').setRequired(true)),
	async execute(interaction, client) {
        const canalSugestoes = client.channels.cache.get(process.env.CANAL_SUGESTOES)
        const sugestao = interaction.options.get('sugestao').value

        try {
            await canalSugestoes.send({embeds: [
                new EmbedBuilder()
                    .setFooter({ text: `Enviada por ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })
                    .setColor('Orange')
                    .addFields(
                        {
                            name: 'Sugestão:',
                            value: sugestao
                        }
                    )
            ]}).then(async msg => {
                await msg.react('👍')
                await msg.react('👎')
            })
            await interaction.reply({ content: 'Sugestão enviada! Obrigado!', ephemeral: true })
        } catch(e) {
            console.log(e)
        }
	},
};