import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
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

  const { user } = useAuth();
  const navigate = useNavigate();
  const { notification, showNotification, hideNotification } = useNotification();

  useEffect(() => {
    if (id) {
      fetchQueueDetails();
      fetchQueueEntries();
      const interval = setInterval(() => {
        fetchQueueEntries();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

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
      showNotification(`Entry status updated to ${status}`, 'success');
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
        return 'bg-yellow-100 text-yellow-700';
      case 'served':
        return 'bg-green-100 text-green-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
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

  const myEntry = entries?.find((entry) => entry.user?.user_id === user?.user_id);

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

      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-6 transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      {queue && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Queue #{queue.service?.name}</h1>
              <p className="text-gray-600 mt-1">
                Date: {new Date(queue.created_at).toLocaleDateString()}
              </p>
            </div>
            <span
              className={`px-4 py-2 rounded-full text-sm font-semibold ${
                queue.status === 'open'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700'
              }`}
            >
              {queue.status.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Users className="text-blue-600" size={24} />
                <span className="text-sm text-gray-600">Total Entries</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">{entries.length}</p>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="text-yellow-600" size={24} />
                <span className="text-sm text-gray-600">waiting</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {entries.filter((e) => e.status === 'waiting').length}
              </p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle className="text-green-600" size={24} />
                <span className="text-sm text-gray-600">served</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {entries.filter((e) => e.status === 'served').length}
              </p>
            </div>
          </div>
        </div>
      )}

      {myEntry && (
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Your Position</h2>
          <div className="flex items-center gap-4">
            <span className="text-4xl font-bold text-blue-600">#{myEntry.queue_number}</span>
            <div>
              <p className="text-gray-700">Status: {myEntry.status}</p>
              <p className="text-sm text-gray-600">
                Joined at: {new Date(myEntry.joined_at).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Queue Entries</h2>

        {entries.length === 0 ? (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-gray-600 text-lg">No entries in this queue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div
                key={entry.entry_id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="bg-gray-100 px-4 py-2 rounded-lg">
                      <span className="text-2xl font-bold text-gray-700">#{entry.queue_number}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {entry.user?.name || `User ${entry.user?.user_id}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        Joined: {new Date(entry.joined_at).toLocaleTimeString()}
                      </p>
                      {entry.served_at && (
                        <p className="text-sm text-gray-600">
                          served: {new Date(entry.served_at).toLocaleTimeString()}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2 ${getStatusColor(
                        entry.status
                      )}`}
                    >
                      {getStatusIcon(entry.status)}
                      {entry.status}
                    </span>

                    {isProvider && entry.status === 'waiting' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(entry.entry_id, 'served')}
                          disabled={loading[entry.entry_id]}
                          className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-200 transition disabled:opacity-50"
                        >
                          Serve
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(entry.entry_id, 'cancelled')}
                          disabled={loading[entry.entry_id]}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-200 transition disabled:opacity-50"
                        >
                          Cancel
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
  );
};

export default QueueDetails;
