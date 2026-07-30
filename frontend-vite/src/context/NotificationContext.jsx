import React, { createContext, useState, useEffect, useContext } from 'react';
import { fetchNotifications, getUnreadNotificationCount, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';
import { useAuth } from './AuthContext';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUnreadCount();
    }
  }, [user]);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await getUnreadNotificationCount(token);
      setUnreadCount(data.count);
    } catch (error) {
      console.error('Error fetching unread notification count:', error);
    }
  };

  const loadNotifications = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const data = await fetchNotifications(token);
      setNotifications(data);
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('token');
      await markNotificationAsRead(notificationId, token);
      setNotifications(prev =>
        prev.map(n => n._id === notificationId ? { ...n, read: true } : n)
      );
      await fetchUnreadCount();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await markAllNotificationsAsRead(token);
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        loadNotifications,
        markAsRead,
        markAllAsRead,
        fetchUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);