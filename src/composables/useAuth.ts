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
  const router = useRouter();
  const { validateLoginForm, validateRegisterForm } = useValidation();

  const user = ref(null);

  const checkLoginStatus = async () => {
    try {
      isLoading.value = true;
      const userData = await authService.checkLoginStatus();

      if (userData) {
        isLoggedIn.value = true;
        user.value = userData;
      } else {
        isLoggedIn.value = false;
        user.value = null;
      }

      return userData;
    } catch (err) {
      console.error('Error checking login status:', err);
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

      const response = await authService.login(credentials.username, credentials.password);

      if (typeof response.id !== 'number') {
        error.value = response.error || 'Login failed';
        return false;
      }

      // The cookie is set by the server, no need to store in localStorage
      user.value = response;
      isLoggedIn.value = true;
      await router.push('/');
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

      const response = await authService.register(credentials.username, credentials.password);

      if (typeof response.id !== 'number') {
        error.value = response.error || 'Registration failed';
        return false;
      }

      // After registration, user needs to login to set the cookie
      await router.push('/login');
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
