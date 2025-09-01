<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { NavItem } from '@/types/types';

const router = useRouter();
const route = useRoute();
const model = ref<string | null>((route.name as string) ?? null);
const order: string[] = ['home', 'stock', 'ingredients', 'shopping-list', 'recepie','auth'];
const labels: Record<string, string> = {
  home: 'Start',
  stock: 'Vorrat',
  ingredients: 'Zutaten',
  'shopping-list': 'Einkauf',
  recepie: 'Rezepte',
  auth: 'Anmelden',
};

const items = computed<NavItem[]>(() => {
  const routes = router
    .getRoutes()
    .filter((r) => r.name && typeof r.name === 'string')
    .filter((r) => !r.path.includes(':') && !r.path.startsWith('/_'));

  const map = new Map(routes.map((r) => [r.name as string, r]));
  return order
    .filter((name) => map.has(name))
    .map((name) => {
      const r = map.get(name)!;
      return {
        name,
        path: r.path,
        label: labels[name] ?? name,
      };
    });
});

watch(
  () => route.name,
  (n) => (model.value = (n as string) ?? null),
);

async function onUpdate(val: string | null) {
  if (!val) return;
  await router.push({ name: val });
}
</script>
<template>
  <v-layout>
    <v-bottom-navigation
      location="bottom"
      :elevation="0"
      :model-value="model"
      @update:model-value="onUpdate">
      <v-btn
        v-for="it in items"
        :key="it.name"
        :value="it.name"
        :to="{ name: it.name }"
        variant="text">
        <span>{{ it.label }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
