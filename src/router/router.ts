import { createWebHistory, createRouter } from 'vue-router';

const routes = [
  { path: '/', component: () => import('../views/homePage.vue') },
  { path: '/stock', component: () => import('../views/stockList.vue') },
  { path: '/recipe', component: () => import('../views/recipeList.vue') },
  { path: '/shoppingList', component: () => import('../views/shoppingList.vue') },
  { path: '/login', component: () => import('../views/LoginPage.vue') },
  { path: '/register', component: () => import('../views/RegisterPage.vue') },
  { path: '/ingredients', component: () => import('../views/ingredientList.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
