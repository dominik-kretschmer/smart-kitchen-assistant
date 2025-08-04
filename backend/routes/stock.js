import express from 'express';
const router = express.Router();
import { createStock, getStockByUser, updateStock, deleteStock } from '../prisma/crud/stock.js';

router.post('/', async (req, res) => {
  try {
    const stockItem = await createStock(req.body);
    res.status(201).json(stockItem);
  } catch (error) {
    console.error('Error creating stock item:', error);
    res.status(500).json({ error: 'Failed to create stock item' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const stockItems = await getStockByUser(parseInt(req.params.userId));
    console.log(stockItems);
    res.json(stockItems);
  } catch (error) {
    console.error('Error getting stock items by user:', error);
    res.status(500).json({ error: 'Failed to get stock items by user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const stockItem = await updateStock(parseInt(req.params.id), req.body);
    res.json(stockItem);
  } catch (error) {
    console.error('Error updating stock item:', error);
    res.status(500).json({ error: 'Failed to update stock item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteStock(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting stock item:', error);
    res.status(500).json({ error: 'Failed to delete stock item' });
  }
});

export default router;
