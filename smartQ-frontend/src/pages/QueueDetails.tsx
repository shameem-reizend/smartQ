import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, CheckCircle, XCircle, RefreshCw, User, Crown } from 'lucide-react';
import { Queue, QueueEntry } from '../types';
import { queueService } from '../services/queueService';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../hooks/useNotification';
import Notification from '../components/Notification';

const QueueDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [queue, setQueue] = useState<Queue | null>(null);
  const [entries, setEntries] = useState<QueueEntry[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (id) {
      fetchQueueData();
      const interval = setInterval(() => {
        fetchQueueEntries();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [id]);

  const fetchQueueData = async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([fetchQueueDetails(), fetchQueueEntries()]);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchQueueDetails = async () => {
    try {
      const data = await queueService.fetchQueueDetails(id!);
      setQueue(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch queue details';
      showNotification(errorMessage, 'error');
    }
  };

  const fetchQueueEntries = async () => {
    try {
      const data = await queueService.fetchQueueEntries(id!);
      setEntries(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch queue entries';
      showNotification(errorMessage, 'error');
    }
  };

  const handleUpdateStatus = async (
    entryId: string,
    status: 'waiting' | 'served' | 'cancelled'
  ) => {
    setLoading((prev) => ({ ...prev, [entryId]: true }));
    try {
      await queueService.updateEntryStatus(entryId, status);
      showNotification(`🎉 Entry status updated to ${status}`, 'success');
      fetchQueueEntries();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update entry status';
      showNotification(errorMessage, 'error');
    } finally {
      setLoading((prev) => ({ ...prev, [entryId]: false }));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'served':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'served':
        return <CheckCircle size={16} />;
      case 'cancelled':
        return <XCircle size={16} />;
      case 'waiting':
        return <Clock size={16} />;
      default:
        return null;
    }
  };

  const isProvider = user?.role === 'service provider' || user?.role === 'admin';
  const myEntry = entries?.find((entry) => entry.user?.user_id === user?.user_id && entry.status === 'waiting');

  const waitingEntries = entries.filter(e => e.status === 'waiting');
  const servedEntries = entries.filter(e => e.status === 'served');
  const cancelledEntries = entries.filter(e => e.status === 'cancelled');

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
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>
          
          <button
            onClick={fetchQueueData}
            disabled={isRefreshing}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-sm text-gray-600 hover:text-gray-800 px-4 py-2 rounded-xl border border-white/50 hover:shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>

        {/* Queue Header Card */}
        {queue && (
          <div className="group relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-white/50">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-3 rounded-xl shadow-lg">
                      <Users className="text-white" size={24} />
                    </div>
                    <div>
                      <h1 className="text-3xl font-bold text-gray-800">
                        {queue.service?.name || 'Unnamed Queue'}
                      </h1>
                      <p className="text-gray-600 mt-1 flex items-center gap-2">
                        <Clock size={16} />
                        Created: {new Date(queue.created_at).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${
                    queue.status === 'open'
                      ? 'bg-green-100 text-green-700 border-green-200'
                      : 'bg-red-100 text-red-700 border-red-200'
                  }`}
                >
                  {queue.status.toUpperCase()}
                </span>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Users size={20} />
                    <span className="text-sm font-medium">Total Entries</span>
                  </div>
                  <p className="text-2xl font-bold">{entries.length}</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-500 to-amber-500 text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock size={20} />
                    <span className="text-sm font-medium">Waiting</span>
                  </div>
                  <p className="text-2xl font-bold">{waitingEntries.length}</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle size={20} />
                    <span className="text-sm font-medium">Served</span>
                  </div>
                  <p className="text-2xl font-bold">{servedEntries.length}</p>
                </div>

                <div className="bg-gradient-to-br from-red-500 to-pink-500 text-white p-4 rounded-xl shadow-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle size={20} />
                    <span className="text-sm font-medium">Cancelled</span>
                  </div>
                  <p className="text-2xl font-bold">{cancelledEntries.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Position Card */}
        {myEntry && (
          <div className="group relative mb-8">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-cyan-500 p-4 rounded-xl shadow-lg">
                    <Crown className="text-white" size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-1">Your Position</h2>
                    <p className="text-gray-600 flex items-center gap-2">
                      <Clock size={16} />
                      Joined: {new Date(myEntry.joined_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    #{myEntry.queue_number}
                  </span>
                  <p className="text-sm text-gray-600 mt-1">
                    {waitingEntries.findIndex(e => e.entry_id === myEntry.entry_id) + 1} in line
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Queue Entries Section */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-gray-500 to-slate-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
          <div className="relative bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/50">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-gray-500 to-slate-500 p-3 rounded-xl shadow-lg">
                  <Users className="text-white" size={24} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Queue Entries</h2>
              </div>
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-semibold border border-gray-200">
                {entries.length} total
              </span>
            </div>

            {entries.length === 0 ? (
              <div className="text-center py-12">
                <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-8 max-w-md mx-auto border border-white/40">
                  <Users className="mx-auto text-gray-400 mb-4" size={64} />
                  <h3 className="text-xl font-bold text-gray-800 mb-2">No Entries Yet</h3>
                  <p className="text-gray-600">Be the first to join this queue!</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.entry_id}
                    className="group/entry relative bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`relative ${
                          entry.user?.user_id === user?.user_id 
                            ? 'bg-gradient-to-br from-blue-500 to-cyan-500 text-white' 
                            : 'bg-gray-100 text-gray-700'
                        } px-4 py-3 rounded-xl font-bold text-lg min-w-[70px] text-center shadow-lg`}>
                          #{entry.queue_number}
                          {entry.user?.user_id === user?.user_id && (
                            <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                              <User size={12} className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 flex items-center gap-2">
                            {entry.user?.name || `User ${entry.user?.user_id}`}
                            {entry.user?.user_id === user?.user_id && (
                              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">You</span>
                            )}
                          </p>
                          <p className="text-sm text-gray-600 flex items-center gap-1">
                            <Clock size={14} />
                            Joined: {new Date(entry.joined_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                              hour12: true,
                            })}
                          </p>
                          {entry.served_at && (
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <CheckCircle size={14} />
                              Served: {new Date(entry.served_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true,
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-2 rounded-full text-sm font-semibold flex items-center gap-2 border ${getStatusColor(
                            entry.status
                          )}`}
                        >
                          {getStatusIcon(entry.status)}
                          {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                        </span>

                        {isProvider && entry.status === 'waiting' && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleUpdateStatus(entry.entry_id, 'served')}
                              disabled={loading[entry.entry_id]}
                              className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 border border-green-500/20"
                            >
                              {loading[entry.entry_id] ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-2"></div>
                              ) : (
                                'Serve'
                              )}
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(entry.entry_id, 'cancelled')}
                              disabled={loading[entry.entry_id]}
                              className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 disabled:hover:scale-100 border border-red-500/20"
                            >
                              {loading[entry.entry_id] ? (
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mx-2"></div>
                              ) : (
                                'Cancel'
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueueDetails;