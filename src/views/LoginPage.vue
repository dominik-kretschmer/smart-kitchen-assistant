<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const error = ref('');
const router = useRouter();

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

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Login failed');
    }

    const userData = await response.json();

    localStorage.setItem('user', JSON.stringify(userData));

    router.push('/');
  } catch (err) {
    console.error('Login error:', err);
    error.value = err instanceof Error ? err.message : 'Login failed';
  }
};
</script>

<template>
  <div class="login-container">
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
</style>
