const API_URL = import.meta.env.VITE_API_URL;
export async function apiCallService(method: string, endPoint: string, body = {}) {
  const url = `${API_URL}${endPoint}`;
  const options: RequestInit =
    method === 'GET'
      ? { credentials: 'include' }
      : {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
          credentials: 'include',
        };

  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') || '';
  let payload: any = null;
  try {
    payload = contentType.includes('application/json') ? await response.json() : await response.text();
  } catch {
    payload = '';
  }
  if (!response.ok) {
    const message =
      typeof payload === 'string' && payload
        ? payload
        : (payload && ((payload as any).message || (payload as any).error)) || response.statusText;
    throw new Error(`${response.status} ${message}`);
  }
  return payload as any;
}
