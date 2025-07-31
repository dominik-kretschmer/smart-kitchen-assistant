<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps<{
  disabled?: boolean;
}>();

const newItem = ref('');
const quantity = ref(1);
const unit = ref('Stück');
const units = ['Stück', 'g', 'kg', 'ml', 'l', 'EL', 'TL', 'Packung'];

const emit = defineEmits(['add-item']);

function addItem() {
  if (newItem.value.trim() && !props.disabled) {
    emit('add-item', {
      name: newItem.value.trim(),
      quantity: quantity.value,
      unit: unit.value,
    });
    newItem.value = '';
    quantity.value = 1;
    unit.value = 'Stück';
  }
}
</script>

<template>
  <div class="add-stock-form mb-6 p-4 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-semibold mb-3">Vorrat hinzufügen</h2>
    <v-form @submit.prevent="addItem">
      <v-row>
        <v-col cols="12">
          <v-text-field
            v-model="newItem"
            label="Zutat"
            placeholder="z.B. Tomaten"
            variant="outlined"
            density="comfortable"
            required
            :disabled="disabled"></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model.number="quantity"
            label="Menge"
            type="number"
            min="0"
            variant="outlined"
            density="comfortable"
            required
            :disabled="disabled"></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-select
            v-model="unit"
            :items="units"
            label="Einheit"
            variant="outlined"
            density="comfortable"
            :disabled="disabled"></v-select>
        </v-col>
      </v-row>
      <v-btn
        color="primary"
        type="submit"
        block
        class="mt-2"
        :disabled="disabled"
        :loading="disabled">
        Hinzufügen
      </v-btn>
    </v-form>
  </div>
</template>
