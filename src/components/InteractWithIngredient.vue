<script setup lang="ts">
import { ref } from 'vue'

const recipeName = ref('')
const description = ref('')
const ingredients = ref([{ name: '', quantity: 1, unit: 'Stück' }])
const steps = ref([''])
const units = ['Stück', 'g', 'kg', 'ml', 'l', 'EL', 'TL', 'Packung']

const emit = defineEmits(['save-recipe'])

function addIngredient() {
  ingredients.value.push({ name: '', quantity: 1, unit: 'Stück' })
}

function removeIngredient(index: number) {
  if (ingredients.value.length > 1) {
    ingredients.value.splice(index, 1)
  }
}

function addStep() {
  steps.value.push('')
}

function removeStep(index: number) {
  if (steps.value.length > 1) {
    steps.value.splice(index, 1)
  }
}

function saveRecipe() {
  if (recipeName.value.trim() &&
      ingredients.value.every(ing => ing.name.trim()) &&
      steps.value.every(step => step.trim())) {

    const recipe = {
      name: recipeName.value,
      description: description.value,
      ingredients: ingredients.value,
      steps: steps.value.filter(step => step.trim())
    }

    emit('save-recipe', recipe)

    // Reset form
    recipeName.value = ''
    description.value = ''
    ingredients.value = [{ name: '', quantity: 1, unit: 'Stück' }]
    steps.value = ['']
  }
}
</script>

<template>
  <div class="create-recipe-form p-4 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-semibold mb-3">Neues Rezept erstellen</h2>
    <v-form @submit.prevent="saveRecipe">
      <v-text-field
        v-model="recipeName"
        label="Rezeptname"
        placeholder="z.B. Spaghetti Bolognese"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        required
      ></v-text-field>

      <v-textarea
        v-model="description"
        label="Beschreibung"
        placeholder="Kurze Beschreibung des Rezepts"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        rows="2"
      ></v-textarea>

      <h3 class="text-lg font-medium mb-2">Zutaten</h3>
      <div v-for="(ingredient, index) in ingredients" :key="index" class="mb-2">
        <v-row>
          <v-col cols="5">
            <v-text-field
              v-model="ingredient.name"
              label="Zutat"
              placeholder="z.B. Tomaten"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model.number="ingredient.quantity"
              label="Menge"
              type="number"
              min="0"
              variant="outlined"
              density="comfortable"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="ingredient.unit"
              :items="units"
              label="Einheit"
              variant="outlined"
              density="comfortable"
            ></v-select>
          </v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              color="error"
              @click="removeIngredient(index)"
              :disabled="ingredients.length <= 1"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn
        prepend-icon="mdi-plus"
        variant="text"
        class="mb-4"
        @click="addIngredient"
      >
        Zutat hinzufügen
      </v-btn>

      <h3 class="text-lg font-medium mb-2">Zubereitungsschritte</h3>
      <div v-for="(step, index) in steps" :key="index" class="mb-2">
        <v-row>
          <v-col cols="11">
            <v-textarea
              v-model="steps[index]"
              :label="`Schritt ${index + 1}`"
              variant="outlined"
              density="comfortable"
              rows="2"
              required
            ></v-textarea>
          </v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              color="error"
              @click="removeStep(index)"
              :disabled="steps.length <= 1"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn
        prepend-icon="mdi-plus"
        variant="text"
        class="mb-4"
        @click="addStep"
      >
        Schritt hinzufügen
      </v-btn>

      <v-btn
        color="primary"
        type="submit"
        block
        class="mt-4"
      >
        Rezept speichern
      </v-btn>
    </v-form>
  </div>
</template>
