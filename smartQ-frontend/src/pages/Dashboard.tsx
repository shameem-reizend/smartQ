import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isProvider = user?.role === 'service provider' || user?.role === 'admin';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">SmartQ</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800 capitalize">{user?.name}</p>
              <p className="text-sm text-gray-600">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-semibold"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Welcome back, {user?.name}!</h2>
          <p className="text-gray-600">What would you like to do today?</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isProvider && (
            <>
              <div
                onClick={() => navigate('/services')}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="bg-blue-100 p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition">
                  <Package className="text-blue-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Manage Services</h3>
                <p className="text-gray-600">Create and manage your service offerings</p>
              </div>

              <div
                onClick={() => navigate('/queue-management')}
                className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer group"
              >
                <div className="bg-green-100 p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition">
                  <Clock className="text-green-600" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Queue Management</h3>
                <p className="text-gray-600">Create and manage queues for your services</p>
              </div>
            </>
          )}

          <div
            onClick={() => navigate('/queues')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition cursor-pointer group"
          >
            <div className="bg-cyan-100 p-4 rounded-full w-fit mb-4 group-hover:scale-110 transition">
              <Users className="text-cyan-600" size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {isProvider ? 'View All Queues' : 'Join Queues'}
            </h3>
            <p className="text-gray-600">
              {isProvider ? 'View and monitor all queues' : 'Browse and join available queues'}
            </p>
          </div>
        </div>

        {!isProvider && (
          <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Getting Started</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                Browse available queues in the "Join Queues\" section
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                Click "Join Queue\" to add yourself to a queue
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                Track your position and status in real-time
              </li>
            </ul>
          </div>
        )}

        {isProvider && (
          <div className="mt-8 bg-green-50 border-2 border-green-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Provider Guide</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                Create services to define what you offer
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                Create queues for specific dates and services
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-600">•</span>
                Manage queue entries and update customer status
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
