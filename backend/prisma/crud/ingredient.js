// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function createIngredient(data) {
  return prisma.ingredient.create({ data })
}

async function getIngredient(id) {
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
  })
}

async function getAllIngredients() {
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
  })
}

async function updateIngredient(id, data) {
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
  })
}

module.exports = {
  createIngredient,
  getIngredient,
  getAllIngredients,
  updateIngredient,
}
