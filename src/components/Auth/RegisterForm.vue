<script setup lang="ts">
import AuthForm from '@/components/Auth/AuthForm.vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { computed } from 'vue';

const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const isLoggedIn = computed(() => userStore.getIsLoggedIn);

userStore.initUser?.();
</script>

<template>
  <div class="page page--auth">
    <header class="auth-header">
      <h1 class="auth-title">{{ t('navigation.register') }}</h1>
    </header>
    <div v-if="isLoggedIn" class="auth-already">
      <p>{{ t('auth.alreadyLoggedIn') }}</p>
      <router-link class="btn btn--primary" :to="{ name: 'home' }">{{
        t('auth.goToHome')
      }}</router-link>
    </div>
    <div v-else class="auth-card">
      <AuthForm mode="register" @success="router.push({ name: 'home' })" />
      <div class="switch">
        <span>{{ t('auth.haveAccount') }}</span>
        <router-link class="btn btn--ghost" :to="{ name: 'login' }">
          {{ t('navigation.login') }}
        </router-link>
      </div>
    </div>
  </div>
</template>
