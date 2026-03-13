const express = require('express')
const router = express.Router();
const JobController = require('../controllers/JobController')
const authorize = require('../middlewares/jobAuth');



router.get('/job/:id', authorize, JobController.getJobPage);
router.post('/job/:id/edit', authorize, JobController.editJob);
router.get('/job/:id/delete', authorize, JobController.deleteJob);


module.exports = router;