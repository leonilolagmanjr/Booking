/**
 * CourtFlow — Notification Page
 */

import React, { useState, useEffect } from 'react';
import { Bell, CheckCheck, Trash2, CalendarDays, CreditCard, AlertTriangle } from 'lucide-react';
import { notificationsApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';

export const NotificationPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await notificationsApi.list({ limit: 50 });
        setNotifications(res.data || []);
        setUnreadCount(res.unreadCount || 0);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await notificationsApi.markAsRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all as read:', err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationsApi.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error('Failed to delete notification:', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'booking_confirmed':
      case 'booking_cancelled':
      case 'booking_reminder':
      case 'booking_rescheduled':
        return <CalendarDays className="text-amber-500" size={20} />;
      case 'payment_received':
      case 'payment_failed':
        return <CreditCard className="text-emerald-500" size={20} />;
      case 'court_maintenance':
        return <AlertTriangle className="text-yellow-500" size={20} />;
      default:
        return <Bell className="text-amber-500" size={20} />;
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Notifications</h1>
          <p className="text-gray-400 mt-1">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'No unread notifications'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" icon={CheckCheck} onClick={handleMarkAllAsRead}>
            Mark All Read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <Card
              key={notification._id}
              className={!notification.read ? 'border-amber-600/20' : ''}
            >
              <CardBody>
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl ${
                    !notification.read ? 'bg-amber-600/10' : 'bg-gray-700/30'
                  }`}>
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className={`text-sm font-medium ${
                          !notification.read ? 'text-white' : 'text-gray-300'
                        }`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-0.5">{notification.message}</p>
                      </div>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(notification.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-amber-400 hover:bg-amber-600/10 transition-colors"
                        title="Mark as read"
                      >
                        <CheckCheck size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(notification._id)}
                      className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Bell className="mx-auto text-gray-600 mb-3" size={48} />
              <p className="text-gray-400">No notifications yet</p>
              <p className="text-sm text-gray-500 mt-1">
                Notifications about your bookings and payments will appear here
              </p>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

