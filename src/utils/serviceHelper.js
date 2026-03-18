async function runDAO(dao, action, parameter) {
    console.log(`\n DAO executando ${action}`)
    let start = Date.now()

    await dao[action](parameter);

    let end = Date.now()
    console.log(`DAO executou ${action} em ${end - start}ms\n`)
}


module.exports = { runDAO }