import express from 'express';
const router = express.Router();
import {
  createIngredient,
  getIngredient,
  getAllIngredients,
  updateIngredient,
} from '../prisma/crud/ingredient.js';

router.post('/', async (req, res) => {
  try {
    const ingredient = await createIngredient(req.body);
    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create ingredient' });
  }
});

router.get('/', async (req, res) => {
  try {
    const ingredients = await getAllIngredients();
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ingredients' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const ingredient = await getIngredient(parseInt(req.params.id));
    if (!ingredient) {
      return res.status(404).json({ error: 'FullIngredient not found' });
    }
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get ingredient' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const ingredient = await updateIngredient(parseInt(req.params.id), req.body);
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update ingredient' });
  }
});

export default router;
