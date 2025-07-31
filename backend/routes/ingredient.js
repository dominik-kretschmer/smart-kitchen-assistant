// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
const router = express.Router();
const {
  createIngredient,
  getIngredient,
  getAllIngredients,
  updateIngredient,
} = require('../prisma/crud/ingredient');

router.post('/', async (req, res) => {
  try {
    const ingredient = await createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    console.error('Error creating ingredient:', error);
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

router.get('/', async (req, res) => {
  try {
    const ingredients = await getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    console.error('Error getting ingredients:', error);
    res.status(500).json({ error: 'Failed to get ingredients' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ingredient = await getIngredient(parseInt(req.params.id));
    if (!ingredient) {
      return res.status(404).json({ error: 'Ingredient not found' });
    }
    res.json(ingredient);
  } catch (error) {
    console.error('Error getting ingredient:', error);
    res.status(500).json({ error: 'Failed to get ingredient' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const ingredient = await updateIngredient(parseInt(req.params.id), req.body);
    res.json(ingredient);
  } catch (error) {
    console.error('Error updating ingredient:', error);
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

module.exports = router;
