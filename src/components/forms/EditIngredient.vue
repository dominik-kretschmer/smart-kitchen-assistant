<script setup lang="ts">
import { ingredientService } from '@/services/ingredientService';
import type { FullIngredient } from '@/types/ingriedientTypes';

const { t } = useI18n();
const props = defineProps<{
  modelValue: boolean;
  editedItem: FullIngredient;
  isLoading: boolean;
  error: string;
}>();
const localEditedItem = ref<FullIngredient>({ ...props.editedItem });
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'update:error': [value: string];
  'update:isLoading': [value: boolean];
  'ingredient-updated': [ingredient: FullIngredient];
}>();

watch(
  () => props.editedItem,
  (newVal:FullIngredient) => {
    localEditedItem.value = { ...newVal };
  },
  { deep: true },
);

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value : boolean) => emit('update:modelValue', value),
});

async function updateIngredient() {
  if (!localEditedItem.value.name) {
    emit('update:error', t('errors.nameRequired'));
    return;
  }

  emit('update:isLoading', true);
  try {
    const updatedItem = await ingredientService.updateIngredient(localEditedItem.value.id, {
      name: localEditedItem.value.name,
      calories: localEditedItem.value.calories,
      carbs: localEditedItem.value.carbs,
      fat: localEditedItem.value.fat,
      protein: localEditedItem.value.protein,
    });

    emit('ingredient-updated', updatedItem);
    dialogVisible.value=false
  } catch (err) {
    emit('update:error', t('errors.failedToUpdateIngredient') + err);
  }
  emit('update:isLoading', false);
}
</script>
<template>
  <v-dialog v-model="dialogVisible" max-width="500px">
    <v-card>
      <v-card-title>{{ t('ingredients.editIngredient') }}</v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="localEditedItem.name"
                :label="t('ingredients.name')"
                required></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localEditedItem.calories"
                :label="t('ingredients.caloriesLabel')"
                type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localEditedItem.carbs"
                :label="t('ingredients.carbsLabel')"
                type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localEditedItem.fat"
                :label="t('ingredients.fatLabel')"
                type="number"></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localEditedItem.protein"
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
        <v-btn color="blue-darken-1" variant="text" @click="updateIngredient">
          {{ t('ingredients.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
