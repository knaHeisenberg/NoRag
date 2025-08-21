import React, { useState } from 'react';
import { MapPin, TrendingUp, Calendar, Users, AlertTriangle } from 'lucide-react';
import { useAlerts } from '../contexts/AlertContext';

const Heatmap: React.FC = () => {
  const { heatmapData } = useAlerts();
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const getRiskColor = (riskLevel: number): string => {
    if (riskLevel >= 8) return 'bg-red-500';
    if (riskLevel >= 6) return 'bg-orange-500';
    if (riskLevel >= 4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getRiskLabel = (riskLevel: number): string => {
    if (riskLevel >= 8) return 'High Risk';
    if (riskLevel >= 6) return 'Medium Risk';
    if (riskLevel >= 4) return 'Low Risk';
    return 'Safe';
  };

  const selectedLocationData = heatmapData.find(item => item.id === selectedLocation);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Campus Risk Heatmap</h2>
          <p className="text-gray-600">Visual representation of ragging incident hotspots</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Visualization */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Campus Map</h3>
          
          {/* Campus Map Container */}
          <div className="relative bg-gradient-to-br from-green-100 to-blue-100 rounded-xl p-8 h-96 overflow-hidden">
            {/* Map Background Elements */}
            <div className="absolute inset-0">
              {/* Roads */}
              <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-300 transform -translate-y-1/2"></div>
              <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-gray-300 transform -translate-x-1/2"></div>
              
              {/* Campus Areas */}
              <div className="absolute top-4 left-4 w-16 h-12 bg-blue-200 rounded opacity-50"></div>
              <div className="absolute top-4 right-4 w-20 h-16 bg-green-200 rounded opacity-50"></div>
              <div className="absolute bottom-4 left-4 w-24 h-20 bg-purple-200 rounded opacity-50"></div>
              <div className="absolute bottom-4 right-4 w-18 h-14 bg-yellow-200 rounded opacity-50"></div>
            </div>

            {/* Risk Points */}
            {heatmapData.map((location) => (
              <div
                key={location.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 group"
                style={{
                  left: `${location.coordinates.x}%`,
                  top: `${location.coordinates.y}%`
                }}
                onClick={() => setSelectedLocation(location.id)}
              >
                <div className={`w-6 h-6 rounded-full ${getRiskColor(location.riskLevel)} opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-200 animate-pulse`}>
                  <div className={`absolute inset-0 rounded-full ${getRiskColor(location.riskLevel)} opacity-30 animate-ping`}></div>
                </div>
                
                {/* Tooltip */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-black text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                  {location.location}
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-2 border-transparent border-t-black"></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Safe</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-600">Low Risk</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Medium Risk</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">High Risk</span>
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          {selectedLocationData ? (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-4 h-4 rounded-full ${getRiskColor(selectedLocationData.riskLevel)}`}></div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedLocationData.location}</h3>
              </div>

              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">Risk Level</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedLocationData.riskLevel >= 8 ? 'bg-red-100 text-red-800' :
                      selectedLocationData.riskLevel >= 6 ? 'bg-orange-100 text-orange-800' :
                      selectedLocationData.riskLevel >= 4 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {getRiskLabel(selectedLocationData.riskLevel)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${getRiskColor(selectedLocationData.riskLevel)}`}
                      style={{ width: `${selectedLocationData.riskLevel * 10}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="font-medium text-gray-900">{selectedLocationData.incidentCount} Incidents</p>
                    <p className="text-sm text-gray-600">Total reported cases</p>
                  </div>
                </div>

                {selectedLocationData.lastIncident && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-900">Last Incident</p>
                      <p className="text-sm text-gray-600">
                        {new Date(selectedLocationData.lastIncident).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">Recommended Actions</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {selectedLocationData.riskLevel >= 8 ? (
                      <>
                        <li>• Increase security patrols</li>
                        <li>• Install additional CCTV</li>
                        <li>• Implement buddy system</li>
                      </>
                    ) : selectedLocationData.riskLevel >= 6 ? (
                      <>
                        <li>• Regular monitoring</li>
                        <li>• Awareness campaigns</li>
                        <li>• Staff presence during peak hours</li>
                      </>
                    ) : (
                      <>
                        <li>• Maintain current security</li>
                        <li>• Periodic safety audits</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Location</h3>
              <p className="text-gray-600">Click on any point on the map to view detailed risk analysis</p>
            </div>
          )}
        </div>
      </div>

      {/* Statistics Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <p className="text-2xl font-bold text-red-600">
              {heatmapData.filter(item => item.riskLevel >= 8).length}
            </p>
            <p className="text-sm text-red-700">High Risk Areas</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-2xl font-bold text-orange-600">
              {heatmapData.filter(item => item.riskLevel >= 6 && item.riskLevel < 8).length}
            </p>
            <p className="text-sm text-orange-700">Medium Risk Areas</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">
              {heatmapData.filter(item => item.riskLevel >= 4 && item.riskLevel < 6).length}
            </p>
            <p className="text-sm text-yellow-700">Low Risk Areas</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {heatmapData.reduce((sum, item) => sum + item.incidentCount, 0)}
            </p>
            <p className="text-sm text-green-700">Total Incidents</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Heatmap;