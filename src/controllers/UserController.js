const UserServices = require('../services/UserServices')
const asyncHandler = require('../utils/asyncHandler');

exports.showLogin = (req, res) => {
    res.render('login', { message: req.flash('info') })
}

exports.login = asyncHandler(async (req, res) => {
    let login = req.body.email
    let password = req.body.password

    let result = await UserServices.login(login, password)

    if (result.user) {
        req.session.user = {
            id: result.user.getId(),
            username: result.user.getUsername(),
            login: result.user.getLogin(),
        }
        res.redirect('/dashboard')
    } else {
        req.flash('info', 'Login ou Senha inválidos.')
        res.redirect('/login')
    }


})

exports.showRegister = (req, res) => {
    res.render('register')
}

exports.register = asyncHandler(async (req, res, next) => {
    let username = req.body.username
    let login = req.body.email
    let password = req.body.password

    let result = await UserServices.register(username, login, password)

    if (result.err) {
        return next(result.err)
    }

    req.session.user = {
        id: result.user.getId(),
        username: result.user.getUsername(),
        login: result.user.getLogin()
    }

    res.redirect('/dashboard')
})

exports.logout = (req, res) => {
    req.session.user = null;
    res.redirect('/login');
}