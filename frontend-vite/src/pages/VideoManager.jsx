import React, { useState, useEffect } from 'react';
import EditVideo from '../components/videos/EditVideo';
import DeleteVideo from '../components/videos/DeleteVideo';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Modal,
  Container,
  Paper,
  Chip,
  IconButton,
  CircularProgress,
  Avatar,
  Stack,
  Divider
} from '@mui/material';
import { fetchUserVideos, uploadVideo } from '../services/api';
import CollapsibleText from '../components/CollapsibleText';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VisibilityIcon from '@mui/icons-material/Visibility';

const VideoManager = () => {
  const [refreshVideos, setRefreshVideos] = useState(false);
  const [userVideos, setUserVideos] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Modal state
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const triggerRefresh = () => {
    setRefreshVideos(!refreshVideos);
  };

  useEffect(() => {
    const fetchUserVideosData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const data = await fetchUserVideos(token);
        setUserVideos(data);
      } catch (err) {
        console.error('Error fetching user videos:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserVideosData();
  }, [refreshVideos]);

  const handleUpload = async () => {
    if (!file || !title) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('video', file);
      formData.append('title', title);
      formData.append('description', description);
      
      const token = localStorage.getItem('token');
      await uploadVideo(formData, token);
      
      setUploadOpen(false);
      setTitle('');
      setDescription('');
      setFile(null);
      triggerRefresh();
    } catch (err) {
      console.error('Error uploading video:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (video) => {
    setSelectedVideo(video);
    setOpenEdit(true);
  };

  const handleDelete = (video) => {
    setSelectedVideo(video);
    setOpenDelete(true);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Validate file size (100MB limit)
      if (selectedFile.size > 100 * 1024 * 1024) {
        alert('File size must be less than 100MB');
        return;
      }
      // Validate file type
      if (!selectedFile.type.startsWith('video/')) {
        alert('Please select a video file');
        return;
      }
      setFile(selectedFile);
    }
  };

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
          radial-gradient(circle at 15% 25%, rgba(162, 123, 92, 0.05) 0%, transparent 25%),
          radial-gradient(circle at 85% 75%, rgba(63, 78, 79, 0.08) 0%, transparent 25%)
        `,
        zIndex: 0,
      }
    }}>
      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            sx={{ 
              color: '#DCD7C9',
              fontWeight: 'bold',
              mb: 2,
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2
            }}
          >
            <VideoLibraryIcon sx={{ fontSize: '2.5rem', color: '#A27B5C' }} />
            Video Manager
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#A27B5C',
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6
            }}
          >
            Upload, manage, and organize your video content
          </Typography>
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Chip 
            label={`${userVideos.length} Videos`} 
            sx={{ 
              bgcolor: 'rgba(162, 123, 92, 0.2)', 
              color: '#DCD7C9',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              px: 2,
              py: 1
            }} 
          />
          
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setUploadOpen(true)}
            sx={{
              bgcolor: '#A27B5C',
              color: '#2C3639',
              py: 1.5,
              px: 4,
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              textTransform: 'none',
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
            Upload New Video
          </Button>
        </Box>

        {/* User Videos Section */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#A27B5C' }} size={60} />
          </Box>
        ) : userVideos.length > 0 ? (
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
              }
            }}
          >
            <CardContent sx={{ p: 4 }}>
              {/* Table Header */}
              <Grid container sx={{ 
                bgcolor: '#2C3639', 
                borderRadius: 2,
                p: 3,
                mb: 3,
                border: '2px solid rgba(162, 123, 92, 0.3)'
              }}>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                    VIDEO TITLE
                  </Typography>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Typography variant="subtitle1" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                    DESCRIPTION
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1" sx={{ color: '#A27B5C', fontWeight: 'bold' }}>
                    UPLOAD DATE
                  </Typography>
                </Grid>
                <Grid item xs={12} md={2}>
                  <Typography variant="subtitle1" sx={{ color: '#A27B5C', fontWeight: 'bold', textAlign: 'right' }}>
                    ACTIONS
                  </Typography>
                </Grid>
              </Grid>

              {/* Video Rows */}
              {userVideos.map((video) => (
                <Paper
                  key={video._id}
                  sx={{
                    bgcolor: '#2C3639',
                    borderRadius: 2,
                    p: 3,
                    mb: 3,
                    border: '1px solid rgba(162, 123, 92, 0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: '#A27B5C',
                      bgcolor: 'rgba(44, 54, 57, 0.9)',
                      boxShadow: '0 4px 12px rgba(162, 123, 92, 0.2)',
                    }
                  }}
                >
                  <Grid container alignItems="center">
                    <Grid item xs={12} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          src={video.thumbnailUrl}
                          variant="rounded"
                          sx={{ 
                            width: 80, 
                            height: 45,
                            bgcolor: 'rgba(162, 123, 92, 0.2)',
                            border: '2px solid rgba(162, 123, 92, 0.3)'
                          }}
                        >
                          <VideoLibraryIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle1" sx={{ color: '#DCD7C9', fontWeight: 'bold', mb: 0.5 }}>
                            {video.title}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <VisibilityIcon sx={{ fontSize: '0.9rem', color: '#A27B5C' }} />
                            <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                              {video.views || 0} views
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={4}>
                      <Box sx={{ pr: 2 }}>
                        {video.description ? (
                          <CollapsibleText 
                            text={video.description} 
                            limit={100} 
                            sx={{ color: 'rgba(220, 215, 201, 0.8)' }}
                          />
                        ) : (
                          <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.6)', fontStyle: 'italic' }}>
                            No description
                          </Typography>
                        )}
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <CalendarTodayIcon sx={{ fontSize: '1rem', color: '#A27B5C' }} />
                        <Typography variant="body2" sx={{ color: 'rgba(220, 215, 201, 0.8)' }}>
                          {new Date(video.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <IconButton
                          onClick={() => handleEdit(video)}
                          sx={{
                            color: '#A27B5C',
                            border: '1px solid #A27B5C',
                            '&:hover': {
                              bgcolor: 'rgba(162, 123, 92, 0.1)',
                            }
                          }}
                          title="Edit Video"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(video)}
                          sx={{
                            color: '#A27B5C',
                            border: '1px solid #A27B5C',
                            '&:hover': {
                              bgcolor: 'rgba(162, 123, 92, 0.1)',
                            }
                          }}
                          title="Delete Video"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              ))}
            </CardContent>
          </Paper>
        ) : (
          <Paper
            sx={{
              bgcolor: '#3F4E4F',
              p: 8,
              borderRadius: 3,
              border: '2px dashed #A27B5C',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
              textAlign: 'center'
            }}
          >
            <VideoLibraryIcon sx={{ fontSize: '6rem', color: '#A27B5C', mb: 3, opacity: 0.5 }} />
            <Typography variant="h4" sx={{ color: '#DCD7C9', mb: 2, fontWeight: 'bold' }}>
              No videos uploaded yet
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 4, maxWidth: 500, mx: 'auto' }}>
              Start building your video library by uploading your first video
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setUploadOpen(true)}
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
              Upload Your First Video
            </Button>
          </Paper>
        )}

        {/* Upload Dialog */}
        <Dialog 
          open={uploadOpen} 
          onClose={() => !uploading && setUploadOpen(false)} 
          maxWidth="sm" 
          fullWidth
          PaperProps={{
            sx: {
              bgcolor: '#3F4E4F',
              color: '#DCD7C9',
              borderRadius: 3,
              border: '2px solid #A27B5C',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)'
            }
          }}
        >
          <DialogTitle sx={{ 
            color: '#DCD7C9', 
            fontWeight: 'bold',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '2px solid rgba(162, 123, 92, 0.3)',
            pb: 2
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CloudUploadIcon sx={{ color: '#A27B5C' }} />
              Upload New Video
            </Box>
            <IconButton 
              onClick={() => setUploadOpen(false)} 
              disabled={uploading}
              sx={{ 
                color: '#A27B5C',
                '&:hover': {
                  bgcolor: 'rgba(162, 123, 92, 0.1)'
                }
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          
          <DialogContent sx={{ pt: 3 }}>
            <TextField
              autoFocus
              margin="dense"
              label="Video Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2C3639',
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
                  '&.Mui-focused': {
                    color: '#A27B5C',
                  }
                }
              }}
            />
            
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#2C3639',
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
                  '&.Mui-focused': {
                    color: '#A27B5C',
                  }
                }
              }}
            />
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#A27B5C', mb: 1, fontWeight: 'bold' }}>
                Select Video File
              </Typography>
              <Box
                sx={{
                  border: '2px dashed #A27B5C',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  bgcolor: 'rgba(44, 54, 57, 0.3)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    bgcolor: 'rgba(44, 54, 57, 0.5)',
                    borderColor: '#8a6a50',
                  }
                }}
                onClick={() => document.getElementById('video-upload').click()}
              >
                <input
                  id="video-upload"
                  type="file"
                  accept="video/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
                
                <CloudUploadIcon sx={{ fontSize: '3rem', color: '#A27B5C', mb: 2, opacity: 0.7 }} />
                
                {file ? (
                  <Box>
                    <Typography variant="body1" sx={{ color: '#DCD7C9', fontWeight: 'bold', mb: 0.5 }}>
                      {file.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Typography variant="body1" sx={{ color: '#DCD7C9', fontWeight: 'bold', mb: 1 }}>
                      Click to select video
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                      Maximum file size: 100MB • Supported formats: MP4, AVI, MOV, etc.
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </DialogContent>
          
          <DialogActions sx={{ p: 3, borderTop: '2px solid rgba(162, 123, 92, 0.3)' }}>
            <Button 
              onClick={() => setUploadOpen(false)} 
              disabled={uploading}
              sx={{ 
                color: '#A27B5C',
                borderColor: '#A27B5C',
                px: 4,
                '&:hover': {
                  bgcolor: 'rgba(162, 123, 92, 0.1)',
                }
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleUpload} 
              disabled={!file || !title || uploading}
              variant="contained"
              sx={{ 
                bgcolor: '#A27B5C', 
                color: '#2C3639',
                px: 5,
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#8a6a50',
                },
                '&.Mui-disabled': {
                  bgcolor: 'rgba(162, 123, 92, 0.3)',
                  color: 'rgba(44, 54, 57, 0.5)',
                }
              }}
            >
              {uploading ? (
                <CircularProgress size={24} sx={{ color: '#2C3639' }} />
              ) : (
                'Upload Video'
              )}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Modal */}
        <Modal open={openEdit} onClose={() => setOpenEdit(false)}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#3F4E4F', 
            p: 5, 
            borderRadius: 3, 
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            border: '3px solid #A27B5C',
            minWidth: { xs: '90%', sm: 600 },
            maxWidth: 800,
            maxHeight: '90vh',
            overflow: 'auto',
            outline: 'none'
          }}>
            {selectedVideo && (
              <EditVideo 
                video={selectedVideo} 
                onVideoUpdated={() => { 
                  setOpenEdit(false); 
                  triggerRefresh(); 
                }} 
                onClose={() => setOpenEdit(false)} 
              />
            )}
          </Box>
        </Modal>

        {/* Delete Modal */}
        <Modal open={openDelete} onClose={() => setOpenDelete(false)}>
          <Box sx={{ 
            position: 'absolute', 
            top: '50%', 
            left: '50%', 
            transform: 'translate(-50%, -50%)', 
            bgcolor: '#3F4E4F', 
            p: 5, 
            borderRadius: 3, 
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.5)',
            border: '3px solid #A27B5C',
            minWidth: { xs: '90%', sm: 500 },
            maxWidth: 600,
            outline: 'none'
          }}>
            {selectedVideo && (
              <DeleteVideo 
                video={selectedVideo} 
                onVideoDeleted={() => { 
                  setOpenDelete(false); 
                  triggerRefresh(); 
                }} 
                onClose={() => setOpenDelete(false)} 
              />
            )}
          </Box>
        </Modal>
      </Container>
    </Box>
  );
};

export default VideoManager;