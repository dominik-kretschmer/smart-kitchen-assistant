import { PrismaClient, Ingredient } from '@prisma/client';
const prisma = new PrismaClient();

interface IngredientData {
  name: string;
  calories: number;
  carbs: number;
  fat: number;
  protein: number;
}

async function createIngredient(data: IngredientData): Promise<Ingredient> {
  return prisma.ingredient.create({ data });
}

async function getIngredient(id: number): Promise<Ingredient | null> {
  return prisma.ingredient.findUnique({
    where: { id },
    include: {
      recipeIngredients: {
        include: {
          recipe: true,
        },
      },
      shoppingLists: {
        include: {
          user: true,
        },
      },
      stock: {
        include: {
          user: true,
        },
      },
    },
  });
}

async function getAllIngredients(): Promise<Ingredient[]> {
  return prisma.ingredient.findMany({
    include: {
      recipeIngredients: {
        include: {
          recipe: true,
        },
      },
      shoppingLists: {
        include: {
          user: true,
        },
      },
      stock: {
        include: {
          user: true,
        },
      },
    },
  });
}

async function updateIngredient(id: number, data: Partial<IngredientData>): Promise<Ingredient> {
  return prisma.ingredient.update({
    where: { id },
    data,
    include: {
      recipeIngredients: {
        include: {
          recipe: true,
        },
      },
      shoppingLists: {
        include: {
          user: true,
        },
      },
      stock: {
        include: {
          user: true,
        },
      },
    },
  });
}

export { createIngredient, getIngredient, getAllIngredients, updateIngredient };
