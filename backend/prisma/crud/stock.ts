import { PrismaClient, Stock } from '@prisma/client';
import { StockData, StockResponse } from '../../types/types';
const prisma = new PrismaClient();

async function createStock(data: StockData): Promise<StockResponse> {
  const { userId, ingredientId, quantity } = data;
  const createdStock = await prisma.stock.create({
    data: {
      quantity: quantity.toString(),
      user: {
        connect: { id: userId },
      },
      ingredient: {
        connect: { id: ingredientId },
      },
    },
    include: {
      ingredient: true,
    },
  });

  return {
    id: createdStock.id,
    name: createdStock.ingredient.name,
    quantity: parseInt(createdStock.quantity) || 0,
    unit: 'Stück',
  };
}

async function getStockByUser(userId: number): Promise<StockResponse[]> {
  const stockItems = await prisma.stock.findMany({
    where: { userId },
    include: {
      ingredient: true,
    },
  });

  return stockItems.map((item) => ({
    id: item.id,
    name: item.ingredient.name,
    quantity: parseInt(item.quantity) || 0,
    unit: 'Stück',
  }));
}

async function updateStock(id: number, data: Partial<StockData>): Promise<StockResponse> {
  const { name, quantity, unit, userId } = data;

  const currentStock = await prisma.stock.findUnique({
    where: { id },
    include: { ingredient: true },
  });

  if (!currentStock) {
    throw new Error('Stock item not found');
  }

  let ingredientId = currentStock.ingredient.id;

  if (name && name !== currentStock.ingredient.name) {
    let ingredient = await prisma.ingredient.findFirst({
      where: { name },
    });

    if (!ingredient) {
      ingredient = await prisma.ingredient.create({
        data: {
          name,
          calories: 0,
          carbs: 0,
          fat: 0,
          protein: 0,
        },
      });
    }

    ingredientId = ingredient.id;
  }

  const updatedStock = await prisma.stock.update({
    where: { id },
    data: {
      quantity: quantity ? quantity.toString() : undefined,
      user: userId
        ? {
            connect: { id: userId },
          }
        : undefined,
      ingredient: {
        connect: { id: ingredientId },
      },
    },
    include: {
      user: true,
      ingredient: true,
    },
  });

  return {
    id: updatedStock.id,
    name: updatedStock.ingredient.name,
    quantity: parseInt(updatedStock.quantity) || 0,
    unit: unit || 'Stück',
  };
}

async function deleteStock(id: number): Promise<Stock> {
  return prisma.stock.delete({ where: { id } });
}

export { createStock, getStockByUser, updateStock, deleteStock };
