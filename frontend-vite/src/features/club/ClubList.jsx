/**
 * CourtFlow — Club List Page
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, Search, Building2 } from 'lucide-react';
import { clubsApi } from '../../services/courtflowApi';
import { Card, CardBody } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { StatusBadge } from '../../components/ui/Badge';
import { useCourtFlow } from '../../context/CourtFlowContext';

export const ClubList = () => {
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { isOwner, isAdmin } = useCourtFlow();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data: res } = await clubsApi.list({ search });
        setClubs(res.data || []);
      } catch (err) {
        console.error('Failed to load clubs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search]);

  const canManage = isOwner || isAdmin;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Clubs</h1>
          <p className="text-gray-400 mt-1">
            {canManage ? 'Manage your pickleball clubs' : 'Browse pickleball clubs near you'}
          </p>
        </div>
        {canManage && (
          <Link to="/clubs/new">
            <Button icon={Plus}>Add Club</Button>
          </Link>
        )}
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input
          placeholder="Search clubs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          icon={Search}
        />
      </div>

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
        </div>
      ) : clubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club) => (
            <Link key={club._id} to={`/clubs/${club._id}`}>
              <Card hover className="h-full">
                <CardBody>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-600/20 flex items-center justify-center">
                      <Building2 className="text-amber-500" size={24} />
                    </div>
                    <StatusBadge status={club.status} />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{club.name}</h3>
                  {club.description && (
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{club.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <MapPin size={12} />
                    {club.address?.city || club.address?.street || 'Location not set'}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card>
          <CardBody>
            <div className="text-center py-12">
              <Building2 className="mx-auto text-gray-600 mb-3" size={48} />
              <p className="text-gray-400 mb-2">No clubs found</p>
              {canManage && (
                <Link to="/clubs/new">
                  <Button variant="outline" size="sm">Create your first club</Button>
                </Link>
              )}
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

