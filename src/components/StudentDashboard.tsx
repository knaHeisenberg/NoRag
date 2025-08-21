import React, { useState } from 'react';
import { Shield, AlertTriangle, MessageCircle, MapPin, LogOut, Phone, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertContext';
import SOSButton from './SOSbutton';
import Chatbot from './Chatbot';

const StudentDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { sosAlerts = [], chatbotAlerts = [] } = useAlerts(); // <-- fallback to empty arrays
  const [activeTab, setActiveTab] = useState<'home' | 'sos' | 'chat'>('home');

  const userAlerts = sosAlerts.filter(alert => alert.studentId === user?.id);
  const userChatAlerts = chatbotAlerts.filter(alert => alert.studentId === user?.id);

  const renderContent = () => {
    switch (activeTab) {
      case 'sos':
        return <SOSButton />;
      case 'chat':
        return <Chatbot />;
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-2">Welcome back, {user?.name}</h2>
              <p className="text-blue-100">Your safety is our priority. Use the tools below if you need help.</p>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setActiveTab('sos')}
                className="bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-xl p-6 text-left transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-red-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <AlertTriangle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-red-900">Emergency SOS</h3>
                    <p className="text-red-700">Get immediate help</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('chat')}
                className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl p-6 text-left transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-green-600 rounded-full p-3 group-hover:scale-110 transition-transform">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Crescent Companion</h3>
                    <p className="text-green-700">Talk to our AI assistant</p>
                  </div>
                </div>
              </button>
            </div>

            {/* Emergency Contacts */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Emergency Contacts
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-blue-600 rounded-full p-2">
                    <Shield className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Campus Security</p>
                    <p className="text-sm text-gray-600">+91 9876543210</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="bg-red-600 rounded-full p-2">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Anti-Ragging Cell</p>
                    <p className="text-sm text-gray-600">+91 9876543211</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            {(userAlerts.length > 0 || userChatAlerts.length > 0) && (
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="space-y-3">
                  {userAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div>
                        <p className="font-medium text-red-900">SOS Alert Sent</p>
                        <p className="text-sm text-red-700">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                      <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </div>
                    </div>
                  ))}
                  {userChatAlerts.slice(0, 2).map(alert => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-orange-600" />
                      <div>
                        <p className="font-medium text-orange-900">Companion Alert</p>
                        <p className="text-sm text-orange-700">Risk level: {alert.riskLevel}</p>
                      </div>
                      <div className={`ml-auto px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'new' ? 'bg-orange-100 text-orange-800' :
                        alert.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  if (!user) {
    return <div>Loading user...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 rounded-lg p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Crescent Sentinel</h1>
                <p className="text-sm text-gray-600">Student Portal</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Navigation Sidebar */}
          <div className="lg:w-64">
            <nav className="bg-white rounded-xl border border-gray-200 p-4">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setActiveTab('home')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'home' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('sos')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'sos' ? 'bg-red-100 text-red-900' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <AlertTriangle className="h-5 w-5" />
                    Emergency SOS
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'chat' ? 'bg-green-100 text-green-900' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Crescent Companion
                  </button>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;