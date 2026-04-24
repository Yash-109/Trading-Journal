import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import LoginOtp from '../models/LoginOtp.js';
import { validatePassword, hashPassword, comparePassword } from '../utils/passwordValidator.js';
import { sendLoginOtpEmail, sendPasswordResetOtpEmail } from '../services/emailService.js';

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const OTP_RESEND_COOLDOWN_MS = 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

const generateSixDigitOtp = () => String(Math.floor(100000 + Math.random() * 900000));

const issueAuthToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

const buildSafeUser = (user) => ({
  userId: user._id,
  email: user.email,
  username: user.username,
  is2FAEnabled: user.is2FAEnabled,
});

const createAndSendOtp = async (user) => {
  const otp = generateSixDigitOtp();
  const otpHash = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS);

  // Invalidate older pending login OTPs so only latest one can be used.
  await LoginOtp.updateMany(
    { userId: user._id, used: false, type: 'login' },
    { $set: { used: true, usedAt: new Date() } }
  );

  await LoginOtp.create({
    userId: user._id,
    otpHash,
    expiresAt,
    attempts: 0,
    maxAttempts: OTP_MAX_ATTEMPTS,
    used: false,
    type: 'login',
  });

  const emailResult = await sendLoginOtpEmail({ to: user.email, otp });
  return emailResult;
};

/**
 * POST /api/auth/register
 * Register user with bcrypt-hashed password and 2FA enabled by default.
 */
export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, username, and password are required',
      });
    }

    const passwordValidation = validatePassword(password, username, email);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email.toLowerCase()
            ? 'User already exists with this email'
            : 'User already exists with this username',
      });
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      email: email.toLowerCase(),
      username,
      password: hashedPassword,
      is2FAEnabled: true,
    });

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: buildSafeUser(user),
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration',
    });
  }
};

/**
 * POST /api/auth/login
 * Step 1 of login: validate password, generate + email OTP.
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (!user.is2FAEnabled) {
      const token = issueAuthToken(user._id);
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          token,
          user: buildSafeUser(user),
          requires2FA: false,
        },
      });
    }

    try {
      await createAndSendOtp(user);
    } catch (emailError) {
      console.error('OTP email delivery error:', emailError.message);
      return res.status(503).json({
        success: false,
        message: 'Unable to deliver OTP email right now. Please check email settings and try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
      data: {
        email: user.email,
        requires2FA: true,
        expiresIn: 300,
        resendCooldown: 60,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login',
    });
  }
};

/**
 * POST /api/auth/verify-otp
 * Step 2 of login: verify OTP, enforce expiry/attempts/single-use, issue JWT.
 */
export const verifyOtpAndLogin = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: 'OTP must be a 6-digit code',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const otpRecord = await LoginOtp.findOne({ userId: user._id, used: false, type: 'login' }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP found. Please login again.',
      });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      otpRecord.used = true;
      otpRecord.usedAt = new Date();
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'OTP attempt limit reached. Please request a new OTP.',
      });
    }

    const isOtpValid = await bcrypt.compare(String(otp), otpRecord.otpHash);

    if (!isOtpValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remaining = Math.max(otpRecord.maxAttempts - otpRecord.attempts, 0);
      return res.status(400).json({
        success: false,
        message:
          remaining > 0
            ? `Invalid OTP. ${remaining} attempt(s) remaining.`
            : 'OTP attempt limit reached. Please request a new OTP.',
      });
    }

    otpRecord.used = true;
    otpRecord.usedAt = new Date();
    await otpRecord.save();

    const token = issueAuthToken(user._id);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: buildSafeUser(user),
      },
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
    });
  }
};

/**
 * POST /api/auth/resend-otp
 * Bonus flow: resend OTP with 60-second cooldown.
 */
