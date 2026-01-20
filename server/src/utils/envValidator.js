/**
 * Environment variable validation utility
 * Ensures all required environment variables are set on server startup
 */

/**
 * List of required environment variables
 * Add or remove based on your application needs
 */
const REQUIRED_ENV_VARS = [
  'MONGO_URI',
  'JWT_SECRET',
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL',
  'FIREBASE_CLIENT_ID',
  'EMAIL_USER',
  'EMAIL_PASSWORD',
  'PORT'
];

/**
 * Optional environment variables with default values
 */
const OPTIONAL_ENV_VARS = {
  'NODE_ENV': 'development',
  'LOG_LEVEL': 'info',
  'JWT_EXPIRY': '7d',
  'ALLOWED_ORIGINS': 'http://localhost:3000,http://localhost:5173',
  'RAZORPAY_KEY_ID': '',
  'RAZORPAY_KEY_SECRET': ''
};

/**
 * Validates that all required environment variables are set
 * @throws {Error} if any required environment variable is missing
 * @returns {Object} validated environment configuration
 */
export const validateEnvironmentVariables = () => {
  const missingVars = [];
  const config = { ...process.env };

  // Check required variables
  REQUIRED_ENV_VARS.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  // Add defaults for optional variables
  Object.entries(OPTIONAL_ENV_VARS).forEach(([varName, defaultValue]) => {
    if (!process.env[varName]) {
      config[varName] = defaultValue;
      console.info(`[ENV] Using default value for ${varName}: ${defaultValue}`);
    }
  });

  // Throw error if required variables are missing
  if (missingVars.length > 0) {
    const errorMessage = `Missing required environment variables:\n${missingVars.map(v => `  - ${v}`).join('\n')}\n\nPlease add these to your .env file.`;
    
    console.error(`\n${'='.repeat(60)}\n[ERROR] ${errorMessage}\n${'='.repeat(60)}\n`);
    
    // Only throw in production. In dev, we log and continue if possible.
    if (process.env.NODE_ENV === 'production') {
      throw new Error(errorMessage);
    } else {
      console.warn("\n[WARNING] Continuing startup despite missing variables. Some features will be broken.");
      if (missingVars.includes('MONGO_URI')) {
        console.warn("[CRITICAL] MONGO_URI is missing. API calls will fail.");
      }
    }
  }

  // Validate environment variable formats
  try {
    validateVariableFormats(config);
  } catch (fmtError) {
    if (process.env.NODE_ENV === 'production') throw fmtError;
    console.warn(`[WARNING] Format validation failed: ${fmtError.message}`);
  }

  // Log startup configuration (without sensitive values)
  logStartupConfiguration(config);

  return config;
};

/**
 * Validates the format and values of environment variables
 * @param {Object} config - The configuration object
 * @throws {Error} if any variable has invalid format
 */
const validateVariableFormats = (config) => {
  const errors = [];

  // Validate JWT_SECRET strength (should be at least 32 characters)
  if (config.JWT_SECRET && config.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long for security');
  }

  // Validate PORT is a valid number
  const port = parseInt(config.PORT, 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push(`PORT must be a valid number between 1 and 65535, got: ${config.PORT}`);
  }

  // Validate NODE_ENV
  const validEnvs = ['development', 'staging', 'production'];
  if (!validEnvs.includes(config.NODE_ENV)) {
    errors.push(`NODE_ENV must be one of: ${validEnvs.join(', ')}, got: ${config.NODE_ENV}`);
  }

  // Validate FIREBASE_PRIVATE_KEY format (should have newlines)
  if (config.FIREBASE_PRIVATE_KEY && !config.FIREBASE_PRIVATE_KEY.includes('-----BEGIN')) {
    errors.push('FIREBASE_PRIVATE_KEY appears to be malformed (missing PEM header)');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (config.EMAIL_USER && !emailRegex.test(config.EMAIL_USER)) {
    errors.push(`EMAIL_USER appears to be invalid: ${config.EMAIL_USER}`);
  }

  // Validate ALLOWED_ORIGINS (must be comma-separated URLs)
  if (config.ALLOWED_ORIGINS) {
    const origins = config.ALLOWED_ORIGINS.split(',').map(o => o.trim());
    const invalidOrigins = origins.filter(o => {
      try {
        new URL(o);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidOrigins.length > 0) {
      errors.push(`Invalid URLs in ALLOWED_ORIGINS: ${invalidOrigins.join(', ')}`);
    }
  }

  if (errors.length > 0) {
    const errorMessage = `Environment variable validation failed:\n${errors.map(e => `  - ${e}`).join('\n')}`;
    console.error(`\n${'='.repeat(60)}\n[ERROR] ${errorMessage}\n${'='.repeat(60)}\n`);
    throw new Error(errorMessage);
  }
};

/**
 * Logs startup configuration (without sensitive values)
 * @param {Object} config - The configuration object
 */
const logStartupConfiguration = (config) => {
  console.log('\n' + '='.repeat(60));
  console.log('[STARTUP] Environment Configuration');
  console.log('='.repeat(60));

  const loggableVars = {
    NODE_ENV: config.NODE_ENV,
    PORT: config.PORT,
    JWT_EXPIRY: config.JWT_EXPIRY,
    LOG_LEVEL: config.LOG_LEVEL,
    MONGO_URI: maskSensitiveValue(config.MONGO_URI),
    JWT_SECRET_LENGTH: config.JWT_SECRET ? config.JWT_SECRET.length : 0,
    FIREBASE_PROJECT_ID: config.FIREBASE_PROJECT_ID,
    EMAIL_USER: config.EMAIL_USER,
    ALLOWED_ORIGINS: config.ALLOWED_ORIGINS
  };

  Object.entries(loggableVars).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      console.log(`  ${key}: ${value}`);
    }
  });

  console.log('='.repeat(60) + '\n');
};

/**
 * Masks sensitive values for logging
 * @param {string} value - The value to mask
 * @returns {string} - Masked value
 */
const maskSensitiveValue = (value) => {
  if (!value || value.length < 10) {
    return '***';
  }

  const start = value.substring(0, 5);
  const end = value.substring(value.length - 3);
  const masked = '*'.repeat(Math.max(1, value.length - 8));

  return `${start}${masked}${end}`;
};

/**
 * Gets an environment variable with optional default
 * @param {string} varName - The variable name
 * @param {string} defaultValue - Optional default value
 * @returns {string} - The environment variable value
 * @throws {Error} if variable is not found and no default provided
 */
export const getEnvVariable = (varName, defaultValue = null) => {
  const value = process.env[varName];

  if (!value) {
    if (defaultValue !== null) {
      return defaultValue;
    }
    throw new Error(`Required environment variable ${varName} not found`);
  }

  return value;
};

/**
 * Gets all CORS allowed origins as an array
 * @returns {string[]} - Array of allowed origins
 */
export const getAllowedOrigins = () => {
  const origins = process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:5173';
  return origins.split(',').map(o => o.trim());
};

/**
 * Checks if the server is running in production mode
 * @returns {boolean} - True if NODE_ENV is 'production'
 */
export const isProduction = () => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Checks if the server is running in development mode
 * @returns {boolean} - True if NODE_ENV is 'development'
 */
export const isDevelopment = () => {
  return process.env.NODE_ENV === 'development';
};

export default {
  validateEnvironmentVariables,
  getEnvVariable,
  getAllowedOrigins,
  isProduction,
  isDevelopment
};
