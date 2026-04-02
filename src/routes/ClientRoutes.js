const express = require('express')
const router = express.Router();
const ClientController = require('../controllers/ClientController')
const JobController = require('../controllers/JobController')
const authorize = require('../middlewares/clientAuth');
const authenticate = require('../middlewares/userAuth');
const saveLastPage = require('../middlewares/saveLastPage');

router.get('/client/:id', saveLastPage, authorize, ClientController.getClientPage);
router.post('/client/:id/edit', authorize, ClientController.editClient);
router.get('/client/:id/delete', authorize, ClientController.deleteClient);

router.post('/client/:id/addJob', authorize, JobController.addJob);

router.get('/clients', authenticate, ClientController.showClientList);

module.exports = router;