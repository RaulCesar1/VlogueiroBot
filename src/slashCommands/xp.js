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
            let tabelaNiveis = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`
                **Membro = nível 0 a 5**\n
                **Membro Ativo = nível 5 a 14**\n
                **Membro Júnior = nível 15 a 29**\n
                **Membro Pleno = nível 30 a 49**\n
                **Membro Senior = nível 50 a 69**\n
                **Membro Lendário = nível 70+**
            `)
            .setFooter({ text: `Utilize /xp perfil para ver seu perfil.` })
        
            interaction.reply({ embeds: [tabelaNiveis] })

            return
        } 

        if (interaction.options._subcommand === 'solicitar') {
            let LENDARIO = interaction.member.guild.roles.cache.get("1006732112138879036");
            let SENIOR = interaction.member.guild.roles.cache.get("876574595409379398");
            let PLENO = interaction.member.guild.roles.cache.get("876576366328426587");
            let JUNIOR = interaction.member.guild.roles.cache.get("876576515792461824");
            let ATIVO = interaction.member.guild.roles.cache.get("1006719636659769454");
        
            let guildId = interaction.member.guild.id
            let userId = interaction.user.id
        
            Mee6LevelsApi.getUserXp(guildId, userId).then(user => {
                if(user.level >=70) { 
                    if(!interaction.member.roles.cache.has("876574595409379398")) {
                        interaction.member.roles.add(SENIOR)
                    }
                    if(!interaction.member.roles.cache.has("876576366328426587")) {
                        interaction.member.roles.add(PLENO)
                    }
                    if(!interaction.member.roles.cache.has("876576515792461824")) {
                        interaction.member.roles.add(JUNIOR)
                    }
                    if(!interaction.member.roles.cache.has("1006719636659769454")) {
                        interaction.member.roles.add(ATIVO)
                    }
                    if(interaction.member.roles.cache.has("1006732112138879036")) {
                        interaction.reply('Você já possui todos os cargos! Parabéns!')
                        return
                    }
        
                    interaction.member.roles.add(LENDARIO)
                    interaction.reply('Cargo adicionado! Cargo: **Membro Lendário**')
                    return
                }
                if(user.level >=50) { 
                    if(!interaction.member.roles.cache.has("876576366328426587")) {
                        interaction.member.roles.add(PLENO)
                    }
                    if(!interaction.member.roles.cache.has("876576515792461824")) {
                        interaction.member.roles.add(JUNIOR)
                    }
                    if(!interaction.member.roles.cache.has("1006719636659769454")) {
                        interaction.member.roles.add(ATIVO)
                    }
        
                    interaction.member.roles.add(SENIOR)
                    interaction.reply('Cargo adicionado! Cargo: **Membro Senior**')
                    return
                }
        
                if(user.level >=30) {
                    if(!interaction.member.roles.cache.has("876576515792461824")) {
                        interaction.member.roles.add(JUNIOR)
                    }
                    if(!interaction.member.roles.cache.has("1006719636659769454")) {
                        interaction.member.roles.add(ATIVO)
                    }
                    if(interaction.member.roles.cache.has("876576366328426587")) {
                        interaction.reply('Você já possui o cargo **Membro Pleno**!')
                        return
                    }
        
                    interaction.member.roles.add(PLENO)
                    interaction.reply('Cargo adicionado! Cargo: **Membro Pleno**')
                    return
                }
        
                if(user.level >=15) {
                    if(!interaction.member.roles.cache.has("1006719636659769454")) {
                        interaction.member.roles.add(ATIVO)
                    }
                    if(interaction.member.roles.cache.has("876576515792461824")) {
                        interaction.reply('Você já possui o cargo **Membro Jr.**!')
                        return
                    }
        
                    interaction.member.roles.add(JUNIOR)
                    interaction.reply('Cargo adicionado! Cargo: **Membro Jr.**')
                    return
                }
              
                if(user.level >=5) {
                    if(interaction.member.roles.cache.has("1006719636659769454")) {
                        interaction.reply('Você já possui o cargo **Membro Ativo**!')
                        return
                    }
        
                    interaction.member.roles.add(ATIVO)
                    interaction.reply('Cargo adicionado! Cargo: **Membro Ativo**')
                    return
                }
            });
            return
        }

        if(interaction.options._subcommand === "perfil") {
            let guildId = interaction.member.guild.id
            var userId = interaction.user.id
            if(interaction.options.get('usuário')) userId = interaction.options.get('usuário').user.id
            
            try {
              Mee6LevelsApi.getUserXp(guildId, userId).then(user => {
                let xp_proximo_nivel = user.xp.levelXp - user.xp.userXp
                let xp_upgrade = `${user.xp.levelXp}\`**`
                let xp_atual = user.xp.userXp
        
                var cargos = []
        
                if(user.level >=70) cargos.push('<@&1006732112138879036>') //Lendário
                if(user.level >=50) cargos.push('<@&876574595409379398>') //Senior
                if(user.level >=30) cargos.push('<@&876576366328426587>') //Pleno
                if(user.level >=15) cargos.push('<@&876576515792461824>') //Junior
                if(user.level >=5) cargos.push('<@&1006719636659769454>') //Ativo
                
                let embed_perfil = new EmbedBuilder()
                .setAuthor({ name: user.tag })
                .setColor('Orange')
                .setDescription(`
                  Nível: ${user.level}
                  Posição no Rank: #${user.rank}
                `)
                .addFields([
                  { name: 'XP:', value: `**XP faltando para subir de nível: \`${xp_proximo_nivel}\`**\n**XP atual: \`${xp_atual}\`**\n**XP necessário para o próximo nível: \`${xp_upgrade}`},
                  { name: 'Cargos:', value: cargos.length===0?'**Não possui nenhum cargo!**':cargos.join('\n') }
                ])
                .setFooter({ text: 'Para solicitar algum cargo: /xp solicitar' })
                .setThumbnail(user.avatarUrl)
        
                interaction.reply({ embeds: [embed_perfil]})
              })
            } catch(e) {
              console.log(e)
            }

            return
        }
	},
};