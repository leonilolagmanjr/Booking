import React from 'react';
import { Button, Box, Typography } from '@mui/material';
import { deleteVideo } from '../../services/api';

const DeleteVideo = ({ video, onVideoDeleted, onClose }) => {
  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await deleteVideo(video._id, token);
      onVideoDeleted();
      onClose();
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  return (
    <Box sx={{ 
      mt: 2,
      bgcolor: '#3F4E4F',
      p: 3,
      borderRadius: '8px',
      border: '2px solid rgba(255, 107, 107, 0.3)'
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 2, 
          color: '#ff6b6b',
          fontWeight: 600,
          borderBottom: '2px solid rgba(255, 107, 107, 0.3)',
          pb: 1
        }}
      >
        Delete Video
      </Typography>
      <Typography sx={{ 
        color: '#DCD7C9',
        mb: 3,
        lineHeight: 1.6
      }}>
        Are you sure you want to delete <strong>"{video.title}"</strong>? This action cannot be undone.
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'flex-end', 
        gap: 2, 
        mt: 3
      }}>
        <Button 
          onClick={onClose}
          sx={{ 
            color: '#DCD7C9', 
            borderColor: 'rgba(162, 123, 92, 0.5)',
            '&:hover': {
              borderColor: '#A27B5C',
              bgcolor: 'rgba(162, 123, 92, 0.1)'
            }
          }}
          variant="outlined"
        >
          Cancel
        </Button>
        <Button 
          onClick={handleDelete} 
          variant="contained"
          sx={{ 
            bgcolor: '#ff6b6b', 
            color: '#2C3639',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#ff5252',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(255, 107, 107, 0.4)'
            }
          }}
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
};

export default DeleteVideo;