import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Mail, Lock, LogIn, ShieldCheck, RotateCcw } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, verifyOtp, resendOtp } = useAuth();
  const [step, setStep] = useState('credentials');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [otp, setOtp] = useState('');
  const [otpEmail, setOtpEmail] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [resendLeft, setResendLeft] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (step !== 'otp') return undefined;

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setResendLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const result = await login(formData.email, formData.password);

    if (result?.success && result?.requires2FA) {
      setStep('otp');
      setOtpEmail(result.email || formData.email);
      setTimeLeft(result.expiresIn || 300);
      setResendLeft(result.resendCooldown || 60);
      setOtp('');
    } else if (result?.success) {
      navigate('/dashboard');
    }
    
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      return;
    }

    setIsLoading(true);
    const success = await verifyOtp(otpEmail, otp);
    setIsLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  const handleResendOtp = async () => {
    if (resendLeft > 0 || !otpEmail) return;

    setIsLoading(true);
    const result = await resendOtp(otpEmail);
    setIsLoading(false);

    if (result?.success) {
      setTimeLeft(result.expiresIn || 300);
      setResendLeft(result.resendCooldown || 60);
      setOtp('');
    }
  };

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
          <p className="text-gray-400">
            {step === 'credentials' ? 'Sign in to your account' : 'Enter OTP sent to your email'}
          </p>
        </div>

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-dark-card border border-dark-border rounded-xl p-8"
        >
          {step === 'credentials' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                    required
                  />
                </div>
              </div>

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
                  <>
                    <div className="spinner border-black"></div>
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Continue</span>
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="bg-dark-bg border border-dark-border rounded-lg p-3 text-sm text-gray-300">
                OTP sent to: <span className="text-gold-500">{otpEmail}</span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  6-Digit OTP
                </label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-dark-bg border border-dark-border rounded-lg pl-10 pr-4 py-3 text-white tracking-[0.35em] focus:ring-2 focus:ring-gold-500 focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className={`${timeLeft > 0 ? 'text-gray-300' : 'text-red-400'}`}>
                  Expires in: {formatTime(timeLeft)}
                </span>
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={resendLeft > 0 || isLoading}
                  className="text-gold-500 hover:text-gold-400 disabled:text-gray-500 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  {resendLeft > 0 ? `Resend in ${resendLeft}s` : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6 || timeLeft === 0}
                className="w-full bg-gold-500 hover:bg-gold-600 text-black font-semibold py-3 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="spinner border-black"></div>
                    <span>Verifying OTP...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Verify OTP</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep('credentials');
                  setOtp('');
                  setTimeLeft(0);
                  setResendLeft(0);
                }}
                className="w-full border border-dark-border text-gray-300 hover:text-white py-3 rounded-lg transition-colors"
              >
                Back to Login
              </button>
            </form>
          )}

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-gold-500 hover:text-gold-600 font-semibold transition-colors"
              >
                Create one
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

export default Login;
