const UserServices = require('../services/UserServices')

exports.showLogin = (req, res) => {
    res.render('login')
}

exports.login = async (req, res) => {
    let login = req.body.email
    let password = req.body.password

    let result = await UserServices.login(login, password)

    if (result.success === true) {
        req.session.user = {
            id: result.user.getId(),
            login: result.user.getLogin(),
        }
        // res.redirect('dashboard', { user: result.user })
        res.redirect('/dashboard')
    } else {
        res.render('erro', { errorMessage: result.errMsg })
    }
}

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
        res.redirect('/dashboard')
    } else {
        res.render('erro', { errorMessage: result.errMsg })
    }
}

exports.logout = (req, res) => {
    req.session.user = null;
    res.redirect('/login');

}