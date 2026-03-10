const express = require('express')
const router = express.Router();
const DashboardController = require('../controllers/DashboardController')
const authenticate = require('../middlewares/authenticationMiddleware');

router.get('/dashboard', authenticate, DashboardController.showDashboard);

module.exports = router;