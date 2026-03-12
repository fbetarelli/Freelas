const express = require('express')
const router = express.Router();
const DashboardController = require('../controllers/DashboardController')
const ClientController = require('../controllers/ClientController')
const authenticate = require('../middlewares/userAuth');

router.get('/dashboard', authenticate, DashboardController.showDashboard,);

router.post('/addClient', authenticate, ClientController.addClient);

module.exports = router;