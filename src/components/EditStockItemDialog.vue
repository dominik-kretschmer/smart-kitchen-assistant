<script setup lang="ts">
import { ref, watch, computed } from 'vue';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

const props = defineProps<{
  modelValue: boolean;
  item: StockItem;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  'save': [item: StockItem];
}>();

const localItem = ref<StockItem>({ ...props.item });

// Computed property for v-model binding
const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
});

// Update local item when prop changes
watch(() => props.item, (newItem) => {
  localItem.value = { ...newItem };
}, { deep: true });

function closeDialog() {
  emit('update:modelValue', false);
}

function saveItem() {
  emit('save', localItem.value);
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">Vorrat bearbeiten</span>
      </v-card-title>

      <v-card-text>
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="localItem.name"
                label="Name"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model.number="localItem.quantity"
                label="Menge"
                type="number"
                required
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="localItem.unit"
                label="Einheit"
                required
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="closeDialog"
        >
          Abbrechen
        </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          @click="saveItem"
        >
          Speichern
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
