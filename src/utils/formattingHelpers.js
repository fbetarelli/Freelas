function formatarData(data) {
    const dateFromDB = new Date(data);
    // Formatar para PT-BR (12/03/2026)
    return dateFromDB.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatarValor(val) {
    //formata numero para separar casas.
    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(val);
}


function formatarParaFloat(valor) {
    //retira os pontos EX: 12,99 para 12.99
    const temp = valor.replace(/\./g, '')
    const final = temp.replace(/,/g, '.')
    return (parseFloat(final))
}

module.exports = { formatarData, formatarValor, formatarParaFloat };