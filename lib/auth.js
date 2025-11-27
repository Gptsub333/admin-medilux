// lib/auth.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Login admin
 */
export async function login(email, password) {
  try {
    const response = await fetch(`${API_URL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        userType: 'admin'
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Store token and user in localStorage
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_user', JSON.stringify(data.admin));
      return { success: true };
    } else {
      return { success: false, error: data.error || 'Login failed' };
    }
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Register admin
 */
export async function register(email, password, name, secretKey) {
  try {
    const response = await fetch(`${API_URL}/api/admin/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name, secretKey }),
    });

    const data = await response.json();

    if (data.success) {
      return { success: true, admin: data.admin };
    } else {
      return { success: false, error: data.error || 'Registration failed' };
    }
  } catch (error) {
    console.error('Registration error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}

/**
 * Logout admin
 */
export function logout() {
  localStorage.removeItem('admin_token');
  localStorage.removeItem('admin_user');
  window.location.href = '/login';
}

/**
 * Get stored token
 */
export function getToken() {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin_token');
  }
  return null;
}

/**
 * Get stored admin user
 */
export function getUser() {
  if (typeof window !== 'undefined') {
    const user = localStorage.getItem('admin_user');
    return user ? JSON.parse(user) : null;
  }
  return null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  return !!getToken();
}

/**
 * API call with authentication
 */
export async function apiCall(endpoint, options = {}) {
  const token = getToken();

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    const data = await response.json();

    // If unauthorized, logout
    if (response.status === 401) {
      logout();
      return { success: false, error: 'Session expired. Please login again.' };
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}