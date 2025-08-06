<script setup lang="ts">
const { t } = useI18n();
const newItem = ref('');
const quantity = ref(1);
const unit = ref(t('units.piece'));
const emit = defineEmits(['add-item']);
const props = defineProps<{
  disabled?: boolean;
}>();

function addItem() {
  if (newItem.value.trim() && !props.disabled) {
    emit('add-item', {
      name: newItem.value.trim(),
      quantity: quantity.value,
      unit: unit.value,
    });
    newItem.value = '';
    quantity.value = 1;
    unit.value = t('units.piece');
  }
}
</script>

<template>
  <FormLayout
    :title="t('addStock.title')"
    :submitText="t('addStock.add')"
    :disabled="disabled"
    :loading="disabled"
    customClass="mb-6"
    @submit="addItem">
    <FormTextField
      v-model="newItem"
      :label="t('addStock.ingredient')"
      :placeholder="t('addStock.ingredientPlaceholder')"
      :disabled="disabled"
      required />
    <v-row>
      <v-col cols="6">
        <QuantityInput
          v-model="quantity"
          :label="t('addStock.quantity')"
          :disabled="disabled"
          required />
      </v-col>
      <v-col cols="6">
        <UnitSelect v-model="unit" :label="t('addStock.unit')" :disabled="disabled" />
      </v-col>
    </v-row>
  </FormLayout>
</template>
