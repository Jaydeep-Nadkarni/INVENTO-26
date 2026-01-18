import validator from 'validator';

/**
 * Security utilities for input validation and sanitization
 */

/**
 * Sanitizes string input by removing potentially harmful characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export const sanitizeString = (input) => {
  if (typeof input !== 'string') {
    return '';
  }
  
  // Trim whitespace
  let sanitized = input.trim();
  
  // Remove any HTML/script tags
  sanitized = validator.stripLow(sanitized);
  
  // Escape HTML entities
  sanitized = validator.escape(sanitized);
  
  return sanitized;
};

/**
 * Validates and sanitizes email address
 * @param {string} email - The email to validate
 * @returns {string|null} - Sanitized email or null if invalid
 */
export const validateAndSanitizeEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return null;
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  if (!validator.isEmail(trimmedEmail)) {
    return null;
  }
  
  return validator.normalizeEmail(trimmedEmail);
};

/**
 * Validates phone number (basic international format check)
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if valid phone format
 */
export const validatePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return false;
  }
  
  // Remove common phone formatting characters
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check if it's a valid phone number (7-15 digits, international format)
  return validator.isMobilePhone(cleanPhone, 'any', { strictMode: false });
};

/**
 * Sanitizes phone number by removing special characters
 * @param {string} phone - The phone number to sanitize
 * @returns {string} - Sanitized phone number
 */
export const sanitizePhoneNumber = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return '';
  }
  
  // Remove all non-digit characters except leading +
  return phone.replace(/[^\d+]/g, '').substring(0, 20);
};

/**
 * Validates gender input against allowed values
 * @param {string} gender - The gender value
 * @returns {boolean} - True if valid
 */
export const validateGender = (gender) => {
  const validGenders = ['Male', 'Female', 'Other', 'Prefer not to say'];
  return validGenders.includes(gender);
};

/**
 * Sanitizes gender input
 * @param {string} gender - The gender value to sanitize
 * @returns {string} - Sanitized gender
 */
export const sanitizeGender = (gender) => {
  if (!gender || typeof gender !== 'string') {
    return 'Other';
  }
  
  const sanitized = gender.trim();
  if (validateGender(sanitized)) {
    return sanitized;
  }
  
  return 'Other';
};

/**
 * Validates college name (basic validation)
 * @param {string} collegeName - The college name to validate
 * @returns {boolean} - True if valid
 */
export const validateCollegeName = (collegeName) => {
  if (!collegeName || typeof collegeName !== 'string') {
    return false;
  }
  
  const sanitized = collegeName.trim();
  
  // College name should be at least 3 characters and max 200
  return sanitized.length >= 3 && sanitized.length <= 200;
};

/**
 * Sanitizes college name
 * @param {string} collegeName - The college name to sanitize
 * @returns {string} - Sanitized college name
 */
export const sanitizeCollegeName = (collegeName) => {
  if (!collegeName || typeof collegeName !== 'string') {
    return '';
  }
  
  let sanitized = collegeName.trim();
  
  // Remove potentially harmful characters but keep alphanumeric, spaces, and common college name chars
  sanitized = sanitized.replace(/[^\w\s\.\&\(\)-]/gi, '');
  
  // Limit length
  sanitized = sanitized.substring(0, 200);
  
  return sanitized;
};

/**
 * Validates user name
 * @param {string} name - The name to validate
 * @returns {boolean} - True if valid
 */
