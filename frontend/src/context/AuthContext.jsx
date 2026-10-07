import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('smart_schedule_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      const authenticatedUser = response.user;

      if (!authenticatedUser) {
        throw new Error('Login response did not include user information');
      }

      const newUser = {
        id: authenticatedUser.id,
        role: authenticatedUser.role,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
        department: authenticatedUser.department,
        teacher: authenticatedUser.teacher || null,
        division: authenticatedUser.division || null
      };

      setUser(newUser);
      localStorage.setItem('smart_schedule_user', JSON.stringify(newUser));
      return newUser;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('smart_schedule_user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
