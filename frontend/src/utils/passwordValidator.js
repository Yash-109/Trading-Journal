/**
 * Password Validation Utility for Trading Journal Pro+
 * Provides frontend validation with detailed error messages and strength assessment
 */

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

/**
 * Validates password against all security requirements
 * @param {string} password - The password to validate
 * @param {string} username - The username to check against
 * @param {string} email - The email to check against
 * @returns {object} - { isValid: boolean, errors: string[], strength: string }
 */
export const validatePassword = (password, username = '', email = '') => {
  const errors = [];
  let strengthScore = 0;

  // Check minimum length
  if (!password || password.length < 12) {
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

  // Check against username
  if (username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push('Password cannot contain your username');
  }

  // Check against email
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
 * Gets color coding for password strength for UI display
 * @param {string} strength - 'weak', 'medium', or 'strong'
 * @returns {object} - { color: string, bgColor: string, label: string }
 */
export const getStrengthColor = (strength) => {
  const colors = {
    weak: {
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      borderColor: 'border-red-300',
      label: 'Weak'
    },
    medium: {
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      borderColor: 'border-yellow-300',
      label: 'Medium'
    },
    strong: {
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      borderColor: 'border-green-300',
      label: 'Strong'
    }
  };

  return colors[strength] || colors.weak;
};

/**
 * Example passwords for documentation/testing
 */
export const PASSWORD_EXAMPLES = {
  valid: [
    'Tr@ding2024Journal',
    'MySecure#Pass99',
    'Pro+Trading$2025',
    'Journal@Pass123'
  ],
  invalid: [
    'short',                    // Too short
    'longerpasswordwithoutuppercase1!', // No uppercase
    'NOLOWERCASE123!',         // No lowercase
    'NoNumbers!',              // No numbers
    'NoSpecialChar1',          // No special character
    'password123',             // Common password
    'admin@123',               // Common password variant
    'MyUsername123!',          // Contains username (example)
    'user@email123!'           // Contains email (example)
  ]
};

export default validatePassword;
