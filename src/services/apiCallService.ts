const API_URL = import.meta.env.VITE_API_URL;
export async function apiCallService(methode: string, endPoint: string, body = {}) {
  if (methode === 'GET') {
    const response = await fetch(`${API_URL}${endPoint}`, { credentials: 'include' });
    return await response.json();
  }
  const response = await fetch(`${API_URL}${endPoint}`, {
    method: methode,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    credentials: 'include',
  });
  return await response.json();
}