export const validateUserName = (name) => {
  if (!name || typeof name !== 'string') {
    return false;
  }
  
  const sanitized = name.trim();
  
  // Name should be at least 2 characters and max 100
  // Should contain mostly letters and basic punctuation
  const nameRegex = /^[a-zA-Z\s\.\-\']{2,100}$/;
  
  return nameRegex.test(sanitized) || sanitized.length >= 2 && sanitized.length <= 100;
};

/**
 * Sanitizes user name
 * @param {string} name - The name to sanitize
 * @returns {string} - Sanitized name
 */
export const sanitizeName = (name) => {
  if (!name || typeof name !== 'string') {
    return '';
  }
  
  let sanitized = name.trim();
  
  // Remove HTML/script content
  sanitized = validator.stripLow(sanitized);
  
  // Keep only letters, spaces, hyphens, apostrophes, and periods
  sanitized = sanitized.replace(/[^\w\s\.\-\']/g, '');
  
  // Limit length
  sanitized = sanitized.substring(0, 100);
  
  return sanitized;
};

/**
 * Validates Firebase UID format
 * @param {string} firebaseUid - The Firebase UID to validate
 * @returns {boolean} - True if valid Firebase UID format
 */
export const validateFirebaseUid = (firebaseUid) => {
  if (!firebaseUid || typeof firebaseUid !== 'string') {
    return false;
  }
  
  // Firebase UID is typically 28 characters alphanumeric
  return /^[a-zA-Z0-9]{28}$/.test(firebaseUid) || /^[a-zA-Z0-9]{20,}$/.test(firebaseUid);
};

/**
 * Validates ID token format (JWT)
 * @param {string} idToken - The token to validate
 * @returns {boolean} - True if valid token format
 */
export const validateIdTokenFormat = (idToken) => {
  if (!idToken || typeof idToken !== 'string') {
    return false;
  }
  
  // JWT format: three parts separated by dots
  const parts = idToken.split('.');
  return parts.length === 3 && parts.every(part => part.length > 0);
};

/**
 * Comprehensive validation for onboarding data
 * @param {Object} data - The onboarding data to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateOnboardingData = (data) => {
  const errors = [];
  
  // Validate firebaseUid
  if (!data.firebaseUid || !validateFirebaseUid(data.firebaseUid)) {
    errors.push('Invalid Firebase UID');
  }
  
  // Validate name
  if (!data.name || !validateUserName(data.name)) {
    errors.push('Invalid name format');
  }
  
  // Validate phone
  if (!data.phone || !validatePhoneNumber(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  // Validate college name
  if (!data.clgName || !validateCollegeName(data.clgName)) {
    errors.push('Invalid college name');
  }
  
  // Validate gender
  if (!data.gender || !validateGender(data.gender)) {
    errors.push('Invalid gender selection');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes complete onboarding data
 * @param {Object} data - The onboarding data to sanitize
 * @returns {Object} - Sanitized data
 */
export const sanitizeOnboardingData = (data) => {
  return {
    firebaseUid: data.firebaseUid, // Don't modify, validate only
    name: sanitizeName(data.name),
    phone: sanitizePhoneNumber(data.phone),
    clgName: sanitizeCollegeName(data.clgName),
    gender: sanitizeGender(data.gender)
  };
};

/**
 * Logs authentication attempt (for security auditing)
 * @param {Object} logData - Data to log
 * @param {string} logData.eventType - Type of auth event
 * @param {string} logData.userId - User ID (if available)
 * @param {string} logData.email - User email
 * @param {string} logData.ip - Client IP address
 * @param {string} logData.status - Success/failure status
 * @param {string} logData.message - Additional message
 */
export const logAuthAttempt = (logData) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    ...logData
  };
  
  // Log to console with appropriate level
  if (logData.status === 'success') {
    console.log(`[AUTH] ${timestamp} - ${logData.eventType} from ${logData.ip} (${logData.email})`);
  } else {
    console.warn(`[AUTH_FAIL] ${timestamp} - ${logData.eventType} from ${logData.ip}: ${logData.message}`);
  }
  
  // In production, this would be sent to a logging service
  // Example: AWS CloudWatch, LogRocket, Sentry, etc.
  return logEntry;
};

/**
 * Rate limiting configuration helper
 * @param {number} windowMs - Time window in milliseconds
 * @param {number} maxRequests - Maximum requests per window
 * @returns {Object} - Rate limiter options
 */
export const getRateLimiterOptions = (windowMs = 60000, maxRequests = 5) => {
  return {
    windowMs,
    max: maxRequests,
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
      // Optional: skip rate limiting for certain IPs
      return false;
    },
    keyGenerator: (req) => {
      // Use IP address as the key
      return req.ip || req.connection.remoteAddress;
    }
  };
};

export default {
  sanitizeString,
  validateAndSanitizeEmail,
  validatePhoneNumber,
  sanitizePhoneNumber,
  validateGender,
  sanitizeGender,
  validateCollegeName,
  sanitizeCollegeName,
  validateUserName,
  sanitizeName,
  validateFirebaseUid,
  validateIdTokenFormat,
  validateOnboardingData,
  sanitizeOnboardingData,
  logAuthAttempt,
  getRateLimiterOptions
};
