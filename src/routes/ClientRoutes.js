const express = require('express')
const router = express.Router();
const ClientController = require('../controllers/ClientController')
const authorize = require('../middlewares/authorizationMiddleware');



router.get('/client/:id', authorize, ClientController.getClientPage);
router.post('/client/:id/edit', authorize, ClientController.editClient);
router.get('/client/:id/delete', authorize, ClientController.deleteClient);

module.exports = router;