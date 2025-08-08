<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts';
import type { credentialsRegister } from '@/types/validationTypes.ts';

const user = ref<Record<string, unknown> | null>(null);
const { checkLoginStatus, register } = useAuth();
const isLoggedIn = computed(() => !!user.value && Object.keys(user.value).length > 0);

const handleSubmit = async (credentials: credentialsRegister) => {
  await register(credentials);
};

onMounted(async () => {
  user.value = await checkLoginStatus();
});
</script>
<template>
  <AuthForm formType="register" :isLoggedIn="isLoggedIn" @submit="handleSubmit" />
</template>
