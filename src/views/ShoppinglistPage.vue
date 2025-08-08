<script setup lang="ts">
import type { ShoppingListItem } from '@/types/shoppingListTypes';
import type { FullIngredient } from '@/types/ingriedientTypes';
import { shoppingListService } from '@/services/shoppingListService';
import { ingredientService } from '@/services/ingredientService';
import { useAuth } from '@/composables/useAuth';
import { useStatus } from '@/composables/useStatus.ts';

const { t } = useI18n();
const { checkLoginStatus } = useAuth();
const { isLoading, error } = useStatus();
const userId = ref<number | null>(null);
const shoppingItems = ref<(ShoppingListItem & { purchased?: boolean })[]>([]);
const availableIngredients = ref<FullIngredient[]>([]);
const showAddForm = ref(false);

const newItem = reactive({
  amount: 0,
  unit: '',
  ingredient: null as FullIngredient | null,
});

const ensureLoggedIn = async () => {
  const userData = await checkLoginStatus();
  userId.value = userData?.id ?? null;
  if (!userId.value) {
    error.value = t('shoppingList.loginRequired');
    return false;
  }
  return true;
};

const loadShoppingList = async () => {
  isLoading.value = true;
  error.value = '';
  try {
    if (!(await ensureLoggedIn())) return;

    shoppingItems.value = await shoppingListService.getShoppingListByUser(userId.value as number);
    await loadIngredients();
  } catch (err) {
    console.error(err);
    error.value = t('shoppingList.loadError');
  } finally {
    isLoading.value = false;
  }
};

const loadIngredients = async () => {
  try {
    availableIngredients.value = await ingredientService.getAllIngredients();
  } catch (err) {
    console.error(err);
    error.value = t('shoppingList.ingredientsLoadError');
  }
};

const addItem = async (item: Omit<ShoppingListItem, 'id'>) => {
  try {
    if (!item.ingredient) {
      error.value = t('shoppingList.ingredientRequired');
      return;
    }
    if (!(await ensureLoggedIn())) return;

    isLoading.value = true;
    const newShoppingItem = await shoppingListService.createShoppingListItem(item);
    shoppingItems.value.push(newShoppingItem);
    newItem.amount = 0;
    newItem.unit = '';
    newItem.ingredient = null;
    showAddForm.value = false;
  } catch (err) {
    console.error(err);
    error.value = t('shoppingList.addError');
  } finally {
    isLoading.value = false;
  }
};

const removeItem = async (id: number) => {
  try {
    if (!(await ensureLoggedIn())) return;

    isLoading.value = true;
    const success = await shoppingListService.deleteShoppingListItem(id);
    if (success) {
      shoppingItems.value = shoppingItems.value.filter((it) => it.id !== id);
      return;
    }
    error.value = t('shoppingList.removeError');
  } catch (err) {
    console.error(err);
    error.value = t('shoppingList.removeError');
  } finally {
    isLoading.value = false;
  }
};

const markItemAsPurchased = async (id: number, purchased: boolean) => {
  try {
    if (!(await ensureLoggedIn())) return;

    isLoading.value = true;
    await shoppingListService.markItemAsPurchased(id, purchased);
    const index = shoppingItems.value.findIndex((it) => it.id === id);
    if (index !== -1) {
      shoppingItems.value[index].purchased = purchased;
    }
  } catch (err) {
    console.error(err);
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
      @click:close="error = ''">
      {{ error }}
    </v-alert>
    <v-btn color="primary" class="mb-4" @click="showAddForm = !showAddForm">
      <v-icon start>mdi-plus</v-icon>
      {{ showAddForm ? t('common.cancel') : t('shoppingList.addItem') }}
    </v-btn>
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
              required />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field
              v-model.number="newItem.amount"
              type="number"
              :label="t('shoppingList.amount')"
              required />
          </v-col>
          <v-col cols="6" sm="3">
            <v-text-field
              v-model="newItem.unit"
              :label="t('shoppingList.unit')"
              required />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
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
            <template #prepend>
              <v-checkbox
                :model-value="item.purchased"
                hide-details
                @change="(val: boolean) => markItemAsPurchased(item.id, Boolean(val))" />
            </template>
            <v-list-item-title>{{ item.ingredient.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.amount }} {{ item.unit }}</v-list-item-subtitle>
            <template #append>
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
