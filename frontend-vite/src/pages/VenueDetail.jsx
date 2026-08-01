import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, Star, Building2,
  ArrowLeft, ChevronRight, CalendarDays, Users, Shield,
  CheckCircle, XCircle,
} from 'lucide-react';
import { venueService } from '../api/venueService';
import { formatCurrency } from '../utils/format';
import { cn } from '../utils/cn';

const VenueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const { data: res } = await venueService.getById(id);
        setVenue(res.data);
      } catch (err) {
        console.error('Failed to load venue:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchVenue();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#C08A5D] border-t-transparent" />
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="text-center py-20">
        <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Venue Not Found</h2>
        <p className="text-gray-500 mb-6">The venue you're looking for doesn't exist.</p>
        <Link
          to="/venues"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-medium hover:bg-[#b07a4e] transition-colors no-underline"
        >
          <ArrowLeft size={16} />
          Back to Venues
        </Link>
      </div>
    );
  }

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const amenities = venue.amenities || ['Free WiFi', 'Parking', 'Locker Rooms', 'Pro Shop', 'Café', 'Equipment Rental'];

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
        aria-label="Go back"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Hero / Header */}
      <div className="rounded-2xl bg-gradient-to-br from-[#151b27] to-[#1a1f2e] border border-white/10 overflow-hidden">
        <div className="aspect-[21/9] bg-gradient-to-br from-[#1a1f2e] to-[#1e2538] flex items-center justify-center">
          <Building2 size={64} className="text-[#C08A5D]/20" />
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl sm:text-3xl font-bold text-white">{venue.name}</h1>
                {venue.rating && (
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-sm font-medium">
                    <Star size={14} fill="currentColor" />
                    {venue.rating.toFixed(1)}
                  </div>
                )}
              </div>
              {venue.description && (
                <p className="text-gray-400 mb-4 max-w-2xl">{venue.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                {venue.address && (
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-[#C08A5D]" />
                    {[venue.address.street, venue.address.city, venue.address.state].filter(Boolean).join(', ')}
                  </span>
                )}
                {venue.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone size={14} className="text-[#C08A5D]" />
                    {venue.phone}
                  </span>
                )}
                {venue.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-[#C08A5D]" />
                    {venue.email}
                  </span>
                )}
              </div>
            </div>
            <Link
              to={`/booking?venue=${id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] transition-all shrink-0 no-underline"
            >
              <CalendarDays size={18} />
              Book Now
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Amenities */}
          <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {amenities.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2 text-sm text-gray-400">
                  <CheckCircle size={14} className="text-[#C08A5D]" />
                  {amenity}
                </div>
              ))}
            </div>
          </div>

          {/* Courts */}
          {venue.courts?.length > 0 && (
            <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">
                  Available Courts ({venue.courts.length})
                </h2>
              </div>
              <div className="space-y-3">
                {venue.courts.map((court) => (
                  <div
                    key={court._id}
                    className="flex items-center justify-between p-4 rounded-xl bg-[#0f1420] border border-white/5 hover:border-[#C08A5D]/20 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C08A5D]/10 flex items-center justify-center">
                        <Building2 size={20} className="text-[#C08A5D]" />
                      </div>
                      <div>
                        <p className="font-medium text-white">{court.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{court.surface || 'Standard'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-[#C08A5D]">
                        {formatCurrency(court.hourlyRate)}/hr
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Operating Hours */}
          {venue.operatingHours?.length > 0 && (
            <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Operating Hours</h2>
              <div className="space-y-1.5">
                {dayNames.map((day) => {
                  const hours = venue.operatingHours.find((h) => h.day === day);
                  return (
                    <div key={day} className="flex items-center justify-between text-sm py-1">
                      <span className="text-gray-400 capitalize font-medium">{day.slice(0, 3)}</span>
                      <span className={cn(
                        'text-sm',
                        hours?.isClosed ? 'text-red-400' : 'text-gray-300'
                      )}>
                        {hours?.isClosed
                          ? 'Closed'
                          : `${hours?.open || '--'} - ${hours?.close || '--'}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Map Placeholder */}
          <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Location</h2>
            <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-[#1a1f2e] to-[#1e2538] flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="mx-auto text-[#C08A5D]/50 mb-2" />
                <p className="text-sm text-gray-500">Map integration coming soon</p>
              </div>
            </div>
          </div>

          {/* Reviews Placeholder */}
          <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Reviews</h2>
            <div className="text-center py-8">
              <Users size={32} className="mx-auto text-gray-600 mb-2" />
              <p className="text-sm text-gray-500">Reviews coming soon</p>
            </div>
          </div>
        </div>

        {/* Booking Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl bg-[#151b27] border border-white/10 p-6 sticky top-24">
            <h3 className="font-semibold text-white mb-4">Quick Book</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                  Select Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-[#0f1420] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C08A5D]/50 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                  Select Court
                </label>
                <select className="w-full bg-[#0f1420] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white outline-none focus:border-[#C08A5D]/50 transition-colors">
                  <option value="">Choose a court</option>
                  {venue.courts?.map((court) => (
                    <option key={court._id} value={court._id}>
                      {court.name} - {formatCurrency(court.hourlyRate)}/hr
                    </option>
                  ))}
                </select>
              </div>
              <Link
                to={`/booking?venue=${id}`}
                className="block w-full text-center px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] transition-all no-underline"
              >
                Check Availability
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500 pt-2">
                <Shield size={12} />
                Secure booking. Free cancellation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueDetail;

