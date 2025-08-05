<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from '../i18n';

const { t } = useI18n();
const items = ref([]);
const error = ref('');

async function fetchRecipes() {
  try {
    const response = await fetch('http://localhost:3000/api/ingredients');
    if (!response.ok) {
      throw new Error(`${t('errors.httpError')}: ${response.status} ${response.statusText}`);
    }
    items.value = await response.json();
  } catch (err) {
    error.value = `${t('errors.failedToLoadIngredients')} ${err}`;
  }
}

onMounted(() => {
  fetchRecipes();
});
</script>
<template>
  <v-container class="bg-surface-variant">
    <v-row no-gutters>
      <v-col v-for="item in items" :key="item.id" cols="12" sm="6">
        <v-sheet class="ma-2 pa-2">
          <div class="font-weight-bold">{{ item.name }}</div>
          <div>{{ t('ingredients.calories') }}: {{ item.calories }}</div>
          <div>{{ t('ingredients.carbs') }}: {{ item.carbs }}g</div>
          <div>{{ t('ingredients.fat') }}: {{ item.fat }}g</div>
          <div>{{ t('ingredients.protein') }}: {{ item.protein }}g</div>
        </v-sheet>
      </v-col>
    </v-row>
    <v-alert v-if="error" type="error" class="mt-4">
      {{ error }}
    </v-alert>
  </v-container>
</template>
