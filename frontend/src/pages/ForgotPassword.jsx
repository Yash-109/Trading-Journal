import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Mail, Lock, ShieldCheck, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { authAPI } from '../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email', 'otp', 'newPassword'
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (step !== 'otp') return undefined;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await authAPI.forgotPassword(email);
      toast.success(response.message || 'OTP sent if account exists');
      setStep('otp');
      setTimeLeft(600); // 10 mins
    } catch (err) {
      toast.error(err.message || 'Failed to request reset');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp)) return;

    setIsLoading(true);
    try {
      const response = await authAPI.verifyResetOtp(email, otp);
      if (response.success && response.data?.resetToken) {
        toast.success('OTP verified');
        setResetToken(response.data.resetToken);
        setStep('newPassword');
      }
    } catch (err) {
      toast.error(err.message || 'Invalid OTP');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await authAPI.resetPassword(resetToken, passwords.newPassword);
      if (response.success) {
        toast.success('Password reset! Please login.');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center bg-gold-500 p-3 rounded-xl mb-4">
            <TrendingUp className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Trading Journal Pro+</h1>
          <p className="text-gray-400">
            {step === 'email' && 'Reset your password'}
            {step === 'otp' && 'Enter verification code'}
            {step === 'newPassword' && 'Create new password'}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-8"
        >
          {step === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="spinner border-black"></div>
                ) : (
                  <>
                    <span>Send Reset Code</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-gray-300">
                Code sent to: <span className="text-gold-500">{email}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  6-Digit Reset Code
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white tracking-[0.35em] focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Time remaining:</span>
                <span className="text-gold-500 font-mono font-medium">
                  {formatTime(timeLeft)}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? <div className="spinner border-black"></div> : <span>Verify Code</span>}
              </button>
            </form>
          )}

          {step === 'newPassword' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                    placeholder="••••••••"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="spinner border-black"></div>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-gray-400">
            Remember your password?{' '}
            <Link to="/login" className="text-gold-500 hover:text-gold-400 transition-colors">
              Sign in
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;