/**
 * API Client Utility for handling authenticated requests with JWT
 * Provides automatic token management, error handling, and redirects
 */

import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

const getApiBaseUrl = () => {
  // In development, always use relative paths so Vite proxy handles the connection.
  // This avoids Mixed Content errors and most CORS issues.
  if (import.meta.env.DEV) {
    return '';
  }

  return import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
};

const API_BASE_URL = getApiBaseUrl();

/**
 * Handle authentication errors and redirect appropriately
 */
const handleAuthError = async (status, navigate) => {
  if (status === 401) {
    // Token expired or invalid
    console.warn('Token expired or invalid (401). Redirecting to login...');
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase sign out error:', err);
    }
    if (navigate) navigate('/login');
  } else if (status === 403) {
    // Permission denied or Onboarding not completed
    console.warn('Access forbidden or onboarding incomplete (403).');
    // NOTE: We do NOT remove the token here because the user may still be authenticated
    // but just lacking permissions for a specific action (or needs to finish registration).

    // Check if it's an onboarding redirect or just a forbidden action
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.onboardingCompleted === false && navigate) {
        navigate('/register');
      }
    }
  }
};


/**
 * Fetch with JWT authentication
 * Automatically adds Authorization header and handles auth errors
 */
export const apiCall = async (endpoint, options = {}, navigate = null) => {
  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}${endpoint}`;

  if (import.meta.env.DEV) {
    console.debug(`[API] ${options.method || 'GET'} ${url}`);
  }

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add Authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // 1. Safe Response Parsing (Text first, then JSON)
    const contentType = response.headers.get("content-type");
    const text = await response.text();
    let data;

    try {
      if (contentType && contentType.includes("application/json") && text) {
        data = JSON.parse(text);
      } else {
        data = { message: text || `Non-JSON response received (${response.status})` };
      }
    } catch (e) {
      console.warn("JSON Parse Failed:", e);
      data = { message: "Invalid server response format" };
    }

    // 2. Handle specific HTTP statuses
    if (response.status === 401) {
      await handleAuthError(401, navigate);
      throw new Error(data.message || 'Session expired. Please log in again.');
    }

    if (response.status === 403) {
      await handleAuthError(403, navigate);
      throw new Error(data.message || 'Profile setup incomplete.');
    }

    // 3. Handle other errors
    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return { data, status: response.status };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

/**
 * GET request helper
 */
export const apiGet = async (endpoint, navigate = null) => {
  return apiCall(endpoint, { method: 'GET' }, navigate);
};

/**
 * POST request helper
 */
export const apiPost = async (endpoint, body = {}, navigate = null) => {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(body),
  }, navigate);
};

/**
 * POST with FormData (for file uploads)
 */
export const apiPostFormData = async (endpoint, formData, navigate = null) => {
  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}${endpoint}`;

  const headers = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    // Safe Parsing and Error Handling (similar to apiCall)
    const contentType = response.headers.get("content-type");
    const text = await response.text();
    let data;

    try {
      if (contentType && contentType.includes("application/json") && text) {
        data = JSON.parse(text);
      } else {
        data = { message: text || `Non-JSON response received (${response.status})` };
      }
    } catch (e) {
      console.warn("JSON Parse Failed:", e);
      data = { message: "Invalid server response format" };
    }

    // Handle authentication errors
    if (response.status === 401) {
      await handleAuthError(401, navigate);
      throw new Error(data.message || 'Session expired. Please log in again.');
    }

    if (response.status === 403) {
      await handleAuthError(403, navigate);
      throw new Error(data.message || 'Profile setup incomplete.');
    }

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    return { data, status: response.status };
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error.message);
    throw error;
  }
};

/**
 * PUT request helper
 */
export const apiPut = async (endpoint, body = {}, navigate = null) => {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
  }, navigate);
};

/**
 * DELETE request helper
 */
export const apiDelete = async (endpoint, navigate = null) => {
  return apiCall(endpoint, { method: 'DELETE' }, navigate);
};

/**
 * PATCH request helper
 */
export const apiPatch = async (endpoint, body = {}, navigate = null) => {
  return apiCall(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(body),
  }, navigate);
};

