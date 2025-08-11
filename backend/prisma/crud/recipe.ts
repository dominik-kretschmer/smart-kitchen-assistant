import { PrismaClient, Recipe } from '@prisma/client';
const prisma = new PrismaClient();

interface RecipeIngredient {
  ingredientId: number;
  amount: number;
}

interface RecipeData {
  title: string;
  description?: string;
  instructions?: string;
  userId: number;
  ingredients?: RecipeIngredient[];
}

async function createRecipe(data: RecipeData): Promise<Recipe> {
  const { ingredients, ...recipeData } = data;

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.create({
      data: recipeData,
    });

    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((ing) => ({
        ingredientId: ing.ingredientId,
        amount: ing.amount,
        recipeId: recipe.id,
      }));

      await Promise.all(recipeIngredients.map((ri) => tx.recipeIngredient.create({ data: ri })));
    }

    return tx.recipe.findUnique({
      where: { id: recipe.id },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
        user: true,
      },
    }) as Promise<Recipe>;
  });
}

async function getRecipe(id: number): Promise<Recipe | null> {
  return prisma.recipe.findUnique({
    where: { id },
    include: {
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
      user: true,
    },
  });
}

async function getAllRecipes(): Promise<Recipe[]> {
  return prisma.recipe.findMany({
    include: {
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
      user: true,
    },
  });
}

async function updateRecipe(id: number, data: Partial<RecipeData>): Promise<Recipe> {
  const { ingredients, ...recipeData } = data;

  return prisma.$transaction(async (tx) => {
    await tx.recipe.update({
      where: { id },
      data: recipeData,
    });

    if (ingredients) {
      await tx.recipeIngredient.deleteMany({
        where: { recipeId: id },
      });

      if (ingredients.length > 0) {
        const recipeIngredients = ingredients.map((ing) => ({
          ingredientId: ing.ingredientId,
          amount: ing.amount,
          recipeId: id,
        }));

        await Promise.all(recipeIngredients.map((ri) => tx.recipeIngredient.create({ data: ri })));
      }
    }

    return tx.recipe.findUnique({
      where: { id },
      include: {
        recipeIngredients: {
          include: {
            ingredient: true,
          },
        },
        user: true,
      },
    }) as Promise<Recipe>;
  });
}

export { createRecipe, getRecipe, getAllRecipes, updateRecipe };
