const express = require('express')
const router = express.Router();
const UserController = require('../controllers/UserController')

router.get('/login', UserController.showLogin);
router.post('/login', UserController.login);

router.get('/register', UserController.showRegister);
router.post('/register', UserController.register);

router.get('/logout', UserController.logout);

module.exports = router;