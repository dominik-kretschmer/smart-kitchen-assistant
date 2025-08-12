
export interface UserState {
  userId: number | null;
  username: string;
  isLoggedIn: boolean;
}
export interface Ingredient{
  name: string;
  calories?: number ;
  protein?: number;
  fat?: number;
  carbs?: number;
}

export interface Stock  {
  userId: number;
  ingredientId: number;
  quantity: string;
}
export interface SelectedIngredient extends Ingredient {
  id: number;
}
