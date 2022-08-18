require('dotenv').config()
const { 
    SlashCommandBuilder,
    TextInputBuilder,
    ModalBuilder,
    ActionRowBuilder,
    TextInputStyle,
    PermissionsBitField,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ticket')
		.setDescription('Comandos relacionados a tickets.')
        .addSubcommand(sub => sub.setName('abrir').setDescription('Cria um ticket de suporte.'))
        .addSubcommand(sub => sub.setName('fechar').setDescription('Fecha um ticket (MOD)')),
	async execute(interaction, client) {
        if (interaction.options._subcommand === 'fechar') {
            if(!interaction.member.permissions.has(PermissionsBitField.Flags.ManageGuild)) 
                return interaction.reply({ content: 'Sem permissão.', ephemeral: true })

            let canalTicket = client.channels.cache.get(interaction.channelId)

            if(!canalTicket.name.startsWith('ticket-'))
                return interaction.reply({ content: 'Utilize este comando em um canal de ticket.', ephemeral: true })

            try {
                await interaction.reply({ content: 'O Ticket será excluido em 10 segundos.' })
                setTimeout(async () => {
                    await canalTicket.delete()
                }, 10 * 1000)
            } catch(e) {
                console.log(e)
            }
            return
        }

        if (interaction.options._subcommand === 'abrir') {
            let Formulario = new ModalBuilder()
            .setTitle('Ticket')
            .setCustomId('ticket-create')

            var AssuntoPrincipal = new TextInputBuilder()
                .setCustomId('__a')
                .setLabel('Assunto do Ticket')
                .setMaxLength(50)
                .setRequired(true)
                .setStyle(TextInputStyle.Short)

            var Descricao = new TextInputBuilder()
                .setCustomId('__b')
                .setLabel('Descrição')
                .setRequired(true)
                .setMaxLength(500)
                .setStyle(TextInputStyle.Paragraph)

            AssuntoPrincipal = new ActionRowBuilder().addComponents(AssuntoPrincipal) 
            Descricao = new ActionRowBuilder().addComponents(Descricao) 

            Formulario.addComponents(AssuntoPrincipal, Descricao)

            await interaction.showModal(Formulario)
            return
        }
	},
};