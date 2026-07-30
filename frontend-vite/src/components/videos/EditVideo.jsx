import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { updateVideo } from '../../services/api';

const EditVideo = ({ video, onVideoUpdated, onClose }) => {
  const [title, setTitle] = useState(video.title || '');
  const [description, setDescription] = useState(video.description || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const updateData = { title, description };
      await updateVideo(video._id, updateData, token);
      onVideoUpdated();
      onClose();
    } catch (err) {
      console.error('Error updating video:', err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ 
      mt: 2,
      bgcolor: '#3F4E4F',
      p: 3,
      borderRadius: '8px',
      border: '2px solid rgba(162, 123, 92, 0.3)'
    }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: '#DCD7C9',
          fontWeight: 600,
          borderBottom: '2px solid rgba(162, 123, 92, 0.3)',
          pb: 1
        }}
      >
        Edit Video
      </Typography>
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        required
        sx={{ 
          mb: 3,
          '& .MuiInputLabel-root': { 
            color: '#DCD7C9',
            '&.Mui-focused': { color: '#A27B5C' }
          },
          '& .MuiOutlinedInput-root': { 
            color: '#DCD7C9',
            '& fieldset': { 
              borderColor: 'rgba(162, 123, 92, 0.3)' 
            },
            '&:hover fieldset': { 
              borderColor: 'rgba(162, 123, 92, 0.5)' 
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#A27B5C' 
            }
          },
        }}
      />
      <TextField
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={4}
        sx={{ 
          mb: 3,
          '& .MuiInputLabel-root': { 
            color: '#DCD7C9',
            '&.Mui-focused': { color: '#A27B5C' }
          },
          '& .MuiOutlinedInput-root': { 
            color: '#DCD7C9',
            '& fieldset': { 
              borderColor: 'rgba(162, 123, 92, 0.3)' 
            },
            '&:hover fieldset': { 
              borderColor: 'rgba(162, 123, 92, 0.5)' 
            },
            '&.Mui-focused fieldset': { 
              borderColor: '#A27B5C' 
            }
          },
        }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
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
          type="submit" 
          variant="contained"
          sx={{ 
            bgcolor: '#A27B5C', 
            color: '#2C3639',
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#8a6a50',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(162, 123, 92, 0.4)'
            }
          }}
        >
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default EditVideo;