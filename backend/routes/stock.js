import express from 'express';
import { createStock, deleteStock, getStockByUser, updateStock } from '../prisma/crud/stock.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const stockItem = await createStock(req.body);
    res.status(201).json(stockItem);
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create stock item' + error,
    });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const stockItems = await getStockByUser(parseInt(req.params.userId));
    res.json(stockItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get stock items by user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const stockItem = await updateStock(parseInt(req.params.id), req.body);
    res.json(stockItem);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update stock item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteStock(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete stock item' });
  }
});

export default router;
