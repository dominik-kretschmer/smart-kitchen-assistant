import type { FullIngredient, Ingredient } from '@/types/ingriedientTypes.ts';

export interface RecipeIngredient {
  ingredientId: number;
  amount: string;
  ingredient: FullIngredient;
}

export interface EditableRecipe {
  name: string;
  description: string;
  ingredients: Ingredient[];
  steps: string[];
}

export interface Recipe {
  id: number;
  name: string;
  steps: string;
  recipeIngredients: RecipeIngredient[];
}
