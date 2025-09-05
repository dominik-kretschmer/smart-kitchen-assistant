export interface UserState {
  userId: number | null;
  username: string;
  isLoggedIn: boolean;
}

export type Mode = 'login' | 'register';

export interface Ingredient {
  id: number;
  name: string;
  calories?: number;
  protein?: number;
  fat?: number;
  carbs?: number;
}

export interface Stock {
  userId: number;
  ingredientId: number;
  quantity: string;
}

export type IngredientRow = {
  ingredient: Ingredient | null;
  amount: number | null;
  unit: string | null;
};

export interface SelectedIngredient extends Ingredient {
  id: number;
}

export interface StockListItem {
  id?: number;
  ingredientId?: number;
  ingredient?: { name?: string | null } | null;
  name?: string | null;
  quantity: string;
}

export interface NavItem {
  name: string;
  path: string;
  label: string;
}

export interface ShoppingListItem {
  id: number;
  userId: number;
  ingredientId: number;
  ingredient?: Pick<Ingredient, 'id' | 'name'> | null;
  amount: number;
  unit: string;
}
export interface Recipe {
  id?: number;
  name?: string;
}
