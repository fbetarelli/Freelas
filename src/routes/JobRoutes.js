const express = require('express')
const router = express.Router();
const JobController = require('../controllers/JobController')
const MaterialController = require('../controllers/MaterialController')
const authorize = require('../middlewares/jobAuth');



router.get('/job/:id', authorize, JobController.getJobPage);
router.post('/job/:id/edit', authorize, JobController.editJob);
router.get('/job/:id/delete', authorize, JobController.deleteJob);

router.post('/job/:id/material/add', authorize, MaterialController.addMaterial);
router.post('/job/:id/material/:materialid/edit', authorize, MaterialController.editMaterial);
router.get('/job/:id/material/:materialid/delete', authorize, MaterialController.deleteMaterial);




module.exports = router;