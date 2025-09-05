<script setup lang="ts">
import { ref, watch } from 'vue';
import UnitDropDown from '@/components/Base/UnitDropDown.vue';
import type { ShoppingListItem } from '@/types/types';

const props = defineProps<{ item: ShoppingListItem }>();
const emit = defineEmits<{
  (e: 'update', id: number, payload: Partial<ShoppingListItem>): void;
  (e: 'delete', id: number): void;
}>();

const amount = ref<number>(props.item.amount);
const unit = ref<string>(props.item.unit);

watch(
  () => props.item,
  (val) => {
    amount.value = val.amount;
    unit.value = val.unit;
  },
  { deep: true },
);

function onSave() {
  emit('update', props.item.id, { amount: Number(amount.value), unit: unit.value });
}
</script>

<template>
  <v-list-item>
    <template #prepend>
      <v-avatar color="primary" size="28">{{ props.item.ingredient?.name?.[0] ?? '?' }}</v-avatar>
    </template>
    <v-list-item-title>{{ props.item.ingredient?.name || 'Unbekannte Zutat' }}</v-list-item-title>
    <v-list-item-subtitle>
      <div class="d-flex align-center" style="gap: 8px">
        <v-text-field v-model.number="amount" type="number" min="0" step="1" density="compact" hide-details style="max-width: 90px" />
        <UnitDropDown v-model="unit" />
        <v-btn size="small" variant="text" color="primary" @click="onSave">Speichern</v-btn>
      </div>
    </v-list-item-subtitle>
    <template #append>
      <v-btn icon="mdi-delete" variant="text" color="error" @click="emit('delete', props.item.id)" />
    </template>
  </v-list-item>
</template>
