import React, { useEffect, useState } from 'react';
import { fetchPostedJobs, deleteJob } from '../../services/api';
import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';

const ReadJob = ({ refresh }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        const data = await fetchPostedJobs(token);
        setJobs(data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };
    getJobs();
  }, [refresh]);

  const handleDelete = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      await deleteJob(jobId, token);
      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== jobId)); // Remove the job from the list
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  return (
    <Box sx={{ mb: 4, padding: '20px' }}>
      <Typography 
        variant="h5" 
        sx={{ 
          mb: 2, 
          color: '#DCD7C9',
          fontSize: '1.75rem',
          fontWeight: 600,
          borderBottom: '2px solid rgba(162, 123, 92, 0.3)',
          paddingBottom: '0.5rem'
        }}
      >
        My Posted Jobs
      </Typography>
      <Grid container spacing={3}>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Grid item xs={12} sm={6} md={4} key={job._id}>
              <Card
                sx={{
                  bgcolor: '#3F4E4F',
                  color: '#DCD7C9',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
                  position: 'relative',
                  border: '2px solid rgba(162, 123, 92, 0.3)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 28px rgba(162, 123, 92, 0.2)',
                    borderColor: '#A27B5C',
                    backgroundColor: 'rgba(63, 78, 79, 0.9)',
                  }
                }}
              >
                <CardContent>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#DCD7C9', 
                      mb: 1,
                      fontSize: '1.25rem',
                      fontWeight: 600
                    }}
                  >
                    {job.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      mb: 1,
                      color: '#A27B5C',
                      lineHeight: '1.6'
                    }}
                  >
                    {job.description.length > 100 ? job.description.substring(0, 100) + '...' : job.description}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#DCD7C9', 
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      mb: 1
                    }}
                  >
                    {(job.currency || 'USD') === 'USD' ? '$' : '₱'}{(job.price || 0).toFixed(2)}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'rgba(220, 215, 201, 0.8)',
                      fontStyle: 'italic',
                      mb: 2
                    }}
                  >
                    Status: <span style={{ 
                      color: job.status === 'open' ? '#28a745' : 
                             job.status === 'in progress' ? '#ffc107' : 
                             job.status === 'completed' ? '#17a2b8' : 
                             '#6c757d',
                      fontWeight: 'bold'
                    }}>{job.status}</span>
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ 
                      bgcolor: '#dc3545', 
                      color: '#DCD7C9', 
                      position: 'absolute', 
                      top: 10, 
                      right: 10,
                      border: '2px solid #dc3545',
                      borderRadius: '8px',
                      padding: '4px 12px',
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      textTransform: 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: '#c82333',
                        borderColor: '#bd2130',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 16px rgba(220, 53, 69, 0.4)'
                      }
                    }}
                    size="small"
                    onClick={() => handleDelete(job._id)}
                  >
                    Remove
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography 
            variant="body1" 
            sx={{ 
              color: '#A27B5C',
              padding: '40px',
              textAlign: 'center',
              width: '100%',
              backgroundColor: 'rgba(162, 123, 92, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(162, 123, 92, 0.3)'
            }}
          >
            No jobs available. Create your first job to get started!
          </Typography>
        )}
      </Grid>
    </Box>
  );
};

export default ReadJob;