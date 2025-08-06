<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import Cookies from 'universal-cookie';
import type { ShoppingListItem } from '@/types/shoppingListTypes';

const { t } = useI18n();
const cookies = new Cookies();
const COOKIE_NAME = 'shopping_list';
const COOKIE_OPTIONS = {
  path: '/',
  maxAge: 60 * 60 * 24 * 30, // 30 days
  sameSite: 'strict' as const,
};

const loading = ref(false);
const error = ref('');
const shoppingItems = ref<(ShoppingListItem & { purchased?: boolean })[]>([]);

const clearError = () => {
  error.value = '';
};

const saveToCookies = () => {
  cookies.set(COOKIE_NAME, shoppingItems.value, COOKIE_OPTIONS);
};

const loadFromCookies = () => {
  loading.value = true;
  try {
    const savedItems = cookies.get(COOKIE_NAME);
    if (savedItems) {
      shoppingItems.value = savedItems;
    }
  } catch (err) {
    console.error('Error loading from cookies:', err);
    error.value = t('shoppingList.loadError');
  } finally {
    loading.value = false;
  }
};

// These functions are defined for future use but not currently used in the UI
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const addItem = (item: Omit<ShoppingListItem, 'id'>) => {
  try {
    // Generate a unique ID
    const newItem = {
      ...item,
      id: Date.now(),
      purchased: false
    } as ShoppingListItem & { purchased: boolean };

    shoppingItems.value.push(newItem);
    saveToCookies();
  } catch (err) {
    console.error('Error adding item:', err);
    error.value = t('shoppingList.addError');
  }
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const removeItem = (id: number) => {
  try {
    shoppingItems.value = shoppingItems.value.filter(item => item.id !== id);
    saveToCookies();
  } catch (err) {
    console.error('Error removing item:', err);
    error.value = t('shoppingList.removeError');
  }
};

const markItemAsPurchased = (id: number, purchased: boolean) => {
  try {
    const index = shoppingItems.value.findIndex(item => item.id === id);
    if (index !== -1) {
      shoppingItems.value[index].purchased = purchased;
      saveToCookies();
    }
  } catch (err) {
    console.error('Error updating item:', err);
    error.value = t('shoppingList.updateError');
  }
};

onMounted(() => {
  loadFromCookies();
});
</script>
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('shoppingList.title') }}</h1>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="clearError()">
      {{ error }}
    </v-alert>
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">{{ t('shoppingList.myList') }}</h2>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="d-block mx-auto my-8"></v-progress-circular>
      <div v-else>
        <v-list v-if="shoppingItems.length > 0" class="bg-transparent">
          <v-list-item v-for="item in shoppingItems" :key="item.id">
            <v-list-item-title>{{ item.ingredient.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.amount }} {{ item.unit }}</v-list-item-subtitle>
            <div class="d-flex">
              <v-checkbox
                :label="t('shoppingList.purchased')"
                :model-value="item.purchased"
                hide-details
                @change="(value) => markItemAsPurchased(item.id, value)"></v-checkbox>
            </div>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('shoppingList.noItems') }}</p>
      </div>
    </div>
  </div>
</template>
