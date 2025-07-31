import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createShoppingList(data) {
  return prisma.shoppingList.create({
    data,
    include: {
      user: true,
      ingredient: true,
    },
  });
}

async function getShoppingListsByUser(userId) {
  return prisma.shoppingList.findMany({
    where: { userId },
    include: {
      ingredient: true,
    },
  });
}

async function updateShoppingList(id, data) {
  return prisma.shoppingList.update({
    where: { id },
    data,
    include: {
      user: true,
      ingredient: true,
    },
  });
}

async function deleteShoppingList(id) {
  return prisma.shoppingList.delete({ where: { id } });
}

export { createShoppingList, getShoppingListsByUser, updateShoppingList, deleteShoppingList };
