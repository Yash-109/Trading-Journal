import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { validatePassword, getStrengthColor } from '../utils/passwordValidator';
import PasswordStrengthIndicator from '../components/PasswordStrengthIndicator';
import { TrendingUp, Mail, Lock, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState(null);

  const validateForm = () => {
    if (!formData.username) {
      toast.error('Username is required');
      return false;
    }

    if (formData.username.length < 3) {
      toast.error('Username must be at least 3 characters');
      return false;
    }

    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error('Email is invalid');
      return false;
    }

    const validation = validatePassword(formData.password, formData.username, formData.email);
    if (!validation.isValid) {
      toast.error('Password does not meet security requirements');
      validation.errors.forEach(error => {
        toast.error(error, { icon: '🔒' });
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const success = await register(formData.username, formData.email, formData.password);

      if (success) {
        toast.success('Account created successfully! Redirecting...');
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password') {
      const validation = validatePassword(value, formData.username, formData.email);
      setPasswordValidation(validation);
    }
  };

  const strengthColor = passwordValidation ? getStrengthColor(passwordValidation.strength) : null;
  const isPasswordValid = passwordValidation?.isValid;
  const passwordsMatch = formData.password && formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gold-500 p-3 rounded-xl mb-4">
            <TrendingUp className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Journal Pro+</h1>
          <p className="text-gray-400">Create your secure account</p>
        </div>

        {/* Register Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a strong password"
                  className={`w-full bg-dark-bg border ${
                    formData.password && !isPasswordValid ? 'border-red-500' : 
                    formData.password && isPasswordValid ? 'border-green-500' :
                    'border-dark-border'
                  } rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all`}
                  disabled={isLoading}
                />
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <PasswordStrengthIndicator
                  password={formData.password}
                  username={formData.username}
                  email={formData.email}
                  showRequirements={true}
                />
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={`w-full bg-dark-bg border ${
                    formData.confirmPassword && !passwordsMatch ? 'border-red-500' : 
                    formData.confirmPassword && passwordsMatch ? 'border-green-500' :
                    'border-dark-border'
                  } rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all`}
                  disabled={isLoading}
                />
              </div>

              {/* Password Match Indicator */}
              {formData.confirmPassword && (
                <div className="mt-2">
                  {passwordsMatch ? (
                    <p className="text-sm text-green-500 flex items-center gap-1">
                      ✓ Passwords match
                    </p>
                  ) : (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      ✗ Passwords do not match
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isPasswordValid || !passwordsMatch || !formData.username || !formData.email}
              className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                <>
                  <div className="spinner border-black"></div>
                  <span>Creating account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-gold-500 hover:text-gold-600 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mt-8 text-sm text-gray-500"
        >
          <p>Professional Trading Analytics Platform</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;
