import React, { useState, useEffect, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, MapPin, Star, Building2, SlidersHorizontal, ChevronDown, X } from 'lucide-react';
import { venueService } from '../api/venueService';
import { cn } from '../utils/cn';

const SPORTS = ['Pickleball', 'Tennis', 'Basketball', 'Badminton', 'Volleyball', 'Squash'];
const PRICE_RANGES = [
  { label: 'Any', min: 0, max: Infinity },
  { label: 'Under ₱500', min: 0, max: 500 },
  { label: '₱500 - ₱1,000', min: 500, max: 1000 },
  { label: '₱1,000 - ₱2,000', min: 1000, max: 2000 },
  { label: 'Over ₱2,000', min: 2000, max: Infinity },
];

const Venues = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [sportFilter, setSportFilter] = useState(searchParams.get('sport') || '');
  const [priceRange, setPriceRange] = useState(0);
  const [sortBy, setSortBy] = useState('name');
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchVenues = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search,
        sport: sportFilter,
        page,
        limit: 12,
        sort: sortBy,
      };
      const { data: res } = await venueService.list(params);
      setVenues(res.data || []);
      setTotalPages(res.pagination?.pages || 1);
    } catch (err) {
      console.error('Failed to load venues:', err);
    } finally {
      setLoading(false);
    }
  }, [search, sportFilter, page, sortBy]);

  useEffect(() => {
    fetchVenues();
  }, [fetchVenues]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    const params = new URLSearchParams();
    if (search) params.set('q', search);
    if (sportFilter) params.set('sport', sportFilter);
    setSearchParams(params);
    fetchVenues();
  };

  const clearFilters = () => {
    setSearch('');
    setSportFilter('');
    setPriceRange(0);
    setSortBy('name');
    setPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = search || sportFilter || priceRange > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">Find Venues</h1>
        <p className="text-gray-400 mt-1">Discover sports venues near you</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search venues by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#151b27] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-[#C08A5D]/50 transition-colors"
            aria-label="Search venues"
          />
        </form>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all',
            showFilters || hasActiveFilters
              ? 'bg-[#C08A5D]/10 border-[#C08A5D]/30 text-[#C08A5D]'
              : 'bg-[#151b27] border-white/10 text-gray-400 hover:text-white hover:border-white/20'
          )}
          aria-label="Toggle filters"
        >
          <SlidersHorizontal size={16} />
          Filters
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-[#C08A5D]" />
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-[#151b27] border border-white/10 rounded-xl p-5 space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-[#C08A5D] hover:text-[#b07a4e] transition-colors"
              >
                <X size={14} />
                Clear all
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Sport Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Sport Type
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSportFilter('')}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                    !sportFilter
                      ? 'bg-[#C08A5D]/10 border-[#C08A5D]/30 text-[#C08A5D]'
                      : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                  )}
                >
                  All
                </button>
                {SPORTS.map((sport) => (
                  <button
                    key={sport}
                    onClick={() => setSportFilter(sport)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-medium border transition-all',
                      sportFilter === sport
                        ? 'bg-[#C08A5D]/10 border-[#C08A5D]/30 text-[#C08A5D]'
                        : 'bg-transparent border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                    )}
                  >
                    {sport}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Price Range
              </label>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full bg-[#0f1420] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#C08A5D]/50"
              >
                {PRICE_RANGES.map((range, i) => (
                  <option key={i} value={i}>{range.label}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wider">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-[#0f1420] border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none focus:border-[#C08A5D]/50"
              >
                <option value="name">Name</option>
                <option value="rating">Highest Rated</option>
                <option value="-createdAt">Newest</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="rounded-2xl bg-[#151b27] border border-white/5 overflow-hidden">
              <div className="aspect-[16/9] skeleton" />
              <div className="p-5 space-y-3">
                <div className="h-5 skeleton w-3/4" />
                <div className="h-4 skeleton w-1/2" />
                <div className="h-4 skeleton w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : venues.length > 0 ? (
        <>
          <p className="text-sm text-gray-500">
            Found <span className="text-white">{venues.length}</span> venue{venues.length !== 1 ? 's' : ''}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {venues.map((venue) => (
              <Link
                key={venue._id}
                to={`/venues/${venue._id}`}
                className="group block rounded-2xl border border-white/10 bg-[#151b27] overflow-hidden hover:border-[#C08A5D]/30 transition-all no-underline"
              >
                <div className="aspect-[16/9] bg-gradient-to-br from-[#1a1f2e] to-[#1e2538] flex items-center justify-center">
                  <Building2 size={48} className="text-[#C08A5D]/30 group-hover:text-[#C08A5D]/50 transition-colors" />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-white group-hover:text-[#C08A5D] transition-colors">
                      {venue.name}
                    </h3>
                    {venue.rating && (
                      <div className="flex items-center gap-1 text-sm text-amber-500">
                        <Star size={14} fill="currentColor" />
                        {venue.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  {venue.description && (
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{venue.description}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
                    <MapPin size={12} />
                    {venue.address?.city || venue.address?.street || 'Location not set'}
                  </div>
                  {venue.sports?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {venue.sports.slice(0, 3).map((sport) => (
                        <span
                          key={sport}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#C08A5D]/10 text-[#C08A5D]"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={cn(
                    'w-10 h-10 rounded-lg text-sm font-medium border transition-all',
                    page === p
                      ? 'bg-[#C08A5D] border-[#C08A5D] text-[#0f1420]'
                      : 'border-white/10 text-gray-400 hover:text-white hover:border-white/20'
                  )}
                >
                  {p}
                </button>
              ))}
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 rounded-lg border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 border-2 border-dashed border-white/10 rounded-2xl">
          <Building2 size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No venues found</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            {search || sportFilter
              ? 'Try adjusting your search or filters'
              : 'No venues are available yet. Check back soon!'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-6 py-2.5 rounded-xl bg-[#C08A5D] text-[#0f1420] font-medium text-sm hover:bg-[#b07a4e] transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Venues;

