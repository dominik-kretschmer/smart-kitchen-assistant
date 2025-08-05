import { Ingredient } from './recipeTypes';

export interface ShoppingListItem {
  id: number;
  amount: number;
  unit: string;
  ingredient: Ingredient;
}
