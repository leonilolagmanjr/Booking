import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { createPost } from '../../services/api';
import { useAuth } from '../../context/AuthContext';


const CreatePost = ({ onPostCreated, type = 'post', category, groupId }) => {
  const { user } = useAuth();
  const [content, setContent] = useState('');
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setMedia(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('content', content);
      for (let i = 0; i < media.length; i++) {
        formData.append('media', media[i]);
      }
      if (type) formData.append('type', type);
      if (category) formData.append('category', category);
      if (groupId) formData.append('groupId', groupId);

      await createPost(formData, token);
      setContent('');
      setMedia([]);
      onPostCreated();
    } catch (err) {
      console.error('Error creating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="What's on your mind?"
        multiline
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        fullWidth
        sx={{
          bgcolor: '#3F4E4F',
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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          component="label"
          variant="outlined"
          size="small"
          sx={{
            color: '#A27B5C',
            borderColor: 'rgba(162, 123, 92, 0.5)',
            '&:hover': {
              borderColor: '#A27B5C',
              bgcolor: 'rgba(162, 123, 92, 0.1)'
            }
          }}
        >
          Add Media
          <input
            type="file"
            hidden
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
          />
        </Button>
        {media.length > 0 && (
          <Typography sx={{ color: '#A27B5C', fontSize: '0.875rem' }}>
            {media.length} file{media.length !== 1 ? 's' : ''} selected
          </Typography>
        )}
      </Box>
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
          },
          '&:disabled': {
            bgcolor: 'rgba(63, 78, 79, 0.7)',
            color: 'rgba(220, 215, 201, 0.5)'
          }
        }}
        disabled={loading || !content.trim()}
      >
        {loading ? 'Posting...' : 'Post'}
      </Button>
    </Box>
  );
};

export default CreatePost;