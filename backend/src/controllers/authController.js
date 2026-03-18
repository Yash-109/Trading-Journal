// Authentication controller with enhanced password security
// Handlers: registerUser, loginUser, changePassword
// Uses secure password validation and bcrypt hashing

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  validatePassword,
  hashPassword,
  comparePassword,
  changePassword as changePasswordService
} from '../utils/passwordValidator.js';

/**
 * Register a new user with secure password validation
 * POST /api/auth/register
 * 
 * Required fields:
 * - email: User email address
 * - username: User username (for password validation)
 * - password: User password (must meet security requirements)
 */
export const registerUser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Email, username, and password are required'
      });
    }

    // Validate password against security requirements
    const passwordValidation = validatePassword(password, username, email);
    if (!passwordValidation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Password does not meet security requirements',
        errors: passwordValidation.errors,
        strength: passwordValidation.strength
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'username';
      return res.status(400).json({
        success: false,
        message: `User already exists with this ${field}`
      });
    }

    // Hash the password securely
    const hashedPassword = await hashPassword(password);

    // Create new user
    const user = await User.create({
      email,
      username,
      password: hashedPassword
    });

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Return success response (without password)
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        userId: user._id,
        email: user.email,
        username: user.username,
        token
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

/**
 * Login user with secure password verification
 * POST /api/auth/login
 * 
 * Required fields:
 * - email: User email address
 * - password: User password
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Compare password securely using bcrypt
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );

    // Return success response with token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          userId: user._id,
          email: user.email,
          username: user.username
        }
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

/**
 * Change password with validation and secure updates
 * POST /api/auth/change-password
 * 
 * Required fields:
 * - currentPassword: Current password for verification
 * - newPassword: New password (must meet security requirements)
 * 
 * Requires: Authentication middleware
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, newPasswordConfirm } = req.body;
    const userId = req.user?.userId;

    // Validate input
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'Current password, new password, and confirmation are required'
      });
    }

    // Verify new passwords match
    if (newPassword !== newPasswordConfirm) {
      return res.status(400).json({
        success: false,
        message: 'New passwords do not match'
      });
    }

    // Get user from database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Prevent reuse of current password
    const isSameAsOld = await comparePassword(newPassword, user.password);
    if (isSameAsOld) {
      return res.status(400).json({
        success: false,
        message: 'New password cannot be the same as current password'
      });
    }

    // Validate and change password using the service
    const result = await changePasswordService(
      newPassword,
      user.username,
      user.email
    );

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.error,
        errors: result.errors
      });
    }

    // Update user password
    user.password = result.hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
      data: {
        strength: result.strength
      }
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change'
    });
  }
};
