import type { FullIngredient } from '@/types/ingriedientTypes.ts';

const API_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = '/api/ingredients';

export const ingredientService = {
  async getAllIngredients() {
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
      credentials: 'include',
    });
    return await response.json();
  },

  async getIngredient(id: number) {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
      credentials: 'include',
    });
    return await response.json();
  },

  async createIngredient(ingredientData: Omit<FullIngredient, 'id'>) {
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData),
      credentials: 'include',
    });
    return await response.json();
  },

  async updateIngredient(id: number, ingredientData: Partial<FullIngredient>) {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredientData),
      credentials: 'include',
    });
    return await response.json();
  },
};
