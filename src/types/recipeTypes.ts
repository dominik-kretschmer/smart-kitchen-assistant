export interface Ingredient {
  id: number;
  name: string;
}

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
