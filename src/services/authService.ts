const API_URL = 'http://localhost:3000';

export const authService = {
  async checkLoginStatus() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    });
    return response.ok;
  },

  async login(username: string, password: string) {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    return await response.json();
  },

  async register(username: string, password: string) {
    const response = await fetch(`${API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });
    return await response.json();
  }
};
