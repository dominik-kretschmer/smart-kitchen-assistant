import express from 'express';
const router = express.Router();
import {
  createShoppingList,
  getShoppingListsByUser,
  updateShoppingList,
  deleteShoppingList,
} from '../prisma/crud/shoppingList.js';

router.post('/', async (req, res) => {
  try {
    const userId = req.cookies.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // Extract ingredient data from request body
    const { ingredient, ...restOfBody } = req.body;

    // Format data with proper connect patterns for both user and ingredient
    const data = {
      ...restOfBody,
      user: {
        connect: { id: parseInt(userId) }
      },
      ingredient: {
        connect: { id: ingredient.id }
      }
    };

    const shoppingListItem = await createShoppingList(data);
    res.status(201).json(shoppingListItem);
  } catch (error) {
    console.error('Error creating shopping list item:', error);
    res.status(500).json({ error: 'Failed to create shopping list item' });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const shoppingListItems = await getShoppingListsByUser(parseInt(req.params.userId));
    res.json(shoppingListItems);
  } catch (error) {
    console.error('Error getting shopping list items by user:', error);
    res.status(500).json({ error: 'Failed to get shopping list items by user' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const shoppingListItem = await updateShoppingList(parseInt(req.params.id), req.body);
    res.json(shoppingListItem);
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    res.status(500).json({ error: 'Failed to update shopping list item' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await deleteShoppingList(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting shopping list item:', error);
    res.status(500).json({ error: 'Failed to delete shopping list item' });
  }
});

export default router;
