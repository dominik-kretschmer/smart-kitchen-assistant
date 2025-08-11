import type { FullIngredient } from '@/types/ingriedientTypes.ts';

export interface RecipeIngredient {
  ingredientId: number;
  amount: string;
  ingredient: FullIngredient;
}

// Row model used when adding/editing ingredients in the recipe form
export interface AddIngredientRow {
  ingredientId: number | null;
  quantity: number;
  unit: string;
}

// Data emitted by the recipe form component
export interface RecipeFormData {
  name: string;
  description: string;
  ingredients: AddIngredientRow[];
  steps: string[];
}

export interface Recipe {
  id: number;
  name: string;
  steps: string;
  recipeIngredients: RecipeIngredient[];
}
