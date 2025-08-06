<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts';

const { error, isLoggedIn, isLoading, checkLoginStatus, login } = useAuth();

onMounted(() => {
  checkLoginStatus();
});

const handleSubmit = async (credentials) => {
  await login(credentials);
};
</script>
<template>
  <AuthForm
    formType="login"
    :isLoggedIn="isLoggedIn"
    :isLoading="isLoading"
    :error="error"
    @submit="handleSubmit" />
</template>
