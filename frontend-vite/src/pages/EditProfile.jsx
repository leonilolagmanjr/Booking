import React, { useState, useEffect } from 'react';
import { updateUserProfile, getUserProfile, updateInfo, uploadAvatar } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  Box, Card, CardContent, Typography, Avatar, Button, Divider, 
  List, ListItem, ListItemButton, ListItemText, TextField, Select, 
  MenuItem, Chip, FormControlLabel, Checkbox, Container, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import WallpaperIcon from '@mui/icons-material/Wallpaper';
import BadgeIcon from '@mui/icons-material/Badge';

const sidebarItems = [
  { name: 'Basic Information', icon: <PersonIcon /> },
  { name: 'Skills & Certifications', icon: <WorkIcon /> },
  { name: 'Preferences', icon: <SettingsIcon /> },
  { name: 'Avatar', icon: <BadgeIcon /> },
  { name: 'Profile Background', icon: <WallpaperIcon /> },
];

const EditProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState({});
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    remoteAvailability: false,
    skills: [],
    languages: [],
    certifications: [],
    newSkill: '',
    newLanguage: '',
    newCertification: '',
  });
  const [selectedSection, setSelectedSection] = useState('Basic Information');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const userProfile = await getUserProfile(user?.id, token);
        setProfile(userProfile);
        setFormData({
          name: userProfile.name || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          location: userProfile.location || '',
          remoteAvailability: userProfile.remoteAvailability || false,
          skills: userProfile.skills || [],
          languages: userProfile.languages || [],
          certifications: userProfile.certifications || [],
          newSkill: '',
          newLanguage: '',
          newCertification: '',
        });
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };

    if (user?.id) {
      fetchUserProfile();
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddItem = (field) => {
    const newItem = formData[`new${field.charAt(0).toUpperCase() + field.slice(1)}`];
    if (newItem && !formData[field].includes(newItem)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], newItem],
        [`new${field.charAt(0).toUpperCase() + field.slice(1)}`]: ''
      }));
    }
  };

  const handleRemoveItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const updateData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        location: formData.location,
        remoteAvailability: formData.remoteAvailability,
        skills: formData.skills,
        languages: formData.languages,
        certifications: formData.certifications,
      };
      
      await updateUserProfile(updateData, token);
      alert('Profile updated successfully!');
      window.location.href = '/profile';
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Error updating profile. Please try again.');
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    // Validate file type
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Only JPG and PNG files are allowed');
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const token = localStorage.getItem('token');
      const response = await uploadAvatar(formData, token);
      setProfile(prev => ({ ...prev, profileImage: response.profileImage }));
      alert('Avatar uploaded successfully!');
    } catch (err) {
      console.error('Error uploading avatar:', err);
      alert('Error uploading avatar. Please try again.');
    }
  };

  const handleCancel = () => {
    window.location.href = '/profile';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#2C3639',
      color: '#DCD7C9',
      py: 6,
    }}>
      <Container maxWidth="lg">
        <Card sx={{ 
          bgcolor: '#3F4E4F', 
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
          display: 'flex',
          minHeight: 700,
          border: '2px solid #A27B5C',
          borderRadius: 3,
          overflow: 'hidden'
        }}>
          {/* Sidebar */}
          <Box sx={{ 
            width: 280, 
            bgcolor: '#2C3639', 
            p: 3,
            borderRight: '2px solid #A27B5C',
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
          }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
              <Avatar 
                src={profile.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'} 
                sx={{ 
                  width: 100, 
                  height: 100, 
                  mb: 2, 
                  border: '4px solid #A27B5C',
                  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)'
                }} 
              />
              <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 0.5, fontWeight: 'bold' }}>
                {profile.name || 'User Name'}
              </Typography>
              <Typography variant="body2" sx={{ color: '#A27B5C', mb: 1 }}>
                Level {profile.level || 1} • {profile.experience || 0} XP
              </Typography>
            </Box>
            
            <Divider sx={{ mb: 3, bgcolor: 'rgba(162, 123, 92, 0.3)' }} />
            
            <List>
              {sidebarItems.map((item) => (
                <ListItem key={item.name} disablePadding>
                  <ListItemButton
                    selected={selectedSection === item.name}
                    onClick={() => setSelectedSection(item.name)}
                    sx={{ 
                      borderRadius: 2, 
                      color: selectedSection === item.name ? '#DCD7C9' : 'rgba(220, 215, 201, 0.7)',
                      mb: 1,
                      py: 1.5,
                      '&.Mui-selected': {
                        backgroundColor: '#A27B5C',
                        color: '#2C3639',
                        fontWeight: 'bold',
                        '&:hover': {
                          backgroundColor: '#8a6a50',
                        }
                      },
                      '&:hover': {
                        backgroundColor: 'rgba(162, 123, 92, 0.2)',
                        color: '#DCD7C9',
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      {React.cloneElement(item.icon, { 
                        sx: { fontSize: '1.2rem' }
                      })}
                      <ListItemText 
                        primary={item.name} 
                        primaryTypographyProps={{
                          fontWeight: selectedSection === item.name ? 'bold' : 'normal'
                        }}
                      />
                    </Box>
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, p: 5, position: 'relative' }}>
            <Box sx={{ mb: 4 }}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#DCD7C9', mb: 1 }}>
                Edit Profile
                <EditIcon sx={{ ml: 2, color: '#A27B5C', verticalAlign: 'middle' }} />
              </Typography>
              <Typography sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 2 }}>
                Update your profile information to help others learn more about your skills and preferences.
              </Typography>
              <Divider sx={{ mb: 3, bgcolor: 'rgba(162, 123, 92, 0.3)' }} />
            </Box>

            {/* Basic Information Section */}
            {selectedSection === 'Basic Information' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#A27B5C', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <PersonIcon /> BASIC INFORMATION
                </Typography>
                
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
                  <TextField
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{
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
                    label="Email Address"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{
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
                    label="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{
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
                    label="Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    fullWidth
                    sx={{
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
                </Box>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.remoteAvailability}
                      onChange={handleInputChange}
                      name="remoteAvailability"
                      sx={{
                        color: '#A27B5C',
                        '&.Mui-checked': {
                          color: '#A27B5C',
                        },
                      }}
                    />
                  }
                  label="Available for Remote Work"
                  sx={{ color: '#DCD7C9', mt: 3 }}
                />
              </Box>
            )}

            {/* Skills & Certifications Section */}
            {selectedSection === 'Skills & Certifications' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#A27B5C', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WorkIcon /> SKILLS & CERTIFICATIONS
                </Typography>

                {/* Skills */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 2 }}>
                    Skills
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="Add Skill"
                      name="newSkill"
                      value={formData.newSkill}
                      onChange={handleInputChange}
                      sx={{ flex: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem('skills')}
                    />
                    <Button 
                      variant="contained" 
                      onClick={() => handleAddItem('skills')}
                      startIcon={<AddIcon />}
                      sx={{ 
                        bgcolor: '#A27B5C', 
                        color: '#2C3639',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: '#8a6a50',
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.skills.map((skill, index) => (
                      <Chip
                        key={index}
                        label={skill}
                        onDelete={() => handleRemoveItem('skills', index)}
                        deleteIcon={<DeleteIcon />}
                        sx={{ 
                          bgcolor: '#2C3639', 
                          color: '#DCD7C9',
                          border: '1px solid #A27B5C',
                          '& .MuiChip-deleteIcon': {
                            color: '#A27B5C',
                            '&:hover': {
                              color: '#DCD7C9',
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Languages */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 2 }}>
                    Languages
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="Add Language"
                      name="newLanguage"
                      value={formData.newLanguage}
                      onChange={handleInputChange}
                      sx={{ flex: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem('languages')}
                    />
                    <Button 
                      variant="contained" 
                      onClick={() => handleAddItem('languages')}
                      startIcon={<AddIcon />}
                      sx={{ 
                        bgcolor: '#A27B5C', 
                        color: '#2C3639',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: '#8a6a50',
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.languages.map((language, index) => (
                      <Chip
                        key={index}
                        label={language}
                        onDelete={() => handleRemoveItem('languages', index)}
                        deleteIcon={<DeleteIcon />}
                        sx={{ 
                          bgcolor: '#2C3639', 
                          color: '#DCD7C9',
                          border: '1px solid #A27B5C',
                          '& .MuiChip-deleteIcon': {
                            color: '#A27B5C',
                            '&:hover': {
                              color: '#DCD7C9',
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                {/* Certifications */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ color: '#DCD7C9', mb: 2 }}>
                    Certifications
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                    <TextField
                      label="Add Certification"
                      name="newCertification"
                      value={formData.newCertification}
                      onChange={handleInputChange}
                      sx={{ flex: 1 }}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddItem('certifications')}
                    />
                    <Button 
                      variant="contained" 
                      onClick={() => handleAddItem('certifications')}
                      startIcon={<AddIcon />}
                      sx={{ 
                        bgcolor: '#A27B5C', 
                        color: '#2C3639',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: '#8a6a50',
                        }
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {formData.certifications.map((certification, index) => (
                      <Chip
                        key={index}
                        label={certification}
                        onDelete={() => handleRemoveItem('certifications', index)}
                        deleteIcon={<DeleteIcon />}
                        sx={{ 
                          bgcolor: '#2C3639', 
                          color: '#DCD7C9',
                          border: '1px solid #A27B5C',
                          '& .MuiChip-deleteIcon': {
                            color: '#A27B5C',
                            '&:hover': {
                              color: '#DCD7C9',
                            }
                          }
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            )}

            {/* Preferences Section */}
            {selectedSection === 'Preferences' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#A27B5C', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <SettingsIcon /> PREFERENCES
                </Typography>
                <Typography sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 3 }}>
                  Additional preference settings will be added here based on your application's requirements.
                </Typography>
              </Box>
            )}

            {/* Avatar Section */}
            {selectedSection === 'Avatar' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#A27B5C', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <BadgeIcon /> AVATAR
                </Typography>
                <Typography sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 3 }}>
                  Upload a new profile picture. The image will be cropped to a square format.
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, mb: 3 }}>
                  <Avatar
                    src={profile.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'}
                    sx={{ 
                      width: 150, 
                      height: 150, 
                      border: '4px solid #A27B5C',
                      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.3)'
                    }}
                  />
                  <Box>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="avatar-upload"
                      type="file"
                      onChange={handleAvatarUpload}
                    />
                    <label htmlFor="avatar-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<AddIcon />}
                        sx={{
                          bgcolor: '#A27B5C',
                          color: '#2C3639',
                          fontWeight: 'bold',
                          py: 1.5,
                          px: 4,
                          '&:hover': {
                            bgcolor: '#8a6a50',
                          }
                        }}
                      >
                        Upload New Avatar
                      </Button>
                    </label>
                    <Typography variant="body2" sx={{ color: 'rgba(162, 123, 92, 0.8)', mt: 2 }}>
                      Supported formats: JPG, PNG (max 5MB)
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}

            {/* Profile Background Section */}
            {selectedSection === 'Profile Background' && (
              <Box>
                <Typography variant="h5" fontWeight="bold" sx={{ color: '#A27B5C', mb: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                  <WallpaperIcon /> PROFILE BACKGROUND
                </Typography>
                <Typography sx={{ color: 'rgba(220, 215, 201, 0.7)', mb: 3 }}>
                  Profile background customization will be implemented here.
                </Typography>
              </Box>
            )}

            {/* Action Buttons */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              gap: 2, 
              mt: 6,
              pt: 4,
              borderTop: '2px solid rgba(162, 123, 92, 0.3)'
            }}>
              <Button 
                onClick={handleCancel} 
                variant="outlined" 
                sx={{ 
                  borderColor: '#A27B5C', 
                  color: '#A27B5C',
                  fontWeight: 'bold',
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    borderColor: '#8a6a50',
                    backgroundColor: 'rgba(162, 123, 92, 0.1)',
                  }
                }}
              >
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                variant="contained" 
                sx={{ 
                  bgcolor: '#A27B5C', 
                  color: '#2C3639',
                  fontWeight: 'bold',
                  px: 5,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: '#8a6a50',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
                  }
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Card>
      </Container>
    </Box>
  );
};

export default EditProfile;