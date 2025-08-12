import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomePage.vue') },
  { path: '/auth', name: 'auth', component: () => import('@/views/AuthPage.vue') },
  { path: '/stock', name: 'stock', component: () => import('@/views/StockPage.vue') },
  { path: '/ingredients', name: 'ingredients', component: () => import('@/views/IngredientPage.vue') },
  { path: '/shopping-list', name: 'shopping-list', component: () => import('@/views/ShoppingListPage.vue') },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
