/**
 * CourtFlow — Admin Panel
 */

import React, { useState, useEffect } from 'react';
import { Users, Building2, BarChart3, Shield, Search, X } from 'lucide-react';
import { adminApi } from '../../services/courtflowApi';
import { Card, CardBody, CardHeader } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';

export const AdminPage = () => {
  const [tab, setTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersRes, clubsRes, analyticsRes] = await Promise.all([
          adminApi.listUsers({ search }),
          adminApi.listClubs({ search }),
          adminApi.getAnalytics(),
        ]);
        setUsers(usersRes.data?.data || []);
        setClubs(clubsRes.data?.data || []);
        setAnalytics(analyticsRes.data?.data || null);
      } catch (err) {
        console.error('Failed to load admin data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [search]);

  const handleSuspend = async (userId) => {
    try {
      await adminApi.suspendUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: 'suspended' } : u))
      );
    } catch (err) {
      console.error('Failed to suspend user:', err);
    }
  };

  const handleActivate = async (userId) => {
    try {
      await adminApi.activateUser(userId);
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: 'active' } : u))
      );
    } catch (err) {
      console.error('Failed to activate user:', err);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'clubs', label: 'Clubs', icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-gray-400 mt-1">Platform management and analytics</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-800/50 rounded-xl p-1 w-fit">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-amber-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <t.icon size={16} />
            {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : (
        <>
          {tab === 'overview' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Users</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {analytics?.totalUsers || users.length || 0}
                      </p>
                    </div>
                    <Users className="text-amber-500" size={24} />
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Clubs</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {analytics?.totalClubs || clubs.length || 0}
                      </p>
                    </div>
                    <Building2 className="text-amber-500" size={24} />
                  </div>
                </CardBody>
              </Card>
              <Card>
                <CardBody>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Total Bookings</p>
                      <p className="text-2xl font-bold text-white mt-1">
                        {analytics?.totalBookings || 0}
                      </p>
                    </div>
                    <BarChart3 className="text-amber-500" size={24} />
                  </div>
                </CardBody>
              </Card>
            </div>
          )}

          {tab === 'users' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">Users ({users.length})</h2>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Email</th>
                        <th className="text-left py-3 px-2">Role</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-right py-3 px-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user._id} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                          <td className="py-3 px-2 text-white">{user.name}</td>
                          <td className="py-3 px-2 text-gray-400">{user.email}</td>
                          <td className="py-3 px-2 capitalize">{user.role?.replace('_', ' ')}</td>
                          <td className="py-3 px-2">
                            <StatusBadge status={user.status} />
                          </td>
                          <td className="py-3 px-2 text-right">
                            {user.status === 'active' ? (
                              <Button size="sm" variant="danger" onClick={() => handleSuspend(user._id)}>
                                Suspend
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" onClick={() => handleActivate(user._id)}>
                                Activate
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}

          {tab === 'clubs' && (
            <Card>
              <CardHeader>
                <h2 className="text-lg font-semibold text-white">All Clubs ({clubs.length})</h2>
              </CardHeader>
              <CardBody>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-gray-400 border-b border-gray-700">
                        <th className="text-left py-3 px-2">Name</th>
                        <th className="text-left py-3 px-2">Owner</th>
                        <th className="text-left py-3 px-2">Status</th>
                        <th className="text-left py-3 px-2">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clubs.map((club) => (
                        <tr key={club._id} className="border-b border-gray-700/50 hover:bg-gray-800/50">
                          <td className="py-3 px-2 text-white">{club.name}</td>
                          <td className="py-3 px-2 text-gray-400">{club.owner?.name || 'N/A'}</td>
                          <td className="py-3 px-2">
                            <StatusBadge status={club.status} />
                          </td>
                          <td className="py-3 px-2 text-gray-400">
                            {new Date(club.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardBody>
            </Card>
          )}
        </>
      )}
    </div>
  );
};
