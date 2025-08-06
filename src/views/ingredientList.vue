<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ingredientService } from '../services/ingredientService';
import { useAuth } from '../composables/useAuth';
import { useI18n } from '@/i18n';
import type { FullIngredient } from '@/types/ingriedientTypes.ts';

const { t } = useI18n();
const ingredients = ref<FullIngredient[]>([]);
const loading = ref(false);
const error = ref('');
const userId = ref<number | null>(null);
const { checkLoginStatus } = useAuth();

const newIngredientDialog = ref(false);
const newIngredient = ref({
  name: '',
  calories: 0,
  carbs: 0,
  fat: 0,
  protein: 0,
});

const editDialog = ref(false);
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
    console.error('Error checking login status:', err);
  }
});

async function loadIngredients() {
  loading.value = true;
  error.value = '';

  try {
    ingredients.value = await ingredientService.getAllIngredients();
  } catch (err) {
    error.value = t('errors.failedToLoadIngredients');
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function addIngredient() {
  if (!newIngredient.value.name) {
    error.value = t('errors.nameRequired');
    return;
  }

  loading.value = true;
  try {
    const createdIngredient = await ingredientService.createIngredient(newIngredient.value);
    ingredients.value.push(createdIngredient);
    newIngredientDialog.value = false;
    newIngredient.value = {
      name: '',
      calories: 0,
      carbs: 0,
      fat: 0,
      protein: 0,
    };
  } catch (err) {
    error.value = t('errors.failedToCreateIngredient' + err);
  } finally {
    loading.value = false;
  }
}

function openEditDialog(item: FullIngredient) {
  editedItem.value = { ...item };
  editDialog.value = true;
}

async function updateIngredient() {
  if (!editedItem.value.name) {
    error.value = t('errors.nameRequired');
    return;
  }

  loading.value = true;
  try {
    const updatedItem = await ingredientService.updateIngredient(editedItem.value.id, {
      name: editedItem.value.name,
      calories: editedItem.value.calories,
      carbs: editedItem.value.carbs,
      fat: editedItem.value.fat,
      protein: editedItem.value.protein,
    });

    const index = ingredients.value.findIndex((item) => item.id === editedItem.value.id);
    if (index !== -1) {
      ingredients.value[index] = updatedItem;
    }

    editDialog.value = false;
  } catch (err) {
    error.value = t('errors.failedToUpdateIngredient');
    console.error(err);
  } finally {
    loading.value = false;
  }
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

    <v-btn color="primary" class="mb-4" @click="newIngredientDialog = true" :disabled="loading">
      {{ t('ingredients.addNew') }}
    </v-btn>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">{{ t('ingredients.allIngredients') }}</h2>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="d-block mx-auto my-8"></v-progress-circular>
      <div v-else>
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
                {{ t('ingredients.edit') }}
              </v-btn>
            </div>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('ingredients.noIngredients') }}</p>
      </div>
    </div>

    <v-dialog v-model="newIngredientDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ t('ingredients.addIngredient') }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="newIngredient.name"
                  :label="t('ingredients.name')"
                  required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newIngredient.calories"
                  :label="t('ingredients.caloriesLabel')"
                  type="number"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newIngredient.carbs"
                  :label="t('ingredients.carbsLabel')"
                  type="number"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newIngredient.fat"
                  :label="t('ingredients.fatLabel')"
                  type="number"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="newIngredient.protein"
                  :label="t('ingredients.proteinLabel')"
                  type="number"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="newIngredientDialog = false">
            {{ t('ingredients.cancel') }}
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="addIngredient">
            {{ t('ingredients.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="editDialog" max-width="500px">
      <v-card>
        <v-card-title>{{ t('ingredients.editIngredient') }}</v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="editedItem.name"
                  :label="t('ingredients.name')"
                  required></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.calories"
                  :label="t('ingredients.caloriesLabel')"
                  type="number"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.carbs"
                  :label="t('ingredients.carbsLabel')"
                  type="number"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.fat"
                  :label="t('ingredients.fatLabel')"
                  type="number"></v-text-field>
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model.number="editedItem.protein"
                  :label="t('ingredients.proteinLabel')"
                  type="number"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="editDialog = false">
            {{ t('ingredients.cancel') }}
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="updateIngredient">
            {{ t('ingredients.save') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
  <div v-else>
    <h1>{{ t('stock.pleaseLogin') }}</h1>
  </div>
</template>
