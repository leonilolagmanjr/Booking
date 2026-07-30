/**
 * CourtFlow — App Router
 * Integrates CourtFlow features alongside existing app routes.
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useCourtFlow } from './context/CourtFlowContext';
import { Layout } from './components/layout/Layout';
import { LoginPage } from './features/auth/LoginPage';
import { ForgotPasswordPage } from './features/auth/ForgotPasswordPage';
import { OwnerDashboard } from './features/dashboard/OwnerDashboard';
import { PlayerDashboard } from './features/dashboard/PlayerDashboard';
import { ClubList } from './features/club/ClubList';
import { ClubDetail } from './features/club/ClubDetail';
import { ClubForm } from './features/club/ClubForm';
import { BookingCalendar } from './features/booking/BookingCalendar';
import { BookingList } from './features/booking/BookingList';
import { ProfilePage } from './features/profile/ProfilePage';
import { NotificationPage } from './features/notifications/NotificationPage';
import { AdminPage } from './features/admin/AdminPage';

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useCourtFlow();
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }
  if (!isLoggedIn) return <Navigate to="/auth" replace />;
  return <Layout>{children}</Layout>;
};

export const AppCourtFlow = () => {
  return (
    <Routes>
      {/* Auth routes (no layout) */}
      <Route path="/auth" element={<LoginPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* Protected routes with layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardRouter />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs"
        element={
          <ProtectedRoute>
            <ClubList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs/new"
        element={
          <ProtectedRoute>
            <ClubForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs/:id"
        element={
          <ProtectedRoute>
            <ClubDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/clubs/:id/edit"
        element={
          <ProtectedRoute>
            <ClubForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings"
        element={
          <ProtectedRoute>
            <BookingList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/bookings/new"
        element={
          <ProtectedRoute>
            <BookingCalendar />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <ProtectedRoute>
            <NotificationPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

// Dashboard router based on user role
const DashboardRouter = () => {
  const { isOwner, isAdmin } = useCourtFlow();
  if (isAdmin || isOwner) return <OwnerDashboard />;
  return <PlayerDashboard />;
};
