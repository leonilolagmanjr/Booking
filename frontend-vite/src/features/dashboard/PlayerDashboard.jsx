/**
 * CourtFlow — Player Dashboard
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Building2, Trophy, ChevronRight } from 'lucide-react';
import { dashboardApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';

export const PlayerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await dashboardApi.getPlayerDashboard();
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
      <div>
        <h1 className="text-2xl font-bold text-white">My Dashboard</h1>
        <p className="text-gray-400 mt-1">Your booking activity at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Bookings</p>
                <p className="text-2xl font-bold text-white mt-1">{data?.totalBookings || 0}</p>
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
                <p className="text-sm text-gray-400">Upcoming</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {data?.upcomingBookings?.length || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-600/10">
                <Clock className="text-emerald-500" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Saved Clubs</p>
                <p className="text-2xl font-bold text-white mt-1">
                  {data?.savedClubs?.length || 0}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-600/10">
                <Building2 className="text-blue-500" size={24} />
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Upcoming Bookings */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming Bookings</h2>
            <Link to="/bookings" className="text-sm text-amber-500 hover:text-amber-400">
              View all
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          {data?.upcomingBookings?.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingBookings.map((booking) => (
                <Link
                  key={booking._id}
                  to={`/bookings/${booking._id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-amber-600/10">
                      <Trophy className="text-amber-500" size={20} />
                    </div>
                    <div>
                      <p className="font-medium text-white">{booking.court?.name}</p>
                      <p className="text-sm text-gray-400">{booking.club?.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <CalendarDays size={12} />
                        {new Date(booking.startTime).toLocaleDateString()}
                        <Clock size={12} />
                        {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <StatusBadge status={booking.status} />
                    <ChevronRight size={16} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays className="mx-auto text-gray-600 mb-3" size={40} />
              <p className="text-gray-400">No upcoming bookings</p>
              <Link to="/clubs">
                <Button variant="outline" className="mt-4" size="sm">Browse Clubs</Button>
              </Link>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Saved Clubs */}
      {data?.savedClubs?.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Saved Clubs</h2>
              <Link to="/clubs" className="text-sm text-amber-500 hover:text-amber-400">
                Browse all
              </Link>
            </div>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {data.savedClubs.map((club) => (
                <Link
                  key={club._id}
                  to={`/clubs/${club._id}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-amber-600/20 flex items-center justify-center">
                    <Building2 className="text-amber-500" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-white text-sm">{club.name}</p>
                    {club.address?.city && (
                      <p className="text-xs text-gray-400">{club.address.city}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

