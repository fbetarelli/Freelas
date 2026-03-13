function authenticate(req, res, next) {
    if (req.session.user) {
        req.session.returnTo = req.originalUrl;
        next()
    } else {
        res.redirect('/login')
    }

}

module.exports = authenticate;