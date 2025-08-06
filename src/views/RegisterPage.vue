<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts';
const { error, isLoggedIn, checkLoginStatus, register } = useAuth();
const handleSubmit = async (credentials) => {
  await register(credentials);
};

onMounted(() => {
  checkLoginStatus();
});
</script>
<template>
  <AuthForm formType="register" :isLoggedIn="isLoggedIn" :error="error" @submit="handleSubmit" />
</template>
