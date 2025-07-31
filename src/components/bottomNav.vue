<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

const routes = ['/', '/recipe', '/shoppingList', '/stock', '/login', '/register'];

const value = computed({
  get: () => routes.indexOf(route.path),
  set: (index: number) => {
    if (routes[index]) {
      router.replace(routes[index]);
    }
  },
});

const color = computed(() => {
  switch (route.path) {
    case '/':
      return 'blue-grey';
    case '/recipe':
      return 'teal';
    case '/shoppingList':
      return 'brown';
    case '/stock':
      return 'indigo';
    case '/login':
      return 'purple';
    case '/register':
      return 'deep-orange';
    default:
      return 'blue-grey';
  }
});
</script>

<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation v-model="value" :bg-color="color" mode="shift">
      <v-btn>
        <v-icon>mdi-television-play</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-book</v-icon>
        <span>Recipe</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-cart</v-icon>
        <span>Shopping</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-warehouse</v-icon>
        <span>Stock</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-login</v-icon>
        <span>Login</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-account-plus</v-icon>
        <span>Register</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
