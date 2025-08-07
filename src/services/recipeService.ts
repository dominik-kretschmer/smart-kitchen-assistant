import type { Recipe } from '@/types/recipeTypes.ts';
import { apiCallService } from '@/services/apiCallService.ts';

const ENDPOINT = import.meta.env.VITE_API_ENDPOINT_RECIPES;

export const recipeService = {
  async getAllRecipes(): Promise<Recipe[]> {
    return await apiCallService('GET', ENDPOINT);
  },

  async createRecipe(recipeData: Omit<Recipe, 'id'>): Promise<Recipe> {
    return await apiCallService('POST', ENDPOINT, recipeData);
  },

  async updateRecipe(id: number, recipeData: Partial<Recipe>): Promise<Recipe> {
    const fullEndpoint = ENDPOINT + '/' + id;
    return await apiCallService('PUT', fullEndpoint, recipeData);
  },
};
