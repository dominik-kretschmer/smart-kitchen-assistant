<script setup lang="ts">
import { recipeService } from '@/services/recipeService';
import { computed, onMounted, ref } from 'vue';
import type { Recipe } from '@/types/types';

const items = ref<Recipe[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const page = ref(1);
const itemsPerPage = ref(12);
const pageCount = computed(() => Math.max(1, Math.ceil(items.value.length / itemsPerPage.value)));

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return items.value.slice(start, start + itemsPerPage.value);
});

async function load() {
  loading.value = true;
  error.value = null;
  try {
    items.value = await recipeService.getAllRecipes();
    if (page.value > pageCount.value) page.value = 1;
  } catch {
    error.value = 'Fehler beim Laden der Zutaten';
  } finally {
    loading.value = false;
  }
}
onMounted(load);
</script>

<template>
  {{ items }}
</template>
