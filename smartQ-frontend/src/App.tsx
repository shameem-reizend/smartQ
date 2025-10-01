import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ServiceDashboard from './pages/ServiceDashboard';
import QueueManagement from './pages/QueueManagement';
import UserQueues from './pages/UserQueues';
import QueueDetails from './pages/QueueDetails';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              <ProtectedRoute requireProvider>
                <ServiceDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queue-management"
            element={
              <ProtectedRoute requireProvider>
                <QueueManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queues"
            element={
              <ProtectedRoute>
                <UserQueues />
              </ProtectedRoute>
            }
          />
          <Route
            path="/queues/:id"
            element={
              <ProtectedRoute>
                <QueueDetails />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
