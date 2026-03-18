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
      
      if ((response.success || response.status === 'success') && response.data) {
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
  const register = async (username, email, password) => {
    try {
      const response = await authAPI.register(username, email, password);
      
      if (response.success || response.status === 'success') {
        if (response.data?.token) {
          localStorage.setItem('authToken', response.data.token);
          const userData = {
            userId: response.data.userId,
            email: response.data.email,
            username: response.data.username,
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);
          setIsAuthenticated(true);
        }
        toast.success(response.message || 'Registration successful!');
        return true;
      } else {
        toast.error(response.message || 'Registration failed');
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
