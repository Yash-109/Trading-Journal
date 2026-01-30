import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, removeToken, isAuthenticated as checkAuth } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const authenticated = checkAuth();
      setIsAuthenticated(authenticated);
      
      // Get user from localStorage if available
      const storedUser = localStorage.getItem('user');
      if (storedUser && authenticated) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('user');
        }
      }
      
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} - Success status
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.status === 'success' && response.data) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));
        
        toast.success(response.message || 'Login successful!');
        return true;
      } else {
        toast.error('Login failed');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return false;
    }
  };

  /**
   * Register new user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise<boolean>} - Success status
   */
  const register = async (email, password) => {
    try {
      const response = await authAPI.register(email, password);
      
      if (response.status === 'success') {
        toast.success(response.message || 'Registration successful! Please login.');
        return true;
      } else {
        toast.error('Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Registration failed. Please try again.');
      return false;
    }
  };

  /**
   * Logout user
   * Clears token and user data from localStorage
   */
  const logout = () => {
    removeToken();
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
