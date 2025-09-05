<script setup lang="ts">
import { ref } from 'vue';
import IngredientDropDown from '@/components/Ingredient/IngredientDropDown.vue';
import UnitDropDown from '@/components/Base/UnitDropDown.vue';
import type { Ingredient } from '@/types/types';

const emit = defineEmits<{
  (e: 'submit', payload: { ingredientId: number; ingredient: Pick<Ingredient, 'id' | 'name'>; amount: number; unit: string }): void;
}>();

const dialog = ref(false);
const formRef = ref();
const formValid = ref(false);

const selectedIngredient = ref<Ingredient | null>(null);
const amount = ref<number | null>(null);
const unit = ref<string | null>(null);

const reqObj = (v: unknown) => !!v || 'Pflichtfeld';
const reqNum = (v: unknown) => (v !== '' && v !== null && v !== undefined) || 'Pflichtfeld';
const gtZero = (v: unknown) => Number(v) > 0 || 'Muss > 0 sein';
const reqText = (v: unknown) => !!String(v ?? '').trim() || 'Pflichtfeld';

async function onSubmit() {
  const ok = await formRef.value?.validate?.();
  const valid = typeof ok === 'object' ? ok?.valid : ok;
  if (!valid || !selectedIngredient.value || amount.value == null || !unit.value) return;

  emit('submit', {
    ingredientId: selectedIngredient.value.id,
    ingredient: { id: selectedIngredient.value.id, name: selectedIngredient.value.name },
    amount: Number(amount.value),
    unit: unit.value,
  });
  dialog.value = false;
  reset();
}

function reset() {
  selectedIngredient.value = null;
  amount.value = null;
  unit.value = null;
  formRef.value?.resetValidation?.();
}
</script>

<template>
  <div>
    <v-btn color="primary" @click="dialog = true">Zur Einkaufsliste hinzufügen</v-btn>
    <v-dialog v-model="dialog" max-width="520">
      <v-card>
        <v-card-title>Zur Einkaufsliste hinzufügen</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
            <IngredientDropDown v-model="selectedIngredient" :rules="[reqObj]" />
            <v-text-field
              v-model.number="amount"
              label="Menge"
              type="number"
              min="0"
              step="any"
              :rules="[reqNum, gtZero]"
              required
              clearable />
            <UnitDropDown v-model="unit" :rules="[reqText]" />
          </v-form>
        </v-card-text>
        <v-card-actions class="justify-end">
          <v-btn variant="text" @click="dialog = false">Abbrechen</v-btn>
          <v-btn color="primary" @click="onSubmit">Hinzufügen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
