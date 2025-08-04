<script setup lang="ts">
import { onMounted } from 'vue';
import AuthForm from '../components/AuthForm.vue';
import { useAuth } from '../composables/useAuth';

const { error, isLoggedIn, checkLoginStatus, register } = useAuth();

onMounted(() => {
  checkLoginStatus();
});

const handleSubmit = async (credentials) => {
  await register(credentials);
};
</script>
<template>
  <AuthForm formType="register" :isLoggedIn="isLoggedIn" :error="error" @submit="handleSubmit" />
</template>
