const UserServices = require('../services/UserServices')
const asyncHandler = require('../utils/asyncHandler');

exports.showLogin = (req, res) => {
    res.render('login')
}

exports.login = asyncHandler(async (req, res) => {
    let login = req.body.email
    let password = req.body.password

    let result = await UserServices.login(login, password)

    req.session.user = {
        id: result.user.getId(),
        username: result.user.getUsername(),
        login: result.user.getLogin(),
    }
    res.redirect('/dashboard')
})

exports.showRegister = (req, res) => {
    res.render('register')
}

exports.register = asyncHandler(async (req, res) => {
    let username = req.body.username
    let login = req.body.email
    let password = req.body.password

    let result = await UserServices.register(username, login, password)

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