<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  modelValue: boolean;
  title: string;
  maxWidth?: string;
  persistent?: boolean;
  hideActions?: boolean;
  cancelText?: string;
  confirmText?: string;
  confirmColor?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

// Computed property for v-model binding
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function closeDialog() {
  emit('cancel');
  emit('update:modelValue', false);
}

function confirmDialog() {
  emit('confirm');
}
</script>

<template>
  <v-dialog
    v-model="dialog"
    :max-width="maxWidth || '500px'"
    :persistent="persistent">
    <v-card>
      <v-card-title class="text-h5">{{ title }}</v-card-title>
      <v-card-text>
        <slot></slot>
      </v-card-text>
      <v-card-actions v-if="!hideActions">
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
          {{ cancelText || 'Cancel' }}
        </v-btn>
        <v-btn :color="confirmColor || 'blue-darken-1'" variant="text" @click="confirmDialog">
          {{ confirmText || 'Confirm' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
