import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Clock, Building2, ChevronRight,
  TrendingUp, Activity, Star, Trophy,
} from 'lucide-react';
import { dashboardService } from '../api/dashboardService';
import { formatDate, formatTime, formatCurrency } from '../utils/format';
import { cn } from '../utils/cn';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await dashboardService.getPlayerDashboard();
        setData(res.data);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C08A5D] border-t-transparent" />
      </div>
    );
  }

  const stats = [
    { label: 'Total Bookings', value: data?.totalBookings || 0, icon: CalendarDays, color: 'text-[#C08A5D]' },
    { label: 'Upcoming', value: data?.upcomingBookings?.length || 0, icon: Clock, color: 'text-emerald-400' },
    { label: 'Saved Venues', value: data?.savedClubs?.length || 0, icon: Building2, color: 'text-blue-400' },
    { label: 'This Month', value: data?.monthlyBookings || 0, icon: Activity, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Your booking activity at a glance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-[#151b27] border border-white/10 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={cn('p-3 rounded-xl bg-[#C08A5D]/10', stat.color)}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Bookings */}
      <div className="rounded-2xl bg-[#151b27] border border-white/10 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-[#C08A5D]" />
            <h2 className="font-semibold text-white">Upcoming Bookings</h2>
          </div>
          <Link to="/bookings" className="text-sm text-[#C08A5D] hover:text-[#b07a4e] transition-colors no-underline">
            View all
          </Link>
        </div>
        <div className="p-6">
          {data?.upcomingBookings?.length > 0 ? (
            <div className="space-y-3">
              {data.upcomingBookings.map((booking) => (
                <div
                  key={booking._id}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420] hover:bg-[#1a1f2e] transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-[#C08A5D]/10">
                      <Trophy size={20} className="text-[#C08A5D]" />
                    </div>
                    <div>
                      <p className="font-medium text-white">{booking.court?.name}</p>
                      <p className="text-sm text-gray-500">{booking.club?.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                        <CalendarDays size={12} />
                        {formatDate(booking.startTime)}
                        <Clock size={12} />
                        {formatTime(booking.startTime)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={cn(
                      'px-2.5 py-0.5 rounded-full text-xs font-medium border',
                      booking.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    )}>
                      {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                    </span>
                    <ChevronRight size={16} className="text-gray-600" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarDays size={40} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 mb-2">No upcoming bookings</p>
              <Link
                to="/venues"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-[#C08A5D]/30 text-[#C08A5D] text-sm font-medium hover:bg-[#C08A5D]/10 transition-all no-underline"
              >
                Browse Venues
                <ChevronRight size={14} />
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity & Quick Book */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
          <h2 className="font-semibold text-white mb-4">Recent Bookings</h2>
          {data?.recentBookings?.length > 0 ? (
            <div className="space-y-2">
              {data.recentBookings.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-sm text-white">{booking.court?.name}</p>
                    <p className="text-xs text-gray-500">{formatDate(booking.startTime)}</p>
                  </div>
                  <span className={cn(
                    'text-xs font-medium',
                    booking.status === 'completed' ? 'text-emerald-400' :
                    booking.status === 'cancelled' ? 'text-red-400' : 'text-amber-400'
                  )}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm text-center py-4">No recent bookings</p>
          )}
        </div>

        {/* Quick Book */}
        <div className="rounded-2xl bg-gradient-to-br from-[#C08A5D]/10 to-[#b07a4e]/5 border border-[#C08A5D]/20 p-6">
          <h2 className="font-semibold text-white mb-2">Quick Booking</h2>
          <p className="text-sm text-gray-400 mb-6">Book a court in seconds</p>
          <Link
            to="/venues"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] transition-all no-underline"
          >
            <Building2 size={18} />
            Find a Venue
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

