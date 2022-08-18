require('dotenv').config()

const User = require('./models/User.js')

const { 
	Client,
	Collection,
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	EmbedBuilder,
	PermissionsBitField,
	ChannelType,
} = require('discord.js')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v10')

const fs = require('fs')
const async = require('async')

const client = new Client({ intents: 3276799 })

const directories = [
	`${__dirname}\\slashCommands`, 
	`${__dirname}\\contextMenu`
]

const commands = []
client.commands = new Collection()

function tipos(type) {
	switch(type) {
		case 2:
		case 3:
			return 'Context Menu'
		case undefined:
			return 'Slash Command'
		default:
			return 'Unknown'
	}
}

async.each(
	directories,
	(directory, callback) => {
		console.log(`Carregando comandos no diretório ${directory}`)
		fs.readdir(directory, (err, files) => {
			if (err) return callback(err)

			files.forEach((file) => {
				if (!file.endsWith('.js')) return
				const command = require(`${directory}/${file}`)
				commands.push(command.data.toJSON())
				client.commands.set(command.data.name, command)
				console.log(`\x1b[32m[${tipos(command.data.type)}] \x1b[33m${command.data.name}`)
			})

			callback()
		})
	},
	(err) => {
		if (err) console.error(err)
	}
)

client.on('ready', async () => {
	const rest = new REST({ version: '10' }).setToken(process.env.TOKEN)

	await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
		body: commands,
	})

	console.log(`Tag: ${client.user.tag}\nID: ${client.user.id}`)
})

/* client.on('messageCreate', async message => {
	const user = await User.findOne({ id: message.author.id })
	if(!user) {
		new User({ id: message.author.id })
		console.log(`Usuário criado na database: ${message.author.id} | ${message.author.tag}`)
		return
	}
}) */

const Ticket = require('./ticket/Ticket.js')

client.on('interactionCreate', async (interaction) => {
	if (interaction.user.bot === true) return

	if(interaction.customId === "ticket-create") {
		try {
			let AssuntoPrincipal = interaction.components[0].components[0].value
			let Descricao = interaction.components[1].components[0].value

			let newTicket = new Ticket(AssuntoPrincipal, Descricao)

			let categoriaTickets = interaction.guild.channels.cache.get(process.env.CATEGORIA_TICKETS)
			let roleMOD = interaction.guild.roles.cache.get('729692294126633060')

			interaction.guild.channels.create({
				name: `ticket-${newTicket.id}`,
				parent: categoriaTickets,
				type: ChannelType.GuildText,
				reason: `Ticket criado por ${interaction.user.tag}`,
				permissionOverwrites: [
					{
						id: interaction.guild.id,
						deny: [PermissionsBitField.Flags.ViewChannel],
					},
					{
						id: interaction.user.id,
						allow: [
							PermissionsBitField.Flags.ViewChannel,
							PermissionsBitField.Flags.SendMessages
						],
					},
					{
						id: roleMOD,
						allow: [
							PermissionsBitField.Flags.ViewChannel,
							PermissionsBitField.Flags.SendMessages
						],
					},
				]
			}).then(async ticketPrivado => {
				let embedAssuntoPrincipal = new EmbedBuilder()
					.setDescription(`\`\`\`${AssuntoPrincipal}\`\`\``)
					.setColor("Orange")

				let embedDescricao = new EmbedBuilder()
					.setDescription(`\`\`\`${Descricao}\`\`\``)
					.setColor("Orange")

				let embedInfo = new EmbedBuilder()
					.setDescription(`
					    **\`#${newTicket.id}\`**
						Ticket criado por: **${interaction.user.tag}**
						ID do usuário: **${interaction.user.id}**
					`)
					.setFooter({ text: 'Para fechar o ticket, utilize: /ticket fechar' })
					.setColor('Orange')

				await ticketPrivado.send({ embeds: [embedAssuntoPrincipal, embedDescricao] })
				await ticketPrivado.send({ embeds: [embedInfo] })
				await interaction.reply({ content: `Ticket criado com sucesso! <#${ticketPrivado.id}>`, ephemeral: true })
			})
		} catch(e) {
			console.log(e)
		}
		return
	}

	if(interaction.customId === "btn_ban") {
		let idUser = interaction.message.embeds[0].fields.filter(r => r.name === "ID:")[0].value.replace(/`/g, "")
		let guild = client.guilds.cache.get(interaction.guildId)
		let user = guild.members.cache.get(idUser)

		try {
			await user.ban()
			await interaction.update({
				components: [
					new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setLabel('O Usuário denunciado foi banido!')
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true)
							.setCustomId('disabled')
					)
				]
			})
		} catch(e) {
			return interaction.reply({content: "Não foi possível banir este usuário!", ephemeral: true})
		}
	}

	if(interaction.customId === "btn_mute") {
		let idUser = interaction.message.embeds[0].fields.filter(r => r.name === "ID:")[0].value.replace(/`/g, "")
		let guild = client.guilds.cache.get(interaction.guildId)
		let user = guild.members.cache.get(idUser)

		try {
			await user.timeout(5 * 60 * 1000) // 5min timeout
			await interaction.update({
				components: [
					new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setLabel('O Usuário denunciado foi mutado! (5 min)')
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true)
							.setCustomId('disabled')
					)
				]
			})
		} catch(e) {
			return interaction.reply({content: "Não foi possível mutar este usuário!", ephemeral: true})
		}
	}

	if(interaction.customId === "btn_kick") {
		let idUser = interaction.message.embeds[0].fields.filter(r => r.name === "ID:")[0].value.replace(/`/g, "")
		let guild = client.guilds.cache.get(interaction.guildId)
		let user = guild.members.cache.get(idUser)

		try {	
			await user.kick()
			await interaction.update({
				components: [
					new ActionRowBuilder()
					.addComponents(
						new ButtonBuilder()
							.setLabel('O Usuário denunciado foi expulso!')
							.setStyle(ButtonStyle.Primary)
							.setDisabled(true)
							.setCustomId('disabled')
					)
				]
			})
		} catch(e) {
			return interaction.reply({content: "Não foi possível expulsar este usuário!", ephemeral: true})
		}
	}

	let command = client.commands.get(interaction.commandName)
	if (!command) return

	try {
		await command.execute(interaction, client)
	} catch (error) {
		console.error(error)
		await interaction.reply({
			content: 'Ocorreu um erro ao executar este comando!',
			ephemeral: true,
		})
	}
})

client.login(process.env.TOKEN)

const { conectar } = require('./mongoDB')
conectar()