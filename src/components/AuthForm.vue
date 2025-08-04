<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits(['submit']);
const username = ref('');
const password = ref('');
const confirmPassword = ref('');

defineProps({
  formType: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value),
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: '',
  },
});

const handleSubmit = () => {
  emit('submit', {
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  });
};
</script>
<template>
  <div class="auth-container" v-if="!isLoading">
    <div v-if="isLoggedIn" class="already-logged-in">
      <h1>You are already logged in</h1>
      <router-link to="/" class="home-link">Go to Home</router-link>
    </div>
    <div v-else>
      <h1>{{ formType === 'login' ? 'Login' : 'Register' }}</h1>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            :placeholder="formType === 'login' ? 'Enter your username' : 'Choose a username'"
            required />
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="formType === 'login' ? 'Enter your password' : 'Choose a password'"
            required />
        </div>
        <div v-if="formType === 'register'" class="form-group">
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
        <button type="submit" class="auth-button">
          {{ formType === 'login' ? 'Login' : 'Register' }}
        </button>
        <div class="auth-link">
          <template v-if="formType === 'login'">
            Don't have an account?
            <router-link to="/register">Register</router-link>
          </template>
          <template v-else>
            Already have an account?
            <router-link to="/login">Login</router-link>
          </template>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 20px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.error-message {
  color: red;
  margin-top: 10px;
}

.auth-button {
  padding: 10px;
  background-color: #4caf50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.auth-link {
  margin-top: 15px;
  text-align: center;
}

.already-logged-in {
  text-align: center;
}

.home-link {
  display: block;
  margin-top: 15px;
  text-decoration: none;
  color: #4caf50;
}
</style>
