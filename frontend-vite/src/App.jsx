import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useCourtFlow } from './context/CourtFlowContext';
import { Layout } from './components/layout/Layout';
import { Spinner } from './components/common/Spinner';

// Lazy load pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const LoginPage = lazy(() => import('./features/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('./features/auth/ForgotPasswordPage'));
const Venues = lazy(() => import('./pages/Venues'));
const VenueDetail = lazy(() => import('./pages/VenueDetail'));
const BookingFlow = lazy(() => import('./pages/BookingFlow'));
const MyBookings = lazy(() => import('./pages/MyBookings'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const BusinessDashboard = lazy(() => import('./pages/BusinessDashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const ProfilePage = lazy(() => import('./features/profile/ProfilePage'));
const NotificationPage = lazy(() => import('./features/notifications/NotificationPage'));
const AdminPage = lazy(() => import('./features/admin/AdminPage'));
const Availability = lazy(() => import('./pages/Availability'));
const Calendar = lazy(() => import('./pages/CalendarPage'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <Spinner size="lg" />
  </div>
);

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, loading } = useCourtFlow();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0f1420]">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <Layout>{children}</Layout>;
};

const PublicRoute = ({ children }) => {
  return <Layout>{children}</Layout>;
};

const App = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />

        {/* Public Pages with Layout */}
        <Route path="/venues" element={<PublicRoute><Venues /></PublicRoute>} />
        <Route path="/venues/:id" element={<PublicRoute><VenueDetail /></PublicRoute>} />

        {/* Protected Routes */}
        <Route path="/booking" element={<ProtectedRoute><BookingFlow /></ProtectedRoute>} />
        <Route path="/bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/business" element={<ProtectedRoute><BusinessDashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationPage /></ProtectedRoute>} />
        <Route path="/availability" element={<ProtectedRoute><Availability /></ProtectedRoute>} />
        <Route path="/calendar" element={<ProtectedRoute><Calendar /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
        <Route path="/admin/*" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />

        {/* 404 */}
        <Route path="*" element={
          <div className="flex flex-col items-center justify-center min-h-screen bg-[#0f1420] text-center px-4">
            <h1 className="text-6xl font-black text-[#C08A5D] mb-4">404</h1>
            <p className="text-xl text-white mb-2">Page Not Found</p>
            <p className="text-gray-500 mb-8">The page you're looking for doesn't exist.</p>
            <a
              href="/"
              className="px-6 py-3 rounded-xl bg-[#C08A5D] text-[#0f1420] font-bold hover:bg-[#b07a4e] transition-all no-underline"
            >
              Go Home
            </a>
          </div>
        } />
      </Routes>
    </Suspense>
  );
};

export default App;

