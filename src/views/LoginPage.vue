<script setup lang="ts">
import { onMounted } from 'vue';
import AuthForm from '../components/AuthForm.vue';
import { useAuth } from '../composables/useAuth';

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
