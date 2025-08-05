export interface StockItem {
  id?: number;
  name: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  userId?: number;
}
export interface UpdatedStockItem {
  name: string;
  quantity: number;
  unit: string;
  userId:  number | null;
}


