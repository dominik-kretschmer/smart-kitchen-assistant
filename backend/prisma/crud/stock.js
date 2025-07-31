// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createStock(data) {
  return prisma.stock.create({
    data,
    include: {
      user: true,
      ingredient: true
    }
  });
}

async function getStockByUser(userId) {
  return prisma.stock.findMany({
    where: { userId },
    include: {
      ingredient: true
    }
  });
}

async function updateStock(id, data) {
  return prisma.stock.update({
    where: { id },
    data,
    include: {
      user: true,
      ingredient: true
    }
  });
}

async function deleteStock(id) {
  return prisma.stock.delete({ where: { id } });
}

module.exports = {
  createStock,
  getStockByUser,
  updateStock,
  deleteStock,
};
