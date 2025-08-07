import type { FullIngredient } from '@/types/ingriedientTypes.ts';
import { apiCallService } from '@/services/apiCallService.ts';

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT_INGREDIENT;

export const ingredientService = {
  async getAllIngredients() {
    return await apiCallService('GET', ENDPOINT);
  },

  async createIngredient(ingredientData: Omit<FullIngredient, 'id'>) {
    return await apiCallService('POST', ENDPOINT, ingredientData);
  },

  async updateIngredient(id: number, ingredientData: Partial<FullIngredient>) {
    return await apiCallService('PUT', `${ENDPOINT}/${id}`, ingredientData);
  },
};
