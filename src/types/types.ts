export interface UserState {
  userId: number | null;
  username: string;
  isLoggedIn: boolean;
}

export type Mode = 'login' | 'register';

export interface Ingredient {
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
  icon: string;
}
