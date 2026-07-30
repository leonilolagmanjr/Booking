import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL; // Backend URL

// Authentication APIs
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);
  return response.data;
};

// Job APIs
export const fetchJobs = async () => {
  const response = await axios.get(`${API_URL}/job/list`);
  return response.data;
};

export const postJob = async (jobData, token) => {
  const response = await axios.post(`${API_URL}/job/post`, jobData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchPostedJobs = async (token) => {
  const response = await axios.get(`${API_URL}/job/my-posted`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchCompletedJobs = async (token) => {
  const response = await axios.get(`${API_URL}/job/my-completed`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAcceptedJobs = async (token) => {
  const response = await axios.get(`${API_URL}/job/my-accepted`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// User APIs
export const getUserProfile = async (userId, token) => {
  const response = await axios.get(`${API_URL}/user/profile/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfile = async (profileData, token) => {
  const response = await axios.patch(`${API_URL}/user/updateprofile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Edit and Delete Job APIs
export const editJob = async (jobId, data, token) => {
  return await axios.patch(`${API_URL}/job/edit/${jobId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const deleteJob = async (jobId, token) => {
  return await axios.delete(`${API_URL}/job/remove/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const applyToJob = async (jobId, token) => {
  const response = await axios.put(`${API_URL}/job/add-candidate/${jobId}`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchCandidates = async (jobId, token) => {
  const response = await axios.get(`${API_URL}/job/candidates/${jobId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const removeCandidate = async (jobId, candidateId, token) => {
  const response = await axios.put(`${API_URL}/job/remove-candidate/${jobId}`, { candidateId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateCandidateStatus = async (jobId, applicationId, status, token) => {
  const response = await axios.patch(`${API_URL}/job/application-status/${jobId}`, { applicationId, status }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Fetch Info
export const fetchInfo = async (token) => {
  const response = await axios.get(`${API_URL}/info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update Info
export const updateInfo = async (token, updatedInfo) => {
  const response = await axios.patch(`${API_URL}/info/update`, updatedInfo, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addUserConnection = async (email, token) => {
  try {
    const response = await axios.post(
      '/api/users/add-connection',
      { email },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.connections; // Assuming the backend returns the updated connections list
  } catch (error) {
    console.error('Error adding user connection:', error);
    throw error;
  }
};

export const sendFriendRequest = async (userIdToAdd, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/friend-request/send`,
      { userIdToAdd },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }
};

export const getFriendRequests = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/friend-request`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching friend requests:', error);
    throw error;
  }
};

export const acceptFriendRequest = async (requesterId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/friend-request/accept`,
      { requesterId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }
};

export const denyFriendRequest = async (requesterId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/friend-request/deny`,
      { requesterId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error denying friend request:', error);
    throw error;
  }
};

export const cancelFriendRequest = async (targetUserId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/friend-request/cancel`,
      { targetUserId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error canceling friend request:', error);
    throw error;
  }
};

// New API call to check friend relationship status
export const checkFriendRelationshipStatus = async (userId1, userId2, token) => {
  try {
    const response = await axios.get(
      `${API_URL}/user/friend-relationship-status`,
      {
        params: { userId1, userId2 },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.status;
  } catch (error) {
    console.error('Error checking friend relationship status:', error);
    throw error;
  }
};

export const removeFriend = async (friendId, token) => {
  try {
    const response = await axios.post(
      `${API_URL}/user/friend/remove`,
      { friendId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error removing friend:', error);
    throw error;
  }
};

// Video APIs
export const fetchVideos = async (search = '') => {
  const response = await axios.get(`${API_URL}/videos?search=${search}`);
  return response.data;
};

export const fetchVideo = async (videoId) => {
  const response = await axios.get(`${API_URL}/videos/${videoId}`);
  return response.data;
};

export const fetchUserVideos = async (token) => {
  const response = await axios.get(`${API_URL}/videos/my-videos`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const uploadVideo = async (formData, token) => {
  const response = await axios.post(`${API_URL}/videos/upload`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateVideo = async (videoId, updateData, token) => {
  const response = await axios.patch(`${API_URL}/videos/${videoId}`, updateData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteVideo = async (videoId, token) => {
  const response = await axios.delete(`${API_URL}/videos/${videoId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Post APIs
export const fetchPosts = async (params = {}) => {
  const response = await axios.get(`${API_URL}/posts`, { params });
  return response.data;
};

export const fetchUserPosts = async (userId, token) => {
  const response = await axios.get(`${API_URL}/posts/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createPost = async (formData, token) => {
  const response = await axios.post(`${API_URL}/posts/create`, formData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updatePost = async (postId, data, token) => {
  const response = await axios.patch(`${API_URL}/posts/${postId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deletePost = async (postId, token) => {
  const response = await axios.delete(`${API_URL}/posts/${postId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const likePost = async (postId, token) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addComment = async (postId, data, token) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/comment`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sharePost = async (postId, token) => {
  const response = await axios.post(`${API_URL}/posts/${postId}/share`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Forum APIs
export const fetchForumGroups = async () => {
  const response = await axios.get(`${API_URL}/forum`);
  return response.data;
};

export const createForumGroup = async (data, token) => {
  const response = await axios.post(`${API_URL}/forum/create`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Upload Avatar API
export const uploadAvatar = async (formData, token) => {
  const response = await axios.post(`${API_URL}/user/upload-avatar`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Leaderboard API
export const fetchLeaderboard = async () => {
  const response = await axios.get(`${API_URL}/user/leaderboard`);
  return response.data;
};

// Notification APIs
export const fetchNotifications = async (token) => {
  const response = await axios.get(`${API_URL}/notifications`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getUnreadNotificationCount = async (token) => {
  const response = await axios.get(`${API_URL}/notifications/unread-count`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markNotificationAsRead = async (notificationId, token) => {
  const response = await axios.patch(`${API_URL}/notifications/${notificationId}/read`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markAllNotificationsAsRead = async (token) => {
  const response = await axios.patch(`${API_URL}/notifications/read-all`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Application Chat API
export const openApplicationChat = async (applicationId, token) => {
  const response = await axios.post(`${API_URL}/application-chat`, { applicationId }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Interview Data API
export const updateInterviewData = async (applicationId, data, token) => {
  const response = await axios.patch(`${API_URL}/job/interview-data/${applicationId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
