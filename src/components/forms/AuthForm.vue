<script setup lang="ts">
const emit = defineEmits(['submit']);
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const { t } = useI18n();

defineProps({
  formType: {
    type: String,
    required: true,
    validator: (value) => ['login', 'register'].includes(value),
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
});

const handleSubmit = () => {
  emit('submit', {
    username: username.value,
    password: password.value,
    confirmPassword: confirmPassword.value,
  });
};
</script>
<template>
  <div class="auth-container" v-if="!isLoading">
    <div v-if="isLoggedIn" class="already-logged-in">
      <h1>{{ t('auth.alreadyLoggedIn') }}</h1>
      <router-link to="/" class="home-link">{{ t('auth.goToHome') }}</router-link>
    </div>
    <div v-else>
      <h1>{{ formType === 'login' ? t('auth.login') : t('auth.register') }}</h1>
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">{{ t('auth.username') }}</label>
          <input
            id="username"
            v-model="username"
            type="text"
            :placeholder="formType === 'login' ? t('auth.enterUsername') : t('auth.chooseUsername')"
            required />
        </div>
        <div class="form-group">
          <label for="password">{{ t('auth.password') }}</label>
          <input
            id="password"
            v-model="password"
            type="password"
            :placeholder="formType === 'login' ? t('auth.enterPassword') : t('auth.choosePassword')"
            required />
        </div>
        <div v-if="formType === 'register'" class="form-group">
          <label for="confirm-password">{{ t('auth.confirmPassword') }}</label>
          <input
            id="confirm-password"
            v-model="confirmPassword"
            type="password"
            :placeholder="t('auth.confirmYourPassword')"
            required />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="auth-button">
          {{ formType === 'login' ? t('auth.login') : t('auth.register') }}
        </button>
        <div class="auth-link">
          <template v-if="formType === 'login'">
            {{ t('auth.noAccount') }}
            <router-link to="/register">{{ t('auth.register') }}</router-link>
          </template>
          <template v-else>
            {{ t('auth.haveAccount') }}
            <router-link to="/login">{{ t('auth.login') }}</router-link>
          </template>
        </div>
      </form>
    </div>
  </div>
</template>
