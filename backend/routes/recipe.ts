import express from 'express';
const router = express.Router();
import { createRecipe, getRecipe, getAllRecipes, updateRecipe } from '../prisma/crud/recipe';

router.post('/', async (req, res) => {
  try {
    const recipe = await createRecipe(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create recipe' + error });
  }
});

router.get('/', async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recipes' + error });
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
    res.status(500).json({ error: 'Failed to get recipe' + error });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const recipe = await updateRecipe(parseInt(req.params.id), req.body);
    res.json(recipe);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update recipe' + error });
  }
});
export default router;
