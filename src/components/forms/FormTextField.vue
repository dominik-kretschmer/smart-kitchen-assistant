<script setup lang="ts">
const props = defineProps<{
  modelValue: string;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'plain' | 'filled' | 'outlined' | 'solo' | 'underlined';
  required?: boolean;
  rows?: number;
  multiLine?: boolean;
  customClass?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value),
});
</script>

<template>
  <component
    :is="multiLine ? 'v-textarea' : 'v-text-field'"
    v-model="inputValue"
    :label="label"
    :placeholder="placeholder"
    :variant="variant || 'outlined'"
    :density="density || 'comfortable'"
    :disabled="disabled"
    :required="required"
    :rows="rows"
    :class="customClass">
  </component>
</template>
