<script setup lang="ts">
import type { FullIngredient } from '@/types/ingriedientTypes';
import type { StockItem } from '@/types/stockTypes';
import { ingredientService } from '@/services/ingredientService';

const { t } = useI18n();

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [item: Omit<StockItem, 'id'>];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

const ingredients = ref<FullIngredient[]>([]);
const selectedIngredient = ref<FullIngredient | null>(null);
const quantity = ref<number>(1);
const unit = ref<string>(t('units.piece'));
const localError = ref<string>('');

async function loadIngredients() {
  try {
    ingredients.value = await ingredientService.getAllIngredients();
  } catch (err) {
    console.error(err);
    // Reuse existing error key from ShoppinglistPage for ingredient load errors
    localError.value = t('shoppingList.ingredientsLoadError');
  }
}

watch(
  () => dialog.value,
  (open: boolean) => {
    if (open) {
      // Reset form each time the dialog opens and lazy-load ingredients
      selectedIngredient.value = null;
      quantity.value = 1;
      unit.value = t('units.piece');
      localError.value = '';
      if (!ingredients.value.length) {
        loadIngredients();
      }
    }
  },
);

function handleConfirm() {
  localError.value = '';
  if (!selectedIngredient.value) {
    localError.value = t('shoppingList.ingredientRequired');
    return;
  }
  if (!quantity.value || quantity.value <= 0) {
    localError.value = t('errors.mustBePositive') || 'must be > 0';
    return;
  }
  const payload: Omit<StockItem, 'id'> = {
    name: selectedIngredient.value.name,
    quantity: Number(quantity.value),
    unit: unit.value || t('units.piece'),
  };
  emit('save', payload);
  dialog.value = false;
}
</script>

<template>
  <DialogBase v-model="dialog" :max-width="'600px'" @confirm="handleConfirm">
    <template #title>
      {{ t('common.create') }}
    </template>
    <v-container>
      <v-alert
        v-if="localError"
        type="error"
        variant="tonal"
        class="mb-2"
        closable
        @click:close="localError = ''">
        {{ localError }}
      </v-alert>
      <v-row>
        <v-col cols="12" md="6">
          <v-select
            v-model="selectedIngredient"
            :items="ingredients"
            item-title="name"
            item-value="id"
            return-object
            :label="t('shoppingList.ingredient')"
            required />
        </v-col>
        <v-col cols="6" md="3">
          <QuantityInput v-model="quantity" :label="t('editStockDialog.quantity')" required />
        </v-col>
        <v-col cols="6" md="3">
          <UnitSelect v-model="unit" :label="t('editStockDialog.unit')" />
        </v-col>
      </v-row>
    </v-container>
  </DialogBase>
</template>
