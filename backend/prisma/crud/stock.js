import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createStock(data) {
  const { name, userId, quantity } = data;

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

  const createdStock = await prisma.stock.create({
    data: {
      quantity: quantity.toString(),
      user: {
        connect: { id: userId },
      },
      ingredient: {
        connect: { id: ingredient.id },
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

async function getStockByUser(userId) {
  const stockItems = await prisma.stock.findMany({
    where: { userId },
    include: {
      ingredient: true,
    },
  });

  return stockItems.map(item => ({
    id: item.id,
    name: item.ingredient.name,
    quantity: parseInt(item.quantity) || 0,
    unit: 'Stück',
  }));
}

async function updateStock(id, data) {
  return prisma.stock.update({
    where: { id },
    data,
    include: {
      user: true,
      ingredient: true,
    },
  });
}

async function deleteStock(id) {
  return prisma.stock.delete({ where: { id } });
}

export { createStock, getStockByUser, updateStock, deleteStock };
