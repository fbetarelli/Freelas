const express = require('express')
const router = express.Router();
const LoginController = require('../controllers/LoginController')

router.post('/cadastro', LoginController.register)

module.exports = router;