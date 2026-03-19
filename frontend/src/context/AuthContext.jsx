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
   * Login step 1: validate credentials and request OTP
   */
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);

      if (!(response.success || response.status === 'success') || !response.data) {
        toast.error(response.message || 'Login failed');
        return { success: false };
      }

      if (response.data.requires2FA) {
        toast.success(response.message || 'OTP sent to your email');
        return {
          success: true,
          requires2FA: true,
          email: response.data.email || email,
          expiresIn: response.data.expiresIn || 300,
          resendCooldown: response.data.resendCooldown || 60,
        };
      }

      // Fallback for non-2FA responses
      if (response.data.token && response.data.user) {
        setUser(response.data.user);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        toast.success(response.message || 'Login successful!');
        return { success: true, requires2FA: false };
      }

      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'Login failed. Please try again.');
      return { success: false };
    }
  };

  /**
   * Login step 2: verify OTP and create session
   */
  const verifyOtp = async (email, otp) => {
    try {
      const response = await authAPI.verifyOtp(email, otp);

      if ((response.success || response.status === 'success') && response.data?.token) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(response.message || 'Login successful!');
        return true;
      }

      toast.error(response.message || 'OTP verification failed');
      return false;
    } catch (error) {
      console.error('OTP verification error:', error);
      toast.error(error.message || 'OTP verification failed');
      return false;
    }
  };

  /**
   * Resend OTP for login challenge
   */
  const resendOtp = async (email) => {
    try {
      const response = await authAPI.resendOtp(email);
      if (response.success || response.status === 'success') {
        toast.success(response.message || 'A new OTP has been sent');
        return {
          success: true,
          expiresIn: response.data?.expiresIn || 300,
          resendCooldown: response.data?.resendCooldown || 60,
        };
      }
      toast.error(response.message || 'Failed to resend OTP');
      return { success: false };
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error.message || 'Failed to resend OTP');
      return { success: false };
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
    verifyOtp,
    resendOtp,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
