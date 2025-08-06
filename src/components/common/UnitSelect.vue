<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@/i18n';

const props = defineProps<{
  modelValue: string;
  label?: string;
  disabled?: boolean;
  density?: 'default' | 'comfortable' | 'compact';
  variant?: 'plain' | 'filled' | 'outlined' | 'solo' | 'underlined';
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const { t } = useI18n();

const units = [
  t('units.piece'),
  t('units.g'),
  t('units.kg'),
  t('units.ml'),
  t('units.l'),
  t('units.tbsp'),
  t('units.tsp'),
  t('units.package'),
];

const selectedUnit = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>

<template>
  <v-select
    v-model="selectedUnit"
    :items="units"
    :label="label || t('recipe.unit')"
    :variant="variant || 'outlined'"
    :density="density || 'comfortable'"
    :disabled="disabled">
  </v-select>
</template>
