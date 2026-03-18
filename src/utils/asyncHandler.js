//Função que trata erros do controller sem precisar utilizar um trycatch toda vez
function asyncHandler(controllerFunction) {
    return (req, res, next) => {
        Promise.resolve(controllerFunction(req, res, next)).catch(err => next(err))
    }
}

module.exports = asyncHandler;