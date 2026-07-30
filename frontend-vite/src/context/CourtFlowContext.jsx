/**
 * CourtFlow — Combined Context
 * Auth + Theme for the CourtFlow frontend.
 */

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { authApi } from '../services/courtflowApi';

// ─── Auth Context ──────────────────────────────────
const CourtFlowContext = createContext(null);

export const CourtFlowProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('cf_access_token'));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem('cf_user')) || null
  );
  const [loading, setLoading] = useState(true);

  // Verify token on mount
  useEffect(() => {
    const verify = async () => {
      const token = localStorage.getItem('cf_access_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        // Try to get profile to verify token is still valid
        const { data } = await authApi.refresh(
          localStorage.getItem('cf_refresh_token')
        );
        if (data?.data?.accessToken) {
          localStorage.setItem('cf_access_token', data.data.accessToken);
          if (data.data.refreshToken) {
            localStorage.setItem('cf_refresh_token', data.data.refreshToken);
          }
          if (data.data.user) {
            localStorage.setItem('cf_user', JSON.stringify(data.data.user));
            setUser(data.data.user);
          }
          setIsLoggedIn(true);
        }
      } catch {
        // Token invalid, clear state
        localStorage.removeItem('cf_access_token');
        localStorage.removeItem('cf_refresh_token');
        localStorage.removeItem('cf_user');
        setIsLoggedIn(false);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, []);

  const login = useCallback((userData, accessToken, refreshToken) => {
    setIsLoggedIn(true);
    setUser(userData);
    localStorage.setItem('cf_access_token', accessToken);
    if (refreshToken) localStorage.setItem('cf_refresh_token', refreshToken);
    localStorage.setItem('cf_user', JSON.stringify(userData));
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors on logout
    }
    setIsLoggedIn(false);
    setUser(null);
    localStorage.removeItem('cf_access_token');
    localStorage.removeItem('cf_refresh_token');
    localStorage.removeItem('cf_user');
  }, []);

  const updateUser = useCallback((userData) => {
    setUser(userData);
    localStorage.setItem('cf_user', JSON.stringify(userData));
  }, []);

  return (
    <CourtFlowContext.Provider
      value={{
        isLoggedIn,
        user,
        loading,
        login,
        logout,
        updateUser,
        isOwner: user?.role === 'club_owner',
        isAdmin: user?.role === 'super_admin',
        isPlayer: user?.role === 'player',
        isStaff: user?.role === 'staff',
      }}
    >
      {children}
    </CourtFlowContext.Provider>
  );
};

export const useCourtFlow = () => {
  const ctx = useContext(CourtFlowContext);
  if (!ctx) throw new Error('useCourtFlow must be used within CourtFlowProvider');
  return ctx;
};

