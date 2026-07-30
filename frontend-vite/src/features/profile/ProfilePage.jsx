/**
 * CourtFlow — Profile Page
 */

import React, { useState } from 'react';
import { User, Mail, Phone, Shield, Save } from 'lucide-react';
import { useCourtFlow } from '../../context/CourtFlowContext';
import { usersApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ProfilePage = () => {
  const { user, updateUser } = useCourtFlow();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data: res } = await usersApi.updateProfile(form);
      updateUser(res.data);
      setEditing(false);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-gray-400 mt-1">Manage your account settings</p>
      </div>

      <Card>
        <CardBody>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full bg-amber-600/20 flex items-center justify-center">
              <span className="text-3xl font-bold text-amber-400">
                {user?.name?.charAt(0)?.toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{user?.name}</h2>
              <p className="text-sm text-gray-400 capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <Input label="Full Name" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} icon={User} />
              <Input label="Phone" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} icon={Phone} />
              <div className="flex gap-3">
                <Button type="submit" loading={saving} icon={Save}>Save Changes</Button>
                <Button type="button" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gray-500" />
                <span className="text-gray-300">{user?.email}</span>
              </div>
              {user?.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone size={16} className="text-gray-500" />
                  <span className="text-gray-300">{user.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm">
                <Shield size={16} className="text-gray-500" />
                <span className="text-gray-300 capitalize">{user?.role?.replace('_', ' ')}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setEditing(true)}>Edit Profile</Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

