export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

export interface SOSAlert {
  id: string;
  studentId: string;
  studentName: string;
  location: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  timestamp: Date;
  status: 'active' | 'resolved' | 'investigating';
  description?: string;
}

export interface ChatbotAlert {
  id: string;
  studentId: string;
  studentName: string;
  conversation: string;
  detectedKeywords: string[];
  riskLevel: 'low' | 'medium' | 'high';
  timestamp: Date;
  status: 'new' | 'reviewed' | 'resolved';
}

export interface HeatmapData {
  id: string;
  location: string;
  coordinates: { x: number; y: number };
  riskLevel: number; // 1-10
  incidentCount: number;
  lastIncident?: Date;
}