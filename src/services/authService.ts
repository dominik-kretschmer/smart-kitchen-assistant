import { apiCallService } from '@/services/apiCallService.ts';

const endPoints: { [key: string]: string } = {
  login: import.meta.env.VITE_API_ENDPOINT_LOGIN,
  me: import.meta.env.VITE_API_ENDPOINT_ME,
  register: import.meta.env.VITE_API_ENDPOINT_REGISTER,
};

export const authService = {
  async checkLoginStatus() {
    return await apiCallService("GET" , endPoints.me)
  },
  async auth(username: string, password: string, methode: string) {
    const body = { username, password };
    return await apiCallService('POST' , endPoints[methode] , body)
  },
};
