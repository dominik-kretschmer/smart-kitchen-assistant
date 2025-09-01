import { ShoppingListItem } from '../types/types.ts';
import { apiCallService } from '@/services/apiCallService.ts';

const endPoints = {
  shoppingList: import.meta.env.VITE_API_ENDPOINT_SHOPPING_LIST,
  shoppingListUser: import.meta.env.VITE_API_ENDPOINT_SHOPPING_LIST_USER,
};

export const shoppingListService = {
  async createShoppingListItem(shoppingListItem: Omit<ShoppingListItem, 'id'>) {
    return await apiCallService('POST', endPoints.shoppingList, shoppingListItem);
  },

  async getShoppingListByUser(userId: number | null) {
    if (userId === null) {
      throw Error('userId is null');
    }
    const fullEndpoint = endPoints.shoppingListUser + '/' + userId;
    return apiCallService('GET', fullEndpoint);
  },

  async updateShoppingListItem(id: number, shoppingListItem: Partial<ShoppingListItem>) {
    const fullEndpoint = endPoints.shoppingList + '/' + id;
    return apiCallService('PUT', fullEndpoint, shoppingListItem);
  },

  async deleteShoppingListItem(id: number) {
    const fullEndpoint = endPoints.shoppingList + '/' + id;
    const response = await apiCallService('DELETE', fullEndpoint);
    return response.status === 204;
  },

  async markItemAsPurchased(id: number, purchased: boolean) {
    const fullEndpoint = endPoints.shoppingList + '/' + id + '/purchased';
    return apiCallService('PUT', fullEndpoint, purchased);
  },
};
