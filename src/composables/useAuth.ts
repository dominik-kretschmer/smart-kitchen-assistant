import { authService } from '@/services/authService';
import { useValidation } from './useValidation';
import type { credentialsLogin, credentialsRegister } from '@/types/validationTypes.ts';
import { useUserStore } from '@/stores/userStore';

const { validateLoginForm, validateRegisterForm } = useValidation();
export function useAuth() {
  const userStore = useUserStore();

  const checkLoginStatus = async () => {
    try {
      const response = await authService.checkLoginStatus();
      if (typeof response.id === 'number') {
        userStore.setUser(response.id, response.username);
        return response;
      }
      userStore.clearUser();
      return null;
    } catch {
      userStore.clearUser();
      return null;
    }
  };

  const login = async (credentials: credentialsLogin) => {
    const validationResult = validateLoginForm(credentials);
    if (!validationResult.isValid) {
      return false;
    }
    try {
      const response = await authService.auth(credentials.username, credentials.password, 'login');
      if (response && typeof response.id === 'number') {
        userStore.setUser(response.id, credentials.username);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const register = async (credentials: credentialsRegister) => {
    const validationResult = validateRegisterForm(credentials);
    if (!validationResult.isValid) {
      return false;
    }
    try {
      const response = await authService.auth(
        credentials.username,
        credentials.password,
        'register',
      );
      if (response && typeof response.id === 'number') {
        userStore.setUser(response.id, credentials.username);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return {
    checkLoginStatus,
    login,
    register,
  };
}
