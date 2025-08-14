<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { authService } from '@/services/authService';
import { useUserStore } from '@/stores/userStore';

type Mode = 'login' | 'register';

const props = defineProps<{
  mode: Mode;
}>();

const emit = defineEmits<{
  (e: 'success'): void;
}>();

const { t } = useI18n();
const userStore = useUserStore();
userStore.initUser?.();

const loading = ref(false);
const error = ref<string>('');
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
});

const needsConfirm = computed(() => props.mode === 'register');

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
    const methode = props.mode === 'login' ? 'login' : 'register';
    const res = await authService.auth(form.username.trim(), form.password, methode);

    const payload = (res?.data ?? res) as any;
    const userId = payload?.userId ?? payload?.id ?? null;
    const username = payload?.username ?? form.username.trim();

    if (typeof userId === 'number' || typeof userId === 'string') {
      userStore.setUser(Number(userId), String(username));
      emit('success');
    } else {
      error.value = t('errors.httpError');
    }
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

<style scoped>
.auth-form {
  display: grid;
  gap: 12px;
  border: 1px solid #eee;
  padding: 16px;
  border-radius: 8px;
  background: #fff;
}
.form-row {
  display: grid;
  gap: 6px;
}
.label {
  font-size: 12px;
  color: #444;
}
.input {
  width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
}
.input:focus {
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.15);
}
.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
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
.error {
  color: #b00020;
  font-size: 13px;
  margin: 0;
}
</style>
