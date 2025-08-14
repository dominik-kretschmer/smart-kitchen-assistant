<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { authService } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';
import type { Mode } from '@/types/types';

const props = defineProps<{
  mode: Mode;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const needsConfirm = computed(() => props.mode === 'register');
const { t } = useI18n();
const userStore = useUserStore();
const loading = ref(false);
const error = ref<string>('');
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

userStore.initUser?.();
function validate(): boolean {
  if (!form.username.trim()) {
    error.value = t('auth.enterUsername');
    return false;
  }
  if (!form.password) {
    error.value = t('auth.enterPassword');
    return false;
  }
  if (needsConfirm.value && form.password !== form.confirmPassword) {
    error.value = t('auth.confirmPassword');
    return false;
  }
  error.value = '';
  return true;
}

async function submit() {
  if (!validate()) return;
  loading.value = true;
  error.value = '';

  try {
    const methode = props.mode;
    const res = await authService.auth(form.username.trim(), form.password, methode);
    const payload = (res?.data ?? res) as any;
    const userId = payload?.userId ?? payload?.id ?? null;
    const username = payload?.username ?? form.username.trim();

    userStore.setUser(Number(userId), String(username));
    emit('success');
  } catch (e: any) {
    error.value = e?.message || t('errors.httpError');
  } finally {
    loading.value = false;
  }
}
</script>
<template>
  <form class="auth-form" @submit.prevent="submit" autocomplete="on">
    <div class="form-row">
      <label class="label" for="username">{{ t('auth.username') }}</label>
      <input
        id="username"
        class="input"
        type="text"
        v-model.trim="form.username"
        :placeholder="t('auth.enterUsername')"
        required />
    </div>
    <div class="form-row">
      <label class="label" for="password">{{ t('auth.password') }}</label>
      <input
        id="password"
        class="input"
        type="password"
        v-model="form.password"
        :placeholder="t('auth.enterPassword')"
        required />
    </div>
    <div v-if="needsConfirm" class="form-row">
      <label class="label" for="confirm">{{ t('auth.confirmPassword') }}</label>
      <input
        id="confirm"
        class="input"
        type="password"
        v-model="form.confirmPassword"
        :placeholder="t('auth.confirmPassword')"
        required />
    </div>
    <p v-if="error" class="error" role="alert">{{ error }}</p>
    <div class="actions">
      <button class="btn btn--primary" type="submit" :disabled="loading">
        <span v-if="loading">...</span>
        <span v-else>
          {{ props.mode === 'login' ? t('navigation.login') : t('navigation.register') }}
        </span>
      </button>
    </div>
  </form>
</template>
