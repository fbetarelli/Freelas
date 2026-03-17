async function runDAO(dao, action, parameter) {
    

    try {
        await dao[action](parameter);
        return { success: true };

    } catch (error) {
        return { success: false, errMsg: error };
    }
}

module.exports = { runDAO }