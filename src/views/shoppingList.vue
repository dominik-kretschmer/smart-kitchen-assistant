<script setup lang="ts">
import { ref, onMounted } from 'vue'
import ListItems from '../components/listItems.vue'

interface ShoppingItem {
  id: number
  name: string
  quantity: number
  unit: string
  checked: boolean
}

const shoppingItems = ref<ShoppingItem[]>([])
const loading = ref(false)
const error = ref('')

// Fetch all shopping list items from the API
async function fetchShoppingItems() {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/shopping-lists')
    if (!response.ok) {
      throw new Error(`Error fetching shopping list items: ${response.statusText}`)
    }

    const data = await response.json()
    shoppingItems.value = data
  } catch (err) {
    console.error('Failed to fetch shopping list items:', err)
    error.value = 'Failed to load shopping list. Please try again later.'
    // Fallback to sample data if API fails
    shoppingItems.value = [
      { id: 1, name: 'Äpfel', quantity: 6, unit: 'Stück', checked: false },
      { id: 2, name: 'Brot', quantity: 1, unit: 'Stück', checked: true },
      { id: 3, name: 'Käse', quantity: 200, unit: 'g', checked: false }
    ]
  } finally {
    loading.value = false
  }
}

// Add a new shopping list item via the API
async function addItem(item: Omit<ShoppingItem, 'id'>) {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch('/api/shopping-lists', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(item)
    })

    if (!response.ok) {
      throw new Error(`Error creating shopping list item: ${response.statusText}`)
    }

    const newItem = await response.json()
    shoppingItems.value.push(newItem)
  } catch (err) {
    console.error('Failed to create shopping list item:', err)
    error.value = 'Failed to add item to shopping list. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Update a shopping list item via the API
async function updateItem(updatedItem: ShoppingItem) {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`/api/shopping-lists/${updatedItem.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedItem)
    })

    if (!response.ok) {
      throw new Error(`Error updating shopping list item: ${response.statusText}`)
    }

    const index = shoppingItems.value.findIndex(item => item.id === updatedItem.id)
    if (index !== -1) {
      shoppingItems.value[index] = updatedItem
    }
  } catch (err) {
    console.error('Failed to update shopping list item:', err)
    error.value = 'Failed to update item. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Delete a shopping list item via the API
async function deleteItem(itemToDelete: ShoppingItem) {
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`/api/shopping-lists/${itemToDelete.id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Error deleting shopping list item: ${response.statusText}`)
    }

    shoppingItems.value = shoppingItems.value.filter(item => item.id !== itemToDelete.id)
  } catch (err) {
    console.error('Failed to delete shopping list item:', err)
    error.value = 'Failed to delete item. Please try again later.'
  } finally {
    loading.value = false
  }
}

// Fetch shopping list items when component is mounted
onMounted(() => {
  fetchShoppingItems()
})
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-bold mb-4">Einkaufsliste</h1>
    <p class="mb-4">Behalte deine Zutaten im Blick und plane deine Einkäufe.</p>

    <v-alert
      v-if="error"
      type="error"
      variant="tonal"
      class="mb-4"
      closable
      @click:close="error = ''"
    >
      {{ error }}
    </v-alert>

    <ListItems
      :items="shoppingItems"
      title="Meine Einkaufsliste"
      :editable="true"
      :disabled="loading"
      @add-item="addItem"
      @update-item="updateItem"
      @delete-item="deleteItem"
    />
  </div>
</template>
