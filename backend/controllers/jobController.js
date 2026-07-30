const jobService = require('../services/jobService');
const Job = require('../models/Job');

// Post Job
const postJob = async (req, res) => {
  const { title, description, price, currency, category, location } = req.body;

  try {
    const job = await jobService.createJob(title, description, price, currency, category, location, req.user.id);
    res.status(201).json(job);
  } catch (err) {
    console.error('Error in postJob:', err.message); // Debugging log
    res.status(400).json({ msg: err.message }); // Return a 400 status for client errors
  }
};

// Accept Job
const acceptJob = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const job = await jobService.acceptJob(jobId, req.user);
    res.json({ msg: 'Job accepted successfully', job });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All Jobs
const getAllJobs = async (req, res) => {
  const { price } = req.query;
  try {
    const jobs = await jobService.getAllJobs(price);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Jobs Posted by Current User
const getMyPostedJobs = async (req, res) => {
  try {
    const jobs = await jobService.getMyPostedJobs(req.user.id); // Ensure `req.user.id` is the logged-in user's ID
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Jobs Accepted by Current User
const getMyAcceptedJobs = async (req, res) => {
  try {
    const jobs = await jobService.getMyAcceptedJobs(req.user.id);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get Jobs Completed by Current User
const getMyCompletedJobs = async (req, res) => {
  try {
    const jobs = await jobService.getMyCompletedJobs(req.user.id);
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Complete Job
const completeJob = async (req, res) => {
  try {
    const job = await jobService.completeJob(req.params.jobId, req.user);
    res.json(job);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Edit Job
const editJob = async (req, res) => {
  const { title, description, price, currency, category, location } = req.body;
  console.log('Edit Job Request:', {
    jobId: req.params.jobId,
    userId: req.user.id,
    body: req.body,
  }); // Debugging log
  try {
    const job = await jobService.editJob(
      req.params.jobId,
      title,
      description,
      price,
      currency,
      category,
      location,
      req.user.id
    );
    res.json(job);
  } catch (err) {
    console.error('Error in editJob Controller:', err.message); // Debugging log
    res.status(500).json({ msg: err.message });
  }
};

// Cancel Job
const cancelJob = async (req, res) => {
  try {
    const job = await jobService.cancelJob(req.params.jobId, req.user);
    res.json({ msg: 'Job canceled' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete Job
const deleteJob = async (req, res) => {
  try {
    const job = await jobService.deleteJob(req.params.jobId);
    res.json({msg: 'Job Deleted'});
  } catch (err) {
    res.status(500).json({ msg: 'Server Error'});
  }
};

const { awardXP } = require('../utils/gameEngine');
const User = require('../models/User');

// Add Candidate
const addCandidate = async (req, res) => {
  const { candidateId } = req.body;
  const finalCandidateId = candidateId || req.user.id; // Allow self-apply if no candidateId provided
  try {
    const job = await jobService.addCandidate(req.params.jobId, finalCandidateId, req.user.id);
    await awardXP(finalCandidateId, 'job_applied');
    const user = await User.findById(finalCandidateId);
    user.jobStats.jobsApplied += 1;
    await user.save();
    res.json({ msg: 'Candidate added successfully and XP awarded!', job });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Remove Candidate
const removeCandidate = async (req, res) => {
  const { candidateId } = req.body;
  try {
    const job = await jobService.removeCandidate(req.params.jobId, candidateId, req.user.id);
    res.json({ msg: 'Candidate removed successfully', job });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Get Candidates for a Job
const getCandidates = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const applications = await jobService.getApplicationsByJob(jobId, req.user.id);
    res.json(applications);
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Update Application Status
const updateApplicationStatus = async (req, res) => {
  const { applicationId, status } = req.body;
  const jobId = req.params.jobId;
  try {
    const application = await jobService.updateApplicationStatus(jobId, applicationId, status, req.user.id);
    res.json({ msg: 'Application status updated successfully', application });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

// Update Interview Data
const updateInterviewData = async (req, res) => {
  const { interviewDate, meetingLink } = req.body;
  const applicationId = req.params.applicationId;
  try {
    const application = await jobService.updateInterviewData(applicationId, interviewDate, meetingLink, req.user.id);
    res.json({ msg: 'Interview data updated successfully', application });
  } catch (err) {
    res.status(400).json({ msg: err.message });
  }
};

module.exports = {
  postJob,
  acceptJob,
  getAllJobs,
  getMyPostedJobs,
  getMyAcceptedJobs,
  getMyCompletedJobs,
  completeJob,
  editJob,
  cancelJob,
  deleteJob,
  addCandidate,
  removeCandidate,
  getCandidates,
  updateApplicationStatus,
  updateInterviewData
};
