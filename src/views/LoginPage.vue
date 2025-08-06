<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts';

const { error, isLoggedIn, isLoading, checkLoginStatus, login } = useAuth();
const handleSubmit = async (credentials) => {
  await login(credentials);
};
onMounted(() => {
  checkLoginStatus();
});
</script>
<template>
  <AuthForm
    formType="login"
    :isLoggedIn="isLoggedIn"
    :isLoading="isLoading"
    :error="error"
    @submit="handleSubmit" />
</template>
