import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Clock, XCircle, CheckCircle } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    service_id: '',
    date: new Date().toISOString().split('T')[0],
    max_capacity: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    fetchQueues();
    fetchServices();
  }, []);

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-700';
      case 'closed':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  return (
    <div className="max-w-7xl mx-auto p-6">
      {notification.isVisible && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Queue Management</h1>
          <p className="text-gray-600 mt-1">Create and manage queues for your services</p>
        </div>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-semibold"
        >
          <Plus size={20} />
          Create Queue
        </button>
      </div>

      {showCreateForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Create New Queue</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="service_id" className="block text-sm font-medium text-gray-700 mb-2">
                Service
              </label>
              <select
                id="service_id"
                value={formData.service_id}
                onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.service_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service.service_id} value={service.service_id}>
                    {service.name}
                  </option>
                ))}
              </select>
              {errors.service_id && <p className="text-red-500 text-sm mt-1">{errors.service_id}</p>}
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>
              <input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition ${
                  errors.date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
            </div>

            <div>
              <label htmlFor="max_capacity" className="block text-sm font-medium text-gray-700 mb-2">
                Max Capacity (Optional)
              </label>
              <input
                id="max_capacity"
                type="number"
                value={formData.max_capacity}
                onChange={(e) => setFormData({ ...formData, max_capacity: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                placeholder="Leave empty for unlimited"
                min="1"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Queue'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {queues.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Clock className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg">No queues found</p>
            <p className="text-gray-500 mt-2">Create your first queue to get started</p>
          </div>
        ) : (
          queues.map((queue) => (
            <div
              key={queue.queue_id}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6 cursor-pointer"
              onClick={() => navigate(`/queues/${queue.queue_id}`)}
            >
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(queue.status)}`}>
                  {getStatusIcon(queue.status)}
                  {queue.status.toUpperCase()}
                </span>
              </div>

              <h3 className="text-lg font-bold text-gray-800 mb-2">
                Queue #{queue.service?.name}
              </h3>

              <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p>Date: {new Date(queue.created_at).toLocaleDateString()}</p>
                {queue.max_capacity && (
                  <p>
                    Capacity: {queue.current_size || 0} / {queue.max_capacity}
                  </p>
                )}
                {!queue.max_capacity && <p>Size: {queue.current_size || 0}</p>}
              </div>

              <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                {queue.status !== 'open' && (
                  <button
                    onClick={() => handleStatusUpdate(queue.queue_id, 'open')}
                    className="flex-1 bg-green-100 text-green-700 py-2 rounded-lg text-sm font-semibold hover:bg-green-200 transition"
                  >
                    Open
                  </button>
                )}
                {queue.status !== 'closed' && (
                  <button
                    onClick={() => handleStatusUpdate(queue.queue_id, 'closed')}
                    className="flex-1 bg-red-100 text-red-700 py-2 rounded-lg text-sm font-semibold hover:bg-red-200 transition"
                  >
                    Close
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default QueueManagement;
