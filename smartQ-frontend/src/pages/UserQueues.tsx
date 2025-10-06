import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListOrdered, Clock, ArrowLeft, Users, Calendar, Zap, ChevronRight } from 'lucide-react';
import { Queue } from '../types';
import { queueService } from '../services/queueService';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';
import { useAuth } from '../context/AuthContext';

const UserQueues: React.FC = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();
  const { user } = useAuth();

  useEffect(() => {
    fetchQueues();
  }, []);

  const fetchQueues = async () => {
    setIsRefreshing(true);
    try {
      const data = await queueService.fetchQueues();
      const activeQueues = data.filter((q) => q.status === 'open');
      setQueues(activeQueues);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch queues';
      showNotification(errorMessage, 'error');
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleJoinQueue = async (queueId: string) => {
    setLoading((prev) => ({ ...prev, [queueId]: true }));
    try {
      const entry = await queueService.joinQueue(queueId, user!.user_id);
      showNotification(`🎉 Successfully joined queue! Your position: ${entry.queue_number}`, 'success');
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
      return { available: true, text: 'Available', color: 'green' };
    }

    const currentSize = queue.current_size || 0;
    const capacity = queue.max_capacity;

    if (currentSize >= capacity) {
      return { available: false, text: 'Full', color: 'red' };
    }

    const percentage = (currentSize / capacity) * 100;
    if (percentage >= 80) {
      return { available: true, text: 'Almost Full', color: 'orange' };
    }

    return { available: true, text: 'Available', color: 'green' };
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-red-500';
    if (percentage >= 60) return 'bg-orange-500';
    return 'bg-green-500';
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
        {/* Enhanced Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back
            </button>
          </div>
          
          <button
            onClick={fetchQueues}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <Zap size={18} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Premium Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40 shadow-sm mb-4">
            <Zap size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Live Queues</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Available <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Queues</span>
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Join a queue and track your position in real-time with seamless updates
          </p>
        </div>

        {/* Enhanced Queue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {queues.length === 0 ? (
            <div className="col-span-full text-center py-16">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 max-w-md mx-auto">
                <ListOrdered className="mx-auto text-gray-400 mb-6" size={80} />
                <h3 className="text-xl font-bold text-gray-800 mb-3">No Active Queues</h3>
                <p className="text-gray-600 mb-2">There are no available queues at the moment</p>
                <p className="text-gray-500 text-sm">Check back later for new queue openings</p>
              </div>
            </div>
          ) : (
            queues.map((queue) => {
              const availability = getAvailabilityStatus(queue);
              const capacityPercentage = queue.max_capacity 
                ? Math.min(100, ((queue.current_size || 0) / queue.max_capacity) * 100)
                : 0;

              return (
                <div
                  key={queue.queue_id}
                  className="group relative cursor-pointer"
                >
                  {/* Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${
                    availability.color === 'green' ? 'from-green-500 to-emerald-500' :
                    availability.color === 'orange' ? 'from-orange-500 to-amber-500' :
                    'from-red-500 to-pink-500'
                  } rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300`}></div>
                  
                  <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:-translate-y-2">
                    {/* Header with Status */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                        <Clock className="text-white" size={24} />
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold backdrop-blur-sm border ${
                          availability.available
                            ? availability.color === 'green' 
                              ? 'bg-green-100 text-green-700 border-green-200'
                              : 'bg-orange-100 text-orange-700 border-orange-200'
                            : 'bg-red-100 text-red-700 border-red-200'
                        }`}
                      >
                        {availability.text}
                      </span>
                    </div>

                    {/* Queue Info */}
                    <h3 className="text-xl font-bold text-gray-800 mb-3 line-clamp-1">
                      {queue.service?.name || 'Unnamed Queue'}
                    </h3>

                    {/* Capacity Bar */}
                    {queue.max_capacity && (
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Capacity</span>
                          <span>{queue.current_size || 0} / {queue.max_capacity}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-500 ${getCapacityColor(capacityPercentage)}`}
                            style={{ width: `${capacityPercentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Queue Details */}
                    <div className="space-y-3 text-sm text-gray-600 mb-6">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-gray-400" />
                        <span>{new Date(queue.created_at).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users size={16} className="text-gray-400" />
                        <span>{queue.current_size || 0} people in queue</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/queues/${queue.queue_id}`);
                        }}
                        className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-all duration-300 border border-gray-200 group/view"
                      >
                        View Details
                        <ChevronRight size={16} className="group-hover/view:translate-x-1 transition-transform" />
                      </button>
                      {user?.role == 'user' && 
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinQueue(queue.queue_id);
                        }}
                        disabled={!availability.available || loading[queue.queue_id]}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 border border-blue-500/20"
                      >
                        {loading[queue.queue_id] ? (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Joining...
                          </div>
                        ) : (
                          'Join Queue'
                        )}
                      </button>
                      }
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Stats Footer */}
        {queues.length > 0 && (
          <div className="mt-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <p className="text-2xl font-bold text-gray-800">{queues.length}</p>
                <p className="text-gray-600 text-sm">Active Queues</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {queues.reduce((acc, queue) => acc + (queue.current_size || 0), 0)}
                </p>
                <p className="text-gray-600 text-sm">Total in Queue</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {queues.filter(q => getAvailabilityStatus(q).available).length}
                </p>
                <p className="text-gray-600 text-sm">Available to Join</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserQueues;