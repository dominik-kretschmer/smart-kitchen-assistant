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

  const checkLoginStatus = async () => {
    try {
      isLoading.value = true;
      const response = await authService.checkLoginStatus();

      if (response) {
        isLoggedIn.value = true;
      }
    } catch (err) {
      console.error('Error checking login status:', err);
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

      localStorage.setItem('user', JSON.stringify(response));
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

      localStorage.setItem('user', JSON.stringify(response));
      isLoggedIn.value = true;

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
    checkLoginStatus,
    login,
    register,
  };
}
