import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, XCircle, Building2, ChevronRight } from 'lucide-react';
import { bookingService } from '../api/bookingService';
import { formatCurrency, formatDate, formatTime } from '../utils/format';
import { cn } from '../utils/cn';

const STATUS_COLORS = {
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'no-show': 'bg-red-500/10 text-red-400 border-red-500/20',
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const params = filter !== 'all' ? { status: filter } : { limit: 50 };
        const { data: res } = await bookingService.list(params);
        setBookings(res.data || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [filter]);

  const handleCancel = async (id) => {
    try {
      await bookingService.cancel(id, 'User requested cancellation');
      setBookings(bookings.map((b) =>
        b._id === id ? { ...b, status: 'cancelled' } : b
      ));
    } catch (err) {
      console.error('Failed to cancel:', err);
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'pending', label: 'Pending' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 mt-1">View and manage your court reservations</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 bg-[#151b27] rounded-xl p-1 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => { setFilter(tab.key); setLoading(true); }}
            className={cn(
              'px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              filter === tab.key
                ? 'bg-[#C08A5D] text-[#0f1420]'
                : 'text-gray-400 hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Booking List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C08A5D] border-t-transparent" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="rounded-2xl bg-[#151b27] border border-white/10 p-5 hover:border-[#C08A5D]/20 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-xl bg-[#C08A5D]/10">
                    <CalendarDays className="text-[#C08A5D]" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{booking.court?.name || 'Court'}</h3>
                    <p className="text-sm text-gray-500">{booking.club?.name || 'Venue'}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <CalendarDays size={12} />
                        {formatDate(booking.startTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        STATUS_COLORS[booking.status] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      )}>
                        {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                      </span>
                      <span className={cn(
                        'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border',
                        booking.paymentStatus === 'paid'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      )}>
                        {booking.paymentStatus === 'paid' ? 'Paid' : 'Unpaid'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-[#C08A5D]">
                    {formatCurrency(booking.totalAmount)}
                  </span>
                  {['pending', 'confirmed'].includes(booking.status) && (
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                      aria-label="Cancel booking"
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
          <CalendarDays size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No bookings found</h3>
          <p className="text-gray-500 text-sm mb-6">
            {filter !== 'all' ? `No ${filter} bookings yet` : 'You haven\'t made any bookings yet'}
          </p>
          <Link
            to="/venues"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-medium hover:bg-[#b07a4e] transition-all no-underline"
          >
            <Building2 size={16} />
            Browse Venues
            <ChevronRight size={16} />
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;

