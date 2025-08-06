import type { Recipe } from '@/types/recipeTypes.ts';

// These constants will be used in the implementation
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const API_URL = import.meta.env.VITE_API_URL;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ENDPOINT = '/api/recipes';

export const recipeService = {
  async getAllRecipes() {
    // Implementation will be added later
    // Will use `${API_URL}${ENDPOINT}` to fetch all recipes
    return [] as Recipe[];
  },

  async getRecipe(id: number) {
    // Implementation will be added later
    // Will use `${API_URL}${ENDPOINT}/${id}` to fetch a specific recipe
    console.log(`Will fetch recipe with id: ${id}`);
    return {} as Recipe;
  },

  async createRecipe(recipeData: Omit<Recipe, 'id'>) {
    // Implementation will be added later
    // Will send recipeData to `${API_URL}${ENDPOINT}`
    console.log('Will create recipe with data:', recipeData);
    return {} as Recipe;
  },

  async updateRecipe(id: number, recipeData: Partial<Recipe>) {
    // Implementation will be added later
    // Will update recipe at `${API_URL}${ENDPOINT}/${id}` with recipeData
    console.log(`Will update recipe ${id} with data:`, recipeData);
    return {} as Recipe;
  },

  async deleteRecipe(id: number) {
    // Implementation will be added later
    // Will delete recipe at `${API_URL}${ENDPOINT}/${id}`
    console.log(`Will delete recipe with id: ${id}`);
    return true;
  },
};
