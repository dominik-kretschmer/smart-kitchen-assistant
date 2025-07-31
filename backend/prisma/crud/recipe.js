// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createRecipe(data) {
  const { ingredients, ...recipeData } = data;

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.create({
      data: recipeData
    });

    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount,
        recipeId: recipe.id
      }));

      await Promise.all(
        recipeIngredients.map(ri =>
          tx.recipeIngredient.create({ data: ri })
        )
      );
    }

    return tx.recipe.findUnique({
      where: { id: recipe.id },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        },
        user: true
      }
    });
  });
}

async function getRecipe(id) {
  return prisma.recipe.findUnique({
    where: { id },
    include: {
      recipeIngredients: {
        include: {
          ingredient: true
        }
      },
      user: true
    }
  });
}

async function getAllRecipes() {
  return prisma.recipe.findMany({
    include: {
      recipeIngredients: {
        include: {
          ingredient: true
        }
      },
      user: true
    }
  });
}

async function updateRecipe(id, data) {
  const { ingredients, ...recipeData } = data;

  return prisma.$transaction(async (tx) => {
    await tx.recipe.update({
      where: { id },
      data: recipeData
    });

    if (ingredients) {
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: id }
      });

      if (ingredients.length > 0) {
        const recipeIngredients = ingredients.map(ing => ({
          ingredientId: ing.ingredientId,
          amount: ing.amount,
          recipeId: id
        }));

        await Promise.all(
          recipeIngredients.map(ri =>
            tx.recipeIngredient.create({ data: ri })
          )
        );
      }
    }

    return tx.recipe.findUnique({
      where: { id },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true
          }
        },
        user: true
      }
    });
  });
}

module.exports = {
  createRecipe,
  getRecipe,
  getAllRecipes,
  updateRecipe,
};
