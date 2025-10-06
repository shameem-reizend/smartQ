import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, MapPin, Calendar, Users, Clock, CheckCircle, XCircle, Zap, Plus, Sparkles } from 'lucide-react';
import { Queue, Service } from '../types';
import { serviceService } from '../services/serviceService';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
// import { useAuth } from '../context/AuthContext';

const ServiceDetails: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

//   const { user } = useAuth();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  const fetchServiceDetails = async () => {
    setIsRefreshing(true);
    try {
      const data = await serviceService.fetchServiceDetails(serviceId!);
      setService(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch service details';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open':
        return <CheckCircle size={16} />;
      case 'closed':
        return <XCircle size={16} />;
      default:
        return null;
    }
  };

  const getCapacityColor = (queue: Queue) => {
    if (!queue.max_capacity) return 'bg-blue-500';
    const percentage = ((queue.current_size || 0) / queue.max_capacity) * 100;
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-green-500';
  };

  const openQueues = service?.queues?.filter(q => q.status === 'open') || [];
  const closedQueues = service?.queues?.filter(q => q.status === 'closed') || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading service details...</span>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto text-gray-400 mb-4" size={64} />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Service Not Found</h2>
          <p className="text-gray-600 mb-4">The service you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

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
        {/* Header with Actions */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/services')}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back to Services
          </button>
          
          <button
            onClick={fetchServiceDetails}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <Zap size={18} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Service Header Card */}
        <div className="group relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-2xl shadow-lg">
                  <Package className="text-white" size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {service.name}
                  </h1>
                  <div className="flex items-center gap-4 text-gray-600">
                    {service.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-blue-500" />
                        <span>{service.location}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar size={18} className="text-green-500" />
                      <span>
                        Created: {new Date(service.created_at).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Provider Info */}
            <div className="bg-blue-50/50 rounded-xl p-4 border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Service Provider</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{service.provider?.name}</p>
                    <p className="text-sm text-gray-600">{service.provider?.email}</p>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {service.provider?.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Clock size={20} />
              <span className="text-sm font-medium">Total Queues</span>
            </div>
            <p className="text-2xl font-bold">{service.queues?.length || 0}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Open Queues</span>
            </div>
            <p className="text-2xl font-bold">{openQueues.length}</p>
          </div>

          <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <XCircle size={20} />
              <span className="text-sm font-medium">Closed Queues</span>
            </div>
            <p className="text-2xl font-bold">{closedQueues.length}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center gap-3 mb-2">
              <Users size={20} />
              <span className="text-sm font-medium">Total in Queue</span>
            </div>
            <p className="text-2xl font-bold">
              {service.queues?.reduce((acc, queue) => acc + (queue.current_size || 0), 0) || 0}
            </p>
          </div>
        </div>

        {/* Queues Section */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-gray-500 to-slate-500 p-3 rounded-xl shadow-lg">
                  <Clock className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Service Queues</h2>
              </div>
              <button
                onClick={() => navigate('/queue-management')}
                className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-2 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 border border-green-500/20"
              >
                <Plus size={18} />
                Create Queue
              </button>
            </div>

            {!service.queues || service.queues.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/40">
                  <Clock className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Queues Yet</h3>
                  <p className="text-gray-600 mb-4">Create your first queue for this service</p>
                  <button
                    onClick={() => navigate('/queue-management')}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 rounded-xl hover:shadow-lg transition-all duration-300"
                  >
                    Create Queue
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {service.queues.map((queue) => (
                  <div
                    key={queue.queue_id}
                    className="group/queue relative cursor-pointer"
                    onClick={() => navigate(`/queues/${queue.queue_id}`)}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 rounded-xl blur opacity-20 group-hover/queue:opacity-30 transition duration-300 ${
                      queue.status === 'open' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                    }`}></div>
                    
                    <div className="relative bg-white/60 backdrop-blur-sm rounded-xl p-4 hover:shadow-lg transition-all duration-300 border border-white/40 group-hover/queue:-translate-y-1">
                      {/* Status Header */}
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 border ${getStatusColor(queue.status)}`}>
                          {getStatusIcon(queue.status)}
                          {queue.status.toUpperCase()}
                        </span>
                      </div>

                      {/* Queue Info */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-gray-800 mb-2">
                          Queue #{queue.queue_id.slice(-6)}
                        </h3>
                        
                        <div className="space-y-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>
                              {new Date(queue.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users size={12} />
                            <span>
                              {queue.max_capacity 
                                ? `${queue.current_size || 0} / ${queue.max_capacity}`
                                : `${queue.current_size || 0} people`
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Capacity Bar */}
                      {queue.max_capacity && (
                        <div className="mb-3">
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className={`h-1.5 rounded-full transition-all duration-500 ${getCapacityColor(queue)}`}
                              style={{ 
                                width: `${Math.min(100, ((queue.current_size || 0) / queue.max_capacity) * 100)}%` 
                              }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* View Details */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-blue-600 font-semibold">View Details</span>
                        <div className="opacity-0 group-hover/queue:opacity-100 transition-opacity duration-300">
                          <Sparkles size={12} className="text-blue-500" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Service Information */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Service Details */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Package size={20} className="text-blue-500" />
                Service Information
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Service ID</label>
                  <p className="text-gray-600 text-sm font-mono">{service.service_id}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Created Date</label>
                  <p className="text-gray-600 text-sm">
                    {new Date(service.created_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Provider Details */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
              <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Users size={20} className="text-green-500" />
                Provider Details
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700">Provider Name</label>
                  <p className="text-gray-600 text-sm">{service.provider?.name}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <p className="text-gray-600 text-sm">{service.provider?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-700">Role</label>
                  <p className="text-gray-600 text-sm capitalize">{service.provider?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;