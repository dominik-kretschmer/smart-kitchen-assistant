<script setup lang="ts">
import AuthForm from '@/components/AuthForm.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
userStore.initUser?.();

const isLoggedIn = computed(() => userStore.getIsLoggedIn);

function onSuccess() {
  router.push({ name: 'home' });
}
</script>

<template>
  <div class="page page--auth">
    <header class="auth-header">
      <h1 class="auth-title">{{ t('navigation.login') }}</h1>
    </header>

    <div v-if="isLoggedIn" class="auth-already">
      <p>{{ t('auth.alreadyLoggedIn') }}</p>
      <router-link class="btn btn--primary" :to="{ name: 'home' }">{{ t('auth.goToHome') }}</router-link>
    </div>

    <div v-else class="auth-card">
      <AuthForm mode="login" @success="onSuccess" />

      <div class="switch">
        <span>{{ t('auth.noAccount') }}</span>
        <router-link class="btn btn--ghost" :to="{ name: 'register' }">
          {{ t('navigation.register') }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page--auth {
  max-width: 420px;
  margin: 0 auto;
  padding: 16px;
}
.auth-header {
  margin-bottom: 16px;
}
.auth-title {
  margin: 0;
  font-size: 24px;
  font-weight: 700;
}
.auth-already {
  display: grid;
  gap: 12px;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 8px;
  background: #fafafa;
}
.auth-card {
  display: grid;
  gap: 12px;
}
.switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.btn {
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.btn--primary {
  background: #4f46e5;
  border-color: #4f46e5;
  color: #fff;
}
.btn--ghost {
  background: transparent;
}
</style>
