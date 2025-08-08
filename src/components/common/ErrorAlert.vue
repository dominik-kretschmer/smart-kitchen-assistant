<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: string;
  type?: 'error' | 'warning' | 'info' | 'success';
  variant?: 'tonal' | 'flat' | 'outlined' | 'text' | 'plain' | 'elevated';
  customClass?: string;
  closable?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const errorMessage = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

</script>
<template>
  <v-alert
    v-if="errorMessage"
    :type="type || 'error'"
    :variant="variant || 'tonal'"
    :class="['mb-4', customClass]"
    :closable="closable"
    @click:close="emit('update:modelValue', '')">
    {{ errorMessage }}
  </v-alert>
</template>
