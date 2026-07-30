// src/pages/Auth.js
import React, { useState } from 'react';
import { registerUser, loginUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import SliderCaptcha from '../components/SliderCaptcha';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Link,
  Alert,
  Container,
  Fade,
} from '@mui/material';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ 
    name: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [message, setMessage] = useState('');
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match for registration
    if (!isLogin && formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    try {
      if (isLogin) {
        // Login with name instead of email
        const response = await loginUser({ 
          name: formData.name, 
          password: formData.password 
        });
        login(response.user, response.token);
        setMessage(`Login successful! Welcome, ${response.user.name}`);
      } else {
        // Register with name instead of email
        const response = await registerUser({
          name: formData.name,
          password: formData.password
        });
        login(response.user, response.token);
        setMessage(`Registration successful! Welcome, ${response.user.name}`);
      }
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);
    } catch (err) {
      setMessage(err.response?.data?.msg || 'An error occurred. Please try again.');
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setMessage('');
    setCaptchaVerified(false);
    // Clear form data when toggling
    setFormData({ name: '', password: '', confirmPassword: '' });
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ 
        bgcolor: '#2C3639',
        backgroundImage: `
          radial-gradient(circle at 20% 80%, rgba(162, 123, 92, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(63, 78, 79, 0.15) 0%, transparent 50%)
        `,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(44, 54, 57, 0.8) 0%, rgba(63, 78, 79, 0.6) 100%)',
          zIndex: 0,
        }
      }}
    >
      <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in timeout={600}>
          <Paper
            elevation={0}
            sx={{
              padding: { xs: 3, sm: 5, md: 6 },
              borderRadius: 3,
              width: '100%',
              maxWidth: 500,
              margin: '0 auto',
              textAlign: 'center',
              bgcolor: '#3F4E4F',
              color: '#DCD7C9',
              border: '2px solid #A27B5C',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
              position: 'relative',
              overflow: 'hidden',
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
            <Box sx={{ position: 'relative', zIndex: 2 }}>
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  color: '#DCD7C9',
                  fontWeight: 'bold',
                  mb: 4,
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                  position: 'relative',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -12,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    background: 'linear-gradient(90deg, #A27B5C 0%, #8a6a50 100%)',
                    borderRadius: '2px',
                  }
                }}
              >
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </Typography>
              
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  color: '#A27B5C',
                  mb: 5,
                  fontSize: '1.1rem',
                  fontStyle: 'italic'
                }}
              >
                {isLogin ? 'Sign in to your account' : 'Join our community today'}
              </Typography>
              
              {message && (
                <Alert 
                  severity={message.includes('successful') ? 'success' : 'error'} 
                  sx={{ 
                    marginBottom: 3,
                    bgcolor: message.includes('successful') ? 'rgba(162, 123, 92, 0.2)' : 'rgba(220, 53, 69, 0.2)',
                    color: '#DCD7C9',
                    border: message.includes('successful') ? '1px solid #A27B5C' : '1px solid #dc3545',
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      color: message.includes('successful') ? '#A27B5C' : '#dc3545'
                    }
                  }}
                >
                  {message}
                </Alert>
              )}
              
              <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
              >
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C3639',
                      color: '#DCD7C9',
                      borderRadius: 2,
                      border: '2px solid rgba(162, 123, 92, 0.3)',
                      transition: 'all 0.3s ease',
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
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    }
                  }}
                />
                
                <TextField
                  label="Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#2C3639',
                      color: '#DCD7C9',
                      borderRadius: 2,
                      border: '2px solid rgba(162, 123, 92, 0.3)',
                      transition: 'all 0.3s ease',
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
                    },
                    '& .MuiOutlinedInput-notchedOutline': {
                      border: 'none',
                    }
                  }}
                />
                
                {!isLogin && (
                  <TextField
                    label="Confirm Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={formData.confirmPassword !== '' && formData.password !== formData.confirmPassword}
                    helperText={
                      formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                        ? 'Passwords do not match' 
                        : ''
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#2C3639',
                        color: '#DCD7C9',
                        borderRadius: 2,
                        border: formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                          ? '2px solid #dc3545' 
                          : '2px solid rgba(162, 123, 92, 0.3)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          borderColor: formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                            ? '#dc3545' 
                            : 'rgba(162, 123, 92, 0.5)',
                        },
                        '&.Mui-focused': {
                          borderColor: formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                            ? '#dc3545' 
                            : '#A27B5C',
                          boxShadow: formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                            ? '0 0 0 4px rgba(220, 53, 69, 0.1)' 
                            : '0 0 0 4px rgba(162, 123, 92, 0.1)',
                        }
                      },
                      '& .MuiInputLabel-root': {
                        color: formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                          ? '#dc3545' 
                          : '#A27B5C',
                        '&.Mui-focused': {
                          color: formData.confirmPassword !== '' && formData.password !== formData.confirmPassword 
                            ? '#dc3545' 
                            : '#A27B5C',
                        }
                      },
                      '& .MuiFormHelperText-root': {
                        color: '#dc3545',
                        marginLeft: 0,
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        border: 'none',
                      }
                    }}
                  />
                )}
                
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
                  <SliderCaptcha onPass={() => setCaptchaVerified(true)} />
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={!captchaVerified}
                  sx={{
                    bgcolor: '#A27B5C',
                    color: '#2C3639',
                    py: 1.5,
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
                    '&:active': {
                      transform: 'translateY(0) scale(0.98)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'rgba(162, 123, 92, 0.3)',
                      color: 'rgba(44, 54, 57, 0.5)',
                      borderColor: 'rgba(162, 123, 92, 0.2)',
                    }
                  }}
                >
                  {isLogin ? 'Sign In' : 'Create Account'}
                </Button>
              </Box>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  marginTop: 4, 
                  color: 'rgba(220, 215, 201, 0.8)',
                  fontSize: '1rem'
                }}
              >
                {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
                <Link
                  component="button"
                  onClick={toggleForm}
                  sx={{ 
                    color: '#A27B5C', 
                    fontWeight: 'bold',
                    textDecoration: 'none',
                    fontSize: '1.05rem',
                    '&:hover': {
                      color: '#DCD7C9',
                      textDecoration: 'underline',
                    }
                  }}
                >
                  {isLogin ? 'Register here' : 'Sign in here'}
                </Link>
              </Typography>
              
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block',
                  marginTop: 3, 
                  color: 'rgba(220, 215, 201, 0.5)',
                  fontSize: '0.85rem'
                }}
              >
                By continuing, you agree to our Terms of Service and Privacy Policy
              </Typography>
            </Box>
          </Paper>
        </Fade>
        
        <Typography 
          variant="body2" 
          sx={{ 
            textAlign: 'center',
            mt: 4,
            color: 'rgba(220, 215, 201, 0.6)',
            fontSize: '0.9rem'
          }}
        >
          © {new Date().getFullYear()} Job Connect Platform. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Auth;