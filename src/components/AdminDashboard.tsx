import React, { useState } from 'react';
import { Shield, AlertTriangle, MessageCircle, MapPin, Users, LogOut, Eye, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertContext';
import Heatmap from './Heatmap';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { sosAlerts, chatbotAlerts, updateSOSAlert, updateChatbotAlert } = useAlerts();
  const [activeTab, setActiveTab] = useState<'overview' | 'sos' | 'chatbot' | 'heatmap'>('overview');

  const activeSOSAlerts = sosAlerts.filter(alert => alert.status === 'active').length;
  const newChatbotAlerts = chatbotAlerts.filter(alert => alert.status === 'new').length;
  const totalIncidents = sosAlerts.length + chatbotAlerts.length;

  const renderContent = () => {
    switch (activeTab) {
      case 'sos':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">SOS Alerts</h2>
              <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                {activeSOSAlerts} Active
              </div>
            </div>

            <div className="space-y-4">
              {sosAlerts.map(alert => (
                <div key={alert.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-3 ${
                        alert.status === 'active' ? 'bg-red-100' :
                        alert.status === 'investigating' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <AlertTriangle className={`h-6 w-6 ${
                          alert.status === 'active' ? 'text-red-600' :
                          alert.status === 'investigating' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{alert.studentName}</h3>
                        <p className="text-gray-600 mb-2">{alert.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {alert.location.latitude.toFixed(6)}, {alert.location.longitude.toFixed(6)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={alert.status}
                        onChange={(e) => updateSOSAlert(alert.id, { status: e.target.value as any })}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                      >
                        <option value="active">Active</option>
                        <option value="investigating">Investigating</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {sosAlerts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No SOS alerts at this time</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'chatbot':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Chatbot Alerts</h2>
              <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                {newChatbotAlerts} New
              </div>
            </div>

            <div className="space-y-4">
              {chatbotAlerts.map(alert => (
                <div key={alert.id} className="bg-white border border-gray-200 rounded-xl p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`rounded-full p-3 ${
                        alert.riskLevel === 'high' ? 'bg-red-100' :
                        alert.riskLevel === 'medium' ? 'bg-yellow-100' :
                        'bg-blue-100'
                      }`}>
                        <MessageCircle className={`h-6 w-6 ${
                          alert.riskLevel === 'high' ? 'text-red-600' :
                          alert.riskLevel === 'medium' ? 'text-yellow-600' :
                          'text-blue-600'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{alert.studentName}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            alert.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                            alert.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {alert.riskLevel} risk
                          </span>
                        </div>
                        <p className="text-gray-700 mb-3 bg-gray-50 p-3 rounded-lg">
                          "{alert.conversation}"
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {alert.detectedKeywords.map(keyword => (
                            <span key={keyword} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                              {keyword}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {new Date(alert.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={alert.status}
                        onChange={(e) => updateChatbotAlert(alert.id, { status: e.target.value as any })}
                        className="border border-gray-300 rounded-lg px-3 py-1 text-sm"
                      >
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
              {chatbotAlerts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No chatbot alerts at this time</p>
                </div>
              )}
            </div>
          </div>
        );

      case 'heatmap':
        return <Heatmap />;

      default:
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-red-100 rounded-full p-3">
                    <AlertTriangle className="h-6 w-6 text-red-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{activeSOSAlerts}</p>
                    <p className="text-gray-600">Active SOS</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-orange-100 rounded-full p-3">
                    <MessageCircle className="h-6 w-6 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{newChatbotAlerts}</p>
                    <p className="text-gray-600">New Chat Alerts</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 rounded-full p-3">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalIncidents}</p>
                    <p className="text-gray-600">Total Incidents</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 rounded-full p-3">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">1,247</p>
                    <p className="text-gray-600">Active Students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent SOS Alerts</h3>
                <div className="space-y-3">
                  {sosAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                      <div className="flex-1">
                        <p className="font-medium text-red-900">{alert.studentName}</p>
                        <p className="text-sm text-red-700">{new Date(alert.timestamp).toLocaleString()}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'active' ? 'bg-red-100 text-red-800' :
                        alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </div>
                    </div>
                  ))}
                  {sosAlerts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent SOS alerts</p>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Chatbot Alerts</h3>
                <div className="space-y-3">
                  {chatbotAlerts.slice(0, 3).map(alert => (
                    <div key={alert.id} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-orange-600" />
                      <div className="flex-1">
                        <p className="font-medium text-orange-900">{alert.studentName}</p>
                        <p className="text-sm text-orange-700">Risk: {alert.riskLevel}</p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        alert.status === 'new' ? 'bg-orange-100 text-orange-800' :
                        alert.status === 'reviewed' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {alert.status}
                      </div>
                    </div>
                  ))}
                  {chatbotAlerts.length === 0 && (
                    <p className="text-gray-500 text-center py-4">No recent chatbot alerts</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

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
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="font-medium text-gray-900">{user?.name}</p>
                <p className="text-sm text-gray-600">Administrator</p>
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
                    onClick={() => setActiveTab('overview')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'overview' ? 'bg-blue-100 text-blue-900' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <TrendingUp className="h-5 w-5" />
                    Overview
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
                    SOS Alerts
                    {activeSOSAlerts > 0 && (
                      <span className="bg-red-600 text-white text-xs rounded-full px-2 py-1 ml-auto">
                        {activeSOSAlerts}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('chatbot')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'chatbot' ? 'bg-orange-100 text-orange-900' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Chatbot Alerts
                    {newChatbotAlerts > 0 && (
                      <span className="bg-orange-600 text-white text-xs rounded-full px-2 py-1 ml-auto">
                        {newChatbotAlerts}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('heatmap')}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === 'heatmap' ? 'bg-green-100 text-green-900' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <MapPin className="h-5 w-5" />
                    Risk Heatmap
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

export default AdminDashboard;