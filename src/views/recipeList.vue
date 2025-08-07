<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Recipe } from '@/types/recipeTypes';
import { recipeService } from '@/services/recipeService';

const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const recipes = ref<Recipe[]>([]);

const loadRecipes = async () => {
  loading.value = true;
  error.value = '';

  try {
    const data = await recipeService.getAllRecipes();
    recipes.value = data;
  } catch (err) {
    console.error('Error loading recipes:', err);
    error.value = t('recipe.loadError') || 'Failed to load recipes';
  } finally {
    loading.value = false;
  }
};

const clearError = () => {
  error.value = '';
};

onMounted(async () => {
  await loadRecipes();
});
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('recipe.title') }}</h1>
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
      <h2 class="text-xl font-semibold mb-3">{{ t('recipe.myRecipes') }}</h2>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="d-block mx-auto my-8"></v-progress-circular>
      <div v-else>
        <v-list v-if="recipes.length > 0" class="bg-transparent">
          <v-list-item v-for="recipe in recipes" :key="recipe.id" class="mb-4">
            <v-card width="100%">
              <v-card-title>{{ recipe.name }}</v-card-title>
              <v-card-subtitle>{{ t('recipe.ingredients') }}</v-card-subtitle>
              <v-card-text>
                <ul>
                  <li v-for="ingredient in recipe.recipeIngredients" :key="ingredient.ingredientId">
                    {{ ingredient.amount }} {{ ingredient.ingredient.name }}
                  </li>
                </ul>
                <div class="mt-2">
                  <strong>{{ t('recipe.preparation') }}</strong>
                  <pre>{{ recipe.steps }}</pre>
                </div>
              </v-card-text>
            </v-card>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('recipe.noRecipes') }}</p>
      </div>
    </div>
  </div>
</template>
