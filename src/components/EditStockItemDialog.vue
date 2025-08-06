<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { StockItem } from '../types/stockTypes';
import { useI18n } from '../i18n';
import DialogBase from './common/DialogBase.vue';
import FormTextField from './common/FormTextField.vue';
import QuantityInput from './common/QuantityInput.vue';
import UnitSelect from './common/UnitSelect.vue';

const props = defineProps<{
  modelValue: boolean;
  item: StockItem;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [item: StockItem];
}>();

const { t } = useI18n();
const localItem = ref<StockItem>({ ...props.item });

// Computed property for v-model binding
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

// Update local item when prop changes
watch(
  () => props.item,
  (newItem) => {
    localItem.value = { ...newItem };
  },
  { deep: true },
);

function handleCancel() {
  emit('update:modelValue', false);
}

function handleConfirm() {
  emit('save', localItem.value);
  emit('update:modelValue', false);
}
</script>

<template>
  <DialogBase
    v-model="dialog"
    :title="t('editStockDialog.title')"
    :cancelText="t('editStockDialog.cancel')"
    :confirmText="t('editStockDialog.save')"
    @cancel="handleCancel"
    @confirm="handleConfirm">

    <v-container>
      <v-row>
        <v-col cols="12">
          <FormTextField
            v-model="localItem.name"
            :label="t('editStockDialog.name')"
            required />
        </v-col>
        <v-col cols="6">
          <QuantityInput
            v-model="localItem.quantity"
            :label="t('editStockDialog.quantity')"
            required />
        </v-col>
        <v-col cols="6">
          <UnitSelect
            v-model="localItem.unit"
            :label="t('editStockDialog.unit')" />
        </v-col>
      </v-row>
    </v-container>
  </DialogBase>
</template>
