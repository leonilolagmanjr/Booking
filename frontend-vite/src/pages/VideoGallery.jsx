import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Container,
  TextField,
  Button,
  Chip,
  IconButton,
  Paper,
  InputAdornment,
  CircularProgress,
  Fade,
  Avatar,
  CardMedia,
  Stack
} from '@mui/material';
import { fetchVideos } from '../services/api';
import { useAuth } from '../context/AuthContext';
import UserLink from '../components/UserLink';
import SearchIcon from '@mui/icons-material/Search';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PersonIcon from '@mui/icons-material/Person';

const VideoGallery = () => {
  const [videos, setVideos] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const getVideos = async () => {
      try {
        setLoading(true);
        const data = await fetchVideos(search);
        setVideos(data);
      } catch (err) {
        console.error('Error fetching videos:', err);
      } finally {
        setLoading(false);
      }
    };
    
    const delayDebounce = setTimeout(() => {
      getVideos();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search]);

  const handleCardClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      // Search is already debounced, no need for additional action
    }
  };

  return (
    <Box sx={{ 
      bgcolor: '#2C3639', 
      color: '#DCD7C9', 
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(162, 123, 92, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 80% 70%, rgba(63, 78, 79, 0.08) 0%, transparent 25%)
        `,
        zIndex: 0,
      }
    }}>
      {/* Top Bar */}
      <AppBar 
        position="static" 
        sx={{ 
          bgcolor: '#2C3639',
          borderBottom: '2px solid #A27B5C',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 2 }}>
            <Typography 
              variant="h4" 
              sx={{ 
                flexGrow: 1, 
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}
            >
              <VideoLibraryIcon sx={{ color: '#A27B5C', fontSize: '2rem' }} />
              Video Gallery
              <Chip 
                label={`${videos.length} videos`} 
                sx={{ 
                  bgcolor: 'rgba(162, 123, 92, 0.2)', 
                  color: '#DCD7C9',
                  fontWeight: 'bold'
                }} 
              />
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <TextField
                variant="outlined"
                placeholder="Search videos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                size="small"
                sx={{
                  width: 300,
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#3F4E4F',
                    color: '#DCD7C9',
                    borderRadius: 2,
                    border: '2px solid rgba(162, 123, 92, 0.3)',
                    '&:hover': {
                      borderColor: 'rgba(162, 123, 92, 0.5)',
                    },
                    '&.Mui-focused': {
                      borderColor: '#A27B5C',
                      boxShadow: '0 0 0 4px rgba(162, 123, 92, 0.1)',
                    }
                  },
                  '& .MuiInputLabel-root': {
                    color: '#A27B5C',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#DCD7C9',
                  },
                  '& .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  }
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#A27B5C' }} />
                    </InputAdornment>
                  ),
                }}
              />
              
              {user && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/videomanager')}
                  sx={{
                    bgcolor: '#A27B5C',
                    color: '#2C3639',
                    py: 1.2,
                    px: 3,
                    borderRadius: 2,
                    fontWeight: 'bold',
                    border: '2px solid #A27B5C',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: '#8a6a50',
                      borderColor: '#8a6a50',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                    },
                  }}
                >
                  Upload Video
                </Button>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Video Grid */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="xl">
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
              <CircularProgress sx={{ color: '#A27B5C' }} size={60} />
            </Box>
          ) : videos.length > 0 ? (
            <Fade in timeout={600}>
              <Grid container spacing={4}>
                {videos.map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                    <Card
                      sx={{
                        bgcolor: '#3F4E4F',
                        color: '#DCD7C9',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        cursor: 'pointer',
                        border: '2px solid rgba(162, 123, 92, 0.3)',
                        borderRadius: 3,
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          borderColor: '#A27B5C',
                          boxShadow: '0 16px 40px rgba(162, 123, 92, 0.3)',
                          '& .play-overlay': {
                            opacity: 1,
                          },
                          '& .thumbnail': {
                            transform: 'scale(1.05)',
                          }
                        },
                      }}
                      onClick={() => handleCardClick(video._id)}
                    >
                      {/* Thumbnail with Play Overlay */}
                      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                        <CardMedia
                          component="img"
                          image={video.thumbnailUrl || "https://via.placeholder.com/320x180?text=Video+Thumbnail"}
                          alt={video.title}
                          className="thumbnail"
                          sx={{
                            width: '100%',
                            height: 180,
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                            aspectRatio: '16/9',
                          }}
                        />
                        <Box
                          className="play-overlay"
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            bgcolor: 'rgba(44, 54, 57, 0.7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                          }}
                        >
                          <PlayCircleIcon sx={{ fontSize: 60, color: '#A27B5C' }} />
                        </Box>
                        
                        {/* Duration Badge */}
                        {video.duration && (
                          <Chip
                            size="small"
                            icon={<ScheduleIcon sx={{ fontSize: '0.8rem' }} />}
                            label={video.duration}
                            sx={{
                              position: 'absolute',
                              bottom: 10,
                              right: 10,
                              bgcolor: 'rgba(44, 54, 57, 0.9)',
                              color: '#DCD7C9',
                              fontWeight: 'bold',
                              fontSize: '0.75rem'
                            }}
                          />
                        )}
                      </Box>
                      
                      <CardContent sx={{ 
                        flexGrow: 1, 
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column'
                      }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            mb: 2,
                            fontWeight: 'bold',
                            lineHeight: 1.3,
                            minHeight: '3rem',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}
                        >
                          {video.title}
                        </Typography>
                        
                        {/* Uploader Info */}
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1.5,
                          mb: 2,
                          flexGrow: 1
                        }}>
                          <Avatar 
                            sx={{ 
                              width: 32, 
                              height: 32,
                              bgcolor: '#A27B5C',
                              border: '1px solid rgba(162, 123, 92, 0.5)'
                            }}
                          >
                            {video.uploader?.name?.charAt(0)?.toUpperCase() || 'U'}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.9)', fontWeight: 500 }}>
                              <UserLink 
                                userId={video.uploader._id} 
                                name={video.uploader.name} 
                                sx={{ color: '#A27B5C' }}
                              />
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.6)', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <VisibilityIcon sx={{ fontSize: '0.8rem' }} />
                              {video.views || 0} views
                            </Typography>
                          </Box>
                        </Box>
                        
                        {/* Video Stats */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          pt: 2,
                          borderTop: '1px solid rgba(162, 123, 92, 0.2)'
                        }}>
                          <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                            {new Date(video.createdAt).toLocaleDateString()}
                          </Typography>
                          
                          {video.category && (
                            <Chip
                              label={video.category}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(162, 123, 92, 0.1)',
                                color: '#A27B5C',
                                fontSize: '0.7rem',
                                fontWeight: 'bold',
                                height: 22
                              }}
                            />
                          )}
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Fade>
          ) : (
            <Fade in timeout={600}>
              <Box sx={{ 
                textAlign: 'center', 
                py: 15,
                bgcolor: 'rgba(63, 78, 79, 0.3)',
                borderRadius: 3,
                border: '2px dashed #A27B5C'
              }}>
                <VideoLibraryIcon sx={{ fontSize: '6rem', color: '#A27B5C', mb: 3, opacity: 0.5 }} />
                <Typography variant="h4" sx={{ color: '#DCD7C9', mb: 2, fontWeight: 'bold' }}>
                  {search ? 'No videos found' : 'No videos available'}
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 4, maxWidth: 500, mx: 'auto' }}>
                  {search 
                    ? `No videos match your search for "${search}"`
                    : 'Be the first to upload a video and share your content with the community'
                  }
                </Typography>
                {user && (
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => navigate('/videomanager')}
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
                    Upload First Video
                  </Button>
                )}
              </Box>
            </Fade>
          )}
          
          {/* Video Stats */}
          {videos.length > 0 && (
            <Fade in timeout={800} delay={300}>
              <Paper
                sx={{
                  mt: 8,
                  bgcolor: '#3F4E4F',
                  p: 4,
                  borderRadius: 3,
                  border: '2px solid rgba(162, 123, 92, 0.3)',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
                }}
              >
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} md={4}>
                    <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 2, fontWeight: 'bold' }}>
                      Video Library Stats
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <Stack direction="row" spacing={4} justifyContent="space-around" flexWrap="wrap">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                          {videos.length}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                          Total Videos
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                          {new Set(videos.map(v => v.uploader._id)).size}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                          Content Creators
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                          {videos.reduce((sum, video) => sum + (video.views || 0), 0).toLocaleString()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                          Total Views
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>
            </Fade>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default VideoGallery;