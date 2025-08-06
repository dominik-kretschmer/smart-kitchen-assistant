export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface Ingredient {
  id: number;
  name: string;
  calories?: number;
  carbs?: number;
  fat?: number;
  protein?: number;
}
