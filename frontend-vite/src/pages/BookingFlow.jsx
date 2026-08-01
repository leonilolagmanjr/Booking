import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  ChevronLeft, ChevronRight, Clock, CalendarDays,
  CheckCircle, CreditCard, MapPin, Building2, ArrowLeft,
} from 'lucide-react';
import { venueService } from '../api/venueService';
import { courtService } from '../api/courtService';
import { bookingService } from '../api/bookingService';
import { formatCurrency, formatTimeSlot } from '../utils/format';
import { cn } from '../utils/cn';

const STEPS = ['Venue', 'Court', 'Date & Time', 'Review', 'Payment', 'Confirmation'];

const BookingFlow = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const venueId = searchParams.get('venue');

  const [step, setStep] = useState(0);
  const [venue, setVenue] = useState(null);
  const [courts, setCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  useEffect(() => {
    if (!venueId) return;
    const fetchVenue = async () => {
      try {
        const { data: res } = await venueService.getById(venueId);
        setVenue(res.data);
        setCourts(res.data.courts || []);
      } catch (err) {
        console.error('Failed to load venue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [venueId]);

  useEffect(() => {
    if (!selectedCourt || !selectedDate) return;
    const fetchSlots = async () => {
      setLoading(true);
      try {
        const { data: res } = await courtService.getAvailability(selectedCourt, {
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
  }, [selectedCourt, selectedDate]);

  const handleBook = async () => {
    if (!selectedSlot || !selectedCourt || !selectedDate) return;
    setBooking(true);
    try {
      const startTime = `${selectedDate}T${selectedSlot.time}:00.000Z`;
      const endTime = new Date(new Date(startTime).getTime() + 60 * 60 * 1000).toISOString();

      await bookingService.create({
        clubId: venueId,
        courtId: selectedCourt,
        date: selectedDate,
        startTime,
        endTime,
      });
      setBookingComplete(true);
      setStep(5);
    } catch (err) {
      console.error('Booking failed:', err);
    } finally {
      setBooking(false);
    }
  };

  const nextStep = () => setStep(Math.min(step + 1, 5));
  const prevStep = () => setStep(Math.max(step - 1, 0));

  const nextDays = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    nextDays.push(d);
  }

  const court = Array.isArray(courts) ? courts.find((c) => c._id === selectedCourt) : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  i < step ? 'bg-[#C08A5D] text-[#0f1420]' :
                  i === step ? 'bg-[#C08A5D]/20 border border-[#C08A5D]/50 text-[#C08A5D]' :
                  'bg-[#151b27] border border-white/10 text-gray-500'
                )}
              >
                {i < step ? <CheckCircle size={14} /> : i + 1}
              </div>
              <span className={cn(
                'text-xs font-medium hidden sm:block',
                i <= step ? 'text-white' : 'text-gray-600'
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'w-8 sm:w-12 h-0.5 mx-2',
                i < step ? 'bg-[#C08A5D]' : 'bg-white/10'
              )} />
            )}
          </div>
        ))}
      </div>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C08A5D] border-t-transparent" />
        </div>
      )}

      {!venueId && !loading && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">No Venue Selected</h2>
          <p className="text-gray-500 mb-6">Please select a venue to begin booking.</p>
          <Link to="/venues" className="px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-medium hover:bg-[#b07a4e] no-underline">
            Browse Venues
          </Link>
        </div>
      )}

      {venue && !loading && (
        <>
          {/* Step 0: Venue Review */}
          {step === 0 && (
            <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Confirm Venue</h2>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#0f1420]">
                <div className="w-14 h-14 rounded-xl bg-[#C08A5D]/10 flex items-center justify-center">
                  <Building2 size={28} className="text-[#C08A5D]" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{venue.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} />
                    {venue.address?.city || 'Various locations'}
                  </p>
                </div>
              </div>
              <button onClick={nextStep} className="mt-6 w-full px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] transition-all">
                Continue
              </button>
            </div>
          )}

          {/* Step 1: Select Court */}
          {step === 1 && (
            <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Select a Court</h2>
              <div className="space-y-3">
                {courts.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => { setSelectedCourt(c._id); }}
                    className={cn(
                      'w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left',
                      selectedCourt === c._id
                        ? 'bg-[#C08A5D]/10 border-[#C08A5D]/30'
                        : 'bg-[#0f1420] border-white/5 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C08A5D]/10 flex items-center justify-center">
                        <Building2 size={20} className="text-[#C08A5D]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{c.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{c.surface || 'Standard'}</p>
                      </div>
                    </div>
                    <p className="text-sm font-bold text-[#C08A5D]">{formatCurrency(c.hourlyRate)}/hr</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={prevStep} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all">Back</button>
                <button onClick={nextStep} disabled={!selectedCourt} className="flex-1 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] disabled:opacity-50 disabled:cursor-not-allowed transition-all">Continue</button>
              </div>
            </div>
          )}

          {/* Step 2: Date & Time */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
                <h2 className="text-xl font-bold text-white mb-4">Select Date</h2>
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
                        onClick={() => { setSelectedDate(dateStr); setSelectedSlot(null); }}
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

              {selectedDate && (
                <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Available Times</h2>
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#C08A5D] border-t-transparent" />
                    </div>
                  ) : slots.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                      {slots.map((slot) => {
                        if (slot.isPast) return null;
                        const isAvail = slot.available;
                        const isSel = selectedSlot?.time === slot.time;

                        return (
                          <button
                            key={slot.time}
                            disabled={!isAvail}
                            onClick={() => setSelectedSlot(slot)}
                            className={cn(
                              'py-3 px-2 rounded-xl text-sm font-medium transition-all',
                              isSel
                                ? 'bg-[#C08A5D] text-white ring-2 ring-[#C08A5D]/50'
                                : isAvail
                                  ? 'bg-[#0f1420] text-gray-300 hover:bg-[#1a1f2e] border border-white/10'
                                  : 'bg-[#0f1420]/50 text-gray-600 cursor-not-allowed line-through'
                            )}
                          >
                            {formatTimeSlot(slot.time)}
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
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={prevStep} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">Back</button>
                <button onClick={nextStep} disabled={!selectedSlot} className="flex-1 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] disabled:opacity-50 disabled:cursor-not-allowed transition-all">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Review Booking</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420]">
                  <span className="text-gray-400">Venue</span>
                  <span className="text-white font-medium">{venue.name}</span>
                </div>
                {court && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420]">
                    <span className="text-gray-400">Court</span>
                    <span className="text-white font-medium">{court.name}</span>
                  </div>
                )}
                <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420]">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-medium">
                    {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                {selectedSlot && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420]">
                    <span className="text-gray-400">Time</span>
                    <span className="text-white font-medium">{formatTimeSlot(selectedSlot.time)}</span>
                  </div>
                )}
                {court && (
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420]">
                    <span className="text-gray-400">Total</span>
                    <span className="text-lg font-bold text-[#C08A5D]">{formatCurrency(court.hourlyRate)}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={prevStep} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">Back</button>
                <button onClick={nextStep} className="flex-1 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] transition-all">Continue to Payment</button>
              </div>
            </div>
          )}

          {/* Step 4: Payment (Placeholder) */}
          {step === 4 && (
            <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
              <h2 className="text-xl font-bold text-white mb-4">Payment</h2>
              <div className="text-center py-8">
                <CreditCard size={48} className="mx-auto text-[#C08A5D] mb-4" />
                <p className="text-gray-400 mb-2">Secure payment integration coming soon</p>
                <p className="text-sm text-gray-600">Your booking will be confirmed without payment for now.</p>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={prevStep} className="flex-1 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white transition-all">Back</button>
                <button onClick={handleBook} disabled={booking} className="flex-1 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] disabled:opacity-50 transition-all">
                  {booking ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Confirmation */}
          {step === 5 && (
            <div className="rounded-2xl bg-[#151b27] border border-[#C08A5D]/30 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-[#C08A5D]/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-[#C08A5D]" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
              <p className="text-gray-400 mb-6">
                Your court has been booked successfully. Check your dashboard for details.
              </p>
              {court && selectedSlot && (
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-[#0f1420] mb-6">
                  <CalendarDays size={18} className="text-[#C08A5D]" />
                  <span className="text-white">
                    {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' at '}
                    {formatTimeSlot(selectedSlot.time)}
                  </span>
                </div>
              )}
              <div className="flex gap-3 justify-center">
                <Link to="/bookings" className="px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] no-underline">
                  View My Bookings
                </Link>
                <Link to="/venues" className="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 no-underline">
                  Book Another
                </Link>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BookingFlow;

