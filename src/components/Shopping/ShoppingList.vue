<script setup lang="ts">
import { onMounted, ref } from 'vue';
import ShoppingListItem from '@/components/Shopping/ShoppingListItem.vue';
import ShoppingAddForm from '@/components/Shopping/ShoppingAddForm.vue';
import { shoppingListService } from '@/services/shoppingListService';
import type { ShoppingListItem as ShoppingListItemType } from '@/types/types';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
const items = ref<ShoppingListItemType[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

async function load() {
  error.value = null;
  try {
    loading.value = true;
    userStore.initUser();
    const userId = userStore.getUserId;
    if (!userId) {
      error.value = 'Nicht eingeloggt';
      return;
    }
    const data = await shoppingListService.getShoppingListByUser(userId);
    items.value = data as ShoppingListItemType[];
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  } finally {
    loading.value = false;
  }
}

onMounted(load);

async function handleAdd(payload: { ingredientId: number; ingredient: { id: number; name?: string }; amount: number; unit: string }) {
  try {
    const created = await shoppingListService.createShoppingListItem({ ingredient: payload.ingredient, amount: payload.amount, unit: payload.unit });
    items.value = [...items.value, created as ShoppingListItemType];
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}

async function handleUpdate(id: number, patch: Partial<ShoppingListItemType>) {
  try {
    const updated = await shoppingListService.updateShoppingListItem(id, patch);
    items.value = items.value.map((it) => (it.id === id ? (updated as ShoppingListItemType) : it));
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}

async function handleDelete(id: number) {
  try {
    const ok = await shoppingListService.deleteShoppingListItem(id);
    if (ok) items.value = items.value.filter((it) => it.id !== id);
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : String(e);
  }
}
</script>

<template>
  <v-card variant="flat">
    <v-card-title class="d-flex align-center justify-space-between">
      <span>Einkaufsliste</span>
      <ShoppingAddForm @submit="handleAdd" />
    </v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error" variant="tonal" class="mb-4">{{ error }}</v-alert>
      <v-skeleton-loader v-if="loading" type="list-item@3" />
      <template v-else>
        <v-list v-if="items.length">
          <ShoppingListItem v-for="it in items" :key="it.id" :item="it" @update="handleUpdate" @delete="handleDelete" />
        </v-list>
        <v-alert v-else type="info" variant="tonal">Noch keine Einträge. Füge Zutaten zur Einkaufsliste hinzu.</v-alert>
      </template>
    </v-card-text>
  </v-card>
</template>
