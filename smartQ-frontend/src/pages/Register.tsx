import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, Sparkles, Smartphone, User, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword, validatePhone } from '../utils/validation';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { register } = useAuth();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.valid) {
      newErrors.password = passwordValidation.message || 'Invalid password';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (formData.phone && !validatePhone(formData.phone)) {
      newErrors.phone = 'Invalid phone number format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone || undefined,
      });
      showNotification('🎉 Registration successful! Please login.', 'success');
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
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
        <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-cyan-600 to-blue-600 text-white p-12 w-1/2 relative overflow-hidden">
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
                <span className="font-semibold">Join Thousands of Users</span>
              </div>
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
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-white/80 text-sm">
              Start your journey with seamless queue management today
            </p>
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-12">
          <div className="max-w-md mx-auto">
            {/* Mobile Logo */}
            <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
              <div className="bg-gradient-to-br from-cyan-600 to-blue-600 p-3 rounded-2xl">
                <Smartphone className="text-white" size={28} />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                SmartQ
              </h1>
            </div>

            {/* Welcome Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-cyan-50 rounded-full px-4 py-2 border border-cyan-200 mb-4">
                <Sparkles size={16} className="text-cyan-500" />
                <span className="text-sm font-medium text-cyan-700">Join SmartQ</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-3">
                Create Your <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Account</span>
              </h2>
              <p className="text-gray-600">Fill in your details to get started</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                  Full Name *
                </label>
                <div className="relative">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
                      errors.name 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 group-hover:border-cyan-300'
                    }`}
                    placeholder="John Doe"
                  />
                  <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    • {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  Email Address *
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
                      errors.email 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 group-hover:border-cyan-300'
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

              {/* Phone Field */}
              <div className="group">
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-3">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pl-12 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
                      errors.phone 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 group-hover:border-cyan-300'
                    }`}
                    placeholder="+1234567890"
                  />
                  <Phone size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    • {errors.phone}
                  </p>
                )}
              </div>

              {/* Role Field */}
              <div className="group">
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-3">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 group-hover:border-cyan-300"
                >
                  <option value="user">User</option>
                  <option value="service provider">Service Provider</option>
                </select>
              </div>

              {/* Password Field */}
              <div className="group">
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  Password *
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pr-12 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
                      errors.password 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 group-hover:border-cyan-300'
                    }`}
                    placeholder="At least 6 characters"
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

              {/* Confirm Password Field */}
              <div className="group">
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-3">
                  Confirm Password *
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`w-full px-4 py-4 pr-12 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300 ${
                      errors.confirmPassword 
                        ? 'border-red-300 focus:ring-red-500' 
                        : 'border-gray-300 group-hover:border-cyan-300'
                    }`}
                    placeholder="Re-enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                    • {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full group relative bg-gradient-to-r from-cyan-600 to-blue-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 border border-cyan-500/20 overflow-hidden"
              >
                <div className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <UserPlus size={20} />
                      Create Account
                    </>
                  )}
                </div>
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </form>

            {/* Sign In Link */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link 
                  to="/login" 
                  className="text-cyan-600 hover:text-cyan-700 font-semibold hover:underline transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>

            {/* Quick Info */}
            <div className="mt-8 bg-cyan-50/50 rounded-xl p-4 border border-cyan-200">
              <p className="text-sm text-cyan-700 text-center">
                💡 Choose "Service Provider" role if you want to create and manage queues
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;