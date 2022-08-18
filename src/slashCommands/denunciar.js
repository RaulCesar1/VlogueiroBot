require('dotenv').config()
const { 
    SlashCommandBuilder, 
    EmbedBuilder, 
    ActionRowBuilder, 
    ButtonBuilder, 
    ButtonStyle
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('denunciar')
		.setDescription('Denuncia um usuário para a equipe de moderação.')
        .addUserOption(option => option.setName('usuário').setDescription('Usuário que deseja denunciar.').setRequired(true))
        .addStringOption(option => option.setName('motivo').setDescription('Motivo pelo qual está denunciando este usuário.').setRequired(true))
        .addAttachmentOption(option => option.setName('provas').setDescription('Prova (imagem; opcional)').setRequired(false)),
	async execute(interaction, client) {
        const usuarioReportado = interaction.options.get('usuário')
        const motivo = interaction.options.get('motivo').value
        const canalReports = client.channels.cache.get(process.env.CANAL_REPORTS)
        const provas = interaction.options.get('provas')

        if(usuarioReportado.user.bot == true) return interaction.reply({ content: 'Você não pode denunciar um bot!', ephemeral: true })
        if(usuarioReportado.user.id === interaction.user.id) return interaction.reply({ content: 'Você não pode se denunciar!', ephemeral: true })

        const botoes = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('btn_ban')
                .setStyle(ButtonStyle.Danger)
                .setLabel('Banir Usuário'),
            new ButtonBuilder()
                .setCustomId('btn_kick')
                .setStyle(ButtonStyle.Primary)
                .setLabel('Expulsar Usuário'),
            new ButtonBuilder()
                .setCustomId('btn_mute')
                .setStyle(ButtonStyle.Secondary)
                .setLabel('Mutar Usuário')
        )

        try {
            let embedNovoReport = new EmbedBuilder()
            .setAuthor({ name: "Nova denúncia!", iconURL: client.user.avatarURL() })
            .setColor('Orange')
            .addFields(
                {
                    name: 'Usuário:',
                    value: `\`\`\`${usuarioReportado.user.tag}\`\`\``
                },
                {
                    name: 'ID:',
                    value: `\`\`\`${usuarioReportado.user.id}\`\`\``
                },
                {
                    name: 'Motivo:',
                    value: `\`\`\`${motivo}\`\`\``
                }
            )
            .setThumbnail(usuarioReportado.user.avatarURL())
            .setFooter({ text: `Denunciado por ${interaction.user.tag}`, iconURL: interaction.user.avatarURL() })

            await canalReports.send({ embeds: [embedNovoReport], components: [botoes] })
            provas?await canalReports.send(`Imagem enviada pelo usuário:\n${provas.attachment.url}`):''
            await interaction.reply({ content: `Sua denúncia foi enviada com sucesso! Obrigado!`, ephemeral: true })
        } catch(e) {
            console.log(e)
        }
	},
};