import type { StockItem ,UpdatedStockItem} from '../types/stockTypes';
const API_URL = import.meta.env.VITE_API_URL;

const endPoints = {
  stock: import.meta.env.VITE_API_ENDPOINT_STOCK,
  stockUser: import.meta.env.VITE_API_ENDPOINT_STOCK_USER,
};

export const stockService = {
  async createStock(stockData: StockItem) {
    const response = await fetch(`${API_URL}${endPoints.stock}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockData),
      credentials: 'include',
    });
    return await response.json();
  },

  async getStockByUser(userId: number| null) {
    if(userId === null){
      throw Error("userId is null ")
    }
    const response = await fetch(`${API_URL}${endPoints.stockUser}/${userId}`, {
      credentials: 'include',
    });
    return await response.json();
  },

  async updateStock(id: number, stockData : UpdatedStockItem ) {
    const response = await fetch(`${API_URL}${endPoints.stock}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockData),
      credentials: 'include',
    });
    return await response.json();
  },

  async deleteStock(id: number) {
    const response = await fetch(`${API_URL}${endPoints.stock}/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.status === 204;
  },
};
