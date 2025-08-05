import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { authService } from '@/services/authService';
import { useValidation } from './useValidation';

export function useAuth() {
  const username = ref('');
  const password = ref('');
  const confirmPassword = ref('');
  const error = ref('');
  const isLoggedIn = ref(false);
  const isLoading = ref(false);
  const { validateLoginForm, validateRegisterForm } = useValidation();

  const user = ref(null);

  const checkLoginStatus = async () => {
    try {
      isLoading.value = true;
      const userData = await authService.checkLoginStatus();
      if (!userData.error) {
        isLoggedIn.value = true;
        user.value = userData;
      } else {
        isLoggedIn.value = false;
        user.value = null;
      }

      return userData;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      isLoggedIn.value = false;
      user.value = null;
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (credentials: { username: string; password: string }) => {
    try {
      error.value = '';

      const validationResult = validateLoginForm(credentials);
      if (!validationResult.isValid) {
        error.value = validationResult.errorMessage;
        return false;
      }

      const response = await authService.auth(credentials.username, credentials.password, 'login');
      if (typeof response.id !== 'number') {
        error.value = response.error || 'Login failed';
        return false;
      }

      user.value = response;
      isLoggedIn.value = true;
      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Login failed';
      return false;
    }
  };

  const register = async (credentials: {
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      error.value = '';

      const validationResult = validateRegisterForm(credentials);
      if (!validationResult.isValid) {
        error.value = validationResult.errorMessage;
        return false;
      }

      const response = await authService.auth(
        credentials.username,
        credentials.password,
        'register',
      );

      if (typeof response.id !== 'number') {
        error.value = response.error || 'Registration failed';
        return false;
      }

      return true;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Registration failed';
      return false;
    }
  };

  return {
    username,
    password,
    confirmPassword,
    error,
    isLoggedIn,
    isLoading,
    user,
    checkLoginStatus,
    login,
    register,
  };
}
