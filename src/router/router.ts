import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/HomePage.vue') },
  { path: '/stock', component: () => import('../views/StockPage.vue') },
  { path: '/recipe', component: () => import('../views/RecipePage.vue') },
  { path: '/shoppingList', component: () => import('../views/ShoppinglistPage.vue') },
  { path: '/login', component: () => import('../views/LoginPage.vue') },
  { path: '/register', component: () => import('../views/RegisterPage.vue') },
  { path: '/ingredients', component: () => import('../views/IngredientPage.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
