import { PrismaClient, ShoppingList } from '@prisma/client';
const prisma = new PrismaClient();

interface ShoppingListData {
  userId: number;
  ingredientId: number;
  quantity?: number;
}

async function createShoppingList(data: ShoppingListData): Promise<ShoppingList> {
  return prisma.shoppingList.create({
    data,
    include: {
      user: true,
      ingredient: true,
    },
  });
}

async function getShoppingListsByUser(userId: number): Promise<ShoppingList[]> {
  return prisma.shoppingList.findMany({
    where: { userId },
    include: {
      ingredient: true,
    },
  });
}

async function updateShoppingList(
  id: number,
  data: Partial<ShoppingListData>,
): Promise<ShoppingList> {
  return prisma.shoppingList.update({
    where: { id },
    data,
    include: {
      user: true,
      ingredient: true,
    },
  });
}

async function deleteShoppingList(id: number): Promise<ShoppingList> {
  return prisma.shoppingList.delete({ where: { id } });
}

export { createShoppingList, getShoppingListsByUser, updateShoppingList, deleteShoppingList };
