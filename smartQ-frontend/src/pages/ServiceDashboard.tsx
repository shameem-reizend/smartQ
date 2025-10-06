import React, { useState, useEffect } from 'react';
import { Plus, Package, MapPin, Calendar, X, Zap } from 'lucide-react';
import { Service } from '../types';
import { serviceService } from '../services/serviceService';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ServiceDashboard: React.FC = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    provider: user?.user_id,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate()

  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setIsRefreshing(true);
    try {
      const data = await serviceService.fetchServices();
      setServices(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch services';
      showNotification(errorMessage, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await serviceService.createService(formData);
      showNotification('🎉 Service created successfully!', 'success');
      setFormData({ name: '', location: '', provider: user?.user_id });
      setShowCreateForm(false);
      fetchServices();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create service';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setFormData({ name: '', location: '', provider: user?.user_id });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {notification.isVisible && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-2xl shadow-lg">
                <Package className="text-white" size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Service Management</h1>
                <p className="text-gray-600 mt-1">Manage your services and offerings</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchServices}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <Zap size={18} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 border border-blue-500/20 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Create Service
            </button>
          </div>
        </div>

        {/* Create Service Form */}
        {showCreateForm && (
          <div className="group relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                    <Plus className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Create New Service</h2>
                </div>
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Name */}
                  <div className="group/input">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                      Service Name *
                    </label>
                    <div className="relative">
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-4 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${
                          errors.name 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 group-hover/input:border-blue-300'
                        }`}
                        placeholder="e.g., Medical Consultation"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        • {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Location */}
                  <div className="group/input">
                    <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-3">
                      Location
                    </label>
                    <div className="relative">
                      <input
                        id="location"
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-4 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 group-hover/input:border-blue-300"
                        placeholder="Enter service location"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 border border-blue-500/20"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Service...
                      </div>
                    ) : (
                      'Create Service'
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-200 hover:scale-105"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 max-w-md mx-auto">
                <Package className="mx-auto text-gray-400 mb-6" size={80} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">No Services Found</h3>
                <p className="text-gray-600 mb-2">Get started by creating your first service</p>
                <p className="text-gray-500 text-sm">Your services will appear here once created</p>
              </div>
            </div>
          ) : (
            services.map((service) => (
              <div
                key={service.service_id}
                className="group relative cursor-pointer"
              >
                {/* Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:-translate-y-2">
                  {/* Service Header */}
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <Package className="text-white" size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1">
                      {service.name}
                    </h3>
                  </div>

                  {/* Service Details */}
                  <div className="space-y-3 mb-6">
                    {service.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {service.description}
                      </p>
                    )}
                    
                    {service.location && (
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <MapPin size={16} />
                        <span className="line-clamp-1">{service.location}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 text-gray-500 text-sm">
                      <Calendar size={16} />
                      <span>
                        Created: {new Date(service.created_at).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-2">
                    <button 
                    onClick={() => navigate(`/services/${service.service_id}`)}
                    className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-semibold hover:bg-blue-100 transition-colors border border-blue-200">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Stats */}
        {services.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">{services.length}</p>
                <p className="text-gray-600 text-sm">Total Services</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {services.filter(s => s.location).length}
                </p>
                <p className="text-gray-600 text-sm">With Location</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {services.filter(s => s.description).length}
                </p>
                <p className="text-gray-600 text-sm">With Description</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {new Date().getDate()}
                </p>
                <p className="text-gray-600 text-sm">Active Today</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDashboard;