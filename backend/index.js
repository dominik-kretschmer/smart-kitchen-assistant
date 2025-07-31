import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import recipeRoutes from './routes/recipe.js';
import ingredientRoutes from './routes/ingredient.js';
import userRoutes from './routes/user.js';
import shoppingListRoutes from './routes/shoppingList.js';
import stockRoutes from './routes/stock.js';
import authRoutes from './routes/auth.js';

const app = express();
const PORT = 3000;

app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:5173',
    optionsSuccessStatus: 200,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use('/api/recipes', recipeRoutes);
app.use('/api/ingredients', ingredientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/shopping-lists', shoppingListRoutes);
app.use('/api/stock', stockRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Express-API läuft auf http://localhost:${PORT}`);
  console.log('Available API endpoints:');
  console.log('- GET, POST /api/recipes');
  console.log('- GET, PUT /api/recipes/:id');
  console.log('- GET, POST /api/ingredients');
  console.log('- GET, PUT /api/ingredients/:id');
  console.log('- GET, POST /api/shopping-lists');
  console.log('- GET, PUT, DELETE /api/shopping-lists/:id');
  console.log('- GET /api/shopping-lists/user/:userId');
  console.log('- GET, PUT, DELETE /api/stock/:id');
  console.log('- GET /api/stock/user/:userId');
});
