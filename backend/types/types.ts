export interface RecipeIngredient {
  ingredientId: number;
  amount: number;
}
export interface ShoppingListData {
  userId: number;
  ingredientId: number;
  quantity?: number;
}
export interface StockData {
  name: string;
  userId: number;
  quantity: number;
  unit?: string;
}
export interface UserData {
  username: string;
  password: string;
  email?: string;
}
export interface StockResponse {
  id: number;
  name: string;
  quantity: number;
  unit: string;
}
export interface RecipeData {
  title: string;
  description?: string;
  instructions?: string;
  userId: number;
  ingredients?: RecipeIngredient[];
}
export interface IngredientData {
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}
