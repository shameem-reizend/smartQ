import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, Clock, Users, LogOut, ChevronRight, Sparkles } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50">
      {/* Enhanced Header with Glass Morphism */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-2 rounded-lg">
              <Sparkles className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              SmartQ
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-gray-800 capitalize">{user?.name}</p>
              <p className="text-sm text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:shadow-lg hover:border-red-200 hover:bg-red-50 hover:text-red-700 transition-all duration-300 font-semibold group"
            >
              <LogOut size={18} className="group-hover:scale-110 transition-transform" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content with Enhanced Layout */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Premium Welcome Section */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 border border-white/40 shadow-sm mb-4">
            <Sparkles size={16} className="text-blue-500" />
            <span className="text-sm font-medium text-gray-600">Welcome back</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-800 mb-3">
            Hello, <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent capitalize">{user?.name}</span>!
          </h2>
          <p className="text-gray-600 text-lg">Ready to manage your queues efficiently?</p>
        </div>

        {/* Enhanced Feature Cards with 3D Effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {isProvider && (
            <>
              <div
                onClick={() => navigate('/services')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Package className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Manage Services</h3>
                  <p className="text-gray-600 mb-4">Create and manage your service offerings</p>
                  <div className="flex items-center text-blue-600 font-semibold">
                    <span>Get started</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>

              <div
                onClick={() => navigate('/queue-management')}
                className="group relative cursor-pointer"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
                <div className="relative bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:-translate-y-2">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                    <Clock className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">Queue Management</h3>
                  <p className="text-gray-600 mb-4">Create and manage queues for your services</p>
                  <div className="flex items-center text-green-600 font-semibold">
                    <span>Manage queues</span>
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </>
          )}

          <div
            onClick={() => navigate('/queues')}
            className="group relative cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>
            <div className="relative bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-white/50 group-hover:-translate-y-2">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-500 p-4 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                {isProvider ? 'View All Queues' : 'Join Queues'}
              </h3>
              <p className="text-gray-600 mb-4">
                {isProvider ? 'View and monitor all queues' : 'Browse and join available queues'}
              </p>
              <div className="flex items-center text-cyan-600 font-semibold">
                <span>{isProvider ? 'Monitor' : 'Browse queues'}</span>
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Guide Sections with Glass Morphism */}
        {!isProvider && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Sparkles className="text-blue-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Getting Started Guide</h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
                <span>Browse available queues in the "Join Queues" section</span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
                <span>Click "Join Queue" to add yourself to a queue</span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50 transition-colors">
                <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
                <span>Track your position and status in real-time</span>
              </li>
            </ul>
          </div>
        )}

        {isProvider && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-green-100 p-2 rounded-lg">
                <Sparkles className="text-green-600" size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Provider Success Guide</h3>
            </div>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors">
                <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">1</div>
                <span>Create services to define what you offer</span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors">
                <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">2</div>
                <span>Create queues for specific dates and services</span>
              </li>
              <li className="flex items-center gap-4 p-3 rounded-lg hover:bg-green-50 transition-colors">
                <div className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">3</div>
                <span>Manage queue entries and update customer status</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;