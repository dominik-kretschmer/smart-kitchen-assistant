<script setup lang="ts">
import { ref } from 'vue';
import type { Recipe } from '../types/recipeTypes';
import { useI18n } from '../i18n';

const { t } = useI18n();

const recipes = ref<Recipe[]>([
  {
    id: 1,
    name: 'Spaghetti Carbonara',
    steps: '1. Cook pasta\n2. Fry bacon\n3. Mix eggs and cheese\n4. Combine all ingredients',
    recipeIngredients: [
      {
        ingredientId: 1,
        amount: '200g',
        ingredient: { id: 1, name: 'Spaghetti' },
      },
      {
        ingredientId: 2,
        amount: '100g',
        ingredient: { id: 2, name: 'Bacon' },
      },
      {
        ingredientId: 3,
        amount: '2',
        ingredient: { id: 3, name: 'Eggs' },
      },
      {
        ingredientId: 4,
        amount: '50g',
        ingredient: { id: 4, name: 'Parmesan' },
      },
    ],
  },
  {
    id: 2,
    name: 'Chicken Curry',
    steps:
      '1. Dice chicken\n2. Sauté onions and garlic\n3. Add curry paste\n4. Add chicken and coconut milk\n5. Simmer until cooked',
    recipeIngredients: [
      {
        ingredientId: 5,
        amount: '300g',
        ingredient: { id: 5, name: 'Chicken Breast' },
      },
      {
        ingredientId: 6,
        amount: '1',
        ingredient: { id: 6, name: 'Onion' },
      },
      {
        ingredientId: 7,
        amount: '2 cloves',
        ingredient: { id: 7, name: 'Garlic' },
      },
      {
        ingredientId: 8,
        amount: '2 tbsp',
        ingredient: { id: 8, name: 'Curry Paste' },
      },
      {
        ingredientId: 9,
        amount: '400ml',
        ingredient: { id: 9, name: 'Coconut Milk' },
      },
    ],
  },
  {
    id: 3,
    name: 'Vegetable Stir Fry',
    steps:
      '1. Chop vegetables\n2. Heat oil in wok\n3. Stir fry vegetables\n4. Add sauce\n5. Serve with rice',
    recipeIngredients: [
      {
        ingredientId: 10,
        amount: '1',
        ingredient: { id: 10, name: 'Bell Pepper' },
      },
      {
        ingredientId: 11,
        amount: '1',
        ingredient: { id: 11, name: 'Carrot' },
      },
      {
        ingredientId: 12,
        amount: '100g',
        ingredient: { id: 12, name: 'Broccoli' },
      },
      {
        ingredientId: 13,
        amount: '2 tbsp',
        ingredient: { id: 13, name: 'Soy Sauce' },
      },
    ],
  },
]);

const loading = ref(false);
const error = ref('');
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
