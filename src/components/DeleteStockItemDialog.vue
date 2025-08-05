<script setup lang="ts">
import { computed } from 'vue';
import { StockItem } from '../types/stockTypes';
import { useI18n } from '../i18n';

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

function closeDialog() {
  emit('update:modelValue', false);
}

function deleteItem() {
  if (props.item) {
    emit('delete', props.item.id);
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title class="text-h5">{{ t('deleteStockDialog.title') }}</v-card-title>
      <v-card-text>
        {{ t('deleteStockDialog.confirmMessage', { name: item?.name }) }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog"> {{ t('deleteStockDialog.cancel') }} </v-btn>
        <v-btn color="error" variant="text" @click="deleteItem"> {{ t('deleteStockDialog.delete') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
