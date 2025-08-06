import type { FullIngredient } from '@/types/ingriedientTypes.ts';

export interface RecipeIngredient {
  ingredientId: number;
  amount: string;
  ingredient: FullIngredient;
}

export interface Recipe {
  id: number;
  name: string;
  steps: string;
  recipeIngredients: RecipeIngredient[];
}
