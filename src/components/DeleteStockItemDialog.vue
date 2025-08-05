<script setup lang="ts">
import { computed } from 'vue';
import { StockItem } from '../types/stockTypes';

const props = defineProps<{
  modelValue: boolean;
  item: StockItem | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  delete: [id: number];
}>();

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
      <v-card-title class="text-h5">Vorrat löschen</v-card-title>
      <v-card-text>
        Möchtest du wirklich "{{ item?.name }}" aus deinem Vorrat löschen?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog"> Abbrechen </v-btn>
        <v-btn color="error" variant="text" @click="deleteItem"> Löschen </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
