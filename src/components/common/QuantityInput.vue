<script setup lang="ts">
const { t } = useI18n();
const props = defineProps<{
  modelValue: number;
  label?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'plain' | 'filled' | 'outlined' | 'solo' | 'underlined';
  required?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: number];
}>();



const quantity = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', Number(value)),
});
</script>

<template>
  <v-text-field
    v-model.number="quantity"
    :label="label || t('recipe.quantity')"
    type="number"
    :min="min !== undefined ? min : 0"
    :max="max"
    :variant="variant || 'outlined'"
    :density="density || 'comfortable'"
    :disabled="disabled"
    :required="required">
  </v-text-field>
</template>
