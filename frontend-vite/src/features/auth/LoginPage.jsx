/**
 * CourtFlow — Login / Register Page
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TennisBall, Mail, Lock, UserPlus, Eye, EyeOff } from 'lucide-react';
import { authApi } from '../../services/courtflowApi';
import { useCourtFlow } from '../../context/CourtFlowContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';

export const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useCourtFlow();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isLogin) {
        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        const { data } = await authApi.register({ name, email, password });
        login(data.data.user, data.data.accessToken, data.data.refreshToken);
      } else {
        const { data } = await authApi.login({ email, password });
        login(data.data.user, data.data.accessToken, data.data.refreshToken);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error?.message || err.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TennisBall className="text-amber-500" size={40} />
            <span className="text-3xl font-bold text-white">CourtFlow</span>
          </div>
          <p className="text-gray-400">
            {isLogin ? 'Welcome back! Sign in to continue' : 'Create your CourtFlow account'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-gray-800/80 border border-gray-700/50 rounded-2xl p-8 shadow-xl">
          {/* Tabs */}
          <div className="flex mb-6 bg-gray-900/50 rounded-xl p-1">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                isLogin ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${
                !isLogin ? 'bg-amber-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="Full Name"
                placeholder="John Smith"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={UserPlus}
                required
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={Mail}
              required
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {!isLogin && (
              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                icon={Lock}
                required
              />
            )}

            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-amber-500 hover:text-amber-400">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full" size="lg">
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-amber-500 hover:text-amber-400 font-medium"
            >
              {isLogin ? 'Register' : 'Sign In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

