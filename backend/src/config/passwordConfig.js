/**
 * Password Security Configuration
 * Centralized settings for password validation and security
 * 
 * Edit these settings to customize password requirements for Trading Journal Pro+
 */

export const PASSWORD_CONFIG = {
  // Minimum password length (characters)
  MIN_LENGTH: 12,

  // Maximum password length for input (prevent DoS)
  MAX_LENGTH: 128,

  // Bcrypt hashing rounds (higher = slower but more secure)
  // Warning: Increasing from 12 may impact performance
  // Typical: 10-12 rounds = 100-300ms per hash
  BCRYPT_ROUNDS: 12,

  // JWT token expiration time
  JWT_EXPIRATION: '7d', // Can be '24h', '7d', '30d', etc.

  // Password requirements flags
  REQUIRE_UPPERCASE: true,      // At least 1 A-Z
  REQUIRE_LOWERCASE: true,      // At least 1 a-z
  REQUIRE_NUMBERS: true,        // At least 1 0-9
  REQUIRE_SPECIAL: true,        // At least 1 special char

  // Special characters allowed in passwords
  SPECIAL_CHARACTERS: '!@#$%^&*',

  // Check against username/email
  CHECK_USERNAME: true,
  CHECK_EMAIL: true,

  // Common password blocklist (add more as needed)
  BLOCKED_PASSWORDS: [
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
    'princess',
    'football',
    'shadow',
    'michael',
    '123123',
    '1a2b3c'
  ],

  // Account security settings
  MAX_LOGIN_ATTEMPTS: 5,           // Failed login attempts before lockout
  LOCKOUT_DURATION_MINUTES: 15,    // Minutes to lockout account
  PASSWORD_HISTORY_COUNT: 5,       // Remember last N passwords (prevent reuse)
  PASSWORD_EXPIRY_DAYS: 0,         // 0 = never expire (set to 90 for expiry)

  // UI/UX Settings
  SHOW_STRENGTH_INDICATOR: true,
  SHOW_REQUIREMENTS_CHECKLIST: true,
  SHOW_PASSWORD_HINTS: true,

  // Security logging
  LOG_FAILED_ATTEMPTS: true,
  LOG_PASSWORD_CHANGES: true,
  LOG_SUSPICIOUS_ACTIVITY: true,

  // Response messages (customize as needed)
  MESSAGES: {
    // Validation errors
    TOO_SHORT: (min) => `Password must be at least ${min} characters long`,
    NO_UPPERCASE: 'Password must include at least 1 uppercase letter (A-Z)',
    NO_LOWERCASE: 'Password must include at least 1 lowercase letter (a-z)',
    NO_NUMBERS: 'Password must include at least 1 number (0-9)',
    NO_SPECIAL: (chars) => `Password must include at least 1 special character (${chars})`,
    CONTAINS_USERNAME: 'Password cannot contain your username',
    CONTAINS_EMAIL: 'Password cannot contain your email',
    COMMON_PASSWORD: 'Password is too common. Please choose a more unique password',
    PASSWORD_REQUIRED: 'Password is required and must be a string',

    // Authentication messages
    LOGIN_SUCCESS: 'Login successful',
    INVALID_CREDENTIALS: 'Invalid email or password',
    USER_NOT_FOUND: 'User not found',
    USER_EXISTS: 'User already exists',
    REGISTRATION_SUCCESS: 'User registered successfully',

    // Password change messages
    PASSWORD_CHANGE_SUCCESS: 'Password changed successfully',
    CURRENT_PASSWORD_INCORRECT: 'Current password is incorrect',
    NEW_PASSWORD_SAME_AS_OLD: 'New password cannot be the same as current password',
    PASSWORDS_NOT_MATCH: 'New passwords do not match',

    // Account security messages
    ACCOUNT_LOCKED: 'Account locked due to too many failed login attempts',
    ACCOUNT_UNLOCKED: 'Account has been unlocked',
    PASSWORD_EXPIRED: 'Password has expired. Please change your password'
  }
};

/**
 * Get regex pattern for password validation
 * Useful for frontend attribute validation
 */
