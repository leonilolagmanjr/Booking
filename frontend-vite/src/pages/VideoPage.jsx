import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Chip,
  Avatar,
  Button,
  IconButton,
  Divider,
  CircularProgress,
  Paper,
  Stack,
  Fade
} from '@mui/material';
import { fetchVideo } from '../services/api';
import CollapsibleText from '../components/CollapsibleText';
import UserLink from '../components/UserLink';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';
import PersonIcon from '@mui/icons-material/Person';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const VideoPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);

  useEffect(() => {
    const getVideo = async () => {
      try {
        const data = await fetchVideo(id);
        setVideo(data);
      } catch (err) {
        console.error('Error fetching video:', err);
        setError('Video not found or may have been removed');
      } finally {
        setLoading(false);
      }
    };
    getVideo();
  }, [id]);

  const handleVideoLoad = () => {
    setVideoLoading(false);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Box sx={{ 
        bgcolor: '#2C3639', 
        color: '#DCD7C9', 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress sx={{ color: '#A27B5C' }} size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        bgcolor: '#2C3639', 
        color: '#DCD7C9', 
        minHeight: '100vh',
        py: 10
      }}>
        <Container maxWidth="md">
          <Fade in>
            <Paper
              sx={{
                bgcolor: '#3F4E4F',
                p: 8,
                borderRadius: 3,
                border: '2px solid #A27B5C',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
                textAlign: 'center'
              }}
            >
              <ErrorOutlineIcon sx={{ fontSize: '6rem', color: '#A27B5C', mb: 3, opacity: 0.7 }} />
              <Typography variant="h4" sx={{ color: '#DCD7C9', mb: 2, fontWeight: 'bold' }}>
                Video Not Found
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 4, maxWidth: 500, mx: 'auto' }}>
                {error}. The video may have been removed or the link might be incorrect.
              </Typography>
              <Button
                variant="contained"
                startIcon={<ArrowBackIcon />}
                onClick={handleBackClick}
                sx={{
                  bgcolor: '#A27B5C',
                  color: '#2C3639',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  '&:hover': {
                    bgcolor: '#8a6a50',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                  }
                }}
              >
                Back to Videos
              </Button>
            </Paper>
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
      py: 5,
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 10% 20%, rgba(162, 123, 92, 0.05) 0%, transparent 20%),
          radial-gradient(circle at 90% 80%, rgba(63, 78, 79, 0.08) 0%, transparent 20%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackClick}
          sx={{
            mb: 3,
            color: '#A27B5C',
            fontWeight: 'bold',
            '&:hover': {
              bgcolor: 'rgba(162, 123, 92, 0.1)',
            }
          }}
        >
          Back to Videos
        </Button>

        <Fade in timeout={600}>
          <Paper
            sx={{
              bgcolor: '#3F4E4F',
              borderRadius: 3,
              border: '2px solid #A27B5C',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
                zIndex: 1,
              }
            }}
          >
            <CardContent sx={{ p: 0 }}>
              {/* Video Player Section */}
              <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                {videoLoading && (
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    right: 0, 
                    bottom: 0, 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    bgcolor: '#2C3639',
                    zIndex: 1
                  }}>
                    <CircularProgress sx={{ color: '#A27B5C' }} size={60} />
                  </Box>
                )}
                
                <video
                  width="100%"
                  height="auto"
                  controls
                  src={video.videoUrl}
                  poster={video.thumbnailUrl}
                  onLoadedData={handleVideoLoad}
                  style={{
                    maxHeight: '600px',
                    width: '100%',
                    aspectRatio: '16/9',
                    backgroundColor: '#2C3639',
                    display: 'block'
                  }}
                />
              </Box>

              {/* Video Info Section */}
              <Box sx={{ p: 5 }}>
                {/* Video Title */}
                <Typography 
                  variant="h3" 
                  sx={{ 
                    color: '#DCD7C9', 
                    mb: 3,
                    fontWeight: 'bold',
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  {video.title}
                </Typography>

                {/* Video Stats */}
                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ 
                    mb: 4,
                    flexWrap: 'wrap',
                    gap: 2
                  }}
                >
                  <Chip
                    icon={<PersonIcon />}
                    label={
                      <UserLink 
                        userId={video.uploader._id} 
                        name={video.uploader.name}
                        sx={{ color: '#DCD7C9', fontWeight: 'bold' }}
                      />
                    }
                    sx={{
                      bgcolor: 'rgba(162, 123, 92, 0.2)',
                      color: '#DCD7C9',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        color: '#A27B5C',
                      }
                    }}
                  />
                  
                  {video.views !== undefined && (
                    <Chip
                      icon={<VisibilityIcon />}
                      label={`${video.views || 0} views`}
                      sx={{
                        bgcolor: 'rgba(162, 123, 92, 0.2)',
                        color: '#DCD7C9',
                        fontWeight: 'bold',
                        '& .MuiChip-icon': {
                          color: '#A27B5C',
                        }
                      }}
                    />
                  )}
                  
                  <Chip
                    icon={<CalendarTodayIcon />}
                    label={new Date(video.createdAt).toLocaleDateString()}
                    sx={{
                      bgcolor: 'rgba(162, 123, 92, 0.2)',
                      color: '#DCD7C9',
                      fontWeight: 'bold',
                      '& .MuiChip-icon': {
                        color: '#A27B5C',
                      }
                    }}
                  />
                  
                  {video.category && (
                    <Chip
                      label={video.category}
                      sx={{
                        bgcolor: '#2C3639',
                        color: '#A27B5C',
                        fontWeight: 'bold',
                        border: '1px solid #A27B5C'
                      }}
                    />
                  )}
                </Stack>

                <Divider sx={{ borderColor: 'rgba(162, 123, 92, 0.3)', mb: 4 }} />

                {/* Video Description */}
                <Box>
                  <Typography 
                    variant="h5" 
                    sx={{ 
                      color: '#DCD7C9', 
                      mb: 2,
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5
                    }}
                  >
                    <VideoLibraryIcon sx={{ color: '#A27B5C' }} />
                    Description
                  </Typography>
                  
                  {video.description ? (
                    <Box sx={{ 
                      bgcolor: '#2C3639', 
                      p: 3, 
                      borderRadius: 2,
                      border: '1px solid rgba(162, 123, 92, 0.2)'
                    }}>
                      <CollapsibleText 
                        text={video.description} 
                        limit={300}
                        sx={{ 
                          color: 'rgba(220, 215, 201, 0.9)',
                          fontSize: '1.1rem',
                          lineHeight: 1.7
                        }}
                      />
                    </Box>
                  ) : (
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: 'rgba(220, 215, 201, 0.7)', 
                        fontStyle: 'italic',
                        p: 3,
                        bgcolor: '#2C3639',
                        borderRadius: 2,
                        border: '1px dashed rgba(162, 123, 92, 0.3)'
                      }}
                    >
                      No description provided
                    </Typography>
                  )}
                </Box>

                {/* Uploader Info */}
                <Paper
                  sx={{
                    mt: 5,
                    bgcolor: '#2C3639',
                    p: 3,
                    borderRadius: 2,
                    border: '2px solid rgba(162, 123, 92, 0.3)'
                  }}
                >
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      color: '#DCD7C9', 
                      mb: 2,
                      fontWeight: 'bold'
                    }}
                  >
                    About the Creator
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <Avatar
                      src={video.uploader.profileImage}
                      sx={{
                        width: 80,
                        height: 80,
                        border: '3px solid #A27B5C',
                        bgcolor: 'rgba(162, 123, 92, 0.2)'
                      }}
                    >
                      {video.uploader.name?.charAt(0)?.toUpperCase() || 'U'}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography 
                        variant="h5" 
                        sx={{ 
                          color: '#DCD7C9', 
                          mb: 0.5,
                          fontWeight: 'bold'
                        }}
                      >
                        <UserLink 
                          userId={video.uploader._id} 
                          name={video.uploader.name}
                          sx={{ color: '#DCD7C9' }}
                        />
                      </Typography>
                      
                      {video.uploader.email && (
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 'rgba(220, 215, 201, 0.7)',
                            mb: 1
                          }}
                        >
                          {video.uploader.email}
                        </Typography>
                      )}
                      
                      <Button
                        variant="outlined"
                        onClick={() => navigate(`/profile/${video.uploader._id}`)}
                        sx={{
                          color: '#A27B5C',
                          borderColor: '#A27B5C',
                          mt: 1,
                          fontWeight: 'bold',
                          '&:hover': {
                            bgcolor: 'rgba(162, 123, 92, 0.1)',
                            borderColor: '#8a6a50',
                          }
                        }}
                      >
                        View Full Profile
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Box>
            </CardContent>
          </Paper>
        </Fade>

        {/* Related Videos Placeholder */}
        <Fade in timeout={800} delay={300}>
          <Paper
            sx={{
              mt: 6,
              bgcolor: '#3F4E4F',
              p: 4,
              borderRadius: 3,
              border: '2px solid rgba(162, 123, 92, 0.3)',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Typography 
              variant="h5" 
              sx={{ 
                color: '#DCD7C9', 
                mb: 3,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <PlayCircleIcon sx={{ color: '#A27B5C' }} />
              More Videos
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'rgba(220, 215, 201, 0.7)',
                textAlign: 'center',
                py: 4,
                bgcolor: '#2C3639',
                borderRadius: 2,
                border: '1px dashed rgba(162, 123, 92, 0.3)'
              }}
            >
              Explore more videos from this creator and others in the Video Gallery
            </Typography>
            
            <Box sx={{ textAlign: 'center', mt: 3 }}>
              <Button
                variant="contained"
                onClick={() => navigate('/videos')}
                sx={{
                  bgcolor: '#A27B5C',
                  color: '#2C3639',
                  px: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  '&:hover': {
                    bgcolor: '#8a6a50',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                  }
                }}
              >
                Browse All Videos
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default VideoPage;