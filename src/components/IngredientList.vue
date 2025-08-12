<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ingredientService } from '@/services/ingredientService';
import type { Ingredient } from '@/types/types';

const items = ref<Ingredient[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const page = ref(1);
const itemsPerPage = ref(12);

const pageCount = computed(() => {
  if (!items.value.length) return 1;
  return Math.ceil(items.value.length / itemsPerPage.value);
});

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return items.value.slice(start, start + itemsPerPage.value);
});

async function load() {
  loading.value = true;
  error.value = null;
  try {
    items.value = await ingredientService.getAllIngredients();
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
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between">
        <span>Zutaten</span>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>
        <v-skeleton-loader v-if="loading" type="image, article, actions" class="mb-4" />
        <v-row v-else-if="paginatedItems.length" dense>
          <v-col v-for="(ing, idx) in paginatedItems" :key="idx" cols="12" sm="6" md="4" lg="3">
            <v-card variant="outlined">
              <v-card-title class="text-wrap">
                {{ ing.name }}
              </v-card-title>
              <v-card-text class="text-body-2">
                <div>Kalorien: {{ ing.calories ?? '—' }}</div>
                <div>Protein: {{ ing.protein ?? '—' }} g</div>
                <div>Fett: {{ ing.fat ?? '—' }} g</div>
                <div>Kohlenhydrate: {{ ing.carbs ?? '—' }} g</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div v-else class="text-medium-emphasis">Keine Zutaten vorhanden.</div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <v-pagination v-model="page" :length="pageCount" :total-visible="7" />
      </v-card-actions>
    </v-card>
  </v-container>
</template>
