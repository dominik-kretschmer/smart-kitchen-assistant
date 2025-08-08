<script setup lang="ts">
const { t } = useI18n();
const props = defineProps<{
  modelValue: boolean;
  item: StockItem | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  delete: [id: number];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

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
    @cancel="dialog.set(false)"
    @confirm="handleConfirm">
    {{ t('deleteStockDialog.confirmMessage', { name: item?.name }) }}
  </DialogBase>
</template>
