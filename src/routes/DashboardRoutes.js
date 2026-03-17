const express = require('express')
const router = express.Router();
const DashboardController = require('../controllers/DashboardController')
const ClientController = require('../controllers/ClientController')
const authenticate = require('../middlewares/userAuth');
const saveLastPage = require('../middlewares/saveLastPage');


router.get('/dashboard', saveLastPage, authenticate, DashboardController.showDashboard);

router.post('/addClient', authenticate, ClientController.addClient);

module.exports = router;