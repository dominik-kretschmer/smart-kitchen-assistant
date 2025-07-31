<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const error = ref('');
const router = useRouter();

const register = async () => {
  try {
    error.value = '';

    if (!username.value || !password.value || !confirmPassword.value) {
      error.value = 'Please fill in all fields';
      return;
    }

    if (password.value !== confirmPassword.value) {
      error.value = 'Passwords do not match';
      return;
    }

    const response = await fetch('http://localhost:3000/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Registration failed');
    }

    router.push('/login');
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err instanceof Error ? err.message : 'Registration failed';
  }
};
</script>

<template>
  <div class="register-container">
    <h1>Register</h1>

    <form @submit.prevent="register" class="register-form">
      <div class="form-group">
        <label for="username">Username</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Choose a username"
          required />
      </div>

      <div class="form-group">
        <label for="password">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Choose a password"
          required />
      </div>

      <div class="form-group">
        <label for="confirm-password">Confirm Password</label>
        <input
          id="confirm-password"
          v-model="confirmPassword"
          type="password"
          placeholder="Confirm your password"
          required />
      </div>

      <div v-if="error" class="error-message">
        {{ error }}
      </div>

      <button type="submit" class="register-button">Register</button>

      <div class="login-link">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </div>
    </form>
  </div>
</template>

<style scoped>
.register-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
}

.register-form {
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

.register-button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.register-button:hover {
  background-color: #45a049;
}

.login-link {
  text-align: center;
  margin-top: 15px;
}
</style>
