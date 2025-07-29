// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createIngredient(data) {
  return prisma.ingredient.create({ data });
}

async function getIngredient(id) {
  return prisma.ingredient.findUnique({
    where: { id },
    include: {
      recipeIngredients: {
        include: {
          recipe: true
        }
      },
      shoppingLists: {
        include: {
          user: true
        }
      },
      stock: {
        include: {
          user: true
        }
      }
    }
  });
}

async function getAllIngredients() {
  return prisma.ingredient.findMany({
    include: {
      recipeIngredients: {
        include: {
          recipe: true
        }
      },
      shoppingLists: {
        include: {
          user: true
        }
      },
      stock: {
        include: {
          user: true
        }
      }
    }
  });
}

async function updateIngredient(id, data) {
  return prisma.ingredient.update({
    where: { id },
    data,
    include: {
      recipeIngredients: {
        include: {
          recipe: true
        }
      },
      shoppingLists: {
        include: {
          user: true
        }
      },
      stock: {
        include: {
          user: true
        }
      }
    }
  });
}

async function deleteIngredient(id) {
  // Delete the ingredient and all related data in a transaction
  return prisma.$transaction(async (tx) => {
    // Delete all recipe-ingredient relationships
    await tx.recipeIngredient.deleteMany({
      where: { ingredientId: id }
    });

    // Delete all shopping list entries
    await tx.shoppingList.deleteMany({
      where: { ingredientId: id }
    });

    // Delete all stock entries
    await tx.stock.deleteMany({
      where: { ingredientId: id }
    });

    // Finally, delete the ingredient
    return tx.ingredient.delete({
      where: { id }
    });
  });
}

module.exports = {
  createIngredient,
  getIngredient,
  getAllIngredients,
  updateIngredient,
  deleteIngredient,
};
