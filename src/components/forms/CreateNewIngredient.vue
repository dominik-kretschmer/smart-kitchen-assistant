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
  'update:modelValue': [value: boolean];
  'update:error': [value: string];
  'update:isLoading': [value: boolean];
  'ingredient-created': [ingredient: FullIngredient];
}>();

const localNewIngredient = ref({ ...props.newIngredient });

watch(
  () => props.newIngredient,
  (newVal) => {
    localNewIngredient.value = { ...newVal };
  },
  { deep: true },
);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

async function addIngredient() {
  if (!localNewIngredient.value.name) {
    emit('update:error', t('errors.nameRequired'));
    return;
  }

  emit('update:isLoading', true);
  try {
    const createdIngredient = await ingredientService.createIngredient(localNewIngredient.value);
    emit('ingredient-created', createdIngredient);
    emit('update:modelValue', false);
    localNewIngredient.value = {
      name: '',
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    };
  } catch (err) {
    emit('update:error', t('errors.failedToCreateIngredient') + err);
  }
  emit('update:isLoading', false);
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
                required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.calories"
                :label="t('ingredients.caloriesLabel')"
                type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.carbs"
                :label="t('ingredients.carbsLabel')"
                type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.fat"
                :label="t('ingredients.fatLabel')"
                type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localNewIngredient.protein"
                :label="t('ingredients.proteinLabel')"
                type="number"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="emit('update:modelValue', false)">
          {{ t('ingredients.cancel') }}
        </v-btn>
        <v-btn color="blue-darken-1" variant="text" @click="addIngredient">
          {{ t('ingredients.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
