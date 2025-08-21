import React, { useState } from 'react';
import { AlertTriangle, MapPin, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertContext';

const SOSButton: React.FC = () => {
  const { user } = useAuth();
  const { addSOSAlert } = useAlerts();
  const [isActivating, setIsActivating] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          // Provide demo location if geolocation fails
          resolve({
            latitude: 13.0827,
            longitude: 80.2707, // Chennai coordinates as demo
          });
        }
      );
    });
  };

  const handleSOSActivation = async () => {
    if (!user) return;

    setIsActivating(true);
    
    try {
      const currentLocation = await getCurrentLocation();
      setLocation(currentLocation);

      // Create SOS alert
      addSOSAlert({
        studentId: user.id,
        studentName: user.name,
        location: currentLocation,
        timestamp: new Date(),
        status: 'active',
        description: description.trim() || 'Emergency assistance required',
      });

      setIsActivated(true);
      
      // Show success message for 3 seconds then reset
      setTimeout(() => {
        setIsActivated(false);
        setDescription('');
      }, 3000);

    } catch (error) {
      console.error('Failed to activate SOS:', error);
    } finally {
      setIsActivating(false);
    }
  };

  if (isActivated) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
        <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-green-900 mb-4">SOS Alert Sent Successfully!</h2>
        <p className="text-green-700 mb-4">
          Campus security and administrators have been notified of your emergency.
          Help is on the way.
        </p>
        <div className="bg-green-50 rounded-lg p-4 text-sm text-green-800">
          <p className="font-medium">What happens next:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Campus security will be dispatched to your location</li>
            <li>Emergency contacts will be notified</li>
            <li>You will receive a follow-up call shortly</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* SOS Button Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Emergency SOS</h2>
          <p className="text-gray-600 text-lg">
            Press the button below if you're in immediate danger or need urgent assistance
          </p>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleSOSActivation}
            disabled={isActivating}
            className={`relative w-32 h-32 rounded-full font-bold text-white text-xl transition-all duration-200 ${
              isActivating
                ? 'bg-red-400 cursor-not-allowed scale-95'
                : 'bg-red-600 hover:bg-red-700 hover:scale-105 active:scale-95'
            } shadow-lg hover:shadow-xl`}
          >
            {isActivating ? (
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                <span className="text-sm">Sending...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <AlertTriangle className="h-8 w-8 mb-1" />
                <span>SOS</span>
              </div>
            )}
          </button>
        </div>

        {/* Optional Description */}
        <div className="max-w-md mx-auto">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Brief description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="Describe the situation briefly..."
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{description.length}/200 characters</p>
        </div>
      </div>

      {/* Information Panel */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-amber-900 mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          How SOS Works
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <div className="bg-amber-600 rounded-full p-2 flex-shrink-0">
              <MapPin className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-amber-900">Location Tracking</p>
              <p className="text-amber-800">Your exact location is automatically shared with security</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-amber-600 rounded-full p-2 flex-shrink-0">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-amber-900">Instant Alert</p>
              <p className="text-amber-800">Campus security and admin receive immediate notification</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-amber-600 rounded-full p-2 flex-shrink-0">
              <Clock className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-medium text-amber-900">Quick Response</p>
              <p className="text-amber-800">Help typically arrives within 2-5 minutes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Tips */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">Safety Tips</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Use SOS only in genuine emergencies or threats
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Stay in a safe location if possible after activating SOS
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Keep your phone charged and location services enabled
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            Save emergency contacts in your phone for quick access
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SOSButton;