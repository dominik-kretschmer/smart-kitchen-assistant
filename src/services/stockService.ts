const API_URL = 'http://localhost:3000';

interface StockItem {
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  userId: number;
}

export const stockService = {
  async createStock(stockData: StockItem) {
    const response = await fetch(`${API_URL}/api/stock`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stockData),
      credentials: 'include',
    });
    return await response.json();
  },

  async getStockByUser(userId: number) {
    const response = await fetch(`${API_URL}/api/stock/user/${userId}`, {
      credentials: 'include',
    });
    return await response.json();
  },

  async updateStock(id: number, stockData: Partial<StockItem>) {
    const response = await fetch(`${API_URL}/api/stock/${id}`, {
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
    const response = await fetch(`${API_URL}/api/stock/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    return response.status === 204;
  },
};
