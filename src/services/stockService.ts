import type { Stock } from '../types/types';
import { apiCallService } from '@/services/apiCallService.ts';

const endPoints = {
  stock: import.meta.env.VITE_API_ENDPOINT_STOCK,
  stockUser: import.meta.env.VITE_API_ENDPOINT_STOCK_USER,
};

export const stockService = {
  async createStock(stockData: Stock) {
    return await apiCallService('POST', endPoints.stock, stockData);
  },

  async getStockByUser(userId: number | null) {
    if (userId === null) {
      throw Error('userId is null ');
    }
    const fullEndpoint = endPoints.stockUser + '/' + userId;
    return await apiCallService('GET', fullEndpoint);
  },

  async updateStock(id: number, stockData: Stock) {
    const fullEndpoint = endPoints.stock + '/' + id;
    return await apiCallService('PUT', fullEndpoint, stockData);
  },

  async deleteStock(id: number) {
    const fullEndpoint = endPoints.stock + '/' + id;
    return apiCallService('DELETE', fullEndpoint);
  },
};
