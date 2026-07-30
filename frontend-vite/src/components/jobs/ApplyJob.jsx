import React, { useState, useCallback, useEffect } from 'react';
import { Button, Alert, CircularProgress, Box, Chip, Typography, Paper } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { applyToJob } from '../../services/api';
import WorkIcon from '@mui/icons-material/Work';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';

// Constants for better maintainability
const MESSAGE_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  INFO: 'info',
  WARNING: 'warning'
};

const JOB_STATUS = {
  OPEN: 'open'
};

const ApplyJob = ({ job, onApplySuccess }) => {
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState(MESSAGE_TYPES.SUCCESS);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [isOwnJob, setIsOwnJob] = useState(false);

  // Initialize state based on job and user
  useEffect(() => {
    if (user && job) {
      setAlreadyApplied(job.candidates?.some(id => id.toString() === user._id) || false);
      setIsOwnJob(user._id === job.createdBy._id.toString());
    }
  }, [user, job]);

  // Clear message helper
  const clearMessage = useCallback(() => {
    setMessage('');
  }, []);

  // Show message helper
  const showMessage = useCallback((text, type = MESSAGE_TYPES.ERROR) => {
    setMessage(text);
    setSeverity(type);
  }, []);

  // Validation checks
  const validateApplication = useCallback(() => {
    if (!isLoggedIn) {
      showMessage('Please log in to apply for jobs.', MESSAGE_TYPES.ERROR);
      return false;
    }

    if (isOwnJob) {
      showMessage('You cannot apply to your own job.', MESSAGE_TYPES.ERROR);
      return false;
    }

    if (alreadyApplied) {
      showMessage('You have already applied to this job.', MESSAGE_TYPES.INFO);
      return false;
    }

    if (job.status !== JOB_STATUS.OPEN) {
      showMessage('This job is no longer accepting applications.', MESSAGE_TYPES.ERROR);
      return false;
    }

    return true;
  }, [isLoggedIn, isOwnJob, alreadyApplied, job.status, showMessage]);

  const handleApply = async () => {
    // Clear previous messages
    clearMessage();

    // Validate application
    if (!validateApplication()) {
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await applyToJob(job._id, token);
      showMessage('Successfully applied to the job!', MESSAGE_TYPES.SUCCESS);
      setAlreadyApplied(true);
      
      if (onApplySuccess) {
        onApplySuccess();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.msg 
        || error.message 
        || 'Failed to apply to the job. Please try again.';
      
      showMessage(errorMessage, MESSAGE_TYPES.ERROR);
    } finally {
      setLoading(false);
    }
  };

  // Determine if button should be disabled
  const isButtonDisabled = loading || job.status !== JOB_STATUS.OPEN || alreadyApplied || isOwnJob;

  // Get button text based on state
  const getButtonText = () => {
    if (loading) return 'Applying...';
    if (alreadyApplied) return 'Already Applied';
    if (isOwnJob) return 'Your Job';
    if (job.status !== JOB_STATUS.OPEN) return 'Job Closed';
    return 'Apply to Job';
  };

  // Auto-hide success message after 5 seconds
  useEffect(() => {
    if (severity === MESSAGE_TYPES.SUCCESS && message) {
      const timer = setTimeout(() => {
        clearMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [severity, message, clearMessage]);

  // Get alert icon based on severity
  const getAlertIcon = () => {
    switch (severity) {
      case MESSAGE_TYPES.SUCCESS:
        return <CheckCircleIcon />;
      case MESSAGE_TYPES.ERROR:
        return <ErrorIcon />;
      case MESSAGE_TYPES.WARNING:
        return <WarningIcon />;
      case MESSAGE_TYPES.INFO:
        return <InfoIcon />;
      default:
        return null;
    }
  };

  return (
    <Paper
      sx={{
        p: 3,
        bgcolor: '#3F4E4F',
        borderRadius: 2,
        border: '2px solid rgba(162, 123, 92, 0.3)',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Typography 
        variant="h6" 
        sx={{ 
          color: '#DCD7C9', 
          mb: 3,
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5
        }}
      >
        <WorkIcon sx={{ color: '#A27B5C' }} />
        Apply to Job
      </Typography>

      {/* Status Chips */}
      <Box sx={{ display: 'flex', gap: 1, mb: 3, flexWrap: 'wrap' }}>
        <Chip
          label={job.status === JOB_STATUS.OPEN ? 'Open' : 'Closed'}
          color={job.status === JOB_STATUS.OPEN ? 'success' : 'error'}
          size="small"
          sx={{
            bgcolor: job.status === JOB_STATUS.OPEN ? '#A27B5C' : 'rgba(162, 123, 92, 0.3)',
            color: job.status === JOB_STATUS.OPEN ? '#2C3639' : '#DCD7C9',
            fontWeight: 'bold'
          }}
        />
        
        {alreadyApplied && (
          <Chip
            label="Applied"
            icon={<CheckCircleIcon />}
            size="small"
            sx={{
              bgcolor: 'rgba(162, 123, 92, 0.2)',
              color: '#DCD7C9',
              fontWeight: 'bold',
              border: '1px solid #A27B5C'
            }}
          />
        )}
        
        {isOwnJob && (
          <Chip
            label="Your Job"
            size="small"
            sx={{
              bgcolor: 'rgba(63, 78, 79, 0.3)',
              color: 'rgba(220, 215, 201, 0.7)',
              fontWeight: 'bold'
            }}
          />
        )}
      </Box>

      {/* Application Stats */}
      {job.candidates && job.candidates.length > 0 && (
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(220, 215, 201, 0.7)', 
            mb: 3,
            textAlign: 'center',
            fontStyle: 'italic'
          }}
        >
          {job.candidates.length} applicant{job.candidates.length !== 1 ? 's' : ''} already applied
        </Typography>
      )}

      {/* Apply Button */}
      <Button
        variant="contained"
        onClick={handleApply}
        disabled={isButtonDisabled}
        startIcon={loading ? null : <WorkIcon />}
        fullWidth
        sx={{
          py: 1.8,
          borderRadius: 2,
          fontSize: '1.1rem',
          fontWeight: 'bold',
          textTransform: 'none',
          background: isButtonDisabled 
            ? 'rgba(162, 123, 92, 0.2)' 
            : 'linear-gradient(135deg, #A27B5C 0%, #8a6a50 100%)',
          color: isButtonDisabled 
            ? 'rgba(44, 54, 57, 0.5)' 
            : '#2C3639',
          border: isButtonDisabled 
            ? '2px solid rgba(162, 123, 92, 0.2)' 
            : '2px solid #A27B5C',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            background: isButtonDisabled 
              ? 'rgba(162, 123, 92, 0.2)' 
              : 'linear-gradient(135deg, #8a6a50 0%, #A27B5C 100%)',
            borderColor: isButtonDisabled 
              ? 'rgba(162, 123, 92, 0.2)' 
              : '#8a6a50',
            transform: isButtonDisabled ? 'none' : 'translateY(-2px)',
            boxShadow: isButtonDisabled ? 'none' : '0 8px 24px rgba(162, 123, 92, 0.4)',
          },
          '&:active': {
            transform: isButtonDisabled ? 'none' : 'translateY(0) scale(0.98)',
          }
        }}
        aria-label={getButtonText()}
        aria-live="polite"
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#2C3639' }} />
        ) : (
          getButtonText()
        )}
      </Button>
      
      {/* Status Messages */}
      {message && (
        <Alert 
          severity={severity} 
          sx={{ 
            mt: 3,
            bgcolor: severity === MESSAGE_TYPES.SUCCESS 
              ? 'rgba(162, 123, 92, 0.2)' 
              : severity === MESSAGE_TYPES.ERROR
                ? 'rgba(220, 53, 69, 0.2)'
                : 'rgba(63, 78, 79, 0.3)',
            color: '#DCD7C9',
            border: severity === MESSAGE_TYPES.SUCCESS 
              ? '1px solid #A27B5C' 
              : severity === MESSAGE_TYPES.ERROR
                ? '1px solid #dc3545'
                : '1px solid rgba(162, 123, 92, 0.3)',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: severity === MESSAGE_TYPES.SUCCESS 
                ? '#A27B5C' 
                : severity === MESSAGE_TYPES.ERROR
                  ? '#dc3545'
                  : 'rgba(220, 215, 201, 0.7)',
            }
          }}
          onClose={clearMessage}
          role="alert"
          icon={getAlertIcon()}
        >
          {message}
        </Alert>
      )}

      {/* Help Text */}
      {!isLoggedIn && (
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block',
            mt: 2,
            color: '#A27B5C',
            textAlign: 'center',
            fontWeight: 'bold'
          }}
        >
          Log in to apply for this job
        </Typography>
      )}

      {/* Application Notes */}
      <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid rgba(162, 123, 92, 0.2)' }}>
        <Typography 
          variant="caption" 
          sx={{ 
            color: 'rgba(220, 215, 201, 0.6)',
            fontSize: '0.75rem',
            display: 'block',
            textAlign: 'center'
          }}
        >
          By applying, you agree to share your profile information with the job poster
        </Typography>
      </Box>
    </Paper>
  );
};

export default ApplyJob;