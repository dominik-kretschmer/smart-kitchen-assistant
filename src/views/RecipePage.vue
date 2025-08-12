<script setup lang="ts">
import type { Recipe, RecipeFormData } from '@/types/recipeTypes.ts';
import { recipeService } from '@/services/recipeService.ts';
import { useStatus } from '@/composables/useStatus.ts';

const { t } = useI18n();
const { isLoading, error } = useStatus();
const recipes = ref<Recipe[]>([]);
const showCreateForm = ref<boolean>(false);
const showEditForm = ref<boolean>(false);
const recipeToEdit = ref<Recipe | null>(null);

const mapFormToApi = (data: RecipeFormData) => {
  return {
    name: data.name,
    steps: data.steps.join('\n\n'),
    ingredients: data.ingredients.map(
      (ing: { ingredientId: number | null; quantity: number; unit: string }) => ({
        ingredientId: ing.ingredientId ?? 0,
        amount: `${ing.quantity} ${ing.unit}`,
      }),
    ),
  };
};

const loadRecipes = async (): Promise<void> => {
  isLoading.value = true;
  error.value = '';
  try {
    recipes.value = await recipeService.getAllRecipes();
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    error.value = `${t('recipe.loadError')}${msg}`;
  } finally {
    isLoading.value = false;
  }
};

const toggleCreateForm = (): void => {
  console.log(typeof showCreateForm.value);
  showCreateForm.value = !showCreateForm.value;
  if (showCreateForm.value) {
    cancelEdit();
  }
};

const startEditRecipe = (recipe: Recipe): void => {
  recipeToEdit.value = recipe;
  showEditForm.value = true;
  showCreateForm.value = false;
};

const cancelEdit = (): void => {
  showEditForm.value = false;
  recipeToEdit.value = null;
};

const handleSaveRecipe = async (recipeData: RecipeFormData): Promise<void> => {
  isLoading.value = true;
  error.value = '';

  try {
    const apiRecipeData = mapFormToApi(recipeData);
    await recipeService.createRecipe(apiRecipeData);
    showCreateForm.value = false;
    await loadRecipes();
  } catch (err: unknown) {
    console.error('Error creating recipe:', err);
    error.value = t('recipe.createError') || 'Failed to create recipe';
  } finally {
    isLoading.value = false;
  }
};

const handleUpdateRecipe = async (recipeData: RecipeFormData): Promise<void> => {
  if (!recipeToEdit.value) return;

  isLoading.value = true;
  error.value = '';

  try {
    const apiRecipeData = mapFormToApi(recipeData);
    await recipeService.updateRecipe(recipeToEdit.value.id, apiRecipeData);
    showEditForm.value = false;
    recipeToEdit.value = null;
    await loadRecipes();
  } catch (err: unknown) {
    console.error('Error updating recipe:', err);
    error.value = t('recipe.updateError') || 'Failed to update recipe';
  } finally {
    isLoading.value = false;
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
      @click:close="error = ''">
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
      <v-btn color="secondary" class="mt-2" @click="cancelEdit">
        {{ t('common.cancel') }}
      </v-btn>
    </div>
    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">{{ t('recipe.myRecipes') }}</h2>
      <div v-if="!isLoading">
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
