/**
 * CourtFlow — Club Create/Edit Form
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { clubsApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const ClubForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    phone: '',
    email: '',
    address: { street: '', city: '', state: '', zip: '' },
    operatingHours: days.map((day) => ({
      day,
      open: '06:00',
      close: '22:00',
      isClosed: day === 'monday' ? true : false,
    })),
    settings: {
      defaultBookingDuration: 60,
      maxAdvanceDays: 30,
      cancellationPolicy: 'flexible',
    },
  });

  // Load club for editing
  useEffect(() => {
    if (!isEdit) return;
    const fetch = async () => {
      try {
        const { data: res } = await clubsApi.getById(id);
        const club = res.data;
        setForm({
          name: club.name || '',
          description: club.description || '',
          phone: club.phone || '',
          email: club.email || '',
          address: club.address || { street: '', city: '', state: '', zip: '' },
          operatingHours: club.operatingHours?.length
            ? club.operatingHours
            : days.map((day) => ({ day, open: '06:00', close: '22:00', isClosed: false })),
          settings: club.settings || { defaultBookingDuration: 60, maxAdvanceDays: 30, cancellationPolicy: 'flexible' },
        });
      } catch (err) {
        console.error('Failed to load club:', err);
      }
    };
    fetch();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await clubsApi.update(id, form);
      } else {
        await clubsApi.create(form);
      }
      navigate(isEdit ? `/clubs/${id}` : '/clubs');
    } catch (err) {
      console.error('Failed to save club:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateHours = (index, field, value) => {
    const hours = [...form.operatingHours];
    hours[index] = { ...hours[index], [field]: value };
    setForm({ ...form, operatingHours: hours });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white">
        <ArrowLeft size={16} /> Back
      </button>

      <Card>
        <CardHeader>
          <h1 className="text-xl font-bold text-white">{isEdit ? 'Edit Club' : 'Create Club'}</h1>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Basic Info</h3>
              <Input label="Club Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-gray-100 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Phone" value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <Input label="Email" type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
            </div>

            {/* Address */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Address</h3>
              <Input label="Street" value={form.address.street}
                onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })} />
              <div className="grid grid-cols-3 gap-4">
                <Input label="City" value={form.address.city}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} />
                <Input label="State" value={form.address.state}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} />
                <Input label="ZIP" value={form.address.zip}
                  onChange={(e) => setForm({ ...form, address: { ...form.address, zip: e.target.value } })} />
              </div>
            </div>

            {/* Operating Hours */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Operating Hours</h3>
              {form.operatingHours.map((hours, i) => (
                <div key={hours.day} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-gray-400 capitalize">{hours.day.slice(0, 3)}</span>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={hours.isClosed}
                      onChange={(e) => updateHours(i, 'isClosed', e.target.checked)}
                      className="rounded border-gray-600 text-amber-600 focus:ring-amber-500"
                    />
                    Closed
                  </label>
                  {!hours.isClosed && (
                    <>
                      <input type="time" value={hours.open}
                        onChange={(e) => updateHours(i, 'open', e.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-sm text-gray-100" />
                      <span className="text-gray-500">to</span>
                      <input type="time" value={hours.close}
                        onChange={(e) => updateHours(i, 'close', e.target.value)}
                        className="rounded-lg border border-gray-700 bg-gray-900/50 px-3 py-1.5 text-sm text-gray-100" />
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Settings */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Default Duration (min)" type="number" value={form.settings.defaultBookingDuration}
                  onChange={(e) => setForm({ ...form, settings: { ...form.settings, defaultBookingDuration: parseInt(e.target.value) } })} />
                <Input label="Max Advance (days)" type="number" value={form.settings.maxAdvanceDays}
                  onChange={(e) => setForm({ ...form, settings: { ...form.settings, maxAdvanceDays: parseInt(e.target.value) } })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1.5">Cancellation Policy</label>
                <select
                  value={form.settings.cancellationPolicy}
                  onChange={(e) => setForm({ ...form, settings: { ...form.settings, cancellationPolicy: e.target.value } })}
                  className="w-full rounded-xl border border-gray-700 bg-gray-900/50 px-4 py-2.5 text-gray-100"
                >
                  <option value="flexible">Flexible (24h)</option>
                  <option value="moderate">Moderate (12h)</option>
                  <option value="strict">Strict (6h)</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" loading={loading} icon={Save}>
                {isEdit ? 'Update Club' : 'Create Club'}
              </Button>
              <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
};

