/**
 * API Client Utility for handling authenticated requests with JWT
 * Provides automatic token management, error handling, and redirects
 */

import { signOut } from 'firebase/auth'
import { auth } from '../config/firebase'

const API_BASE_URL = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';

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
    // Onboarding not completed
    console.warn('Onboarding incomplete (403). Redirecting to onboarding...');
    localStorage.removeItem('token');
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      const user = JSON.parse(userStr);
      user.onboardingCompleted = false;
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Firebase sign out error:', err);
    }
    if (navigate) navigate('/register');
  }
};

/**
 * Fetch with JWT authentication
 * Automatically adds Authorization header and handles auth errors
 */
export const apiCall = async (endpoint, options = {}, navigate = null) => {
  const token = localStorage.getItem('token');
  const url = `${API_BASE_URL}${endpoint}`;

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

    // Handle authentication errors
    if (response.status === 401) {
      await handleAuthError(401, navigate);
      throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 403) {
      await handleAuthError(403, navigate);
      throw new Error('Profile setup incomplete. Please complete onboarding.');
    }

    // Parse response data
    const data = await response.json();

    // Handle HTTP errors
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

    // Handle authentication errors
    if (response.status === 401) {
      await handleAuthError(401, navigate);
      throw new Error('Session expired. Please log in again.');
    }

    if (response.status === 403) {
      await handleAuthError(403, navigate);
      throw new Error('Profile setup incomplete. Please complete onboarding.');
    }

    const data = await response.json();

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
