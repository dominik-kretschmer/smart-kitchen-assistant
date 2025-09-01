<script setup lang="ts">
import { ref } from 'vue';
import type { Ingredient } from '@/types/types';
import { ingredientService } from '@/services/ingredientService';

const dialog = ref(false);
const formRef = ref();
const formValid = ref(false);
const model = ref<Ingredient>({
  name: '',
  calories: undefined,
  protein: undefined,
  fat: undefined,
  carbs: undefined,
});

function resetForm() {
  model.value = {
    name: '',
    calories: undefined,
    protein: undefined,
    fat: undefined,
    carbs: undefined,
  };
  formRef.value?.resetValidation?.();
}

async function onSubmit() {
  const ok = await formRef.value?.validate?.();
  if (!ok || (typeof ok === 'object' && ok.valid === false)) return;
  await ingredientService.createIngredient({
    name: model.value.name.trim(),
    calories: model.value.calories,
    protein: model.value.protein ?? undefined,
    fat: model.value.fat ?? undefined,
    carbs: model.value.carbs ?? undefined,
  });
  dialog.value = false;
  resetForm();
}
</script>

<template>
  <div>
    <v-btn @click="dialog = true">Zutat erstellen</v-btn>
    <v-dialog v-model="dialog" max-width="520">
      <v-card>
        <v-card-title>Neue Zutat</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
            <v-text-field
              v-model="model.name"
              label="Name"
              :rules="[(v: string) => v?.trim() || 'Pflichtfeld']"
              clearable
              required />
            <v-text-field
              v-model.number="model.calories"
              label="Kalorien"
              type="number"
              min="0"
              :rules="[
                (v) =>
                  v === null || v === undefined || v === '' || Number(v) >= 0 || 'Muss ≥ 0 sein',
              ]"
              step="any"
              clearable />
            <v-text-field
              v-model.number="model.protein"
              label="Protein (g)"
              type="number"
              min="0"
              step="any"
              clearable />
            <v-text-field
              v-model.number="model.fat"
              label="Fett (g)"
              type="number"
              min="0"
              step="any"
              clearable />
            <v-text-field
              v-model.number="model.carbs"
              label="Kohlenhydrate (g)"
              type="number"
              min="0"
              step="any"
              clearable />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dialog = false">Abbrechen</v-btn>
          <v-btn @click="onSubmit">Erstellen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
