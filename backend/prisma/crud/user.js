// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// CREATE
async function createUser(data) {
  return prisma.user.create({ data });
}

// READ (get by id)
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

// READ ALL
async function getAllUsers() {
  return prisma.user.findMany({
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

// UPDATE
async function updateUser(id, data) {
  return prisma.user.update({ where: { id }, data });
}

// DELETE
async function deleteUser(id) {
  // Delete the user and all related data in a transaction
  return prisma.$transaction(async (tx) => {
    // Delete all shopping lists for this user
    await tx.shoppingList.deleteMany({
      where: { userId: id }
    });

    // Delete all stock entries for this user
    await tx.stock.deleteMany({
      where: { userId: id }
    });

    // Get all recipes for this user
    const recipes = await tx.recipe.findMany({
      where: { userId: id },
      select: { id: true }
    });

    // Delete all recipe ingredients for this user's recipes
    if (recipes.length > 0) {
      const recipeIds = recipes.map(recipe => recipe.id);
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: { in: recipeIds } }
      });
    }

    // Delete all recipes for this user
    await tx.recipe.deleteMany({
      where: { userId: id }
    });

    // Finally, delete the user
    return tx.user.delete({
      where: { id }
    });
  });
}

module.exports = {
  createUser,
  getUser,
  getAllUsers,
  updateUser,
  deleteUser,
};
