import type { ShoppingListItem } from '../types/shoppingListTypes';

const API_URL = import.meta.env.VITE_API_URL;
const endPoints = {
  shoppingList: import.meta.env.VITE_API_ENDPOINT_SHOPPING_LIST,
  shoppingListUser: import.meta.env.VITE_API_ENDPOINT_SHOPPING_LIST_USER,
};

export const shoppingListService = {
  async createShoppingListItem(shoppingListItem: Omit<ShoppingListItem, 'id'>) {
    const response = await fetch(`${API_URL}${endPoints.shoppingList}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shoppingListItem),
      credentials: 'include',
    });
    return await response.json();
  },

  async getShoppingListByUser(userId: number | null) {
    if (userId === null) {
      throw Error('userId is null');
    }
    const response = await fetch(`${API_URL}${endPoints.shoppingListUser}/${userId}`, {
      credentials: 'include',
    });
    return await response.json();
  },

  async updateShoppingListItem(id: number, shoppingListItem: Partial<ShoppingListItem>) {
    const response = await fetch(`${API_URL}${endPoints.shoppingList}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(shoppingListItem),
      credentials: 'include',
    });
    return await response.json();
  },

  async deleteShoppingListItem(id: number) {
    const response = await fetch(`${API_URL}${endPoints.shoppingList}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.status === 204;
  },

  async markItemAsPurchased(id: number, purchased: boolean) {
    const response = await fetch(`${API_URL}${endPoints.shoppingList}/${id}/purchased`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ purchased }),
      credentials: 'include',
    });
    return await response.json();
  },
};
