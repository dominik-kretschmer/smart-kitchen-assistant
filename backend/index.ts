import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import recipeRoutes from './routes/recipe.ts';
import ingredientRoutes from './routes/ingredient.ts';
import userRoutes from './routes/user.ts';
import shoppingListRoutes from './routes/shoppingList.ts';
import stockRoutes from './routes/stock.ts';
import authRoutes from './routes/auth.ts';

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
  console.log(`Server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- /api/recipes');
  console.log('- /api/ingredients');
  console.log('- /api/users');
  console.log('- /api/shopping-lists');
  console.log('- /api/stock');
  console.log('- /api/auth');
});
