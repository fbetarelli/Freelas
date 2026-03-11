class ClientDTO {
    name
    address
    contact

    constructor({ id, name, address, contact }) {
        this.id = id
        this.name = name
        this.address = address
        this.contact = contact
    }
}

module.exports = ClientDTO;