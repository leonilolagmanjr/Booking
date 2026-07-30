import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { updatePost } from '../../services/api';

const EditPost = ({ post, onPostUpdated, onCancel }) => {
  const [content, setContent] = useState(post.content);
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
      await updatePost(post._id, formData, token);
      onPostUpdated();
      onCancel();
    } catch (err) {
      console.error('Error updating post:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Edit your post"
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
      {post.media && post.media.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
          {post.media.map((mediaItem, idx) => {
            const isVideo = mediaItem.url.match(/\.(mp4|webm|ogg)$/i);
            return isVideo ? (
              <video 
                key={idx} 
                src={mediaItem.url} 
                controls 
                style={{ 
                  width: '100%', 
                  borderRadius: '8px',
                  border: '2px solid rgba(162, 123, 92, 0.3)'
                }} 
              />
            ) : (
              <img 
                key={idx} 
                src={mediaItem.url} 
                alt="current media" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  border: '2px solid rgba(162, 123, 92, 0.3)'
                }} 
              />
            );
          })}
          <Typography sx={{ 
            color: 'rgba(220, 215, 201, 0.8)', 
            fontSize: '0.8rem',
            fontWeight: 500
          }}>
            Current media:
          </Typography>
          {post.media.map((mediaItem, idx) => (
            <Typography key={idx} sx={{ 
              color: '#DCD7C9', 
              fontSize: '0.8rem',
              fontFamily: 'monospace',
              bgcolor: 'rgba(44, 54, 57, 0.5)',
              p: 0.5,
              borderRadius: '4px'
            }}>
              {mediaItem.url.split('/').pop()}
            </Typography>
          ))}
        </Box>
      )}
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
          Add New Media
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
            {media.length} new file{media.length !== 1 ? 's' : ''} selected
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
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
          {loading ? 'Updating...' : 'Update'}
        </Button>
        <Button
          variant="outlined"
          onClick={onCancel}
          sx={{ 
            color: '#DCD7C9', 
            borderColor: 'rgba(162, 123, 92, 0.5)',
            '&:hover': {
              borderColor: '#A27B5C',
              bgcolor: 'rgba(162, 123, 92, 0.1)'
            }
          }}
        >
          Cancel
        </Button>
      </Box>
    </Box>
  );
};

export default EditPost;