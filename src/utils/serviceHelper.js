const { formatarParaFloat } = require('./formattingHelpers');

async function runDAO(dao, action, parameter, toDTO, returnVar, getTotal, sum) {
    console.log(`\nDAO executando ${action}`)
    let start = Date.now()

    if (toDTO) {
        const DTOArray = []
        let dto = null
        let totalSum = 0

        const result = await dao[action](parameter)
        let isArray = Array.isArray(result);
        let check = (result && result.length > 0)


        if (isArray && check) {
            result.forEach(entity => {
                dto = toDTO(entity)
                DTOArray.push(dto)
                if (getTotal) {
                    totalSum += formatarParaFloat(dto[sum]);
                }
            })
        }

        let end = Date.now()
        console.log(`DAO executou ${action} em ${end - start}ms\n`)

        return { [returnVar]: (isArray ? DTOArray : toDTO(result)), totalSum: getTotal ? totalSum : undefined }
    } else {

        await dao[action](parameter);
    }

    let end = Date.now()
    console.log(`DAO executou ${action} em ${end - start}ms\n`)
}


module.exports = { runDAO }