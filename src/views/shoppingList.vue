<script setup lang="ts">
const { t } = useI18n();
const loading = ref(false);
const error = ref('');
const shoppingItems = ref<ShoppingListItem[]>([
  {
    id: 1,
    amount: 500,
    unit: 'g',
    ingredient: { id: 1, name: 'Ground Beef' },
  },
  {
    id: 2,
    amount: 1,
    unit: 'kg',
    ingredient: { id: 2, name: 'Potatoes' },
  },
  {
    id: 3,
    amount: 250,
    unit: 'g',
    ingredient: { id: 3, name: 'Mushrooms' },
  },
  {
    id: 4,
    amount: 2,
    unit: t('units.piece'),
    ingredient: { id: 4, name: 'Onions' },
  },
  {
    id: 5,
    amount: 1,
    unit: 'l',
    ingredient: { id: 5, name: 'Milk' },
  },
  {
    id: 6,
    amount: 6,
    unit: t('units.piece'),
    ingredient: { id: 6, name: 'Eggs' },
  },
]);
</script>
<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">{{ t('shoppingList.title') }}</h1>
    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = ''">
      {{ error }}
    </v-alert>

    <div class="mt-6">
      <h2 class="text-xl font-semibold mb-3">{{ t('shoppingList.myList') }}</h2>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
        class="d-block mx-auto my-8"></v-progress-circular>
      <div v-else>
        <v-list v-if="shoppingItems.length > 0" class="bg-transparent">
          <v-list-item v-for="item in shoppingItems" :key="item.id">
            <v-list-item-title>{{ item.ingredient.name }}</v-list-item-title>
            <v-list-item-subtitle>{{ item.amount }} {{ item.unit }}</v-list-item-subtitle>
            <div class="d-flex">
              <v-checkbox :label="t('shoppingList.purchased')" hide-details></v-checkbox>
            </div>
          </v-list-item>
        </v-list>
        <p v-else class="text-center py-4 text-gray-500">{{ t('shoppingList.noItems') }}</p>
      </div>
    </div>
  </div>
</template>
