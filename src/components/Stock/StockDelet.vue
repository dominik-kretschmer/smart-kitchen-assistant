<script setup lang="ts">
import { computed, ref } from 'vue';
import { stockService } from '@/services/stockService';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    itemId: number | null;
    itemName?: string | null;
  }>(),
  {
    itemName: null,
  },
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'deleted'): void;
  (e: 'cancel'): void;
}>();

const processing = ref(false);
const localError = ref<string | null>(null);
const nameLabel = computed(() => props.itemName?.toString().trim() || 'diesen Eintrag');

function onCancel() {
  emit('cancel');
  emit('update:modelValue', false);
}

async function onConfirm() {
  if (props.itemId === null || props.itemId === undefined) return;
  processing.value = true;
  localError.value = null;
  try {
    await stockService.deleteStock(props.itemId);
    emit('deleted');
    emit('update:modelValue', false);
  } catch (e: unknown) {
    localError.value = (e as Error)?.message ?? 'Fehler beim Löschen';
  } finally {
    processing.value = false;
  }
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="480"
    @update:model-value="emit('update:modelValue', $event)">
    <v-card>
      <v-card-title class="text-wrap">Vorrat löschen</v-card-title>

      <v-card-text class="text-body-2">
        <div>Möchtest du „{{ nameLabel }}“ wirklich aus deinem Vorrat löschen?</div>
        <v-alert v-if="localError" type="error" variant="tonal" class="mt-3">
          {{ localError }}
        </v-alert>
      </v-card-text>

      <v-card-actions class="justify-end">
        <v-btn variant="text" :disabled="processing" @click="onCancel" aria-label="Abbrechen">
          Abbrechen
        </v-btn>
        <v-btn
          color="error"
          variant="flat"
          :loading="processing"
          :disabled="processing"
          @click="onConfirm"
          aria-label="Löschen">
          Löschen
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
