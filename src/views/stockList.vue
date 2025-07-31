<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddStock from '../components/addStock.vue';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

const stockItems = ref<StockItem[]>([]);
const loading = ref(false);
const error = ref('');

async function fetchStockItems() {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('/api/stock');
    if (!response.ok) {
      throw new Error(`Error fetching stock items: ${response.statusText}`);
    }

    stockItems.value = await response.json();
  } catch (err) {
    console.error('Failed to fetch stock items:', err);
    error.value = 'Failed to load stock items. Please try again later.';
  } finally {
    loading.value = false;
  }
}

async function addStockItem(item: Omit<StockItem, 'id'>) {
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('/api/stock', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    if (!response.ok) {
      throw new Error(`Error creating stock item: ${response.statusText}`);
    }

    const newStockItem = await response.json();
    stockItems.value.push(newStockItem);
  } catch (err) {
    console.error('Failed to create stock item:', err);
    error.value = 'Failed to add stock item. Please try again later.';
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStockItems();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Vorrat</h1>
    <p class="mb-4">Hier siehst du alle aktuell verfügbaren Zutaten in deinem Vorrat.</p>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = ''">
      {{ error }}
    </v-alert>

    <AddStock @add-item="addStockItem" :disabled="loading" />

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">Aktuelle Vorräte</h2>

      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="d-block mx-auto my-8"></v-progress-circular>

      <div v-else>
        <v-list v-if="stockItems.length > 0" class="bg-transparent">
          <v-list-item v-for="item in stockItems" :key="item.id">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.quantity }} {{ item.unit }}</v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">Keine Vorräte vorhanden</p>
      </div>
    </div>
  </div>
</template>
