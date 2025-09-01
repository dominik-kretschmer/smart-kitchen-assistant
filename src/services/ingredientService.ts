import { apiCallService } from '@/services/apiCallService.ts';
import type { Ingredient } from '@/types/types.ts';

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT_INGREDIENT;

export const ingredientService = {
  async getAllIngredients() {
    return await apiCallService('GET', ENDPOINT);
  },

  async createIngredient(ingredientData: Omit<Ingredient, 'id'>) {
    return await apiCallService('POST', ENDPOINT, ingredientData);
  },

  async updateIngredient(id: number, ingredientData: Partial<Ingredient>) {
    return await apiCallService('PUT', `${ENDPOINT}/${id}`, ingredientData);
  },
};
