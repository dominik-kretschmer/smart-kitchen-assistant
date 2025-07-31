// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createUser(data) {
  return prisma.user.create({ data });
}

async function getUser(id) {
  return prisma.user.findUnique({
    where: { id },
    include: {
      stock: {
        include: {
          ingredient: true
        }
      },
      recipes: {
        include: {
          recipeIngredients: {
            include: {
              ingredient: true
            }
          }
        }
      },
      shoppingLists: {
        include: {
          ingredient: true
        }
      }
    }
  });
}


async function deleteUser(id) {
  return prisma.$transaction(async (tx) => {
    await tx.shoppingList.deleteMany({
      where: { userId: id }
    });

    await tx.stock.deleteMany({
      where: { userId: id }
    });

    const recipes = await tx.recipe.findMany({
      where: { userId: id },
      select: { id: true }
    });

    if (recipes.length > 0) {
      const recipeIds = recipes.map(recipe => recipe.id);
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: { in: recipeIds } }
      });
    }

    await tx.recipe.deleteMany({
      where: { userId: id }
    });

    return tx.user.delete({
      where: { id }
    });
  });
}

module.exports = {
  createUser,
  getUser,
  deleteUser,
};
