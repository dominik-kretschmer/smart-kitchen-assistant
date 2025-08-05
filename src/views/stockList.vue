<script setup lang="ts">
import { onMounted, ref } from 'vue';
import AddStock from '../components/addStock.vue';
import { stockService } from '../services/stockService';
import { useValidation } from '../composables/useValidation';

interface StockItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}

const stockItems = ref<StockItem[]>([]);
const loading = ref(false);
const error = ref('');
const userId = ref<number | null>(null);
const { validateStockItem } = useValidation();

onMounted(() => {
  const userStr = localStorage.getItem('user');
  if (userStr) {
    try {
      const user = JSON.parse(userStr);
      userId.value = user.id;
      fetchStockItems();
    } catch (err) {
      console.error('Error parsing user data:', err);
    }
  }
});

async function handleStockItems(item: Omit<StockItem, 'id'> , mode :string ) {
  if (!userId.value) {
    error.value = 'User not logged in';
    return;
  }
  if (mode === "add"){
    const validationResult = validateStockItem(item);
    if (!validationResult.isValid) {
      error.value = validationResult.errorMessage;
      return;
    }
  }

  loading.value = true;
  error.value = '';
  try {
    if (mode === "fetch"){
      stockItems.value = await stockService.getStockByUser(userId.value);
    }else{
      const stockData = {
        ...item,
        userId: userId.value,
      };

      const newStockItem = await stockService.createStock(stockData);
      stockItems.value.push(newStockItem);
    }
  } catch (err) {
    error.value = 'Failed to load stock items. Please try again later.' + err;
  }
  finally {
    loading.value = false;
  }
}

async function addStockItem() {

}
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Vorrat</h1>
    <p class="mb-4">
      Hier siehst du alle aktuell verfügbaren Zutaten in deinem Vorrat.
    </p>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = ''">
      {{ error }}
    </v-alert>
    <AddStock @add-item="handleStockItems" :disabled="loading" />
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
            <v-list-item-subtitle>
              {{ item.quantity }} {{ item.unit }}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">Keine Vorräte vorhanden</p>
      </div>
    </div>
  </div>
</template>
