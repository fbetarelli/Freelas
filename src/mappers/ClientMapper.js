const ClientDTO = require('../DTO/ClientDTO')

function toDTO(obj) {
    let dto = new ClientDTO({
        id: obj.getId(),
        name: obj.getName(),
        address: obj.getAddress(),
        contact: obj.getContact()

    })
    return dto;
}

module.exports = { toDTO }