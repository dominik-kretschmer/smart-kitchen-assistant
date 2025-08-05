const API_URL = import.meta.env.VITE_API_URL;

const endPoints: { [key: string]: string } = {
  login: import.meta.env.VITE_API_ENDPOINT_LOGIN,
  me: import.meta.env.VITE_API_ENDPOINT_ME,
  register: import.meta.env.VITE_API_ENDPOINT_REGISTER,
};

export const authService = {
  async checkLoginStatus() {
    const response = await fetch(`${API_URL}${endPoints.me}`, {
      credentials: 'include',
    });
    return await response.json();
  },
  async auth(username: string, password: string, methode: string) {
    const response = await fetch(`${API_URL}${endPoints[methode]}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
      credentials: 'include',
    });
    return await response.json();
  },
};
