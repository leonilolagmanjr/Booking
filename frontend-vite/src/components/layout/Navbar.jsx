import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, LayoutDashboard, CalendarDays, Building2,
  User, Settings, LogOut, ChevronDown, Bell, Search,
} from 'lucide-react';
import { useCourtFlow } from '../../context/CourtFlowContext';
import { cn } from '../../utils/cn';

const navLinks = [
  { to: '/', label: 'Home', icon: null },
  { to: '/venues', label: 'Venues', icon: Building2 },
  { to: '/bookings', label: 'Bookings', icon: CalendarDays },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const accountLinks = [
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isLoggedIn, user, logout, isOwner, isAdmin } = useCourtFlow();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#0f1420]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#C08A5D]">
            <span className="text-sm font-black text-[#0f1420]">B</span>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            <span className="text-[#C08A5D]">Book</span>Vault
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline',
                isActive(link.to)
                  ? 'bg-[#C08A5D]/10 text-[#C08A5D] border border-[#C08A5D]/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              )}
              aria-current={isActive(link.to) ? 'page' : undefined}
            >
              {link.icon && <link.icon size={16} />}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <Link
            to="/venues"
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 border border-white/10 hover:border-[#C08A5D]/30 hover:text-gray-300 transition-all no-underline"
            aria-label="Search venues"
          >
            <Search size={16} />
            <span>Search venues...</span>
          </Link>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                {/* Notifications Bell */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
                  aria-label="Notifications"
                >
                  <Bell size={20} />
                </Link>

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/5 transition-all"
                    aria-haspopup="true"
                    aria-expanded={userMenuOpen}
                    aria-label="User menu"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C08A5D]/20">
                      <span className="text-sm font-medium text-[#C08A5D]">
                        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-white hidden lg:block">
                      {user?.name}
                    </span>
                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  {userMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setUserMenuOpen(false)}
                      />
                      <div className="absolute right-0 mt-2 w-56 bg-[#151b27] border border-white/10 rounded-xl shadow-xl z-20 py-1">
                        <div className="px-4 py-3 border-b border-white/10">
                          <p className="text-sm font-medium text-white">{user?.name}</p>
                          <p className="text-xs text-gray-500 capitalize">
                            {user?.role?.replace('_', ' ')}
                          </p>
                        </div>
                        {accountLinks.map((link) => (
                          <Link
                            key={link.to}
                            to={link.to}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors no-underline"
                          >
                            <link.icon size={16} />
                            {link.label}
                          </Link>
                        ))}
                        {(isOwner || isAdmin) && (
                          <Link
                            to={isAdmin ? '/admin' : '/business'}
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors no-underline"
                          >
                            <LayoutDashboard size={16} />
                            {isAdmin ? 'Admin Panel' : 'Business Dashboard'}
                          </Link>
                        )}
                        <div className="border-t border-white/10 mt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2.5 w-full text-sm text-red-400 hover:bg-red-500/10 transition-colors text-left"
                          >
                            <LogOut size={16} />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-all no-underline"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-[#C08A5D] text-[#0f1420] hover:bg-[#b07a4e] transition-all no-underline"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Open navigation menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-72 bg-[#151b27] border-l border-white/10 shadow-xl">
            <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
              <span className="font-bold text-white">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white"
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="p-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all no-underline',
                    isActive(link.to)
                      ? 'bg-[#C08A5D]/10 text-[#C08A5D]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {link.icon && <link.icon size={18} />}
                  {link.label}
                </Link>
              ))}
            </nav>

            {isLoggedIn ? (
              <div className="border-t border-white/10 p-4 space-y-1">
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 no-underline"
                >
                  <User size={18} />
                  Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 no-underline"
                >
                  <Settings size={18} />
                  Settings
                </Link>
                {(isOwner || isAdmin) && (
                  <Link
                    to={isAdmin ? '/admin' : '/business'}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 no-underline"
                  >
                    <LayoutDashboard size={18} />
                    {isAdmin ? 'Admin' : 'Business'}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-white/10 p-4 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-center text-white bg-white/5 hover:bg-white/10 no-underline"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-lg text-sm font-medium text-center bg-[#C08A5D] text-[#0f1420] hover:bg-[#b07a4e] no-underline"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

