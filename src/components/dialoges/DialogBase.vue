<script setup lang="ts">
const { t } = useI18n();
const props = defineProps<{
  modelValue: boolean;
  maxWidth?: string;
  persistent?: boolean;
  hideActions?: boolean;
  confirmColor?: string;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const dialog = computed({
  get: () => props.modelValue,
  set: (value: boolean) => emit('update:modelValue', value),
});

function closeDialog() {
  emit('cancel');
  dialog.value = false;
}
</script>
<template>
  <v-dialog v-model="dialog" :max-width="maxWidth || '500px'" :persistent="persistent">
    <v-card>
      <v-card-title class="text-h5">
        <slot name="title">
        </slot>
      </v-card-title>
      <slot />
      <v-card-actions v-if="!hideActions">
        <v-spacer></v-spacer>
        <slot name="cancel">
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">
            {{ t('common.cancel') }}
          </v-btn>
        </slot>
        <slot name="confirm">
          <v-btn :color="confirmColor || 'blue-darken-1'" variant="text" @click="emit('confirm')">
            {{ t('ingredients.save') }}
          </v-btn>
        </slot>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
