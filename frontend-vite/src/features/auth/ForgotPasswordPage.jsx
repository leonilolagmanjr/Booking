/**
 * CourtFlow — Forgot Password Page
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { TennisBall, Mail, ArrowLeft } from 'lucide-react';
import { authApi } from '../../services/courtflowApi';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await authApi.forgotPassword(email);
      if (data.success) {
        setSent(true);
      }
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <TennisBall className="text-amber-500 mx-auto mb-4" size={48} />
          <h1 className="text-2xl font-bold text-white mb-2">Check Your Email</h1>
          <p className="text-gray-400 mb-6">
            If an account exists with {email}, we've sent a password reset link.
          </p>
          <Link to="/auth">
            <Button variant="outline">Back to Sign In</Button>
          </Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <TennisBall className="text-amber-500 mx-auto" size={40} />
          <h1 className="text-2xl font-bold text-white mt-4">Reset Password</h1>
          <p className="text-gray-400 mt-2">Enter your email and we'll send you a reset link</p>
        </div>
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <Button type="submit" loading={loading} className="w-full">
              Send Reset Link
            </Button>
          </form>
          <Link to="/auth" className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400 hover:text-white">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
    </div>
  );
};
