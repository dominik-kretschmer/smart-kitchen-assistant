<script setup lang="ts">
import { computed, ref } from 'vue'

const value = ref(1)
const color = computed(() => {
  switch (value.value) {
    case 0: return 'blue-grey'
    case 1: return 'teal'
    case 2: return 'brown'
    case 3: return 'indigo'
    default: return 'blue-grey'
  }
})
</script>

<template>
  <v-layout class="overflow-visible" style="height: 56px;">
    <v-bottom-navigation
      v-model="value"
      :bg-color="color"
      mode="shift"
    >
      <v-btn to="/" replace>
        <v-icon>mdi-television-play</v-icon>
        <span>Home</span>
      </v-btn>
      <v-btn to="/recipe" replace>
        <v-icon>mdi-book</v-icon>
        <span>Recipe</span>
      </v-btn>
      <v-btn to="/shoppingList" replace>
        <v-icon>mdi-cart</v-icon>
        <span>Shopping List</span>
      </v-btn>
      <v-btn to="/stock" replace>
        <v-icon>mdi-warehouse</v-icon>
        <span>Stock</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
