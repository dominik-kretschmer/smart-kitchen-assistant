<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { stockService } from '@/services/stockService';

export interface StockListItem {
  id?: number;
  ingredientId?: number;
  ingredient?: { name?: string | null } | null;
  name?: string | null;
  quantity: string;
}

const items = ref<StockListItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const page = ref(1);
const itemsPerPage = ref(8);

const pageCount = computed(() => Math.max(1, Math.ceil(items.value.length / itemsPerPage.value)));

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return items.value.slice(start, start + itemsPerPage.value);
});

function displayName(item: StockListItem) {
  return item.ingredient?.name ?? item.name ?? '—';
}

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const userStore = useUserStore();
    const userId = userStore.getUserId;
    if (!userId) {
      return (items.value = []);
    }
    items.value = userId ? await stockService.getStockByUser(userId) : [];
    if (page.value > pageCount.value) page.value = 1;
  } catch (e: unknown) {
    error.value = (e as Error)?.message;
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
        <span>Deine Vorräte</span>
      </v-card-title>
      <v-card-text>
        <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
          {{ error }}
        </v-alert>
        <v-skeleton-loader v-if="loading" type="image, article, actions" class="mb-4" />
        <v-row v-else-if="paginatedItems.length" dense>
          <v-col
            v-for="(s, idx) in paginatedItems"
            :key="s.id ?? idx"
            cols="12"
            sm="6"
            md="4"
            lg="3">
            <v-card variant="outlined">
              <v-card-title class="text-wrap">
                {{ displayName(s) }}
              </v-card-title>
              <v-card-text class="text-body-2">
                <div>Menge: {{ s.quantity }}</div>
                <div v-if="s.ingredientId">Ingredient-ID: {{ s.ingredientId }}</div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
        <div v-else class="text-medium-emphasis">Keine Vorräte vorhanden.</div>
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <v-pagination v-model="page" :length="pageCount" :total-visible="7" />
      </v-card-actions>
    </v-card>
  </v-container>
</template>
