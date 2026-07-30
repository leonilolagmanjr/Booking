import React, { useState } from 'react';
import {
  sendFriendRequest,
  acceptFriendRequest,
  denyFriendRequest,
  cancelFriendRequest,
  getFriendRequests,
  removeFriend
} from '../../services/api';
import UserLink from '../UserLink';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  Stack,
  Chip,
  Avatar,
  CircularProgress,
  Divider,
  Paper
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import ChatIcon from '@mui/icons-material/Chat';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import PeopleIcon from '@mui/icons-material/People';

const FriendActions = ({
  userId,
  isCurrentUser,
  isFriend,
  requestSent,
  hasPendingRequest,
  loadingFriendStatus,
  openChatWithUser,
  updateFriendStatus,
  notifyFriendListUpdated,
  friendRequests = [], // for current user
}) => {
  const [loading, setLoading] = useState(false);

  // Handlers for friend actions
  const handleSendFriendRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await sendFriendRequest(userId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error sending friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelFriendRequest = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await cancelFriendRequest(userId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error canceling friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requesterId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await acceptFriendRequest(requesterId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error accepting friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDenyRequest = async (requesterId) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await denyFriendRequest(requesterId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error denying friend request:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFriend = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      await removeFriend(userId, token);
      notifyFriendListUpdated();
      await updateFriendStatus();
    } catch (err) {
      console.error('Error removing friend:', err);
    } finally {
      setLoading(false);
    }
  };

  // UI for current user: show incoming friend requests
  if (isCurrentUser) {
    return (
      <>
        {friendRequests.length > 0 && (
          <Paper
            sx={{
              mt: 3,
              bgcolor: '#3F4E4F',
              p: 3,
              borderRadius: 3,
              border: '2px solid #A27B5C',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#DCD7C9', 
                mb: 3,
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: 1.5
              }}
            >
              <PeopleIcon sx={{ color: '#A27B5C' }} />
              Friend Requests
              <Chip 
                label={friendRequests.length} 
                size="small"
                sx={{ 
                  bgcolor: 'rgba(162, 123, 92, 0.2)', 
                  color: '#DCD7C9',
                  fontWeight: 'bold',
                  ml: 1
                }} 
              />
            </Typography>
            
            <Stack spacing={2}>
              {friendRequests.map((req) => (
                <Card
                  key={req._id}
                  sx={{
                    bgcolor: '#2C3639',
                    border: '1px solid rgba(162, 123, 92, 0.3)',
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: 'rgba(162, 123, 92, 0.2)',
                            border: '1px solid #A27B5C'
                          }}
                        >
                          {req.name?.charAt(0)?.toUpperCase() || 'U'}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: '#DCD7C9', fontWeight: 'bold' }}>
                            <UserLink userId={req._id} name={req.name} />
                          </Typography>
                          {req.email && (
                            <Typography variant="caption" sx={{ color: 'rgba(220, 215, 201, 0.7)' }}>
                              {req.email}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          startIcon={<CheckIcon />}
                          onClick={() => handleAcceptRequest(req._id)}
                          disabled={loading}
                          sx={{
                            bgcolor: '#A27B5C',
                            color: '#2C3639',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            px: 2,
                            '&:hover': {
                              bgcolor: '#8a6a50',
                            }
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          startIcon={<CloseIcon />}
                          onClick={() => handleDenyRequest(req._id)}
                          disabled={loading}
                          sx={{
                            color: '#A27B5C',
                            borderColor: '#A27B5C',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            px: 2,
                            '&:hover': {
                              bgcolor: 'rgba(162, 123, 92, 0.1)',
                              borderColor: '#8a6a50',
                            }
                          }}
                        >
                          Deny
                        </Button>
                      </Stack>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </Paper>
        )}
      </>
    );
  }

  // UI for other users: friend actions
  if (loadingFriendStatus || loading) {
    return (
      <Button
        variant="contained"
        disabled
        sx={{
          bgcolor: 'rgba(162, 123, 92, 0.3)',
          color: 'rgba(44, 54, 57, 0.5)',
          py: 1.5,
          px: 4,
          borderRadius: 2,
          fontWeight: 'bold',
          width: '100%'
        }}
      >
        <CircularProgress size={20} sx={{ mr: 1, color: '#2C3639' }} />
        Loading...
      </Button>
    );
  }

  if (isFriend) {
    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Button
          variant="contained"
          startIcon={<ChatIcon />}
          onClick={() => openChatWithUser(userId)}
          sx={{
            bgcolor: '#A27B5C',
            color: '#2C3639',
            py: 1.5,
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
          Message
        </Button>
        <Button
          variant="outlined"
          startIcon={<PersonRemoveIcon />}
          onClick={handleRemoveFriend}
          disabled={loading}
          sx={{
            color: '#A27B5C',
            borderColor: '#A27B5C',
            borderWidth: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'rgba(162, 123, 92, 0.1)',
              borderColor: '#8a6a50',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(162, 123, 92, 0.2)',
            },
          }}
        >
          Remove Friend
        </Button>
      </Stack>
    );
  }

  if (requestSent) {
    return (
      <Stack spacing={2} sx={{ width: '100%' }}>
        <Button
          variant="contained"
          disabled
          sx={{
            bgcolor: 'rgba(162, 123, 92, 0.3)',
            color: 'rgba(44, 54, 57, 0.7)',
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            border: '2px solid rgba(162, 123, 92, 0.3)',
          }}
        >
          <CheckIcon sx={{ mr: 1 }} />
          Request Sent
        </Button>
        <Button
          variant="outlined"
          onClick={handleCancelFriendRequest}
          disabled={loading}
          sx={{
            color: '#A27B5C',
            borderColor: '#A27B5C',
            borderWidth: 2,
            py: 1.5,
            borderRadius: 2,
            fontWeight: 'bold',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              bgcolor: 'rgba(162, 123, 92, 0.1)',
              borderColor: '#8a6a50',
              transform: 'translateY(-2px)',
              boxShadow: '0 8px 24px rgba(162, 123, 92, 0.2)',
            },
          }}
        >
          Cancel Request
        </Button>
      </Stack>
    );
  }

  if (hasPendingRequest) {
    return (
      <Button
        variant="contained"
        disabled
        sx={{
          bgcolor: 'rgba(162, 123, 92, 0.3)',
          color: 'rgba(44, 54, 57, 0.7)',
          py: 1.5,
          borderRadius: 2,
          fontWeight: 'bold',
          border: '2px solid rgba(162, 123, 92, 0.3)',
          width: '100%'
        }}
      >
        Request Pending
      </Button>
    );
  }

  return (
    <Button
      variant="contained"
      startIcon={<PersonAddIcon />}
      onClick={handleSendFriendRequest}
      disabled={loading}
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
        width: '100%',
        '&:hover': {
          bgcolor: '#8a6a50',
          borderColor: '#8a6a50',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 24px rgba(162, 123, 92, 0.4)',
        },
      }}
    >
      Add Friend
    </Button>
  );
};

export default FriendActions;