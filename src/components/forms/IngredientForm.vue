<script setup lang="ts">
import type { Ingredient } from '@/types/ingriedientTypes';
const { t } = useI18n();
const props = defineProps<{
  modelValue: Ingredient;
  showRemoveButton?: boolean;
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: Ingredient];
  remove: [];
}>();

const name = computed({
  get: () => props.modelValue.name,
  set: (value:string) => {
    emit('update:modelValue', { ...props.modelValue, name: value });
  },
});

const quantity = computed({
  get: () => props.modelValue.quantity,
  set: (value :number) => {
    emit('update:modelValue', { ...props.modelValue, quantity: value });
  },
});

const unit = computed({
  get: () => props.modelValue.unit,
  set: (value:string) => {
    emit('update:modelValue', { ...props.modelValue, unit: value });
  },
});
</script>
<template>
  <v-row>
    <v-col cols="5">
      <FormTextField
        v-model="name"
        :label="t('recipe.ingredient')"
        :placeholder="t('recipe.ingredientPlaceholder')"
        :disabled="disabled"
        required />
    </v-col>
    <v-col cols="3">
      <QuantityInput
        v-model="quantity"
        :label="t('recipe.quantity')"
        :disabled="disabled"
        required />
    </v-col>
    <v-col cols="3">
      <UnitSelect v-model="unit" :label="t('recipe.unit')" :disabled="disabled" />
    </v-col>
    <v-col cols="1" class="d-flex align-center" v-if="showRemoveButton">
      <v-btn
        icon
        variant="text"
        density="comfortable"
        color="error"
        @click="emit('remove')"
        :disabled="disabled">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>
