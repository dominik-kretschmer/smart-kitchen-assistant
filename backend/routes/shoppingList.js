// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
const router = express.Router();
const {
  createShoppingList,
  getShoppingList,
  getShoppingListsByUser,
  getAllShoppingLists,
  updateShoppingList,
  deleteShoppingList
} = require('../prisma/crud/shoppingList');

// Create a new shopping list item
router.post('/', async (req, res) => {
  try {
    const shoppingListItem = await createShoppingList(req.body);
    res.status(201).json(shoppingListItem);
  } catch (error) {
    console.error('Error creating shopping list item:', error);
    res.status(500).json({ error: 'Failed to create shopping list item' });
  }
});

// Get all shopping list items
router.get('/', async (req, res) => {
  try {
    const shoppingListItems = await getAllShoppingLists();
    res.json(shoppingListItems);
  } catch (error) {
    console.error('Error getting shopping list items:', error);
    res.status(500).json({ error: 'Failed to get shopping list items' });
  }
});

// Get a specific shopping list item by ID
router.get('/:id', async (req, res) => {
  try {
    const shoppingListItem = await getShoppingList(parseInt(req.params.id));
    if (!shoppingListItem) {
      return res.status(404).json({ error: 'Shopping list item not found' });
    }
    res.json(shoppingListItem);
  } catch (error) {
    console.error('Error getting shopping list item:', error);
    res.status(500).json({ error: 'Failed to get shopping list item' });
  }
});

// Get shopping list items by user ID
router.get('/user/:userId', async (req, res) => {
  try {
    const shoppingListItems = await getShoppingListsByUser(parseInt(req.params.userId));
    res.json(shoppingListItems);
  } catch (error) {
    console.error('Error getting shopping list items by user:', error);
    res.status(500).json({ error: 'Failed to get shopping list items by user' });
  }
});

// Update a shopping list item
router.put('/:id', async (req, res) => {
  try {
    const shoppingListItem = await updateShoppingList(parseInt(req.params.id), req.body);
    res.json(shoppingListItem);
  } catch (error) {
    console.error('Error updating shopping list item:', error);
    res.status(500).json({ error: 'Failed to update shopping list item' });
  }
});

// Delete a shopping list item
router.delete('/:id', async (req, res) => {
  try {
    await deleteShoppingList(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting shopping list item:', error);
    res.status(500).json({ error: 'Failed to delete shopping list item' });
  }
});

module.exports = router;
