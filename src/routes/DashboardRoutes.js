const express = require('express')
const router = express.Router();
const DashboardController = require('../controllers/DashboardController')
const ClientController = require('../controllers/ClientController')
const authenticate = require('../middlewares/authenticationMiddleware');

router.get('/dashboard', authenticate, DashboardController.showDashboard);

router.post('/addClient', authenticate, ClientController.addClient);
router.get('/getClients', authenticate, ClientController.getClients);

module.exports = router;