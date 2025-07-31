import express from 'express';
const router = express.Router();
import { createRecipe, getRecipe, getAllRecipes, updateRecipe } from '../prisma/crud/recipe.js';

router.post('/', async (req, res) => {
  try {
    const recipe = await createRecipe(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

router.get('/', async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (error) {
    console.error('Error getting recipes:', error);
    res.status(500).json({ error: 'Failed to get recipes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await getRecipe(parseInt(req.params.id));
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }
    res.json(recipe);
  } catch (error) {
    console.error('Error getting recipe:', error);
    res.status(500).json({ error: 'Failed to get recipe' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const recipe = await updateRecipe(parseInt(req.params.id), req.body);
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

export default router;
