import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PostItem from './PostItem';
import { fetchPosts, fetchUserPosts } from '../../services/api';

const Posts = ({ refreshTrigger, userId, type, category, groupId, onPostUpdate }) => {
  const [posts, setPosts] = useState([]);
  const [internalRefresh, setInternalRefresh] = useState(0);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        let data;
        const token = localStorage.getItem('token');
        if (userId) {
          data = await fetchUserPosts(userId, token);
        } else {
          const params = {};
          if (type) params.type = type;
          if (category) params.category = category;
          if (groupId) params.groupId = groupId;
          data = await fetchPosts(params);
        }
        setPosts(data);
      } catch (err) {
        console.error('Error fetching posts:', err);
      }
    };
    loadPosts();
  }, [refreshTrigger, internalRefresh, userId, type, category, groupId]);

  const handlePostUpdated = () => {
    setInternalRefresh(prev => prev + 1);
    if (onPostUpdate) onPostUpdate();
  };

  return (
    <Box>
      {posts.length === 0 ? (
        <Box sx={{ 
          textAlign: 'center', 
          py: 4,
          bgcolor: '#3F4E4F',
          borderRadius: '8px',
          border: '2px dashed rgba(162, 123, 92, 0.3)',
          mx: 'auto',
          maxWidth: '70%'
        }}>
          <Typography sx={{ 
            color: '#A27B5C', 
            fontSize: '1.1rem',
            fontStyle: 'italic',
            mb: 1
          }}>
            No posts yet.
          </Typography>
          <Typography sx={{ 
            color: 'rgba(220, 215, 201, 0.8)',
            fontSize: '0.95rem'
          }}>
            Be the first to post!
          </Typography>
        </Box>
      ) : (
        posts.map((post) => (
          <PostItem key={post._id} post={post} onPostUpdated={handlePostUpdated} />
        ))
      )}
    </Box>
  );
};

export default Posts;