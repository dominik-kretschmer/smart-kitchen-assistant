<script setup lang="ts">
import { ref } from 'vue';
import IngredientDropDown from '@/components/Ingredient/IngredientDropDown.vue';
import UnitDropDown from '@/components/Base/UnitDropDown.vue';
import type { SelectedIngredient } from '@/types/types';
import { stockService } from '@/services/stockService';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const dialog = ref(false);
const formRef = ref();
const formValid = ref(false);
const selectedIngredient = ref<SelectedIngredient | null>(null);
const quantity = ref<number>(0);
const unit = ref<string>('');

const reqObj = (v: unknown) => !!v || 'Pflichtfeld';
const reqNum = (v: unknown) => (v !== '' && v !== null && v !== undefined) || 'Pflichtfeld';
const gtZero = (v: unknown) => Number(v) > 0 || 'Muss > 0 sein';
const reqText = (v: unknown) => !!String(v ?? '').trim() || 'Pflichtfeld';

async function onSubmit() {
  const ok = await formRef.value?.validate?.();
  const valid = typeof ok === 'object' ? ok?.valid : ok;
  const userId = userStore.getUserId;

  if (!valid || !selectedIngredient.value || !userId) return;
  try {
    await stockService.createStock({
      userId,
      ingredientId: selectedIngredient.value.id,
      quantity: `${quantity.value}${unit.value}`,
    });
  } catch (e) {
    console.log(e);
  } finally {
    dialog.value = false;
    reset();
  }
}

function reset() {
  selectedIngredient.value = null;
  quantity.value = 0;
  unit.value = '';
  formRef.value?.resetValidation?.();
}
</script>

<template>
  <div>
    <v-btn color="primary" @click="dialog = true">Zum Bestand hinzufügen</v-btn>
    <v-dialog v-model="dialog" max-width="520">
      <v-card>
        <v-card-title>Bestand hinzufügen</v-card-title>
        <v-card-text>
          <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
            <ingredient-drop-down v-model="selectedIngredient" :rules="[reqObj]" />
            <v-text-field
              v-model.number="quantity"
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
