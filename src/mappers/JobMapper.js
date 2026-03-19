const JobDTO = require('../DTO/JobDTO')
const { formatarData, formatarValor } = require('../utils/formattingHelpers');

function toDTO(obj) {
    let dto = new JobDTO({
        id: obj.getId(),
        clientId: obj.getClientId(),
        jobDate: formatarData(obj.getJobDate()),
        descr: obj.getDescription(),
        payed: (obj.isPayed() ? 'Serviço pago' : 'Aguardando pagamento'),
        totalValue: formatarValor(obj.getTotalValue())
    })
    return dto;
}

module.exports = { toDTO }