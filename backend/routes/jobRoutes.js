const express = require('express');
const authenticate = require('../middleware/authenticate');
const jobController = require('../controllers/jobController');

const router = express.Router();

// Route to Post Job
router.post('/post', authenticate(), jobController.postJob);

// Route to Accept Job
router.put('/accept/:jobId', authenticate(), jobController.acceptJob);

// Route to Get All Jobs
router.get('/list', jobController.getAllJobs);

// Route to Get Jobs Posted by Current User
router.get('/my-posted', authenticate(), jobController.getMyPostedJobs);

// Route to Get Jobs Completed by Current User
router.get('/my-completed', authenticate(), jobController.getMyCompletedJobs);

// Route to Complete Job
router.put('/complete/:jobId', authenticate(), jobController.completeJob);

// Route to Edit Job
router.patch('/edit/:jobId', authenticate(), jobController.editJob);

// Route to Cancel Job
router.put('/cancel/:jobId', jobController.cancelJob);

// Route to Delete Job
router.delete('/remove/:jobId', jobController.deleteJob);

// Route to Get Jobs Accepted by Current User
router.get('/my-accepted', authenticate(), jobController.getMyAcceptedJobs);

// Route to Add Candidate
router.put('/add-candidate/:jobId', authenticate(), jobController.addCandidate);

// Route to Remove Candidate
router.put('/remove-candidate/:jobId', authenticate(), jobController.removeCandidate);

// Route to Get Candidates for a Job
router.get('/candidates/:jobId', authenticate(), jobController.getCandidates);

// Route to Update Application Status
router.patch('/application-status/:jobId', authenticate(), jobController.updateApplicationStatus);

// Route to Update Interview Data
router.patch('/interview-data/:applicationId', authenticate(), jobController.updateInterviewData);

module.exports = router;
