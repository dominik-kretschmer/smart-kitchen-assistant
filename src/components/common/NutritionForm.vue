<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from '@/i18n';
import QuantityInput from './QuantityInput.vue';

interface NutritionData {
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

const props = defineProps<{
  modelValue: NutritionData;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: NutritionData];
}>();

const { t } = useI18n();

// Computed properties for v-model binding
const calories = computed({
  get: () => props.modelValue.calories,
  set: (value) => {
    emit('update:modelValue', { ...props.modelValue, calories: value });
  },
});

const carbs = computed({
  get: () => props.modelValue.carbs,
  set: (value) => {
    emit('update:modelValue', { ...props.modelValue, carbs: value });
  },
});

const fat = computed({
  get: () => props.modelValue.fat,
  set: (value) => {
    emit('update:modelValue', { ...props.modelValue, fat: value });
  },
});

const protein = computed({
  get: () => props.modelValue.protein,
  set: (value) => {
    emit('update:modelValue', { ...props.modelValue, protein: value });
  },
});
</script>

<template>
  <v-row>
    <v-col cols="6">
      <QuantityInput
        v-model="calories"
        :label="t('ingredients.caloriesLabel')"
        :disabled="disabled" />
    </v-col>
    <v-col cols="6">
      <QuantityInput v-model="carbs" :label="t('ingredients.carbsLabel')" :disabled="disabled" />
    </v-col>
    <v-col cols="6">
      <QuantityInput v-model="fat" :label="t('ingredients.fatLabel')" :disabled="disabled" />
    </v-col>
    <v-col cols="6">
      <QuantityInput
        v-model="protein"
        :label="t('ingredients.proteinLabel')"
        :disabled="disabled" />
    </v-col>
  </v-row>
</template>
