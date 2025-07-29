// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
const router = express.Router();
const {
  createStock,
  getStock,
  getStockByUser,
  getAllStock,
  updateStock,
  deleteStock
} = require('../prisma/crud/stock');

// Create a new stock item
router.post('/', async (req, res) => {
  try {
    const stockItem = await createStock(req.body);
    res.status(201).json(stockItem);
  } catch (error) {
    console.error('Error creating stock item:', error);
    res.status(500).json({ error: 'Failed to create stock item' });
  }
});

// Get all stock items
router.get('/', async (req, res) => {
  try {
    const stockItems = await getAllStock();
    res.json(stockItems);
  } catch (error) {
    console.error('Error getting stock items:', error);
    res.status(500).json({ error: 'Failed to get stock items' });
  }
});

// Get a specific stock item by ID
router.get('/:id', async (req, res) => {
  try {
    const stockItem = await getStock(parseInt(req.params.id));
    if (!stockItem) {
      return res.status(404).json({ error: 'Stock item not found' });
    }
    res.json(stockItem);
  } catch (error) {
    console.error('Error getting stock item:', error);
    res.status(500).json({ error: 'Failed to get stock item' });
  }
});

// Get stock items by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const stockItems = await getStockByUser(parseInt(req.params.userId));
    res.json(stockItems);
  } catch (error) {
    console.error('Error getting stock items by user:', error);
    res.status(500).json({ error: 'Failed to get stock items by user' });
  }
});

// Update a stock item
router.put('/:id', async (req, res) => {
  try {
    const stockItem = await updateStock(parseInt(req.params.id), req.body);
    res.json(stockItem);
  } catch (error) {
    console.error('Error updating stock item:', error);
    res.status(500).json({ error: 'Failed to update stock item' });
  }
});

// Delete a stock item
router.delete('/:id', async (req, res) => {
  try {
    await deleteStock(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting stock item:', error);
    res.status(500).json({ error: 'Failed to delete stock item' });
  }
});

module.exports = router;
