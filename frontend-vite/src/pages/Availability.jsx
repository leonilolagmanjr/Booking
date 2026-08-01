import React, { useState } from 'react';
import { Clock, CalendarDays, CheckCircle, XCircle } from 'lucide-react';
import { cn } from '../utils/cn';
import { formatTimeSlot } from '../utils/format';

const Availability = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedVenue, setSelectedVenue] = useState('');

  const nextDays = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    nextDays.push(d);
  }

  // Mock data for demonstration
  const mockSlots = [
    { time: '06:00', available: true },
    { time: '07:00', available: true },
    { time: '08:00', available: false },
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '12:00', available: false },
    { time: '13:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
    { time: '17:00', available: true },
    { time: '18:00', available: true },
    { time: '19:00', available: true },
    { time: '20:00', available: false },
    { time: '21:00', available: false },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Availability</h1>
        <p className="text-gray-400 mt-1">Check court availability by date</p>
      </div>

      {/* Date Picker */}
      <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CalendarDays size={18} className="text-[#C08A5D]" />
          <h2 className="font-semibold text-white">Select Date</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {nextDays.map((d) => {
            const dateStr = d.toISOString().split('T')[0];
            const isToday = dateStr === new Date().toISOString().split('T')[0];
            const isSelected = dateStr === selectedDate;
            const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = d.getDate();

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={cn(
                  'flex flex-col items-center p-3 min-w-[60px] rounded-xl transition-all',
                  isSelected
                    ? 'bg-[#C08A5D] text-white'
                    : 'bg-[#0f1420] text-gray-400 hover:bg-[#1a1f2e]'
                )}
              >
                <span className="text-xs font-medium">{dayName}</span>
                <span className="text-lg font-bold">{dayNum}</span>
                {isToday && <span className="text-[10px] font-medium opacity-70">Today</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Available Slots */}
      <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock size={18} className="text-[#C08A5D]" />
          <h2 className="font-semibold text-white">
            Available Slots for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
          {mockSlots.map((slot) => (
            <div
              key={slot.time}
              className={cn(
                'py-3 px-2 rounded-xl text-sm font-medium text-center border transition-all',
                slot.available
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                  : 'bg-red-500/5 border-red-500/10 text-red-400/50 line-through'
              )}
            >
              <span className="block">{formatTimeSlot(slot.time)}</span>
              <span className="block text-[10px] mt-0.5">
                {slot.available ? 'Available' : 'Unavailable'}
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-4 mt-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <CheckCircle size={12} className="text-emerald-400" />
            Available
          </span>
          <span className="flex items-center gap-1">
            <XCircle size={12} className="text-red-400" />
            Unavailable
          </span>
        </div>
      </div>
    </div>
  );
};

export default Availability;

