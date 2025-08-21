import React, { createContext, useContext, useState, useEffect } from 'react';
import { SOSAlert, ChatbotAlert, HeatmapData } from '../types';

interface AlertContextType {
  sosAlerts: SOSAlert[];
  chatbotAlerts: ChatbotAlert[];
  heatmapData: HeatmapData[];
  addSOSAlert: (alert: Omit<SOSAlert, 'id'>) => void;
  addChatbotAlert: (alert: Omit<ChatbotAlert, 'id'>) => void;
  updateSOSAlert: (id: string, updates: Partial<SOSAlert>) => void;
  updateChatbotAlert: (id: string, updates: Partial<ChatbotAlert>) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

const INITIAL_HEATMAP_DATA: HeatmapData[] = [
  { id: '1', location: 'Main Hostel Block', coordinates: { x: 20, y: 30 }, riskLevel: 8, incidentCount: 12 },
  { id: '2', location: 'Library Backyard', coordinates: { x: 60, y: 20 }, riskLevel: 6, incidentCount: 7 },
  { id: '3', location: 'Sports Complex', coordinates: { x: 80, y: 60 }, riskLevel: 9, incidentCount: 15 },
  { id: '4', location: 'Academic Block C', coordinates: { x: 40, y: 70 }, riskLevel: 4, incidentCount: 3 },
  { id: '5', location: 'Cafeteria Area', coordinates: { x: 30, y: 50 }, riskLevel: 7, incidentCount: 9 },
  { id: '6', location: 'Parking Lot B', coordinates: { x: 70, y: 80 }, riskLevel: 5, incidentCount: 4 },
];

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sosAlerts, setSosAlerts] = useState<SOSAlert[]>([]);
  const [chatbotAlerts, setChatbotAlerts] = useState<ChatbotAlert[]>([]);
  const [heatmapData] = useState<HeatmapData[]>(INITIAL_HEATMAP_DATA);

  // Load alerts from localStorage
  useEffect(() => {
    const savedSosAlerts = localStorage.getItem('sosAlerts');
    const savedChatbotAlerts = localStorage.getItem('chatbotAlerts');
    
    if (savedSosAlerts) {
      setSosAlerts(JSON.parse(savedSosAlerts));
    }
    if (savedChatbotAlerts) {
      setChatbotAlerts(JSON.parse(savedChatbotAlerts));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('sosAlerts', JSON.stringify(sosAlerts));
  }, [sosAlerts]);

  useEffect(() => {
    localStorage.setItem('chatbotAlerts', JSON.stringify(chatbotAlerts));
  }, [chatbotAlerts]);

  const addSOSAlert = (alert: Omit<SOSAlert, 'id'>) => {
    const newAlert: SOSAlert = {
      ...alert,
      id: Date.now().toString(),
    };
    setSosAlerts(prev => [newAlert, ...prev]);
  };

  const addChatbotAlert = (alert: Omit<ChatbotAlert, 'id'>) => {
    const newAlert: ChatbotAlert = {
      ...alert,
      id: Date.now().toString(),
    };
    setChatbotAlerts(prev => [newAlert, ...prev]);
  };

  const updateSOSAlert = (id: string, updates: Partial<SOSAlert>) => {
    setSosAlerts(prev =>
      prev.map(alert => alert.id === id ? { ...alert, ...updates } : alert)
    );
  };

  const updateChatbotAlert = (id: string, updates: Partial<ChatbotAlert>) => {
    setChatbotAlerts(prev =>
      prev.map(alert => alert.id === id ? { ...alert, ...updates } : alert)
    );
  };

  return (
    <AlertContext.Provider value={{
      sosAlerts,
      chatbotAlerts,
      heatmapData,
      addSOSAlert,
      addChatbotAlert,
      updateSOSAlert,
      updateChatbotAlert,
    }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (context === undefined) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};