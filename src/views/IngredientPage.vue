<script setup lang="ts">
import { useAuth } from '@/composables/useAuth.ts';
import { ingredientService } from '@/services/ingredientService.ts';
import { useStatus } from '@/composables/useStatus.ts';
import type { FullIngredient } from '@/types/ingriedientTypes';

const { t } = useI18n();
const ingredients = ref<FullIngredient[]>([]);
const { isLoading, error } = useStatus();
const userId = ref<number | null>(null);
const { checkLoginStatus } = useAuth();
const editDialog = ref(false);
const newIngredientDialog = ref(false);
const newIngredient = ref({
  name: '',
  calories: 0,
  carbs: 0,
  fat: 0,
  protein: 0,
});

const editedItem = ref<FullIngredient>({
  id: 0,
  name: '',
  calories: 0,
  carbs: 0,
  fat: 0,
  protein: 0,
});

onMounted(async () => {
  try {
    const userData = await checkLoginStatus();
    if (userData) {
      userId.value = userData.id;
      await loadIngredients();
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : String(err);
  }
});

async function loadIngredients() {
  isLoading.value = true;
  error.value = '';
  try {
    ingredients.value = await ingredientService.getAllIngredients();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    error.value = `${t('errors.failedToLoadIngredients')}: ${msg}`;
  }
  isLoading.value = false;
}

function handleIngredientCreated(createdIngredient: FullIngredient) {
  ingredients.value.push(createdIngredient);
  newIngredient.value = {
    name: '',
    calories: 0,
    carbs: 0,
    fat: 0,
    protein: 0,
  };
}

function openEditDialog(item: FullIngredient) {
  editedItem.value = { ...item };
  editDialog.value = true;
}

function handleIngredientUpdated(updatedIngredient: FullIngredient) {
  const index = ingredients.value.findIndex(
    (item: FullIngredient) => item.id === updatedIngredient.id,
  );
  if (index !== -1) ingredients.value[index] = updatedIngredient;
}
</script>
<template>
  <div class="p-4" v-if="userId !== null">
    <h1 class="text-2xl font-bold mb-4">{{ t('ingredients.title') }}</h1>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = ''">
      {{ error }}
    </v-alert>
    <v-btn color="primary" class="mb-4" @click="newIngredientDialog = true" :disabled="isLoading">
      {{ t('ingredients.addIngredient') }}
    </v-btn>
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">{{ t('ingredients.allIngredients') }}</h2>
      <div v-if="!isLoading">
        <v-list v-if="ingredients.length > 0" class="bg-transparent">
          <v-list-item v-for="item in ingredients" :key="item.id">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>
              {{ t('ingredients.calories') }}: {{ item.calories }} | {{ t('ingredients.carbs') }}:
              {{ item.carbs }}g | {{ t('ingredients.fat') }}: {{ item.fat }}g |
              {{ t('ingredients.protein') }}: {{ item.protein }}g
            </v-list-item-subtitle>
            <div class="d-flex">
              <v-btn variant="text" color="white" @click="openEditDialog(item)">
                {{ t('common.edit') }}
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('ingredients.noIngredients') }}</p>
      </div>
    </div>
    <edit-ingredient
      v-model="editDialog"
      :edited-item="editedItem"
      :is-loading="isLoading"
      :error="error"
      @update:error="error = $event"
      @update:is-loading="isLoading = $event"
      @ingredient-updated="handleIngredientUpdated" />
  </div>
  <div v-else>
    <h1>{{ t('stock.pleaseLogin') }}</h1>
  </div>
  <create-new-ingredient
    v-model="newIngredientDialog"
    :new-ingredient="newIngredient"
    :is-loading="isLoading"
    :error="error"
    @update:error="error = $event"
    @update:is-loading="isLoading = $event"
    @ingredient-created="handleIngredientCreated" />
</template>
