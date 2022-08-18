class Ticket {
    constructor(assuntoPrincipal, descricao) {
        this.assuntoPrincipal = assuntoPrincipal
        this.descricao = descricao

        let ticketID = ''
        let chars = '1234567890'
        for(let i = 0; i < 5; i++) {
            ticketID += chars.charAt(Math.floor(Math.random() * chars.length))
        }
        
        this.id = ticketID
    }
}

module.exports = Ticket