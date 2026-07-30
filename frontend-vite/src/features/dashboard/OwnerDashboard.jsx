/**
 * CourtFlow — Owner Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Users, DollarSign, Activity,
  Clock, ChevronRight, TrendingUp, Plus,
} from 'lucide-react';
import { dashboardApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const OwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await dashboardApi.getOwnerDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Owner Dashboard</h1>
          <p className="text-gray-400 mt-1">Your club performance at a glance</p>
        </div>
        <Link to="/clubs/new">
          <Button icon={Plus}>Add Club</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Today's Bookings</p>
                <p className="text-2xl font-bold text-white mt-1">{data?.todayBookings || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-600/10">
                <CalendarDays className="text-amber-500" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Weekly Revenue</p>
                <p className="text-2xl font-bold text-white mt-1">
                  ₱{(data?.weeklyRevenue || 0).toLocaleString()}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-600/10">
                <DollarSign className="text-emerald-500" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Active Players</p>
                <p className="text-2xl font-bold text-white mt-1">{data?.activePlayers || 0}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-600/10">
                <Users className="text-blue-500" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Court Utilization</p>
                <p className="text-2xl font-bold text-white mt-1">{data?.courtUtilization || 0}%</p>
              </div>
              <div className="p-3 rounded-xl bg-purple-600/10">
                <Activity className="text-purple-500" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Today's Schedule</h2>
          </CardHeader>
          <CardBody>
            {data?.recentBookings?.length > 0 ? (
              <div className="space-y-2">
                {data.recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-500" />
                      <div>
                        <p className="text-sm font-medium text-white">{booking.court?.name}</p>
                        <p className="text-xs text-gray-400">{booking.player?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-400">
                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No bookings today</p>
            )}
          </CardBody>
        </Card>

        {/* Upcoming */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold text-white">Upcoming Bookings</h2>
          </CardHeader>
          <CardBody>
            {data?.upcomingBookings?.length > 0 ? (
              <div className="space-y-2">
                {data.upcomingBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-900/50"
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-medium text-white">{booking.court?.name}</p>
                        <p className="text-xs text-gray-400">{booking.player?.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={12} className="text-gray-500" />
                      <span className="text-xs text-gray-400">
                        {new Date(booking.startTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No upcoming bookings</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Clubs Overview */}
      {data?.clubs?.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Your Clubs</h2>
              <Link to="/clubs" className="text-sm text-amber-500 hover:text-amber-400">
                Manage
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.clubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/clubs/${club.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors group"
                >
                  <div>
                    <p className="font-medium text-white">{club.name}</p>
                    <StatusBadge status={club.status} />
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400" />
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

