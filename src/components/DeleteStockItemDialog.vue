<script setup lang="ts">
import { computed } from 'vue';
import { StockItem } from '../types/stockTypes';
import { useI18n } from '../i18n';
import DialogBase from './common/DialogBase.vue';

const props = defineProps<{
  modelValue: boolean;
  item: StockItem | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  delete: [id: number];
}>();

const { t } = useI18n();

// Computed property for v-model binding
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function handleCancel() {
  emit('update:modelValue', false);
}

function handleConfirm() {
  if (props.item) {
    emit('delete', props.item.id);
  }
}
</script>

<template>
  <DialogBase
    v-model="dialog"
    :title="t('deleteStockDialog.title')"
    :cancelText="t('deleteStockDialog.cancel')"
    :confirmText="t('deleteStockDialog.delete')"
    confirmColor="error"
    @cancel="handleCancel"
    @confirm="handleConfirm">
    {{ t('deleteStockDialog.confirmMessage', { name: item?.name }) }}
  </DialogBase>
</template>
