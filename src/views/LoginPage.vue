<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();
const isLoggedIn = ref(false);

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const cookieValue = parts.pop()?.split(';').shift();
    return cookieValue || null;
  }
  return null;
};

const checkLoginStatus = () => {
  try {
    const authToken = getCookie('authToken') || getCookie('sessionId') || getCookie('jwt');

    if (authToken) {
      isLoggedIn.value = true;
      const userData = getCookie('userData');
      if (userData) {
        try {
          const parsedUserData = JSON.parse(decodeURIComponent(userData));
          localStorage.setItem('user', JSON.stringify(parsedUserData));
        } catch (e) {
          console.error('Error parsing user data from cookie:', e);
        }
      }
    } else {
      isLoggedIn.value = false;
      localStorage.removeItem('user');
    }
  } catch (err) {
    console.error('Error checking login status from cookies:', err);
    isLoggedIn.value = false;
  }
};
onMounted(() => {
  checkLoginStatus();
});

const login = async () => {
  try {
    error.value = '';

    if (!username.value || !password.value) {
      error.value = 'Please enter both username and password';
      return;
    }

    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }

    localStorage.setItem('user', JSON.stringify(data));
    isLoggedIn.value = true;

    await router.push('/');
  } catch (err) {
    console.error('Login error:', err);
    error.value = err instanceof Error ? err.message : 'Login failed';
  }
};
</script>

<template>
  <div class="login-container">
    <div v-if="isLoggedIn" class="already-logged-in">
      <h1>You are already logged in</h1>
      <router-link to="/" class="home-link">Go to Home</router-link>
    </div>
    <div v-else>
      <h1>Login</h1>

      <form @submit.prevent="login" class="login-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            placeholder="Enter your username"
            required />
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            placeholder="Enter your password"
            required />
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button type="submit" class="login-button">Login</button>

        <div class="register-link">
          Don't have an account?
          <router-link to="/register">Register</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

label {
  font-weight: bold;
}

input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.login-button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.login-button:hover {
  background-color: #45a049;
}

.register-link {
  text-align: center;
  margin-top: 15px;
}

.already-logged-in {
  text-align: center;
  padding: 20px;
}

.home-link {
  display: inline-block;
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #4caf50;
  color: white;
  text-decoration: none;
  border-radius: 4px;
}

.home-link:hover {
  background-color: #45a049;
}
</style>
