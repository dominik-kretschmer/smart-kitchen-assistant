<script setup lang="ts">
import { ingredientService } from '@/services/ingredientService';
import type { FullIngredient } from '@/types/ingriedientTypes';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
  newIngredient: {
    name: string;
    calories: number;
    carbs: number;
    fat: number;
    protein: number;
  };
  isLoading: boolean;
  error: string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'update:error', value: string): void;
  (e: 'update:is-loading', value: boolean): void; // an Parent angepasst
  (e: 'ingredient-created', ingredient: FullIngredient): void;
}>();

const localNewIngredient = ref({ ...props.newIngredient });

watch(
  () => props.newIngredient,
  (newVal: FullIngredient) => {
    localNewIngredient.value = { ...newVal };
  },
  { deep: true },
);

const dialogVisible = computed<boolean>({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

async function addIngredient() {
  if (!localNewIngredient.value.name) {
    emit('update:error', t('errors.nameRequired'));
    return;
  }

  emit('update:is-loading', true);
  emit('update:error', '');

  try {
    const createdIngredient = await ingredientService.createIngredient({
      name: localNewIngredient.value.name,
      calories: localNewIngredient.value.calories,
      carbs: localNewIngredient.value.carbs,
      fat: localNewIngredient.value.fat,
      protein: localNewIngredient.value.protein,
    });
    emit('ingredient-created', createdIngredient);

    dialogVisible.value = false;

    localNewIngredient.value = {
      name: '',
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    };
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
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title>{{ t('ingredients.addIngredient') }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="localNewIngredient.name"
                :label="t('ingredients.name')"
                required />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.calories"
                :label="t('ingredients.caloriesLabel')"
                type="number" />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.carbs"
                :label="t('ingredients.carbsLabel')"
                type="number" />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.fat"
                :label="t('ingredients.fatLabel')"
                type="number" />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.protein"
                :label="t('ingredients.proteinLabel')"
                type="number" />
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="emit('update:modelValue', false)">
          {{ t('ingredients.cancel') }}
        </v-btn>
        <v-btn color="primary" variant="text" @click="addIngredient">
          {{ t('ingredients.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
