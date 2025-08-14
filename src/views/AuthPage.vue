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

function switchMode(next: Mode) {
  mode.value = next;
}
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
        @click="switchMode('login')">
        {{ t('navigation.login') }}
      </button>
      <button
        type="button"
        class="tab"
        :class="{ 'tab--active': mode === 'register' }"
        role="tab"
        aria-selected="mode === 'register'"
        @click="switchMode('register')">
        {{ t('navigation.register') }}
      </button>
    </div>

    <AuthForm :mode="mode" @success="router.push({ name: 'home' })" />
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
.tabs {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
}
.tab {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 999px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
}
.tab--active {
  background: #eef2ff;
  border-color: #c7d2fe;
  color: #3730a3;
}
.switch {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 12px;
}
.btn {
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
}
.btn--ghost {
  background: transparent;
}
</style>
