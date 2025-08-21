import React from 'react';
// Corrected: Removed .tsx from import paths
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
// Corrected: Removed incorrect path and .tsx extension
import AdminDashboard from './components/Admindashboard';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return user.role === 'admin' ? <AdminDashboard /> : <StudentDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <AppContent />
      </AlertProvider>
    </AuthProvider>
  );
}

export default App;
