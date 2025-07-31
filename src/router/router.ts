import { createWebHistory, createRouter } from 'vue-router';
import homePage from '../views/homePage.vue';
import StockList from '../views/stockList.vue';
import RecipeList from '../views/recipeList.vue';
import shoppingList from '../views/shoppingList.vue';
import LoginPage from '../views/LoginPage.vue';
import RegisterPage from '../views/RegisterPage.vue';

const routes = [
  { path: '/', component: homePage },
  { path: '/stock', component: StockList },
  { path: '/recipe', component: RecipeList },
  { path: '/shoppingList', component: shoppingList },
  { path: '/login', component: LoginPage },
  { path: '/register', component: RegisterPage },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
