import CONFIG from './config';

/**
 * Unified fetch wrapper for backend endpoints.
 * Automatically injects X-Admin-Token from sessionStorage if available.
 */
export async function request(endpoint, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const adminToken = sessionStorage.getItem('admin_token');
  if (adminToken) {
    headers['X-Admin-Token'] = adminToken;
  }

  const response = await fetch(`${CONFIG.API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return response;
}

export default request;
