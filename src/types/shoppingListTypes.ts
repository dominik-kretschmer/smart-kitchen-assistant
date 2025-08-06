import type { FullIngredient } from '@/types/ingriedientTypes.ts';

export interface ShoppingListItem {
  id: number;
  amount: number;
  unit: string;
  ingredient: FullIngredient;
}
