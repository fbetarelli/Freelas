const UserServices = require('../services/UserServices')

exports.showRegister = (req, res) => {
    res.render('register')
}

exports.register = async (req, res) => {
    let login = req.body.email
    let password = req.body.password

    let result = await UserServices.register(login, password)

    if (result.success === true) {
        req.session.user = {
            id: result.user.id,
            login: result.user.login,
        }
        // res.redirect('dashboard', { user: result.user })
        res.render('dashboard')
    } else {
        res.render('erro', { errorMessage: result.errMsg })
    }
}