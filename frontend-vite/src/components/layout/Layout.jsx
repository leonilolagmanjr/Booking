/**
 * CourtFlow — Layout Component
 * Sidebar + Navigation + Content area
 */

import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, CalendarDays, Building2, User,
  Menu, X, Bell, LogOut, ChevronDown, TennisBall,
} from 'lucide-react';
import { useCourtFlow } from '../../context/CourtFlowContext';
import { Badge } from '../ui/Badge';

const playerLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/bookings', icon: CalendarDays, label: 'My Bookings' },
  { to: '/clubs', icon: Building2, label: 'Clubs' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const ownerLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/clubs', icon: Building2, label: 'My Clubs' },
  { to: '/courts', icon: TennisBall, label: 'Courts' },
  { to: '/bookings', icon: CalendarDays, label: 'Bookings' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Admin' },
  { to: '/admin/users', icon: User, label: 'Users' },
  { to: '/admin/clubs', icon: Building2, label: 'Clubs' },
];

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, isLoggedIn, logout, isOwner, isAdmin } = useCourtFlow();
  const location = useLocation();
  const navigate = useNavigate();

  const links = isAdmin ? adminLinks : isOwner ? ownerLinks : playerLinks;

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Mobile Nav */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-800/90 backdrop-blur-md border-b border-gray-700/50">
        <div className="flex items-center justify-between px-4 h-16">
          <button onClick={() => setSidebarOpen(true)} className="p-2 text-gray-300">
            <Menu size={24} />
          </button>
          <Link to="/" className="flex items-center gap-2">
            <TennisBall className="text-amber-500" size={24} />
            <span className="font-bold text-lg">CourtFlow</span>
          </Link>
          <div className="w-10" />
        </div>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-gray-800 border-r border-gray-700/50
          transform transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between px-6 h-16 border-b border-gray-700/50">
          <Link to="/" className="flex items-center gap-2">
            <TennisBall className="text-amber-500" size={28} />
            <span className="font-bold text-xl">CourtFlow</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-gray-400">
            <X size={20} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.to || location.pathname.startsWith(link.to + '/');
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? 'bg-amber-600/15 text-amber-400 border border-amber-600/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                  }
                `}
              >
                <link.icon size={20} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700/50">
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 w-full rounded-xl text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          ) : (
            <Link
              to="/auth"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center justify-center px-4 py-2.5 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 bg-gray-900/80 backdrop-blur-md border-b border-gray-700/50">
          <div className="flex items-center justify-end gap-4 px-6 h-16">
            {/* Notifications */}
            <Link
              to="/notifications"
              className="relative p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
            >
              <Bell size={20} />
            </Link>

            {/* User Menu */}
            {isLoggedIn && (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-800 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-600/20 flex items-center justify-center">
                    <span className="text-sm font-medium text-amber-400">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium hidden sm:block">{user?.name}</span>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-56 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20">
                      <div className="p-3 border-b border-gray-700">
                        <p className="text-sm font-medium">{user?.name}</p>
                        <p className="text-xs text-gray-400 capitalize">{user?.role?.replace('_', ' ')}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-gray-700"
                        >
                          <User size={16} />
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-sm text-red-400 hover:bg-red-500/10"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

