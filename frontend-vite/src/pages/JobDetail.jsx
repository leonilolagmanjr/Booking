import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  Alert,
  Chip,
  Stack,
  Paper,
  Divider,
  Button,
  Grid,
  Fade
} from '@mui/material';
import {
  WorkOutline,
  Category,
  LocationOn,
  Event,
  Person,
  AttachMoney,
  Groups,
  ArrowBack,
  Cached
} from '@mui/icons-material';
import { fetchJobs } from '../services/api';
import UserLink from '../components/UserLink';
import ApplyJob from '../components/jobs/ApplyJob';

// Constants for better maintainability
const JOB_STATUS_COLORS = {
  open: '#A27B5C', // Using accent color for open status
  closed: 'rgba(162, 123, 92, 0.3)',
  in_progress: 'rgba(162, 123, 92, 0.6)',
  completed: 'rgba(162, 123, 92, 0.8)'
};

const JOB_STATUS_BG_COLORS = {
  open: 'rgba(162, 123, 92, 0.2)',
  closed: 'rgba(63, 78, 79, 0.3)',
  in_progress: 'rgba(162, 123, 92, 0.1)',
  completed: 'rgba(162, 123, 92, 0.15)'
};

const JobDetail = () => {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const jobs = await fetchJobs();
      const selectedJob = jobs.find((job) => job._id === jobId);
      
      if (selectedJob) {
        setJob(selectedJob);
      } else {
        setError('Job not found');
      }
    } catch (err) {
      console.error('Error fetching job details:', err);
      setError('Failed to fetch job details. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const handleApplySuccess = useCallback(() => {
    // Refresh job details to get updated candidates list
    fetchJobDetails();
  }, [fetchJobDetails]);

  // Format date safely
  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  // Get location display text
  const getLocationText = (location) => {
    if (!location) return 'Remote Work';
    return location.type === 'physical' ? `${location.address}` : 'Remote Work';
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        bgcolor: '#2C3639'
      }}>
        <CircularProgress sx={{ color: '#A27B5C' }} size={60} />
        <Typography variant="h6" sx={{ mt: 3, color: '#DCD7C9' }}>
          Loading job details...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: '#2C3639',
        color: '#DCD7C9',
        py: 10
      }}>
        <Container maxWidth="md">
          <Fade in>
            <Alert 
              severity="error" 
              sx={{ 
                textAlign: 'center',
                bgcolor: 'rgba(63, 78, 79, 0.8)',
                color: '#DCD7C9',
                border: '2px solid rgba(162, 123, 92, 0.5)',
                borderRadius: 3
              }}
              action={
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={fetchJobDetails}
                  startIcon={<Cached />}
                  sx={{ 
                    color: '#A27B5C',
                    fontWeight: 'bold'
                  }}
                >
                  Retry
                </Button>
              }
            >
              {error}
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  if (!job) {
    return (
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: '#2C3639',
        color: '#DCD7C9',
        py: 10
      }}>
        <Container maxWidth="md">
          <Fade in>
            <Alert 
              severity="warning" 
              sx={{ 
                textAlign: 'center',
                bgcolor: 'rgba(63, 78, 79, 0.8)',
                color: '#DCD7C9',
                border: '2px solid rgba(162, 123, 92, 0.5)',
                borderRadius: 3
              }}
            >
              No job data available.
            </Alert>
          </Fade>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: '#2C3639', 
      color: '#DCD7C9', 
      minHeight: '100vh',
      py: 6,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 10%, rgba(162, 123, 92, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 90% 90%, rgba(63, 78, 79, 0.08) 0%, transparent 25%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header Section */}
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              p: 5,
              mb: 6,
              bgcolor: '#3F4E4F',
              border: '3px solid #A27B5C',
              borderRadius: 3,
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
              }
            }}
          >
            <Grid container spacing={4} alignItems="flex-start">
              <Grid item xs={12} md={8}>
                <Typography
                  variant="h2"
                  sx={{
                    color: '#DCD7C9',
                    mb: 3,
                    fontWeight: 'bold',
                    fontSize: { xs: '2.2rem', md: '2.8rem' },
                    lineHeight: 1.2
                  }}
                >
                  {job.title}
                </Typography>

                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
                  <Chip
                    icon={<WorkOutline />}
                    label={job.status.toUpperCase()}
                    sx={{ 
                      fontWeight: 'bold',
                      color: JOB_STATUS_COLORS[job.status] || '#DCD7C9',
                      bgcolor: JOB_STATUS_BG_COLORS[job.status] || '#2C3639',
                      border: `2px solid ${JOB_STATUS_COLORS[job.status] || '#A27B5C'}`,
                      fontSize: '0.9rem'
                    }}
                  />
                  <Chip
                    icon={<Category />}
                    label={job.category}
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#A27B5C',
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      border: '2px solid #A27B5C',
                      fontSize: '0.9rem'
                    }}
                  />
                  <Chip
                    icon={<LocationOn />}
                    label={getLocationText(job.location)}
                    sx={{ 
                      fontWeight: 'bold',
                      color: '#A27B5C',
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      border: '2px solid #A27B5C',
                      fontSize: '0.9rem'
                    }}
                  />
                </Stack>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Box sx={{ 
                  position: 'sticky', 
                  top: 20,
                  bgcolor: '#2C3639',
                  p: 3,
                  borderRadius: 2,
                  border: '2px solid #A27B5C',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}>
                  <ApplyJob 
                    job={job} 
                    onApplySuccess={handleApplySuccess} 
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Main Content */}
        <Grid container spacing={6}>
          {/* Job Details */}
          <Grid item xs={12} lg={8}>
            <Fade in timeout={800} delay={200}>
              <Paper
                elevation={0}
                sx={{
                  p: 5,
                  bgcolor: '#3F4E4F',
                  border: '2px solid rgba(162, 123, 92, 0.3)',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                  height: '100%'
                }}
              >
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: '#DCD7C9', 
                    mb: 4,
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    pb: 2,
                    borderBottom: '2px solid #A27B5C'
                  }}
                >
                  <WorkOutline sx={{ color: '#A27B5C' }} />
                  Job Description
                </Typography>
                
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(220, 215, 201, 0.9)',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    fontSize: '1.1rem',
                    '& p': {
                      mb: 2
                    }
                  }}
                >
                  {job.description}
                </Typography>
              </Paper>
            </Fade>
          </Grid>

          {/* Sidebar with Additional Info */}
          <Grid item xs={12} lg={4}>
            <Fade in timeout={800} delay={400}>
              <Box sx={{ position: 'sticky', top: 20 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 4,
                    bgcolor: '#3F4E4F',
                    border: '2px solid #A27B5C',
                    borderRadius: 3,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
                    }
                  }}
                >
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#DCD7C9', 
                      mb: 4,
                      fontWeight: 'bold'
                    }}
                  >
                    Job Details
                  </Typography>

                  <Stack spacing={3}>
                    {/* Price */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: '#A27B5C', 
                          display: 'block', 
                          mb: 1,
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <AttachMoney sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        BUDGET
                      </Typography>
                      <Typography
                        variant="h3"
                        sx={{
                          color: '#A27B5C',
                          fontWeight: 'bold',
                          fontSize: '2.5rem'
                        }}
                      >
                        {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />

                    {/* Location */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: '#A27B5C', 
                          display: 'block', 
                          mb: 1,
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <LocationOn sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        LOCATION
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: '#DCD7C9', 
                        fontWeight: 600,
                        fontSize: '1.1rem'
                      }}>
                        {getLocationText(job.location)}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />

                    {/* Date Listed */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: '#A27B5C', 
                          display: 'block', 
                          mb: 1,
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <Event sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        DATE LISTED
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: '#DCD7C9',
                        fontSize: '1.1rem'
                      }}>
                        {formatDate(job.dateListed)}
                      </Typography>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />

                    {/* Posted By */}
                    <Box>
                      <Typography
                        variant="caption"
                        sx={{ 
                          color: '#A27B5C', 
                          display: 'block', 
                          mb: 1,
                          fontWeight: 'bold',
                          fontSize: '0.9rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}
                      >
                        <Person sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        POSTED BY
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <UserLink
                          userId={job.createdBy._id}
                          name={job.createdBy.name}
                        />
                      </Box>
                    </Box>

                    {/* Candidates Count */}
                    {job.candidates && (
                      <>
                        <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)' }} />
                        <Box>
                          <Typography
                            variant="caption"
                            sx={{ 
                              color: '#A27B5C', 
                              display: 'block', 
                              mb: 1,
                              fontWeight: 'bold',
                              fontSize: '0.9rem',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px'
                            }}
                          >
                            <Groups sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                            APPLICATIONS
                          </Typography>
                          <Typography variant="body1" sx={{ 
                            color: '#DCD7C9',
                            fontSize: '1.1rem',
                            fontWeight: 'bold'
                          }}>
                            {job.candidates.length} candidate{job.candidates.length !== 1 ? 's' : ''}
                          </Typography>
                        </Box>
                      </>
                    )}
                  </Stack>
                </Paper>

                {/* Back Button */}
                <Button
                  component="a"
                  href="/jobs"
                  startIcon={<ArrowBack />}
                  sx={{
                    mt: 3,
                    width: '100%',
                    color: '#A27B5C',
                    border: '2px solid #A27B5C',
                    py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: 'rgba(162, 123, 92, 0.1)',
                      borderColor: '#8a6a50',
                    }
                  }}
                >
                  Back to Jobs
                </Button>
              </Box>
            </Fade>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default JobDetail;