export const resendLoginOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const latestOtp = await LoginOtp.findOne({ userId: user._id, type: 'login' }).sort({ createdAt: -1 });
    if (latestOtp) {
      const elapsedMs = Date.now() - latestOtp.createdAt.getTime();
      if (elapsedMs < OTP_RESEND_COOLDOWN_MS) {
        const waitSeconds = Math.ceil((OTP_RESEND_COOLDOWN_MS - elapsedMs) / 1000);
        return res.status(429).json({
          success: false,
          message: `Please wait ${waitSeconds} second(s) before requesting another OTP.`,
          data: { retryAfter: waitSeconds },
        });
      }
    }

    try {
      await createAndSendOtp(user);
    } catch (emailError) {
      console.error('Resend OTP email delivery error:', emailError.message);
      return res.status(503).json({
        success: false,
        message: 'Unable to deliver OTP email right now. Please check email settings and try again.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'A new OTP has been sent to your email',
      data: {
        email: user.email,
        expiresIn: 300,
        resendCooldown: 60,
      },
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while resending OTP',
    });
  }
};

/**
 * POST /api/auth/forgot-password
 * Step 1 of password reset: validate email, generate + email reset OTP.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    
    // Always return success even if user not found (security best practice)
    if (!user) {
      return res.status(200).json({
        success: true,
        message: 'If an account exists with that email, a password reset OTP will be sent.',
      });
    }

    // Generate reset OTP
    const otp = generateSixDigitOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    // Invalidate older pending reset OTPs so only latest one can be used.
    await LoginOtp.updateMany(
      { userId: user._id, used: false, type: 'reset' },
      { $set: { used: true, usedAt: new Date() } }
    );

    await LoginOtp.create({
      userId: user._id,
      otpHash,
      expiresAt,
      attempts: 0,
      maxAttempts: OTP_MAX_ATTEMPTS,
      used: false,
      type: 'reset',
    });

    try {
      await sendPasswordResetOtpEmail({ to: user.email, otp });
    } catch (emailError) {
      console.error('Reset OTP email delivery error:', emailError.message);
      // Optional: you can fail silently here or just log it to prevent email enumeration,
      // but returning 503 is okay if the system is generally broken.
      return res.status(503).json({
        success: false,
        message: 'Unable to deliver OTP email right now. Please try again later.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'If an account exists with that email, a password reset OTP will be sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during password reset request',
    });
  }
};

/**
 * POST /api/auth/verify-reset-otp
 * Step 2 of password reset: verify OTP and issue short-lived JWT for password reset.
 */
export const verifyResetOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Email and OTP are required',
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const otpRecord = await LoginOtp.findOne({ userId: user._id, used: false, type: 'reset' }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: 'No active OTP found. Please request a new one.',
      });
    }

    if (otpRecord.expiresAt.getTime() < Date.now()) {
      otpRecord.used = true;
      otpRecord.usedAt = new Date();
      await otpRecord.save();

      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    if (otpRecord.attempts >= otpRecord.maxAttempts) {
      return res.status(429).json({
        success: false,
        message: 'OTP attempt limit reached. Please request a new OTP.',
      });
    }

    const isOtpValid = await bcrypt.compare(String(otp), otpRecord.otpHash);

    if (!isOtpValid) {
      otpRecord.attempts += 1;
      await otpRecord.save();

      const remaining = Math.max(otpRecord.maxAttempts - otpRecord.attempts, 0);
      return res.status(400).json({
        success: false,
        message:
          remaining > 0
            ? `Invalid OTP. ${remaining} attempt(s) remaining.`
            : 'OTP attempt limit reached. Please request a new OTP.',
      });
    }

    // OTP is valid
    otpRecord.used = true;
    otpRecord.usedAt = new Date();
    await otpRecord.save();

    // Issue short-lived token for password reset
    const resetToken = jwt.sign(
      { userId: user._id, purpose: 'reset' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        resetToken,
      },
    });
  } catch (error) {
    console.error('Verify reset OTP error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during OTP verification',
    });
  }
};

/**
 * POST /api/auth/reset-password
 * Step 3 of password reset: set a new password.
 */
export const resetPassword = async (req, res) => {
  try {
    const { resetToken, newPassword } = req.body;

    if (!resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Reset token and new password are required',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired reset token',
      });
    }

    if (decoded.purpose !== 'reset') {
      return res.status(403).json({
        success: false,
        message: 'Invalid token purpose',
      });
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const passwordValidation = validatePassword(newPassword, user.username, user.email);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
      });
    }

    const hashedPassword = await hashPassword(newPassword);
    
    user.password = hashedPassword;
    // Disconnect all other sessions implicitly if we had a token version, 
    // but here we just update the password.
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    console.error('Reset password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while resetting password',
    });
  }
};
