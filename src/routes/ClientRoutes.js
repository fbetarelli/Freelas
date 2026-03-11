const express = require('express')
const router = express.Router();
const ClientController = require('../controllers/ClientController')
const authenticate = require('../middlewares/authenticationMiddleware');



router.get('/client/:id', authenticate, ClientController.getClientPage);
router.post('/client/:id/edit', authenticate, ClientController.editClient);

module.exports = router;