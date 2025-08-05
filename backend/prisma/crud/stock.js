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

  return stockItems.map((item) => ({
    id: item.id,
    name: item.ingredient.name,
    quantity: parseInt(item.quantity) || 0,
    unit: 'Stück',
  }));
}

async function updateStock(id, data) {
  const { name, quantity, unit, userId } = data;

  // Get the current stock item to access its relations
  const currentStock = await prisma.stock.findUnique({
    where: { id },
    include: { ingredient: true },
  });

  if (!currentStock) {
    throw new Error('Stock item not found');
  }

  let ingredientId = currentStock.ingredient.id;

  // If name is provided and different from current ingredient name,
  // find or create the ingredient
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

  // Update the stock with the correct data structure
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

  // Return the data in the same format as getStockByUser
  return {
    id: updatedStock.id,
    name: updatedStock.ingredient.name,
    quantity: parseInt(updatedStock.quantity) || 0,
    unit: unit || 'Stück',
  };
}

async function deleteStock(id) {
  return prisma.stock.delete({ where: { id } });
}

export { createStock, getStockByUser, updateStock, deleteStock };
