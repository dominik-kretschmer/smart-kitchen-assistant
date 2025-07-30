<script setup lang="ts">
import { onMounted, ref } from 'vue'

const items = ref([])

async function fetchRecipes() {
  try {
    const response = await fetch('http://localhost:3000/api/ingredients')
    if (!response.ok) {
      throw new Error(`HTTP-Fehler: ${response.status} ${response.statusText}`)
    }
    items.value = await response.json()
  } catch (err) {
    alert('Fehler beim Laden der Rezepte:'+ err)
  }
}

onMounted(() => {
  fetchRecipes()
})
</script>
<template>
  <v-container class="bg-surface-variant">
    <v-row no-gutters>
      <v-col
        v-for="item in items"
        :key="item.id"
        cols="12"
        sm="6">
        <v-sheet class="ma-2 pa-2">
          <div class="font-weight-bold">{{ item.name }}</div>
          <div>Kalorien: {{ item.calories }}</div>
          <div>Kohlenhydrate: {{ item.carbs }}g</div>
          <div>Fett: {{ item.fat }}g</div>
          <div>Protein: {{ item.protein }}g</div>
        </v-sheet>
      </v-col>
    </v-row>
    <v-alert
      v-if="error"
      type="error"
      class="mt-4"
    >
      {{ error }}
    </v-alert>
  </v-container>
</template>
