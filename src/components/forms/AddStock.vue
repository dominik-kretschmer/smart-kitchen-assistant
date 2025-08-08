<script setup lang="ts">
const dialogVisible = defineModel<boolean>({ default: false });

const props = defineProps<{
  newIngredient: {
    name: string;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
  };
  isLoading: boolean;
  error: string | null;
}>();

const emit = defineEmits<{
  (e: 'update:error', value: string): void;
  (e: 'update:is-loading', value: boolean): void;
  (e: 'ingredient-created', value: { id: number; name: string; calories?: number; carbs?: number; fat?: number; protein?: number }): void;
}>();

async function submit() {
  emit('update:is-loading', true);
  emit('update:error', '');
  try {
    const payload = {
      name: props.newIngredient.name,
      calories: props.newIngredient.calories,
      carbs: props.newIngredient.carbs,
      fat: props.newIngredient.fat,
      protein: props.newIngredient.protein,
    };
    const created = await ingredientService.createIngredient(payload);
    emit('ingredient-created', created);
    dialogVisible.value = false;
  } catch (err) {
    const message =
      'Failed to create ingredient. Please try again later.' +
      (err instanceof Error ? ` ${err.message}` : '');
    emit('update:error', message);
  } finally {
    emit('update:is-loading', false);
  }
}
</script>
<template>
  <v-dialog v-model="dialogVisible" max-width="600">
    <template #actions>
      <v-btn variant="text" @click=" dialogVisible= false">{{ t('common.cancel') }}</v-btn>
      <v-btn color="primary" :loading="isLoading" :disabled="isLoading" @click="submit">
        {{ t('common.save') }}
      </v-btn>
    </template>
  </v-dialog>
</template>
