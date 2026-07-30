/**
 * CourtFlow — Booking Calendar & Time Slot Picker
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, CalendarDays } from 'lucide-react';
import { courtsApi, bookingsApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';

export const BookingCalendar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const courtId = searchParams.get('court');
  const clubId = searchParams.get('club');

  const [court, setCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!courtId) return;
    const fetch = async () => {
      try {
        const { data: res } = await courtsApi.getById(courtId);
        setCourt(res.data);
      } catch (err) {
        console.error('Failed to load court:', err);
      }
    };
    fetch();
  }, [courtId]);

  useEffect(() => {
    if (!courtId || !selectedDate) return;
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const { data: res } = await courtsApi.getAvailability(courtId, {
          date: selectedDate,
          duration: 60,
        });
        setSlots(res.data?.slots || []);
      } catch (err) {
        console.error('Failed to load slots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSlots();
  }, [courtId, selectedDate]);

  const handleBook = async () => {
    if (!selectedSlot) return;
    setBooking(true);
    try {
      const startTime = `${selectedDate}T${selectedSlot.time}:00.000Z`;
      const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();

      await bookingsApi.create({
        clubId,
        courtId,
        date: selectedDate,
        startTime,
        endTime,
      });
      navigate('/bookings');
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setBooking(false);
    }
  };

  const nextDays = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    nextDays.push(d);
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Book a Court</h1>
        {court && (
          <p className="text-gray-400 mt-1">
            {court.name} — ₱{court.hourlyRate}/hr
          </p>
        )}
      </div>

      {/* Date Picker */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-amber-500" />
            <h2 className="font-semibold text-white">Select Date</h2>
          </div>
        </CardHeader>
        <CardBody>
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
                  className={`
                    flex flex-col items-center p-3 min-w-[60px] rounded-xl transition-all
                    ${isSelected
                      ? 'bg-amber-600 text-white'
                      : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700'
                    }
                  `}
                >
                  <span className="text-xs font-medium">{dayName}</span>
                  <span className="text-lg font-bold">{dayNum}</span>
                  {isToday && <span className="text-[10px] font-medium opacity-70">Today</span>}
                </button>
              );
            })}
          </div>
        </CardBody>
      </Card>

      {/* Time Slots */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-amber-500" />
            <h2 className="font-semibold text-white">Available Times</h2>
          </div>
        </CardHeader>
        <CardBody>
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-500 border-t-transparent" />
            </div>
          ) : slots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {slots.map((slot) => {
                if (slot.isPast) return null;
                const isAvailable = slot.available;
                const isSelected = selectedSlot?.time === slot.time;

                return (
                  <button
                    key={slot.time}
                    disabled={!isAvailable}
                    onClick={() => setSelectedSlot(slot)}
                    className={`
                      py-3 px-2 rounded-xl text-sm font-medium transition-all
                      ${isSelected
                        ? 'bg-amber-600 text-white ring-2 ring-amber-400'
                        : isAvailable
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white border border-gray-700'
                          : 'bg-gray-800/30 text-gray-600 cursor-not-allowed line-through'
                      }
                    `}
                  >
                    {slot.time}
                    {isAvailable && <span className="block text-[10px] text-gray-500">Available</span>}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="mx-auto text-gray-600 mb-2" size={32} />
              <p className="text-gray-500">No available slots for this date</p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Booking Confirmation */}
      {selectedSlot && (
        <Card className="border-amber-600/30">
          <CardBody>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-white">Confirm Booking</h3>
                <p className="text-sm text-gray-400 mt-1">
                  {new Date(selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long', month: 'long', day: 'numeric'
                  })} at {selectedSlot.time}
                  {court && ` — ₱${court.hourlyRate}`}
                </p>
              </div>
              <Button onClick={handleBook} loading={booking}>
                Confirm Booking
              </Button>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

