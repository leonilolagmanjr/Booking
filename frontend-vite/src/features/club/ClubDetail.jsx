/**
 * CourtFlow — Club Detail Page
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Phone, Mail, Clock, Plus, Edit2, Trash2,
  ArrowLeft, TennisBall,
} from 'lucide-react';
import { clubsApi, courtsApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { StatusBadge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { useCourtFlow } from '../../context/CourtFlowContext';
import { Input } from '../../components/ui/Input';

export const ClubDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isOwner, user } = useCourtFlow();
  const [club, setClub] = useState(null);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourtForm, setShowCourtForm] = useState(false);
  const [courtForm, setCourtForm] = useState({ name: '', surface: 'outdoor', hourlyRate: '' });
  const [courtLoading, setCourtLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: clubRes } = await clubsApi.getById(id);
        setClub(clubRes.data);
        // Fetch courts from club endpoint
        // Courts are embedded in club data or fetched separately
      } catch (err) {
        console.error('Failed to load club:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const isOwnerOfClub = isOwner && club?.owner?._id === user?.id;

  const handleCreateCourt = async (e) => {
    e.preventDefault();
    setCourtLoading(true);
    try {
      await courtsApi.create(id, {
        ...courtForm,
        hourlyRate: parseFloat(courtForm.hourlyRate),
      });
      setShowCourtForm(false);
      setCourtForm({ name: '', surface: 'outdoor', hourlyRate: '' });
    } catch (err) {
      console.error('Failed to create court:', err);
    } finally {
      setCourtLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  if (!club) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Club not found</p>
        <Link to="/clubs"><Button variant="ghost" className="mt-4">Back to Clubs</Button></Link>
      </div>
    );
  }

  const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
        <ArrowLeft size={16} /> Back
      </button>

      {/* Header */}
      <Card>
        <CardBody>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-600/20 flex items-center justify-center">
                <Building2 className="text-amber-500" size={32} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-white">{club.name}</h1>
                  <StatusBadge status={club.status} />
                </div>
                {club.description && <p className="text-gray-400 mt-1">{club.description}</p>}
              </div>
            </div>
            {isOwnerOfClub && (
              <div className="flex gap-2">
                <Link to={`/clubs/${id}/edit`}>
                  <Button variant="outline" size="sm" icon={Edit2}>Edit</Button>
                </Link>
              </div>
            )}
          </div>
        </CardBody>
      </Card>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact */}
        <Card>
          <CardHeader><h2 className="text-lg font-semibold text-white">Contact</h2></CardHeader>
          <CardBody className="space-y-3">
            {club.address && (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <MapPin size={16} className="text-gray-500" />
                {[club.address.street, club.address.city, club.address.state].filter(Boolean).join(', ')}
              </div>
            )}
            {club.phone && (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Phone size={16} className="text-gray-500" />
                {club.phone}
              </div>
            )}
            {club.email && (
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Mail size={16} className="text-gray-500" />
                {club.email}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Hours */}
        <Card>
          <CardHeader><h2 className="text-lg font-semibold text-white">Operating Hours</h2></CardHeader>
          <CardBody>
            {club.operatingHours?.length > 0 ? (
              <div className="space-y-1.5">
                {dayNames.map((day) => {
                  const hours = club.operatingHours.find((h) => h.day === day);
                  return (
                    <div key={day} className="flex items-center justify-between text-sm">
                      <span className="text-gray-400 capitalize">{day.slice(0, 3)}</span>
                      <span className="text-gray-300">
                        {hours?.isClosed
                          ? 'Closed'
                          : `${hours?.open || '--'} - ${hours?.close || '--'}`}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No hours set</p>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Courts Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Courts ({courts.length})</h2>
            {isOwnerOfClub && (
              <Button size="sm" icon={Plus} onClick={() => setShowCourtForm(true)}>
                Add Court
              </Button>
            )}
          </div>
        </CardHeader>
        <CardBody>
          {courts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {courts.map((court) => (
                <Link key={court._id} to={`/courts/${court._id}`}>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-gray-900/50 hover:bg-gray-900 transition-colors">
                    <div className="flex items-center gap-3">
                      <TennisBall className="text-amber-500" size={20} />
                      <div>
                        <p className="font-medium text-white">{court.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{court.surface}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-amber-400">₱{court.hourlyRate}/hr</p>
                      <StatusBadge status={court.status} />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-6">No courts yet</p>
          )}
        </CardBody>
      </Card>

      {/* Add Court Modal */}
      <Modal isOpen={showCourtForm} onClose={() => setShowCourtForm(false)} title="Add Court">
        <form onSubmit={handleCreateCourt} className="space-y-4">
          <Input label="Court Name" placeholder="e.g. Court 1" value={courtForm.name}
            onChange={(e) => setCourtForm({ ...courtForm, name: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Surface</label>
            <select
              value={courtForm.surface}
              onChange={(e) => setCourtForm({ ...courtForm, surface: e.target.value })}
              className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-gray-100"
            >
              <option value="outdoor">Outdoor</option>
              <option value="indoor">Indoor</option>
            </select>
          </div>
          <Input label="Hourly Rate (₱)" type="number" placeholder="150"
            value={courtForm.hourlyRate}
            onChange={(e) => setCourtForm({ ...courtForm, hourlyRate: e.target.value })} required />
          <Button type="submit" loading={courtLoading} className="w-full">Create Court</Button>
        </form>
      </Modal>
    </div>
  );
};

// Fix missing import
import { Building2 } from 'lucide-react';

