<script setup lang="ts">
import type { StockItem } from '@/types/stockTypes';

const { t } = useI18n();

const props = defineProps<{
  disabled?: boolean;
}>();

const emit = defineEmits<{
  'add-item': [item: Omit<StockItem, 'id'>];
}>();

const name = ref<string>('');
const quantity = ref<number>(1);
const unit = ref<string>(t('units.piece'));
const localError = ref<string>('');

function resetForm() {
  name.value = '';
  quantity.value = 1;
  unit.value = t('units.piece');
  localError.value = '';
}

function submit() {
  localError.value = '';
  if (!name.value.trim()) {
    localError.value = t('editStockDialog.name') + ' ' + t('errors.required');
    return;
  }
  if (!quantity.value || quantity.value <= 0) {
    localError.value =
      t('editStockDialog.quantity') + ' ' + (t('errors.mustBePositive') || 'must be > 0');
    return;
  }
  const payload = {
    name: name.value.trim(),
    quantity: Number(quantity.value),
    unit: unit.value || t('units.piece'),
  };
  emit('add-item', payload);
  resetForm();
}
</script>
<template>
  <v-card class="mb-4">
    <v-card-text>
      <v-alert
        v-if="localError"
        type="error"
        variant="tonal"
        class="mb-2"
        closable
        @click:close="localError = ''">
        {{ localError }}
      </v-alert>
      <v-container class="pa-0">
        <v-row>
          <v-col cols="12" md="6">
            <FormTextField v-model="name" :label="t('editStockDialog.name')" required />
          </v-col>
          <v-col cols="6" md="3">
            <QuantityInput v-model="quantity" :label="t('editStockDialog.quantity')" required />
          </v-col>
          <v-col cols="6" md="3">
            <UnitSelect v-model="unit" :label="t('editStockDialog.unit')" />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-card-actions>
      <v-spacer />
      <v-btn color="primary" :disabled="props.disabled" @click="submit">
        {{ t('common.add') }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
