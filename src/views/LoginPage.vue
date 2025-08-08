<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts';
import type { credentialsLogin } from '@/types/validationTypes.ts';

const user = ref<Record<string, unknown> | null>(null);
const { checkLoginStatus, login } = useAuth();
const isLoggedIn = computed(() => !!user.value && Object.keys(user.value).length > 0);

const handleSubmit = async (credentials: credentialsLogin) => {
  await login(credentials);
};

onMounted(async () => {
  user.value = await checkLoginStatus();
});
</script>
<template>
  <AuthForm formType="login" :isLoggedIn="isLoggedIn" @submit="handleSubmit" />
</template>
