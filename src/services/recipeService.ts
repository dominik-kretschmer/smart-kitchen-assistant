import type { Recipe } from '@/types/recipeTypes.ts';

const API_URL = import.meta.env.VITE_API_URL;
const ENDPOINT = import.meta.env.VITE_API_ENDPOINT_RECIPES;

export const recipeService = {
  async getAllRecipes(): Promise<Recipe[]> {
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
      credentials: 'include',
    });
    return await response.json();
  },

  async getRecipe(id: number): Promise<Recipe> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
      credentials: 'include',
    });
    return await response.json();
  },

  async createRecipe(recipeData: Omit<Recipe, 'id'>): Promise<Recipe> {
    const response = await fetch(`${API_URL}${ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
      credentials: 'include',
    });
    return await response.json();
  },

  async updateRecipe(id: number, recipeData: Partial<Recipe>): Promise<Recipe> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipeData),
      credentials: 'include',
    });
    return await response.json();
  },

  async deleteRecipe(id: number): Promise<boolean> {
    const response = await fetch(`${API_URL}${ENDPOINT}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.status === 204;
  },
};
