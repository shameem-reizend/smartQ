import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, XCircle, CheckCircle, Zap, Calendar, Users, ChevronRight } from 'lucide-react';
import { Queue, Service } from '../types';
import { queueService } from '../services/queueService';
import { serviceService } from '../services/serviceService';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';

const QueueManagement: React.FC = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [formData, setFormData] = useState({
    service_id: '',
    date: new Date().toISOString().split('T')[0],
    max_capacity: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchQueues(), fetchServices()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchQueues = async () => {
    try {
      const data = await queueService.fetchQueues();
      setQueues(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch queues';
      showNotification(errorMessage, 'error');
    }
  };

  const fetchServices = async () => {
    try {
      const data = await serviceService.fetchServices();
      setServices(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch services';
      showNotification(errorMessage, 'error');
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.service_id) {
      newErrors.service_id = 'Service is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await queueService.createQueue({
        service: formData.service_id,
        max_capacity: formData.max_capacity ? parseInt(formData.max_capacity) : undefined,
      });
      showNotification('Queue created successfully!', 'success');
      setFormData({
        service_id: '',
        date: new Date().toISOString().split('T')[0],
        max_capacity: '',
      });
      setShowCreateForm(false);
      fetchQueues();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to create queue';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (queueId: string, status: 'open' | 'closed') => {
    try {
      await queueService.updateQueueStatus(queueId, status);
      showNotification(`Queue ${status} successfully!`, 'success');
      fetchQueues();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update queue status';
      showNotification(errorMessage, 'error');
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setFormData({
      service_id: '',
      date: new Date().toISOString().split('T')[0],
      max_capacity: '',
    });
    setErrors({});
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

  const openQueues = queues.filter(q => q.status === 'open');
  const closedQueues = queues.filter(q => q.status === 'closed');

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
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-2xl shadow-lg">
              <Clock className="text-white" size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Queue Management</h1>
              <p className="text-gray-600 mt-1">Create and manage queues for your services</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={fetchData}
              disabled={isRefreshing}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
            >
              <Zap size={18} className={isRefreshing ? 'animate-spin' : ''} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all duration-300 font-semibold hover:scale-105 border border-green-500/20 group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              Create Queue
            </button>
          </div>
        </div>

        {/* Create Queue Form */}
        {showCreateForm && (
          <div className="group relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-xl shadow-lg">
                    <Plus className="text-white" size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">Create New Queue</h2>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Service Selection */}
                  <div className="group/input">
                    <label htmlFor="service_id" className="block text-sm font-semibold text-gray-700 mb-3">
                      Service *
                    </label>
                    <select
                      id="service_id"
                      value={formData.service_id}
                      onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                      className={`w-full px-4 py-4 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                        errors.service_id 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-gray-300 group-hover/input:border-green-300'
                      }`}
                    >
                      <option value="">Select a service</option>
                      {services.map((service) => (
                        <option key={service.service_id} value={service.service_id}>
                          {service.name}
                        </option>
                      ))}
                    </select>
                    {errors.service_id && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        • {errors.service_id}
                      </p>
                    )}
                  </div>

                  {/* Date Selection */}
                  <div className="group/input">
                    <label htmlFor="date" className="block text-sm font-semibold text-gray-700 mb-3">
                      Date *
                    </label>
                    <div className="relative">
                      <input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className={`w-full px-4 py-4 pl-12 bg-white/60 backdrop-blur-sm border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 ${
                          errors.date 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-gray-300 group-hover/input:border-green-300'
                        }`}
                      />
                      <Calendar size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                    {errors.date && (
                      <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                        • {errors.date}
                      </p>
                    )}
                  </div>
                </div>

                {/* Max Capacity */}
                <div className="group/input">
                  <label htmlFor="max_capacity" className="block text-sm font-semibold text-gray-700 mb-3">
                    Max Capacity
                  </label>
                  <div className="relative">
                    <input
                      id="max_capacity"
                      type="number"
                      value={formData.max_capacity}
                      onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                      className="w-full px-4 py-4 pl-12 bg-white/60 backdrop-blur-sm border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 group-hover/input:border-green-300"
                      placeholder="Leave empty for unlimited capacity"
                      min="1"
                    />
                    <Users size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-sm mt-2">
                    💡 Leave empty for unlimited entries
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 border border-green-500/20"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Creating Queue...
                      </div>
                    ) : (
                      'Create Queue'
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

        {/* Quick Stats */}
        {queues.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} />
                <span className="text-sm font-medium">Total Queues</span>
              </div>
              <p className="text-2xl font-bold">{queues.length}</p>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle size={20} />
                <span className="text-sm font-medium">Open</span>
              </div>
              <p className="text-2xl font-bold">{openQueues.length}</p>
            </div>
            <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <XCircle size={20} />
                <span className="text-sm font-medium">Closed</span>
              </div>
              <p className="text-2xl font-bold">{closedQueues.length}</p>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-indigo-500 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} />
                <span className="text-sm font-medium">Total in Queue</span>
              </div>
              <p className="text-2xl font-bold">
                {queues.reduce((acc, queue) => acc + (queue.current_size || 0), 0)}
              </p>
            </div>
          </div>
        )}

        {/* Queues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {queues.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 max-w-md mx-auto">
                <Clock className="mx-auto text-gray-400 mb-6" size={80} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">No Queues Found</h3>
                <p className="text-gray-600 mb-2">Get started by creating your first queue</p>
                <p className="text-gray-500 text-sm">Your queues will appear here once created</p>
              </div>
            </div>
          ) : (
            queues.map((queue) => (
              <div
                key={queue.queue_id}
                className="group relative cursor-pointer"
                onClick={() => navigate(`/queues/${queue.queue_id}`)}
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300 ${
                  queue.status === 'open' ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-red-500 to-pink-500'
                }`}></div>
                
                <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:-translate-y-2">
                  {/* Status Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border ${getStatusColor(queue.status)}`}>
                      {getStatusIcon(queue.status)}
                      {queue.status.toUpperCase()}
                    </span>
                  </div>

                  {/* Queue Info */}
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                      {queue.service?.name || 'Unnamed Queue'}
                    </h3>

                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>
                          {new Date(queue.created_at).toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span>
                          {queue.max_capacity 
                            ? `${queue.current_size || 0} / ${queue.max_capacity} people`
                            : `${queue.current_size || 0} people in queue`
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Capacity Bar */}
                  {queue.max_capacity && (
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getCapacityColor(queue)}`}
                          style={{ 
                            width: `${Math.min(100, ((queue.current_size || 0) / queue.max_capacity) * 100)}%` 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    {queue.status !== 'open' && (
                      <button
                        onClick={() => handleStatusUpdate(queue.queue_id, 'open')}
                        className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-green-500/20"
                      >
                        Open
                      </button>
                    )}
                    {queue.status !== 'closed' && (
                      <button
                        onClick={() => handleStatusUpdate(queue.queue_id, 'closed')}
                        className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 border border-red-500/20"
                      >
                        Close
                      </button>
                    )}
                  </div>

                  {/* View Details Arrow */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ChevronRight size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QueueManagement;