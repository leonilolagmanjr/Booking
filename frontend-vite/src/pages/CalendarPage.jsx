import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../utils/cn';

const CalendarPage = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [view, setView] = useState('month'); // month | week

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const prevMonth = () => setCurrentMonth(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(year, month + 1, 1));

  // Mock bookings
  const mockBookings = [
    { date: 5, court: 'Court 1', time: '09:00 - 10:00', status: 'confirmed' },
    { date: 8, court: 'Court 2', time: '14:00 - 15:00', status: 'confirmed' },
    { date: 12, court: 'Court 1', time: '16:00 - 17:00', status: 'pending' },
    { date: 15, court: 'Court 3', time: '10:00 - 11:00', status: 'confirmed' },
    { date: 20, court: 'Court 1', time: '08:00 - 09:00', status: 'pending' },
  ];

  const getBookingsForDay = (day) => mockBookings.filter((b) => b.date === day);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Calendar</h1>
        <p className="text-gray-400 mt-1">View your bookings on a calendar</p>
      </div>

      {/* View Toggle */}
      <div className="flex items-center gap-2 bg-[#151b27] rounded-xl p-1 w-fit">
        <button
          onClick={() => setView('month')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            view === 'month' ? 'bg-[#C08A5D] text-[#0f1420]' : 'text-gray-400 hover:text-white'
          )}
        >
          Month
        </button>
        <button
          onClick={() => setView('week')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-medium transition-all',
            view === 'week' ? 'bg-[#C08A5D] text-[#0f1420]' : 'text-gray-400 hover:text-white'
          )}
        >
          Week
        </button>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevMonth}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#151b27] transition-all"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-white">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-[#151b27] transition-all"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="rounded-2xl bg-[#151b27] border border-white/10 overflow-hidden">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 border-b border-white/5">
          {weekDays.map((day) => (
            <div key={day} className="px-3 py-2.5 text-xs font-medium text-gray-500 text-center">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 border-b border-r border-white/5" />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
            const dayBookings = getBookingsForDay(day);
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

            return (
              <div
                key={day}
                className={cn(
                  'min-h-[100px] p-2 border-b border-r border-white/5 transition-colors',
                  isToday ? 'bg-[#C08A5D]/5' : 'hover:bg-white/5'
                )}
              >
                <div className={cn(
                  'flex items-center justify-center w-7 h-7 rounded-full text-sm mb-1',
                  isToday ? 'bg-[#C08A5D] text-[#0f1420] font-bold' : 'text-gray-400'
                )}>
                  {day}
                </div>
                <div className="space-y-1">
                  {dayBookings.map((booking, i) => (
                    <div
                      key={i}
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] font-medium truncate',
                        booking.status === 'confirmed'
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : 'bg-amber-500/15 text-amber-400'
                      )}
                    >
                      {booking.court} - {booking.time}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bookings Legend */}
      <div className="rounded-2xl bg-[#151b27] border border-white/10 p-5">
        <h3 className="font-semibold text-white mb-3">Your Bookings This Month</h3>
        {mockBookings.length > 0 ? (
          <div className="space-y-2">
            {mockBookings.map((booking, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[#0f1420]">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    'w-2 h-2 rounded-full',
                    booking.status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'
                  )} />
                  <div>
                    <p className="text-sm font-medium text-white">{booking.court}</p>
                    <p className="text-xs text-gray-500">{booking.time}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(currentMonth.getFullYear(), currentMonth.getMonth(), booking.date)
                    .toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">No bookings this month</p>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;

