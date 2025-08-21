import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { validateEmail } from '../utils/validation';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users
const DEMO_USERS: User[] = [
  {
    id: '1',
    email: 'sarah.johnson@crescent.education',
    name: 'Dr. Sarah Johnson',
    role: 'admin'
  },
  {
    id: '2',
    email: '123456@crescent.education',
    name: 'Alex Kumar',
    role: 'student'
  },
  {
    id: '3',
    email: 'admin.security@crescent.education',
    name: 'Security Admin',
    role: 'admin'
  },
  {
    id: '4',
    email: '789012@crescent.education',
    name: 'Priya Sharma',
    role: 'student'
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<User[]>(DEMO_USERS);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    const savedUsers = localStorage.getItem('registeredUsers');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  }, [users]);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser && (password === 'password123' || password === 'admin123' || password === 'student123')) {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const emailValidation = validateEmail(email);
    
    if (!emailValidation.isValid) {
      return { success: false, error: emailValidation.error };
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return { success: false, error: 'An account with this email already exists' };
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: emailValidation.role!
    };

    setUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    return { success: true };
  };
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};