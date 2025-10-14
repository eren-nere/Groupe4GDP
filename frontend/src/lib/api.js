const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

async function handleResponse(response) {
  const isJson = response.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await response.json() : null;
  if (!response.ok) {
    const error = new Error(body?.error || `HTTP ${response.status}`);
    error.status = response.status;
    error.body = body;
    throw error;
  }
  return body;
}

export const api = {
  // Auth
  async signIn(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/sign-in`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async signUp(email, password) {
    const res = await fetch(`${BASE_URL}/api/auth/sign-up`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async signInWithOtp(email, redirectTo) {
    const res = await fetch(`${BASE_URL}/api/auth/magic-link`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirectTo }),
    });
    return handleResponse(res);
  },

  async getUser(accessToken) {
    const res = await fetch(`${BASE_URL}/api/auth/user`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return handleResponse(res);
  },

  async signOut() {
    const res = await fetch(`${BASE_URL}/api/auth/sign-out`, { method: 'POST' });
    return handleResponse(res);
  },
  async listProfiles() {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/api/utilisateur`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  async getProfile(id) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/api/utilisateur/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return handleResponse(res);
  },

  async createProfile(payload) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/api/utilisateur`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async updateProfile(id, payload) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/api/utilisateur/${encodeURIComponent(id)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(payload),
    });
    return handleResponse(res);
  },

  async deleteProfile(id) {
    const token = localStorage.getItem('access_token');
    const res = await fetch(`${BASE_URL}/api/utilisateur/${encodeURIComponent(id)}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) return true;
    return handleResponse(res);
  },

  async getSession(accessToken) {
    const res = await fetch(`${BASE_URL}/api/auth/session`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    return handleResponse(res);
  }
};


