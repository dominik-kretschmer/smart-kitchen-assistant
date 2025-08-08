<script setup lang="ts">
const props = defineProps<{
  title?: string;
  submitText?: string;
  loading?: boolean;
  disabled?: boolean;
  customClass?: string;
}>();

const emit = defineEmits<{
  submit: [];
}>();
</script>
<template>
  <div :class="['form-container p-4 bg-gray-100 rounded-lg', customClass]">
    <h2 v-if="title" class="text-xl font-semibold mb-3">{{ title }}</h2>
    <v-form @submit.prevent="emit('submit')">
      <slot></slot>
      <v-btn
        color="primary"
        type="submit"
        block
        class="mt-4"
        :disabled="disabled || loading"
        :loading="loading">
        {{ submitText || 'Submit' }}
      </v-btn>
    </v-form>
  </div>
</template>
