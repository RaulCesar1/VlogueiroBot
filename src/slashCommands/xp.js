require('dotenv').config()
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const Mee6LevelsApi = require("mee6-levels-api");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('xp')
		.setDescription('Comandos relacionados à XP.')
        .addSubcommand(sub => 
            sub
                .setName('tabela')
                .setDescription('Mostra a tabela de cargos.')    
        )
        .addSubcommand(sub => 
            sub
                .setName('perfil')
                .setDescription('Mostra o perfil do usuário')
                .addUserOption(option => 
                    option
                        .setName('usuário')
                        .setDescription('Usuário que deseja ver o perfil.')
                )
        )
        .addSubcommand(sub => 
            sub
                .setName('solicitar')
                .setDescription('Comando para solicitar cargos.')
        ),
	async execute(interaction, client) {
        if (interaction.options._subcommand === 'tabela') {
            await interaction.reply({embeds: [
                new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`
                        <@&729692324845584415> = nível 0 a 4\n
                        <@&1006719636659769454> = nível 5 a 14\n
                        <@&876576515792461824> = nível 15 a 29\n
                        <@&876576366328426587> = nível 30 a 49\n
                        <@&876574595409379398> = nível 50 a 69\n
                        <@&1006732112138879036> = nível 70 a 99\n
                        <@&1009567733710598334> = nível 100+
                    `)
                    .setFooter({ text: `Utilize /xp perfil para ver seu perfil.` })
            ]})
            return
        } 

        if (interaction.options._subcommand === 'solicitar') {
            let CENTENARIO = interaction.member.guild.roles.cache.get("1009567733710598334");
            let LENDARIO = interaction.member.guild.roles.cache.get("1006732112138879036");
            let SENIOR = interaction.member.guild.roles.cache.get("876574595409379398");
            let PLENO = interaction.member.guild.roles.cache.get("876576366328426587");
            let JUNIOR = interaction.member.guild.roles.cache.get("876576515792461824");
            let ATIVO = interaction.member.guild.roles.cache.get("1006719636659769454");
        
            let guildId = interaction.member.guild.id
            let userId = interaction.user.id
        
            Mee6LevelsApi.getUserXp(guildId, userId).then(user => {
                if(user.level >=5) {
                    if(interaction.member.roles.cache.has("1009567733710598334")) 
                    return interaction.reply({ content: 'Você possui todos os cargos! Parabéns!', ephemeral: true })
                    if(user.level >=100) interaction.member.roles.add(CENTENARIO)
                    if(user.level >=70) interaction.member.roles.add(LENDARIO)
                    if(user.level >=50) interaction.member.roles.add(SENIOR)
                    if(user.level >=30) interaction.member.roles.add(PLENO)
                    if(user.level >=15) interaction.member.roles.add(JUNIOR)
                    interaction.member.roles.add(ATIVO)
                    interaction.reply({ content: 'Cargos adicionados!', ephemeral: true })
                } else {
                    return interaction.reply({ ephemeral: true, content: 'Você não possui nenhum cargo para solicitar!' })
                }
            });
            return
        }

        if(interaction.options._subcommand === "perfil") {
            var userId = interaction.user.id
            if(interaction.options.get('usuário')) userId = interaction.options.get('usuário').user.id
            
            try {
              Mee6LevelsApi.getUserXp(interaction.member.guild.id, userId).then(user => {
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
                ]})
              })
            } catch(e) {
              console.log(e)
            }
            return
        }
	},
};