import { PrismaClient, User } from '@prisma/client';
import { UserData } from '../../types/types';
const prisma = new PrismaClient();

async function createUser(data: UserData): Promise<User> {
  return prisma.user.create({ data });
}

async function getUser(id: number): Promise<User | null> {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function deleteUser(id: number): Promise<User> {
  return prisma.$transaction(async (tx) => {
    await tx.shoppingList.deleteMany({
      where: { userId: id },
    });

    await tx.stock.deleteMany({
      where: { userId: id },
    });

    const recipes = await tx.recipe.findMany({
      where: { userId: id },
      select: { id: true },
    });

    if (recipes.length > 0) {
      const recipeIds = recipes.map((recipe) => recipe.id);
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: { in: recipeIds } },
      });
    }

    await tx.recipe.deleteMany({
      where: { userId: id },
    });

    return tx.user.delete({
      where: { id },
    });
  });
}

export { createUser, getUser, deleteUser };
