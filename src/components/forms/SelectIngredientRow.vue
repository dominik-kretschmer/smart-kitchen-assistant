<script setup lang="ts">
import type { FullIngredient } from '@/types/ingriedientTypes.ts';
import type { AddIngredientRow } from '@/types/recipeTypes.ts';

const { t } = useI18n();

const props = defineProps<{
  modelValue: AddIngredientRow;
  availableIngredients: FullIngredient[];
  showRemoveButton?: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: AddIngredientRow];
  remove: [];
}>();

const row = computed<AddIngredientRow>({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <v-row>
    <v-col cols="12" md="6">
      <v-select
        v-model="row.ingredientId"
        :items="availableIngredients"
        item-title="name"
        item-value="id"
        :label="t('common.ingredient')"
        :return-object="false"
        variant="outlined"
        density="comfortable"
        required />
    </v-col>
    <v-col cols="6" md="3">
      <QuantityInput v-model="row.quantity" :label="t('common.quantity')" required />
    </v-col>
    <v-col cols="6" md="3" class="d-flex align-center">
      <UnitSelect v-model="row.unit" :label="t('common.unit')" />
    </v-col>
    <v-col cols="12" md="auto" class="d-flex align-center" v-if="props.showRemoveButton">
      <v-btn icon variant="text" density="comfortable" color="error" @click="emit('remove')">
        <v-icon>mdi-delete</v-icon>
      </v-btn>
    </v-col>
  </v-row>
</template>
