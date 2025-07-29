// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createRecipe(data) {
  // Extract ingredients from the data
  const { ingredients, ...recipeData } = data;

  // Create the recipe with its ingredients in a transaction
  return prisma.$transaction(async (tx) => {
    // Create the recipe
    const recipe = await tx.recipe.create({
      data: recipeData
    });

    // If ingredients are provided, create the recipe-ingredient relationships
    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map(ing => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount,
        recipeId: recipe.id
      }));

      // Create all recipe-ingredient relationships
      await Promise.all(
        recipeIngredients.map(ri =>
          tx.recipeIngredient.create({ data: ri })
        )
      );
    }

    // Return the created recipe with its ingredients
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
  // Extract ingredients from the data
  const { ingredients, ...recipeData } = data;

  // Update the recipe with its ingredients in a transaction
  return prisma.$transaction(async (tx) => {
    // Update the recipe
    await tx.recipe.update({
      where: { id },
      data: recipeData
    });

    // If ingredients are provided, update the recipe-ingredient relationships
    if (ingredients) {
      // Delete existing recipe-ingredient relationships
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: id }
      });

      // Create new recipe-ingredient relationships
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

    // Return the updated recipe with its ingredients
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

async function deleteRecipe(id) {
  // Delete the recipe and its ingredients in a transaction
  return prisma.$transaction(async (tx) => {
    // Delete all recipe-ingredient relationships
    await tx.recipeIngredient.deleteMany({
      where: { recipeId: id }
    });

    // Delete the recipe
    return tx.recipe.delete({
      where: { id }
    });
  });
}

module.exports = {
  createRecipe,
  getRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe,
};
