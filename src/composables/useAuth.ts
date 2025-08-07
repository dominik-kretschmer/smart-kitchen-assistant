import { authService } from '@/services/authService';
import { useValidation } from './useValidation';
import type { credentialsLogin, credentialsRegister } from '@/types/validationTypes.ts';

const { validateLoginForm, validateRegisterForm } = useValidation();
export function useAuth() {
  const checkLoginStatus = async () => {
    return await authService.checkLoginStatus();
  };

  const login = async (credentials: credentialsLogin) => {
    const validationResult = validateLoginForm(credentials);
    if (!validationResult.isValid) {
      return false;
    }
    const response = await authService.auth(credentials.username, credentials.password, 'login');
    return typeof response.id === 'number';
  };

  const register = async (credentials: credentialsRegister) => {
    const validationResult = validateRegisterForm(credentials);
    if (!validationResult.isValid) {
      return false;
    }
    const response = await authService.auth(credentials.username, credentials.password, 'register');
    return typeof response.id === 'number';
  };

  return {
    checkLoginStatus,
    login,
    register,
  };
}
