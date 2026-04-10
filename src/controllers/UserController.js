const UserServices = require('../services/UserServices')
const asyncHandler = require('../utils/asyncHandler');

exports.showLogin = (req, res) => {
    return res.render('login', { message: req.flash('info') })
}

exports.showRegister = (req, res) => {
    return res.render('register')
}

exports.showProfile = (req, res) => {
    return res.render('profile', { user: req.session.user })
}

exports.logout = (req, res) => {
    req.session.user = null;
    return res.redirect('/login');
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
        return res.redirect('/dashboard')
    } else {
        req.flash('info', 'Login ou Senha inválidos.')
        return res.redirect('/login')
    }


})

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

    return res.redirect('/dashboard')
})

exports.editUser = asyncHandler(async (req, res) => {
    let username = req.body.username
    let login = req.body.email
    let password = req.body.password

    const result = await UserServices.editUser(req.session.user.id, username, login, password)

    req.session.user = {
        id: req.session.user.id,
        username: result.getUsername(),
        login: result.getLogin(),
    }
    return res.redirect('/dashboard')
})
