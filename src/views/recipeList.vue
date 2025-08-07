<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Recipe } from '@/types/recipeTypes';
import { recipeService } from '@/services/recipeService';
import InteractWithIngredient from '@/components/InteractWithIngredient.vue';

const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const recipes = ref<Recipe[]>([]);
const showCreateForm = ref(false);
const showEditForm = ref(false);
const recipeToEdit = ref<Recipe | null>(null);

const loadRecipes = async () => {
  loading.value = true;
  error.value = '';

  try {
    recipes.value = await recipeService.getAllRecipes();
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

const toggleCreateForm = () => {
  showCreateForm.value = !showCreateForm.value;
  if (showCreateForm.value) {
    // Close edit form if open
    showEditForm.value = false;
    recipeToEdit.value = null;
  }
};

const startEditRecipe = (recipe: Recipe) => {
  recipeToEdit.value = recipe;
  showEditForm.value = true;
  showCreateForm.value = false;
};

const cancelEdit = () => {
  showEditForm.value = false;
  recipeToEdit.value = null;
};

const handleSaveRecipe = async (recipeData) => {
  loading.value = true;
  error.value = '';

  try {
    const apiRecipeData = {
      name: recipeData.name,
      steps: recipeData.steps.join('\n\n'),
      recipeIngredients: recipeData.ingredients.map((ing) => ({
        ingredientId: 0,
        amount: `${ing.quantity} ${ing.unit}`,
        ingredient: {
          id: 0,
          name: ing.name,
        },
      })),
    };

    await recipeService.createRecipe(apiRecipeData);
    showCreateForm.value = false;
    await loadRecipes();
  } catch (err) {
    console.error('Error creating recipe:', err);
    error.value = t('recipe.createError') || 'Failed to create recipe';
  } finally {
    loading.value = false;
  }
};

const handleUpdateRecipe = async (recipeData) => {
  if (!recipeToEdit.value) return;

  loading.value = true;
  error.value = '';

  try {
    const apiRecipeData = {
      name: recipeData.name,
      steps: recipeData.steps.join('\n\n'),
      recipeIngredients: recipeData.ingredients.map((ing) => ({
        ingredientId: 0,
        amount: `${ing.quantity} ${ing.unit}`,
        ingredient: {
          id: 0,
          name: ing.name,
        },
      })),
    };

    await recipeService.updateRecipe(recipeToEdit.value.id, apiRecipeData);
    showEditForm.value = false;
    recipeToEdit.value = null;
    await loadRecipes();
  } catch (err) {
    console.error('Error updating recipe:', err);
    error.value = t('recipe.updateError') || 'Failed to update recipe';
  } finally {
    loading.value = false;
  }
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
      @click:close="clearError">
      {{ error }}
    </v-alert>
    <v-btn color="primary" class="mb-4" @click="toggleCreateForm" prepend-icon="mdi-plus">
      {{ showCreateForm ? t('common.cancel') : t('recipe.createNew') }}
    </v-btn>
    <div v-if="showCreateForm" class="mb-6">
      <InteractWithIngredient @save-recipe="handleSaveRecipe" />
    </div>
    <div v-if="showEditForm" class="mb-6">
      <InteractWithIngredient
        :recipe="recipeToEdit"
        :isEditing="true"
        @save-recipe="handleUpdateRecipe" />
      <v-btn
        color="secondary"
        class="mt-2"
        @click="cancelEdit">
        {{ t('common.cancel') }}
      </v-btn>
    </div>
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
              <v-card-actions>
                <v-btn
                  color="primary"
                  variant="text"
                  prepend-icon="mdi-pencil"
                  @click="startEditRecipe(recipe)">
                  {{ t('common.edit') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('recipe.noRecipes') }}</p>
      </div>
    </div>
  </div>
</template>
