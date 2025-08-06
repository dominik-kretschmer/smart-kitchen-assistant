import type { Ingredient } from '@/types/ingriedientTypes.ts';

export interface RecipeIngredient {
  ingredientId: number;
  amount: string;
  ingredient: Ingredient;
}

export interface Recipe {
  id: number;
  name: string;
  steps: string;
  recipeIngredients: RecipeIngredient[];
}
