// eslint-disable-next-line @typescript-eslint/no-require-imports
const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getRecipe,
  getAllRecipes,
  updateRecipe,
  deleteRecipe
} = require('../prisma/crud/recipe');

// Create a new recipe
router.post('/', async (req, res) => {
  try {
    const recipe = await createRecipe(req.body);
    res.status(201).json(recipe);
  } catch (error) {
    console.error('Error creating recipe:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Get all recipes
router.get('/', async (req, res) => {
  try {
    const recipes = await getAllRecipes();
    res.json(recipes);
  } catch (error) {
    console.error('Error getting recipes:', error);
    res.status(500).json({ error: 'Failed to get recipes' });
  }
});

// Get a specific recipe by ID
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

// Update a recipe
router.put('/:id', async (req, res) => {
  try {
    const recipe = await updateRecipe(parseInt(req.params.id), req.body);
    res.json(recipe);
  } catch (error) {
    console.error('Error updating recipe:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete a recipe
router.delete('/:id', async (req, res) => {
  try {
    await deleteRecipe(parseInt(req.params.id));
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

module.exports = router;
