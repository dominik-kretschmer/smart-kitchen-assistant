<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean;
  item: StockItem;
}>();
const { t } = useI18n();
const localItem = ref<StockItem>({ ...props.item });
const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [item: StockItem];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

watch(
  () => props.item,
  (newItem) => {
    localItem.value = { ...newItem };
  },
  { deep: true },
);

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
    @cancel="emit('update:modelValue', false)"
    @confirm="handleConfirm">
    <v-container>
      <v-row>
        <v-col cols="12">
          <FormTextField v-model="localItem.name" :label="t('editStockDialog.name')" required />
        </v-col>
        <v-col cols="6">
          <QuantityInput
            v-model="localItem.quantity"
            :label="t('editStockDialog.quantity')"
            required />
        </v-col>
        <v-col cols="6">
          <UnitSelect v-model="localItem.unit" :label="t('editStockDialog.unit')" />
        </v-col>
      </v-row>
    </v-container>
  </DialogBase>
</template>
