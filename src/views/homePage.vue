<script setup lang="ts">
import { useI18n } from '../i18n';

const { t } = useI18n();
</script>
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('home.title') }}</h1>
    <p>{{ t('home.welcome') }}</p>
  </div>
</template>
