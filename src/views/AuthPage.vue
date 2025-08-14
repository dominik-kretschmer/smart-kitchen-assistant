<script setup lang="ts">
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import AuthForm from '@/components/Auth/AuthForm.vue';
import type { Mode } from '@/types/types.ts';

const { t } = useI18n();
const router = useRouter();
const mode = ref<Mode>('login');
const title = computed(() =>
  mode.value === 'login' ? t('navigation.login') : t('navigation.register'),
);
</script>
<template>
  <div class="page page--auth">
    <header class="auth-header">
      <h1 class="auth-title">{{ title }}</h1>
    </header>
    <div class="tabs" role="tablist" aria-label="auth-tabs">
      <button
        type="button"
        class="tab"
        :class="{ 'tab--active': mode === 'login' }"
        role="tab"
        aria-selected="mode === 'login'"
        @click="mode = 'login'">
        {{ t('navigation.login') }}
      </button>
      <button
        type="button"
        class="tab"
        :class="{ 'tab--active': mode === 'register' }"
        role="tab"
        aria-selected="mode === 'register'"
        @click="mode = 'register'">
        {{ t('navigation.register') }}
      </button>
    </div>
    <AuthForm :mode="mode" @success="router.push({ name: 'home' })" />
  </div>
</template>
