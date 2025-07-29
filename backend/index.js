/* eslint-disable @typescript-eslint/no-require-imports */
const express = require('express');
const app = express();
const PORT = 3000;

const recipeRoutes = require('./routes/recipe');
const ingredientRoutes = require('./routes/ingredient');
const userRoutes = require('./routes/user');
const shoppingListRoutes = require('./routes/shoppingList');
const stockRoutes = require('./routes/stock');

app.use(express.json());

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hallo von Express!'});
});

app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shopping-lists', shoppingListRoutes);
app.use('/api/stock', stockRoutes);

app.listen(PORT, () => {
  console.log(`Express-API läuft auf http://localhost:${PORT}`);
  console.log('Available API endpoints:');
  console.log('- GET /api/hello');
  console.log('- GET, POST /api/recipes');
  console.log('- GET, PUT, DELETE /api/recipes/:id');
  console.log('- GET, POST /api/ingredients');
  console.log('- GET, PUT, DELETE /api/ingredients/:id');
  console.log('- GET, POST /api/users');
  console.log('- GET, PUT, DELETE /api/users/:id');
  console.log('- GET, POST /api/shopping-lists');
  console.log('- GET, PUT, DELETE /api/shopping-lists/:id');
  console.log('- GET /api/shopping-lists/user/:userId');
  console.log('- GET, POST /api/stock');
  console.log('- GET, PUT, DELETE /api/stock/:id');
  console.log('- GET /api/stock/user/:userId');
});
