import React, { useEffect, useState } from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { fetchLeaderboard } from '../../services/api';
import LevelBar from './LevelBar';

function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const getLeaderboard = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaderboard(data);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
      }
    };
    getLeaderboard();
  }, []);

  return (
    <Box sx={{ 
      bgcolor: '#3F4E4F', 
      p: 3, 
      borderRadius: '8px',
      border: '2px solid rgba(162, 123, 92, 0.3)',
      boxShadow: '0 8px 24px rgba(44, 54, 57, 0.4)'
    }}>
      <Typography
        variant="h5"
        sx={{ 
          color: '#DCD7C9', 
          textAlign: 'center', 
          mb: 3,
          fontWeight: 700,
          borderBottom: '2px solid rgba(162, 123, 92, 0.3)',
          pb: 1.5
        }}
      >
        Top Users by XP
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {leaderboard.slice(0, 5).map((user, index) => (
          <Box 
            key={user._id} 
            sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 2,
              p: 2,
              borderRadius: '8px',
              bgcolor: index < 3 ? 'rgba(162, 123, 92, 0.1)' : 'transparent',
              border: '1px solid rgba(162, 123, 92, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: 'rgba(162, 123, 92, 0.15)',
                transform: 'translateX(4px)'
              }
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: index === 0 ? '#FFD700' : 
                       index === 1 ? '#C0C0C0' : 
                       index === 2 ? '#CD7F32' : '#A27B5C', 
                fontWeight: 'bold', 
                minWidth: '40px',
                textAlign: 'center',
                fontSize: '1.25rem'
              }}
            >
              #{index + 1}
            </Typography>
            <Avatar
              src={user.profileImage || 'https://www.kindpng.com/picc/m/722-7221920_placeholder-profile-image-placeholder-png-transparent-png.png'}
              sx={{
                width: 56,
                height: 56,
                border: `3px solid ${index === 0 ? '#FFD700' : 
                                       index === 1 ? '#C0C0C0' : 
                                       index === 2 ? '#CD7F32' : '#A27B5C'}`,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography 
                variant="h6" 
                sx={{ 
                  color: '#DCD7C9',
                  fontWeight: 600,
                  mb: 0.5
                }}
              >
                {user.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#A27B5C',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  Level {user.level}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'rgba(220, 215, 201, 0.9)',
                    fontWeight: 500,
                    fontSize: '0.9rem'
                  }}
                >
                  {user.xp.toLocaleString()} XP
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: '6px', bgcolor: '#2C3639', borderRadius: '3px', overflow: 'hidden' }}>
                <Box 
                  sx={{ 
                    height: '100%', 
                    bgcolor: '#A27B5C',
                    width: `${Math.min(100, (user.xp / (user.level * 1000)) * 100)}%`,
                    borderRadius: '3px'
                  }} 
                />
              </Box>
            </Box>
          </Box>
        ))}
      </Box>
      {leaderboard.length === 0 && (
        <Typography 
          sx={{ 
            textAlign: 'center', 
            color: 'rgba(220, 215, 201, 0.7)',
            fontStyle: 'italic',
            py: 3
          }}
        >
          No leaderboard data available yet.
        </Typography>
      )}
    </Box>
  );
}

export default Leaderboard;