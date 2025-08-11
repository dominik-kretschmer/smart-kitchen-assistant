<script setup lang="ts">
import { useValidation } from '@/composables/useValidation.ts';
import { useAuth } from '@/composables/useAuth.ts';
import { stockService } from '@/services/stockService.ts';
import { useStatus } from '@/composables/useStatus.ts';
import AddStockItemDialog from '@/components/dialoges/AddStockItemDialog.vue';

const stockItems = ref<StockItem[]>([]);
const { isLoading, error } = useStatus();
const userId = ref<number | null>(null);
const { validateStockItem } = useValidation();
const { checkLoginStatus } = useAuth();
const { t } = useI18n();
const deleteDialog = ref(false);
const itemToDelete = ref<StockItem | null>(null);
const editDialog = ref(false);
const createDialog = ref(false);
const editedItem = ref<StockItem>({
  id: 0,
  name: '',
  quantity: 0,
  unit: '',
});

onMounted(async () => {
  try {
    const userData = await checkLoginStatus();
    if (userData) {
      userId.value = userData.id;
      await handleStockItems();
    }
  } catch (err) {
    error.value = 'failed' + err;
  }
});

function validateUserInput(item: StockItem | undefined = undefined) {
  if (!userId.value) {
    error.value = t('errors.userNotLoggedIn');
    throw error;
  }
  if (item !== undefined) {
    const validationResult = validateStockItem(item);
    if (!validationResult.isValid) {
      error.value = validationResult.errorMessage;
      throw error;
    }
  }
  isLoading.value = true;
  error.value = '';
}

async function useCreateStock(item: Omit<StockItem, 'id'>) {
  validateUserInput();
  const stockData = {
    userId: userId.value,
    ...item,
  };

  const newStockItem = await stockService.createStock(stockData);
  stockItems.value.push(newStockItem);
}

async function handleStockItems(item: Omit<StockItem, 'id'> | undefined = undefined) {
  validateUserInput(item);
  try {
    if (item === undefined) {
      stockItems.value = await stockService.getStockByUser(userId.value);
      return;
    }
    await useCreateStock(item);
  } catch (err) {
    error.value = t('errors.failedToLoadStock') + err;
  } finally {
    isLoading.value = false;
  }
}

function openEditDialog(item: StockItem) {
  editedItem.value = { ...item };
  editDialog.value = true;
}

async function updateStockItem(item: StockItem) {
  validateUserInput(item);
  try {
    const stockData = {
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      userId: userId.value,
    };
    if (typeof item.id !== 'number') {
      return;
    }
    const updatedItem = await stockService.updateStock(item.id, stockData);
    const index = stockItems.value.findIndex((stockItem: StockItem) => stockItem.id === item.id);

    if (index !== -1) {
      stockItems.value[index] = updatedItem;
    }
    isLoading.value = false;
    editDialog.value = false;
  } catch (err) {
    error.value = t('errors.failedToUpdateStock') + err;
  }
}

function openDeleteDialog(item: StockItem) {
  itemToDelete.value = item;
  deleteDialog.value = true;
}

async function deleteStockItem(itemId: number) {
  try {
    await stockService.deleteStock(itemId);
    stockItems.value = stockItems.value.filter((item :stockItems) => item.id !== itemId);
    deleteDialog.value = false;
    itemToDelete.value = null;
  } catch (err) {
    error.value = t('errors.failedToDeleteStock') + err;
  }
}
</script>
<template>
  <div class="p-4" v-if="userId !== null">
    <h1 class="text-2xl font-bold mb-4">{{ t('stock.title') }}</h1>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = ''">
      {{ error }}
    </v-alert>
    <v-btn color="primary" class="mb-4" @click="createDialog = true">
      <v-icon start>mdi-plus</v-icon>
      {{ t('common.create') }}
    </v-btn>
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">{{ t('stock.currentStock') }}</h2>
      <div v-if="!isLoading">
        <v-list v-if="stockItems.length > 0" class="bg-transparent">
          <v-list-item v-for="item in stockItems" :key="item.id">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle> {{ item.quantity }} {{ item.unit }}</v-list-item-subtitle>
            <div class="d-flex">
              <v-btn variant="text" color="white" @click="openEditDialog(item)">
                {{ t('stock.edit') }}
              </v-btn>
              <v-btn variant="text" color="white" @click="openDeleteDialog(item)">
                {{ t('stock.delete') }}
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('stock.noItems') }}</p>
      </div>
    </div>
    <EditStockItemDialog v-model="editDialog" :item="editedItem" @save="updateStockItem" />
    <DeleteStockItemDialog v-model="deleteDialog" :item="itemToDelete" @delete="deleteStockItem" />
    <AddStockItemDialog v-model="createDialog" @save="handleStockItems" />
  </div>
  <div v-else>
    <h1>{{ t('stock.pleaseLogin') }}</h1>
  </div>
</template>
