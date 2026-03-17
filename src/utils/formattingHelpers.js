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

module.exports = { formatarData, formatarValor };