export const getPasswordRegex = (config = PASSWORD_CONFIG) => {
  // Build a pattern that requires at least 1 of each requirement
  // Note: This checks for the presence, not rejection of requirements
  
  // Positive lookaheads for each requirement
  let pattern = '^';

  if (config.REQUIRE_UPPERCASE) {
    pattern += '(?=.*[A-Z])';
  }
  if (config.REQUIRE_LOWERCASE) {
    pattern += '(?=.*[a-z])';
  }
  if (config.REQUIRE_NUMBERS) {
    pattern += '(?=.*[0-9])';
  }
  if (config.REQUIRE_SPECIAL) {
    // Escape special characters for regex
    const escapedChars = config.SPECIAL_CHARACTERS.replace(/[-[\]{}()*+?.\\^$|#\s]/g, '\\$&');
    pattern += `(?=.*[${escapedChars}])`;
  }

  // Length requirement
  pattern += `.{${config.MIN_LENGTH},${config.MAX_LENGTH}}$`;

  return new RegExp(pattern);
};

/**
 * Get human-readable configuration summary
 */
export const getConfigSummary = (config = PASSWORD_CONFIG) => {
  return `
PASSWORD CONFIGURATION SUMMARY
==============================

Minimum Length: ${config.MIN_LENGTH} characters
Maximum Length: ${config.MAX_LENGTH} characters
Bcrypt Rounds: ${config.BCRYPT_ROUNDS}
JWT Expiration: ${config.JWT_EXPIRATION}

Requirements:
- Uppercase Letters: ${config.REQUIRE_UPPERCASE ? '✓' : '✗'}
- Lowercase Letters: ${config.REQUIRE_LOWERCASE ? '✓' : '✗'}
- Numbers: ${config.REQUIRE_NUMBERS ? '✓' : '✗'}
- Special Characters: ${config.REQUIRE_SPECIAL ? '✓ (' + config.SPECIAL_CHARACTERS + ')' : '✗'}

Checks:
- Username Not Allowed: ${config.CHECK_USERNAME ? '✓' : '✗'}
- Email Not Allowed: ${config.CHECK_EMAIL ? '✓' : '✗'}
- Blocked Common Passwords: ${config.BLOCKED_PASSWORDS.length} words

Security:
- Max Login Attempts: ${config.MAX_LOGIN_ATTEMPTS}
- Lockout Duration: ${config.LOCKOUT_DURATION_MINUTES} minutes
- Password History: ${config.PASSWORD_HISTORY_COUNT} previous passwords
- Password Expiry: ${config.PASSWORD_EXPIRY_DAYS === 0 ? 'Never' : config.PASSWORD_EXPIRY_DAYS + ' days'}

UI Settings:
- Show Strength Indicator: ${config.SHOW_STRENGTH_INDICATOR ? '✓' : '✗'}
- Show Requirements: ${config.SHOW_REQUIREMENTS_CHECKLIST ? '✓' : '✗'}
- Show Hints: ${config.SHOW_PASSWORD_HINTS ? '✓' : '✗'}

Logging:
- Log Failed Attempts: ${config.LOG_FAILED_ATTEMPTS ? '✓' : '✗'}
- Log Password Changes: ${config.LOG_PASSWORD_CHANGES ? '✓' : '✗'}
- Log Suspicious Activity: ${config.LOG_SUSPICIOUS_ACTIVITY ? '✓' : '✗'}
  `;
};

/**
 * Validate configuration for potential issues
 */
export const validateConfiguration = (config = PASSWORD_CONFIG) => {
  const issues = [];

  if (config.MIN_LENGTH < 8) {
    issues.push('Warning: MIN_LENGTH less than 8 may be less secure');
  }

  if (config.MIN_LENGTH > config.MAX_LENGTH) {
    issues.push('Error: MIN_LENGTH cannot be greater than MAX_LENGTH');
  }

  if (config.BCRYPT_ROUNDS < 10 || config.BCRYPT_ROUNDS > 15) {
    issues.push('Warning: BCRYPT_ROUNDS outside recommended range (10-15)');
  }

  if (config.BLOCKED_PASSWORDS.length === 0) {
    issues.push('Warning: No blocked passwords defined');
  }

  if (!config.REQUIRE_UPPERCASE && !config.REQUIRE_LOWERCASE && !config.REQUIRE_NUMBERS && !config.REQUIRE_SPECIAL) {
    issues.push('Error: At least one requirement must be enabled');
  }

  if (config.MAX_LOGIN_ATTEMPTS < 3) {
    issues.push('Warning: MAX_LOGIN_ATTEMPTS may be too restrictive');
  }

  return {
    isValid: issues.filter(i => i.startsWith('Error')).length === 0,
    issues
  };
};

export default PASSWORD_CONFIG;
