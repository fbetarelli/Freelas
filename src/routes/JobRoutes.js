const express = require('express')
const router = express.Router();
const JobController = require('../controllers/JobController')
const authorize = require('../middlewares/jobAuth');



router.get('/job/:id', authorize, JobController.getJobPage);


module.exports = router;