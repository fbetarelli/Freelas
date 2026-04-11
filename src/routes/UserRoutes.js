const express = require('express')
const router = express.Router();
const auth = require('../middlewares/userAuth');
const UserController = require('../controllers/UserController')

router.get('/login', UserController.showLogin);
router.post('/login', UserController.login);

router.get('/register', UserController.showRegister);
router.post('/register', UserController.register);

router.get('/logout', UserController.logout);

router.get('/profile', auth, UserController.showProfile)
router.post('/profile/edit', auth, UserController.editUser)

module.exports = router;