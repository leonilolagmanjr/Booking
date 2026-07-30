import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import dayjs from 'dayjs';
import { fetchVideo } from '../../services/api';
import UserLink from '../UserLink';

const DisplayVideo = ({ videoId }) => {
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setLoading(true);
        const data = await fetchVideo(videoId);
        setVideo(data);
      } catch (err) {
        setError('Failed to load video.');
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      loadVideo();
    }
  }, [videoId]);

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress sx={{ color: '#A27B5C' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography sx={{ 
        color: '#ff6b6b', 
        textAlign: 'center', 
        mt: 4,
        fontWeight: 500
      }}>
        {error}
      </Typography>
    );
  }

  if (!video) {
    return (
      <Typography sx={{ 
        color: '#A27B5C', 
        textAlign: 'center', 
        mt: 4,
        fontStyle: 'italic'
      }}>
        Video not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ 
      bgcolor: '#3F4E4F', 
      borderRadius: '8px', 
      p: 3, 
      mb: 3,
      border: '2px solid rgba(162, 123, 92, 0.3)',
      transition: 'all 0.3s ease',
      '&:hover': {
        borderColor: '#A27B5C',
        boxShadow: '0 8px 24px rgba(162, 123, 92, 0.2)'
      }
    }}>
      <Box sx={{ mb: 2 }}>
        <UserLink 
          userId={video.uploader?._id} 
          name={video.uploader?.name} 
          sx={{ 
            fontWeight: 600, 
            mb: 0.5,
            fontSize: '1rem',
            color: '#DCD7C9'
          }} 
        />
        <Typography sx={{ 
          color: 'rgba(220, 215, 201, 0.8)', 
          fontSize: '0.8rem',
          fontStyle: 'italic'
        }}>
          {dayjs(video.createdAt).format('h:mm A · MMM D, YYYY')}
        </Typography>
      </Box>
      <Typography 
        variant="h5" 
        sx={{ 
          color: '#DCD7C9', 
          mb: 2,
          fontWeight: 700,
          fontSize: { xs: '1.5rem', sm: '1.75rem' }
        }}
      >
        {video.title}
      </Typography>
      {video.description && (
        <Typography sx={{ 
          color: '#DCD7C9', 
          mb: 2,
          lineHeight: 1.7,
          opacity: 0.95
        }}>
          {video.description}
        </Typography>
      )}
      <Box sx={{ mb: 2, position: 'relative' }}>
        <video
          width="100%"
          height="auto"
          controls
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          style={{ 
            maxHeight: '500px', 
            borderRadius: '8px',
            border: '2px solid rgba(162, 123, 92, 0.3)',
            backgroundColor: '#2C3639'
          }}
        />
      </Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 3,
        pt: 1.5,
        borderTop: '1px solid rgba(162, 123, 92, 0.2)'
      }}>
        <Typography sx={{ 
          color: '#A27B5C', 
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          {video.views || 0} Views
        </Typography>
        <Typography sx={{ 
          color: '#A27B5C', 
          fontSize: '0.9rem',
          fontWeight: 500
        }}>
          {video.likes || 0} Likes
        </Typography>
      </Box>
    </Box>
  );
};

export default DisplayVideo;