import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, Sparkles, Smartphone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail } from '../utils/validation';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { login } = useAuth();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  const validate = (): boolean => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await login(email, password);
      showNotification('Login successful! Redirecting...', 'success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Invalid credentials. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center p-4">
      {notification.isVisible && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        </div>
      )}

      <div className="flex w-full max-w-6xl bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/40">
        {/* Left Side - Brand/Illustration */}
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-600 to-cyan-600 text-white p-12 w-1/2 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full"></div>
            <div className="absolute bottom-20 right-16 w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-sm">
                <Smartphone className="text-white" size={28} />
              </div>
              <h1 className="text-3xl font-bold">SmartQ</h1>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles size={16} />
                </div>
                <span className="font-semibold">Smart Queue Management</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles size={16} />
                </div>
                <span className="font-semibold">Real-time Updates</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Sparkles size={16} />
                </div>
                <span className="font-semibold">Seamless Experience</span>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white/80 text-sm">
              Join thousands of users managing their queues efficiently
            </p>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-2xl">
                <Smartphone className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                SmartQ
              </h1>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-50 rounded-full px-4 py-2 border border-blue-200 mb-4">
                <Sparkles size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-blue-700">Welcome back</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Sign In to <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">SmartQ</span>
              </h2>
              <p className="text-gray-600">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-4 py-4 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 group-hover:border-blue-300'
                    }`}
                    placeholder="you@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    • {errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full px-4 py-4 pr-12 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 group-hover:border-blue-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    • {errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 border border-blue-500/20 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing In...
                    </>
                  ) : (
                    <>
                      <LogIn size={20} />
                      Sign In
                    </>
                  )}
                </div>
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-blue-600 hover:text-blue-700 font-semibold hover:underline transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>

            {/* Quick Demo Info */}
            <div className="mt-8 bg-blue-50/50 rounded-xl p-4 border border-blue-200">
              <p className="text-sm text-blue-700 text-center">
                💡 Demo: Use your registered credentials to explore SmartQ
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;