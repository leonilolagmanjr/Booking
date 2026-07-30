import React, { createContext, useState, useEffect, useContext } from 'react';
import { checkFriendRelationshipStatus, getFriendRequests } from '../services/api';
import { useAuth } from './AuthContext';

export const FriendContext = createContext();

export const FriendProvider = ({ children }) => {
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState([]);
  const [friendStatusCache, setFriendStatusCache] = useState({}); // Cache friend status by userId
  const [openChatUserId, setOpenChatUserId] = useState(null);
  const [friendListVersion, setFriendListVersion] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchFriendRequests();
    }
  }, [user]);

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const requests = await getFriendRequests(token);
      setFriendRequests(requests);
    } catch (error) {
      console.error('Error fetching friend requests:', error);
    }
  };

  const notifyFriendListUpdated = () => {
    fetchFriendRequests();
    clearFriendStatusCache();
    setFriendListVersion(prev => prev + 1);
  };

  const clearFriendStatusCache = () => {
    setFriendStatusCache({});
  };

  const getFriendStatus = async (otherUserId) => {
    if (!user?.id) return 'none';
    const cacheKey = `${user.id}-${otherUserId}`;
    if (friendStatusCache[cacheKey]) {
      return friendStatusCache[cacheKey];
    }
    try {
      const token = localStorage.getItem('token');
      const status = await checkFriendRelationshipStatus(user.id, otherUserId, token);
      setFriendStatusCache((prev) => ({ ...prev, [cacheKey]: status }));
      return status;
    } catch (error) {
      console.error('Error getting friend status:', error);
      return 'none';
    }
  };

  const openChatWithUser = (userId) => {
    setOpenChatUserId(userId);
  };

  const clearOpenChatUser = () => {
    setOpenChatUserId(null);
  };

  return (
    <FriendContext.Provider
      value={{
        friendRequests,
        notifyFriendListUpdated,
        getFriendStatus,
        openChatWithUser,
        clearFriendStatusCache,
        openChatUserId,
        clearOpenChatUser,
        friendListUpdated: friendListVersion,
      }}
    >
      {children}
    </FriendContext.Provider>
  );
};

export const useFriend = () => useContext(FriendContext);
