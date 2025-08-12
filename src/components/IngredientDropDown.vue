<script setup lang="ts">
import { ref, onMounted, defineModel } from 'vue';
import { ingredientService } from '@/services/ingredientService';
import type { Ingredient } from '@/types/types';

const model = defineModel<Ingredient | null>({ default: null });
const Ingredients = ref<Ingredient[]>([]);

onMounted(async () => {
  try {
    Ingredients.value = await ingredientService.getAllIngredients();
  } catch (e) {
    console.log(e);
  }
});
</script>

<template>
  <v-select
    v-model="model"
    clearable
    label="Zutat"
    :items="Ingredients"
    item-title="name"
    item-value="id"
    return-object
  />
</template>
