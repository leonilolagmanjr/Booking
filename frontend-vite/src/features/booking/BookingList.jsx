/**
 * CourtFlow — Booking List Page
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, XCircle } from 'lucide-react';
import { bookingsApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { StatusBadge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';

export const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await bookingsApi.list({ limit: 50 });
        setBookings(res.data || []);
      } catch (err) {
        console.error('Failed to load bookings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleCancel = async () => {
    if (!cancelId) return;
    try {
      await bookingsApi.cancel(cancelId, cancelReason);
      setBookings(bookings.map((b) =>
        b._id === cancelId ? { ...b, status: 'cancelled' } : b
      ));
      setCancelId(null);
      setCancelReason('');
    } catch (err) {
      console.error('Failed to cancel:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 mt-1">View and manage your court bookings</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : bookings.length > 0 ? (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking._id}>
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-amber-600/10">
                      <CalendarDays className="text-amber-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{booking.court?.name}</h3>
                      <p className="text-sm text-gray-400">{booking.club?.name}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <CalendarDays size={12} />
                          {new Date(booking.startTime).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(booking.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {' - '}
                          {new Date(booking.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <StatusBadge status={booking.status} />
                        <StatusBadge status={booking.paymentStatus} color="blue" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-amber-400">₱{booking.totalAmount}</span>
                    {['pending', 'confirmed'].includes(booking.status) && (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={XCircle}
                        onClick={() => setCancelId(booking._id)}
                      >
                        Cancel
                      </Button>
                    )}
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
              <CalendarDays className="mx-auto text-gray-600 mb-3" size={48} />
              <p className="text-gray-400 mb-2">No bookings yet</p>
              <Link to="/clubs">
                <Button variant="outline" size="sm">Browse Clubs to Book</Button>
              </Link>
            </div>
          </CardBody>
        </Card>
      )}

      <Modal isOpen={!!cancelId} onClose={() => setCancelId(null)} title="Cancel Booking">
        <div className="space-y-4">
          <p className="text-sm text-gray-400">Are you sure you want to cancel this booking?</p>
          <Input label="Reason (optional)" value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)} />
          <div className="flex gap-3">
            <Button variant="danger" onClick={handleCancel}>Confirm Cancel</Button>
            <Button variant="ghost" onClick={() => setCancelId(null)}>Keep Booking</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

