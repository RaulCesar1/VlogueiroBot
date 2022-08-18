require('dotenv').config()
const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js')
const Mee6LevelsApi = require("mee6-levels-api")

module.exports = {
	data: new ContextMenuCommandBuilder()
		.setName('Cargos')
		.setType(ApplicationCommandType.User), 
	async execute(interaction, client) {
        try {
          Mee6LevelsApi.getUserXp(interaction.guildId, interaction.targetId).then(user => {
            let xpProximoNivel = (user.xp.levelXp - user.xp.userXp).toLocaleString()
            let xpUpgrade = user.xp.levelXp.toLocaleString()
            let xpAtual = user.xp.userXp.toLocaleString()
    
            var cargos = []
    
            if(user.level >=100) cargos.push('<@&1009567733710598334>') //Centenário
            if(user.level >=70) cargos.push('<@&1006732112138879036>') //Lendário
            if(user.level >=50) cargos.push('<@&876574595409379398>') //Senior
            if(user.level >=30) cargos.push('<@&876576366328426587>') //Pleno
            if(user.level >=15) cargos.push('<@&876576515792461824>') //Junior
            if(user.level >=5) cargos.push('<@&1006719636659769454>') //Ativo
            cargos.push('<@&729692324845584415>') //Membros
    
            interaction.reply({embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: user.tag, iconURL: user.avatarUrl })
                    .setColor('Orange')
                    .setDescription(`
                        Nível: **${user.level}**
                        Posição no Rank: **#${user.rank}**
                    `)
                    .addFields([
                        { 
                            name: '\u200B', 
                            value: `
                                **XP faltando para subir de nível: \`${xpProximoNivel}\`**
                                **XP atual: \`${xpAtual}\`**
                                **XP necessário para o próximo nível: \`${xpUpgrade}\`**
                            `,
                            inline: true
                        },
                        { 
                            name: '\u200B', 
                            value: cargos.join('\n'),
                            inline: true
                        }
                    ])
                    .setFooter({ text: 'Para solicitar algum cargo: /xp solicitar' })
            ], ephemeral: true})
          })
        } catch(e) {
          console.log(e)
        }
	},
}