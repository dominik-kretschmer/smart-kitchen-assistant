import { createMemoryHistory, createRouter } from 'vue-router'
import homePage from '../views/homePage.vue'
import stock from '../views/stock.vue'
import recipe from '../views/recipe.vue'
import shoppingList from '../views/shoppingList.vue'

const routes = [
  { path: '/', component: homePage },
  { path: '/stock', component: stock },
  { path: '/recipe', component: recipe },
  { path: '/shoppingList', component: shoppingList },
]

export const router = createRouter({
  history: createMemoryHistory(),
  routes,
})
