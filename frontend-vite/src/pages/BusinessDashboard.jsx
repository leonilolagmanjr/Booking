import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays, Users, DollarSign, Activity,
  Clock, ChevronRight, Plus,
} from 'lucide-react';
import { dashboardService } from '../api/dashboardService';
import { formatCurrency, formatTime } from '../utils/format';
import { cn } from '../utils/cn';

const BusinessDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: res } = await dashboardService.getOwnerDashboard();
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
    { label: "Today's Bookings", value: data?.todayBookings || 0, icon: CalendarDays, color: 'text-[#C08A5D]' },
    { label: 'Revenue (This Week)', value: formatCurrency(data?.weeklyRevenue || 0), icon: DollarSign, color: 'text-emerald-400' },
    { label: 'Active Players', value: data?.activePlayers || 0, icon: Users, color: 'text-blue-400' },
    { label: 'Court Utilization', value: `${data?.courtUtilization || 0}%`, icon: Activity, color: 'text-purple-400' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white">Business Dashboard</h1>
          <p className="text-gray-400 mt-1">Your venue performance at a glance</p>
        </div>
        <Link
          to="/venues/new"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#C08A5D] text-[#0f1420] font-medium text-sm hover:bg-[#b07a4e] transition-all no-underline"
        >
          <Plus size={16} />
          Add Venue
        </Link>
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

      {/* Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-2xl bg-[#151b27] border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <Clock size={18} className="text-[#C08A5D]" />
              Today's Schedule
            </h2>
          </div>
          <div className="p-6">
            {data?.recentBookings?.length > 0 ? (
              <div className="space-y-2">
                {data.recentBookings.map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0f1420]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-[#C08A5D]" />
                      <div>
                        <p className="text-sm font-medium text-white">{booking.court?.name}</p>
                        <p className="text-xs text-gray-500">{booking.player?.name}</p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTime(booking.startTime)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">No bookings today</p>
            )}
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="rounded-2xl bg-[#151b27] border border-white/10 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <CalendarDays size={18} className="text-[#C08A5D]" />
              Upcoming Bookings
            </h2>
          </div>
          <div className="p-6">
            {data?.upcomingBookings?.length > 0 ? (
              <div className="space-y-2">
                {data.upcomingBookings.slice(0, 5).map((booking) => (
                  <div
                    key={booking._id}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0f1420]"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{booking.court?.name}</p>
                      <p className="text-xs text-gray-500">{booking.player?.name}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(booking.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm text-center py-6">No upcoming bookings</p>
            )}
          </div>
        </div>
      </div>

      {/* Venues Overview */}
      {data?.clubs?.length > 0 && (
        <div className="rounded-2xl bg-[#151b27] border border-white/10 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
            <h2 className="font-semibold text-white">Your Venues</h2>
            <Link to="/venues" className="text-sm text-[#C08A5D] hover:text-[#b07a4e] no-underline">
              Manage
            </Link>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.clubs.map((club) => (
                <Link
                  key={club.id}
                  to={`/venues/${club.id}`}
                  className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420] hover:bg-[#1a1f2e] transition-colors group no-underline"
                >
                  <div>
                    <p className="font-medium text-white">{club.name}</p>
                    <span className={cn(
                      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 border',
                      club.status === 'active'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                    )}>
                      {club.status?.charAt(0).toUpperCase() + club.status?.slice(1)}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-[#C08A5D] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessDashboard;

