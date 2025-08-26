"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  name: string;
  phone: string;
  email: string;
  selectedSubject?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated on app load
    const storedUserData = localStorage.getItem('userData');
    const storedAuth = localStorage.getItem('isAuthenticated');
    
    if (storedUserData && storedAuth === 'true') {
      const userData = JSON.parse(storedUserData);
      const selectedSubject = localStorage.getItem('selectedSubject');
      
      setUser({
        ...userData,
        selectedSubject: selectedSubject || undefined
      });
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('userData', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    if (userData.selectedSubject) {
      localStorage.setItem('selectedSubject', userData.selectedSubject);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('userData');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('selectedSubject');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      if (updates.selectedSubject) {
        localStorage.setItem('selectedSubject', updates.selectedSubject);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
