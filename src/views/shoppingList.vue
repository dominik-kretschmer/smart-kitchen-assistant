<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { ShoppingListItem } from '@/types/shoppingListTypes';
import type { FullIngredient } from '@/types/ingriedientTypes';
import { shoppingListService } from '@/services/shoppingListService';
import { ingredientService } from '@/services/ingredientService';
import { useAuth } from '@/composables/useAuth';
import { useStatus } from '@/composables/useStatus.ts';

const { t } = useI18n();
const { user, checkLoginStatus, isLoggedIn } = useAuth();
const { isLoading, error } = useStatus();
const shoppingItems = ref<(ShoppingListItem & { purchased?: boolean })[]>([]);
const availableIngredients = ref<FullIngredient[]>([]);

const showAddForm = ref(false);
const newItem = reactive({
  amount: 0,
  unit: '',
  ingredient: null as FullIngredient | null,
});

const clearError = () => {
  error.value = '';
};

const loadShoppingList = async () => {
  isLoading.value = true;
  try {
    if (!isLoggedIn.value || !user.value?.id) {
      await checkLoginStatus();
    }

    if (isLoggedIn.value && user.value?.id) {
      const items = await shoppingListService.getShoppingListByUser(user.value.id);
      shoppingItems.value = items;

      // Load available ingredients
      await loadIngredients();
    } else {
      error.value = t('shoppingList.loginRequired');
    }
  } catch (err) {
    console.error('Error loading shopping list:', err);
    error.value = t('shoppingList.loadError');
  } finally {
    isLoading.value = false;
  }
};

const loadIngredients = async () => {
  try {
    availableIngredients.value = await ingredientService.getAllIngredients();
  } catch (err) {
    console.error('Error loading ingredients:', err);
    error.value = t('shoppingList.ingredientsLoadError');
  }
};

const addItem = async (item: Omit<ShoppingListItem, 'id'>) => {
  try {
    if (!item.ingredient) {
      error.value = t('shoppingList.ingredientRequired');
      return;
    }

    isLoading.value = true;
    const newShoppingItem = await shoppingListService.createShoppingListItem(item);
    shoppingItems.value.push(newShoppingItem);

    // Reset form
    newItem.amount = 0;
    newItem.unit = '';
    newItem.ingredient = null;
    showAddForm.value = false;
  } catch (err) {
    console.error('Error adding item:', err);
    error.value = t('shoppingList.addError');
  } finally {
    isLoading.value = false;
  }
};

const removeItem = async (id: number) => {
  try {
    isLoading.value = true;
    const success = await shoppingListService.deleteShoppingListItem(id);
    if (success) {
      shoppingItems.value = shoppingItems.value.filter((item) => item.id !== id);
    } else {
      error.value = t('shoppingList.removeError');
    }
  } catch (err) {
    console.error('Error removing item:', err);
    error.value = t('shoppingList.removeError');
  } finally {
    isLoading.value = false;
  }
};

const markItemAsPurchased = async (id: number, purchased: boolean) => {
  try {
    isLoading.value = true;
    await shoppingListService.markItemAsPurchased(id, purchased);
    const index = shoppingItems.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      shoppingItems.value[index].purchased = purchased;
    }
  } catch (err) {
    console.error('Error updating item:', err);
    error.value = t('shoppingList.updateError');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  await loadShoppingList();
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

    <!-- Add Item Button -->
    <v-btn color="primary" class="mb-4" @click="showAddForm = !showAddForm" :disabled="!isLoggedIn">
      <v-icon start>mdi-plus</v-icon>
      {{ showAddForm ? t('common.cancel') : t('shoppingList.addItem') }}
    </v-btn>

    <!-- Add Item Form -->
    <v-card v-if="showAddForm" class="mb-6 pa-4">
      <v-card-title>{{ t('shoppingList.addNewItem') }}</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <v-select
              v-model="newItem.ingredient"
              :items="availableIngredients"
              item-title="name"
              item-value="id"
              return-object
              :label="t('shoppingList.ingredient')"
              required></v-select>
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field
              v-model.number="newItem.amount"
              type="number"
              :label="t('shoppingList.amount')"
              required></v-text-field>
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field
              v-model="newItem.unit"
              :label="t('shoppingList.unit')"
              required></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          @click="addItem(newItem as Omit<ShoppingListItem, 'id'>)"
          :disabled="!newItem.ingredient || newItem.amount <= 0 || !newItem.unit">
          {{ t('common.add') }}
        </v-btn>
      </v-card-actions>
    </v-card>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">{{ t('shoppingList.myList') }}</h2>
      <div v-if="!isLoading">
        <v-list v-if="shoppingItems.length > 0" class="bg-transparent">
          <v-list-item v-for="item in shoppingItems" :key="item.id">
            <template v-slot:prepend>
              <v-checkbox
                :model-value="item.purchased"
                hide-details
                @change="(value) => markItemAsPurchased(item.id, value)"></v-checkbox>
            </template>
            <v-list-item-title>{{ item.ingredient.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.amount }} {{ item.unit }}</v-list-item-subtitle>
            <template v-slot:append>
              <v-btn icon @click="removeItem(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('shoppingList.noItems') }}</p>
      </div>
    </div>
  </div>
</template>
