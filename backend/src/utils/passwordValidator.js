/**
 * Password Validation Utility for Backend (Node.js/Express)
 * Provides secure password validation with bcrypt integration for Trading Journal Pro+
 */

import bcrypt from 'bcrypt';

// Common passwords to reject
const COMMON_PASSWORDS = [
  'password',
  '123456',
  'qwerty',
  'abc123',
  '12345678',
  'password123',
  'admin',
  'letmein',
  'welcome',
  'monkey',
  '1q2w3e4r',
  'dragon',
  'master',
  'sunshine',
  'princess'
];

// Bcrypt rounds for hashing (higher = slower but more secure)
const BCRYPT_ROUNDS = 12;

/**
 * Validates password against all security requirements
 * @param {string} password - The password to validate
 * @param {string} username - The username to check against
 * @param {string} email - The email to check against
 * @returns {Object} - { isValid: boolean, errors: string[], strength: string }
 */
export const validatePassword = (password, username = '', email = '') => {
  const errors = [];
  let strengthScore = 0;

  // Input validation
  if (!password || typeof password !== 'string') {
    return {
      isValid: false,
      errors: ['Password is required and must be a string'],
      strength: 'weak'
    };
  }

  // Check minimum length (12 characters)
  if (password.length < 12) {
    errors.push('Password must be at least 12 characters long');
  } else {
    strengthScore += 1;
  }

  // Check for uppercase letters
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least 1 uppercase letter (A-Z)');
  } else {
    strengthScore += 1;
  }

  // Check for lowercase letters
  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least 1 lowercase letter (a-z)');
  } else {
    strengthScore += 1;
  }

  // Check for numbers
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least 1 number (0-9)');
  } else {
    strengthScore += 1;
  }

  // Check for special characters
  if (!/[!@#$%^&*]/.test(password)) {
    errors.push('Password must include at least 1 special character (!@#$%^&*)');
  } else {
    strengthScore += 1;
  }

  // Check against username (case-insensitive)
  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push('Password cannot contain your username');
  }

  // Check against email (check local part before @)
  if (email) {
    const emailLocal = email.split('@')[0].toLowerCase();
    if (password.toLowerCase().includes(emailLocal)) {
      errors.push('Password cannot contain your email');
    }
  }

  // Check against common passwords
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) {
    errors.push('Password is too common. Please choose a more unique password');
  }

  // Calculate password strength
  const strength = calculateStrength(strengthScore, errors.length === 0);

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    score: strengthScore
  };
};

/**
 * Hash password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} - The hashed password
 * @throws {Error} - If password hashing fails
 */
export const hashPassword = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    return hashedPassword;
  } catch (error) {
    throw new Error(`Failed to hash password: ${error.message}`);
  }
};

/**
 * Compare plain text password with hashed password
 * @param {string} plainPassword - The plain text password to check
 * @param {string} hashedPassword - The hashed password from database
 * @returns {Promise<boolean>} - True if passwords match, false otherwise
 * @throws {Error} - If comparison fails
 */
export const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    throw new Error(`Failed to compare passwords: ${error.message}`);
  }
};

/**
 * Calculate password strength based on criteria met
 * @param {number} score - Number of criteria met (0-5)
 * @param {boolean} passedAllChecks - Whether all validation checks passed
 * @returns {string} - 'weak', 'medium', or 'strong'
 */
const calculateStrength = (score, passedAllChecks) => {
  if (!passedAllChecks) return 'weak';
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

/**
 * Express middleware for password validation in registration/password change
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {void}
 */
export const validatePasswordMiddleware = (req, res, next) => {
  const { password, username, email } = req.body;

  // Validate required fields
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Password is required',
      errors: ['Password is required']
    });
  }

  if (!username) {
    return res.status(400).json({
      success: false,
      message: 'Username is required for validation',
      errors: ['Username is required']
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required for validation',
      errors: ['Email is required']
    });
  }

  // Validate password
  const validation = validatePassword(password, username, email);

  if (!validation.isValid) {
    return res.status(400).json({
      success: false,
      message: 'Password does not meet security requirements',
      errors: validation.errors,
      strength: validation.strength
    });
  }

  // Attach validation result to request for next middleware
  req.passwordValidation = validation;
  next();
};

/**
 * Utility function to securely handle password changes
 * @param {string} newPassword - New password to set
 * @param {string} username - Username for validation
 * @param {string} email - Email for validation
 * @returns {Promise<Object>} - { success: boolean, hashedPassword?: string, error?: string, errors?: string[] }
 */
export const changePassword = async (newPassword, username, email) => {
  try {
    // Validate new password
    const validation = validatePassword(newPassword, username, email);

    if (!validation.isValid) {
      return {
        success: false,
        error: 'Password does not meet security requirements',
        errors: validation.errors
      };
    }

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    return {
      success: true,
      hashedPassword,
      strength: validation.strength
    };
  } catch (error) {
    return {
      success: false,
      error: `Failed to change password: ${error.message}`
    };
  }
};

/**
 * Password examples for documentation and testing
 */
export const PASSWORD_EXAMPLES = {
  valid: [
    'Tr@ding2024Journal',
    'MySecure#Pass99',
    'Pro+Trading$2025',
    'Journal@Pass123',
    'SecureJournal!2024'
  ],
  invalid: {
    'short': 'Too short - only 5 characters',
    'longerpasswordwithoutuppercase1!': 'No uppercase letter',
    'NOLOWERCASE123!': 'No lowercase letter',
    'NoNumbers!': 'No number',
    'NoSpecialChar1': 'No special character',
    'password123': 'Common password',
    'admin@123': 'Common password variant',
    'MyUsername123!': 'Contains username',
    'user@email123!': 'Contains email local part'
  }
};

export default {
  validatePassword,
  hashPassword,
  comparePassword,
  validatePasswordMiddleware,
  changePassword,
  PASSWORD_EXAMPLES
};
