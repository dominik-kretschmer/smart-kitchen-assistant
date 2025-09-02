<script setup lang="ts">
import { ref, computed } from 'vue';
import IngredientDropDown from '@/components/Ingredient/IngredientDropDown.vue';
import UnitDropDown from '@/components/Base/UnitDropDown.vue';
import type { Ingredient, IngredientRow } from '@/types/types';

const MIN_ING = 1;
const MAX_ING = 15;
const MIN_STEPS = 1;
const MAX_STEPS = 20;
const recipeName = ref<string>('');
const ingredientRows = ref<IngredientRow[]>([{ ingredient: null, amount: null, unit: null }]);
const stepsText = ref<string>('');

const stepsList = computed<string[]>(() =>
  stepsText.value
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0),
);

const ingredientCount = computed(() => ingredientRows.value.length);
const stepsCount = computed(() => stepsList.value.length);
const canAddIngredient = computed(() => ingredientCount.value < MAX_ING);
const canRemoveIngredient = computed(() => ingredientCount.value > MIN_ING);

function addIngredientRow() {
  if (!canAddIngredient.value) return;
  ingredientRows.value.push({ ingredient: null, amount: null, unit: null });
}

function removeIngredientRow(index: number) {
  if (!canRemoveIngredient.value) return;
  ingredientRows.value.splice(index, 1);
}

function validateName(): string | true {
  if (!recipeName.value.trim()) return 'Name ist erforderlich';
  if (recipeName.value.trim().length < 3) return 'Name ist zu kurz (min. 3 Zeichen)';
  return true;
}

function validateIngredientRow(row: IngredientRow, idx: number): string[] {
  const errors: string[] = [];
  if (!row.ingredient) errors.push(`Zutat #${idx + 1}: Zutat fehlt`);
  if (row.amount == null || isNaN(row.amount) || row.amount <= 0)
    errors.push(`Zutat #${idx + 1}: Menge muss > 0 sein`);
  if (!row.unit) errors.push(`Zutat #${idx + 1}: Einheit fehlt`);
  return errors;
}

function validateIngredients(): string[] {
  const errs: string[] = [];
  if (ingredientCount.value < MIN_ING || ingredientCount.value > MAX_ING) {
    errs.push(`Anzahl Zutaten muss zwischen ${MIN_ING} und ${MAX_ING} liegen`);
  }
  ingredientRows.value.forEach((row, idx) => {
    errs.push(...validateIngredientRow(row, idx));
  });
  return errs;
}

function validateSteps(): string | true {
  if (stepsCount.value < MIN_STEPS) return `Mindestens ${MIN_STEPS} Schritt erforderlich`;
  if (stepsCount.value > MAX_STEPS) return `Maximal ${MAX_STEPS} Schritte erlaubt`;
  return true;
}

const formErrors = ref<string[]>([]);
const isSubmitting = ref(false);
const emit = defineEmits<{
  (
    e: 'submit',
    payload: {
      name: string;
      ingredients: { ingredientId: number; amount: number; unit: string }[];
      steps: string[];
    },
  ): void;
}>();

async function onSubmit() {
  formErrors.value = [];

  const nameOk = validateName();
  if (nameOk !== true) formErrors.value.push(nameOk);
  formErrors.value.push(...validateIngredients());
  const stepsOk = validateSteps();
  if (stepsOk !== true) formErrors.value.push(stepsOk);
  if (formErrors.value.length > 0) return;

  const payload = {
    name: recipeName.value.trim(),
    ingredients: ingredientRows.value.map((row) => ({
      ingredientId: (row.ingredient as Ingredient).id,
      amount: Number(row.amount),
      unit: row.unit as string,
    })),
    steps: stepsList.value,
  };

  try {
    isSubmitting.value = true;
    emit('submit', payload);
  } finally {
    isSubmitting.value = false;
  }
}
</script>
<template>
  <v-form @submit.prevent="onSubmit">
    <v-card variant="flat">
      <v-card-title>Rezept erstellen</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="8">
            <v-text-field
              v-model="recipeName"
              label="Rezeptname"
              :counter="100"
              :rules="[() => validateName() === true || (validateName() as string)]"
              required />
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <div class="d-flex align-center justify-space-between">
          <h3 class="text-h6">Zutaten ({{ ingredientCount }}/{{ MAX_ING }})</h3>
          <div>
            <v-btn
              class="mr-2"
              color="primary"
              variant="outlined"
              :disabled="!canAddIngredient"
              @click="addIngredientRow">
              Zutat hinzufügen
            </v-btn>
          </div>
        </div>
        <v-row v-for="(row, idx) in ingredientRows" :key="idx" class="align-end">
          <v-col cols="12" md="5">
            <IngredientDropDown v-model="row.ingredient" />
          </v-col>
          <v-col cols="6" md="3">
            <v-text-field
              v-model.number="row.amount"
              type="number"
              min="0"
              step="any"
              label="Menge" />
          </v-col>
          <v-col cols="6" md="3">
            <UnitDropDown v-model="row.unit" />
          </v-col>
          <v-col cols="12" md="1" class="d-flex justify-end">
            <v-btn
              color="error"
              variant="text"
              icon="mdi-delete"
              :disabled="!canRemoveIngredient"
              @click="removeIngredientRow(idx)"
              :aria-label="`Zutat #${idx + 1} entfernen`" />
          </v-col>
        </v-row>
        <v-divider class="my-4" />
        <h3 class="text-h6 mb-2">Schritte ({{ stepsCount }}/{{ MAX_STEPS }})</h3>
        <v-textarea
          v-model="stepsText"
          label="Schritte (eine Zeile pro Schritt)"
          rows="8"
          auto-grow
          :hint="`Gib zwischen ${MIN_STEPS} und ${MAX_STEPS} Schritten ein. Jede Zeile = ein Schritt.`"
          persistent-hint />
        <v-alert v-if="formErrors.length" type="error" variant="tonal" class="mt-4">
          <ul class="ma-0 pl-4">
            <li v-for="(err, i) in formErrors" :key="i">{{ err }}</li>
          </ul>
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" :loading="isSubmitting" @click="onSubmit"> Rezept erstellen </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
