<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts';
const isLoggedIn=ref(false)
const user = ref({});
const {checkLoginStatus, login } = useAuth();
const handleSubmit = async (credentials) => {
  await login(credentials);
};
watch(user, (newUser : object) => {
  isLoggedIn.value = !!newUser && Object.keys(newUser).length > 0;
}, { immediate: true });

onMounted(() => {
  checkLoginStatus();
});
</script>
<template>
  <AuthForm
    formType="login"
    :isLoggedIn="isLoggedIn"
    @submit="handleSubmit" />
</template>
