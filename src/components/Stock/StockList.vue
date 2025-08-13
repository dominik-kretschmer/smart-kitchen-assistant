<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { stockService } from '@/services/stockService';
import BaseList from '@/components/Base/BaseList.vue';
import StockDelet from '@/components/Stock/StockDelet.vue';
import type { StockListItem } from '@/types/types';

//todo add decrease and increase change database structure
const items = ref<StockListItem[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const page = ref(1);
const itemsPerPage = ref(8);
const pageCount = computed(() => Math.max(1, Math.ceil(items.value.length / itemsPerPage.value)));
const showDelete = ref(false);
const selectedItem = ref<StockListItem | null>(null);

const paginatedItems = computed(() => {
  const start = (page.value - 1) * itemsPerPage.value;
  return items.value.slice(start, start + itemsPerPage.value);
});

async function load() {
  loading.value = true;
  error.value = null;
  try {
    const userStore = useUserStore();
    const userId = userStore.getUserId;
    if (!userId) {
      items.value = [];
      return;
    }
    items.value = await stockService.getStockByUser(userId);
    if (page.value > pageCount.value) page.value = 1;
  } catch (e: unknown) {
    error.value = (e as Error)?.message ?? 'Unbekannter Fehler';
  } finally {
    loading.value = false;
  }
}

function openDeleteDialog(item: StockListItem) {
  selectedItem.value = item;
  showDelete.value = true;
}
onMounted(load);
</script>
<template>
  <BaseList v-model:page="page" :page-count="pageCount">
    <template #title>Deine Vorräte</template>
    <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
      {{ error }}
    </v-alert>
    <v-skeleton-loader v-if="loading" type="image, article, actions" class="mb-4" />
    <v-row v-else-if="paginatedItems.length" dense>
      <v-col v-for="(s, idx) in paginatedItems" :key="s.id ?? idx" cols="12" sm="6" md="4" lg="3">
        <v-card variant="outlined">
          <v-card-title class="text-wrap">
            {{ s.name }}
          </v-card-title>
          <v-card-text class="text-body-2">
            <div>Menge: {{ s.quantity }}</div>
            <div v-if="s.ingredientId">Ingredient-ID: {{ s.ingredientId }}</div>
          </v-card-text>
          <v-card-actions>
            <v-btn variant="text" aria-label="Menge um 1 reduzieren (Plus)"> + </v-btn>
            <v-btn variant="text" aria-label="Menge um 1 reduzieren (Minus)"> - </v-btn>
            <v-spacer />
            <v-btn color="error" variant="text" @click="openDeleteDialog(s)" aria-label="Löschen">
              Löschen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <div v-else class="text-medium-emphasis">Keine Vorräte vorhanden.</div>
  </BaseList>

  <StockDelet
    v-model="showDelete"
    :item-id="selectedItem?.id ?? null"
    :item-name="selectedItem?.name ?? null"
    @deleted="load" />
</template>
