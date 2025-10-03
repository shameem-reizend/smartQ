import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListOrdered, Clock } from 'lucide-react';
import { Queue } from '../types';
import { queueService } from '../services/queueService';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

const UserQueues: React.FC = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();
  const {user} = useAuth();

  useEffect(() => {
    fetchQueues();
    // const interval = setInterval(fetchQueues, 10000);
    // return () => clearInterval(interval);
  }, []);

  const fetchQueues = async () => {
    try {
      const data = await queueService.fetchQueues();
      const activeQueues = data.filter((q) => q.status === 'open');
      setQueues(activeQueues);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch queues';
      showNotification(errorMessage, 'error');
    }
  };

  const handleJoinQueue = async (queueId: string) => {
    setLoading((prev) => ({ ...prev, [queueId]: true }));
    try {
      const entry = await queueService.joinQueue(queueId, user!.user_id);
      showNotification(`Successfully joined queue! Your position: ${entry.queue_number}`, 'success');
      setTimeout(() => {
        navigate(`/queues/${queueId}`);
      }, 1500);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to join queue';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading((prev) => ({ ...prev, [queueId]: false }));
    }
  };

  const getAvailabilityStatus = (queue: Queue) => {
    if (!queue.max_capacity) {
      return { available: true, text: 'Available' };
    }

    const currentSize = queue.current_size || 0;
    const capacity = queue.max_capacity;

    if (currentSize >= capacity) {
      return { available: false, text: 'Full' };
    }

    const percentage = (currentSize / capacity) * 100;
    if (percentage >= 80) {
      return { available: true, text: 'Almost Full' };
    }

    return { available: true, text: 'Available' };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {notification.isVisible && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
          />
        </div>
      )}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Available Queues</h1>
        <p className="text-gray-600 mt-1">Join a queue and track your position in real-time</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {queues.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <ListOrdered className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg">No active queues available</p>
            <p className="text-gray-500 mt-2">Check back later for available queues</p>
          </div>
        ) : (
          queues.map((queue) => {
            const availability = getAvailabilityStatus(queue);
            return (
              <div
                key={queue.queue_id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-2 rounded-lg">
                    <Clock className="text-green-600" size={24} />
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      availability.available
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {availability.text}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  Queue #{queue.service?.name}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <p>Date: {new Date(queue.created_at).toLocaleDateString()}</p>
                  <p>Current Size: {queue.current_size || 0}</p>
                  {queue.max_capacity && <p>Max Capacity: {queue.max_capacity}</p>}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/queues/${queue.queue_id}`)}
                    className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-200 transition"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => handleJoinQueue(queue.queue_id)}
                    disabled={!availability.available || loading[queue.queue_id]}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading[queue.queue_id] ? 'Joining...' : 'Join Queue'}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UserQueues;
