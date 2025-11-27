// lib/auth.js
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Set cookie helper function
 */
function setCookie(name, value, days = 7) {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`;
}

/**
 * Get cookie helper function
 */
function getCookie(name) {
  if (typeof window === 'undefined') return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Delete cookie helper function
 */
function deleteCookie(name) {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
}

/**
 * Login admin
 */
// export async function login(email, password) {
//   try {
//     const response = await fetch(`${API_URL}/api/admin/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ email, password }),
//     });

//     const data = await response.json();

//     if (data.success) {
//       // Store token in both localStorage AND cookie
//       localStorage.setItem('admin_token', data.token);
//       localStorage.setItem('admin_user', JSON.stringify(data.admin));

//       // Set cookie for middleware
//       setCookie('admin_token', data.token, 7);

//       return { success: true };
//     } else {
//       return { success: false, error: data.error || 'Login failed' };
//     }
//   } catch (error) {
//     console.error('Login error:', error);
//     return { success: false, error: 'Network error. Please try again.' };
//   }
// }
export async function login(email, password) {
  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // REQUIRED
    });

    const data = await response.json();

    if (data.success) {
      return { success: true };
    }

    return { success: false, error: data.error };
  } catch (err) {
    return { success: false, error: "Network error" };
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
  deleteCookie('admin_token'); // Also remove cookie
}

/**
 * Get stored token
 */
export function getToken() {
  if (typeof window !== 'undefined') {
    // Try localStorage first, then cookie
    return localStorage.getItem('admin_token') || getCookie('admin_token');
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
      window.location.href = '/login';
      return { success: false, error: 'Session expired. Please login again.' };
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    return { success: false, error: 'Network error. Please try again.' };
  }
}