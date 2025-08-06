<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from '../i18n';

const { t } = useI18n();

const recipeName = ref('');
const description = ref('');
const ingredients = ref([{ name: '', quantity: 1, unit: t('units.piece') }]);
const steps = ref(['']);
const units = [
  t('units.piece'),
  t('units.g'),
  t('units.kg'),
  t('units.ml'),
  t('units.l'),
  t('units.tbsp'),
  t('units.tsp'),
  t('units.package'),
];

const emit = defineEmits(['save-recipe']);

function addIngredient() {
  ingredients.value.push({ name: '', quantity: 1, unit: t('units.piece') });
}

function removeIngredient(index: number) {
  if (ingredients.value.length > 1) {
    ingredients.value.splice(index, 1);
  }
}

function addStep() {
  steps.value.push('');
}

function removeStep(index: number) {
  if (steps.value.length > 1) {
    steps.value.splice(index, 1);
  }
}

function saveRecipe() {
  if (
    recipeName.value.trim() &&
    ingredients.value.every((ing) => ing.name.trim()) &&
    steps.value.every((step) => step.trim())
  ) {
    const recipe = {
      name: recipeName.value,
      description: description.value,
      ingredients: ingredients.value,
      steps: steps.value.filter((step) => step.trim()),
    };

    emit('save-recipe', recipe);

    recipeName.value = '';
    description.value = '';
    ingredients.value = [{ name: '', quantity: 1, unit: t('units.piece') }];
    steps.value = [''];
  }
}
</script>

<template>
  <div class="create-recipe-form p-4 bg-gray-100 rounded-lg">
    <h2 class="text-xl font-semibold mb-3">{{ t('recipe.createNew') }}</h2>
    <v-form @submit.prevent="saveRecipe">
      <v-text-field
        v-model="recipeName"
        :label="t('recipe.recipeName')"
        :placeholder="t('recipe.recipeNamePlaceholder')"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        required></v-text-field>

      <v-textarea
        v-model="description"
        :label="t('recipe.description')"
        :placeholder="t('recipe.descriptionPlaceholder')"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        rows="2"></v-textarea>

      <h3 class="text-lg font-medium mb-2">{{ t('recipe.ingredientsSection') }}</h3>
      <div v-for="(ingredient, index) in ingredients" :key="index" class="mb-2">
        <v-row>
          <v-col cols="5">
            <v-text-field
              v-model="ingredient.name"
              :label="t('recipe.ingredient')"
              :placeholder="t('recipe.ingredientPlaceholder')"
              variant="outlined"
              density="comfortable"
              required></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-text-field
              v-model.number="ingredient.quantity"
              :label="t('recipe.quantity')"
              type="number"
              min="0"
              variant="outlined"
              density="comfortable"
              required></v-text-field>
          </v-col>
          <v-col cols="3">
            <v-select
              v-model="ingredient.unit"
              :items="units"
              :label="t('recipe.unit')"
              variant="outlined"
              density="comfortable"></v-select>
          </v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              color="error"
              @click="removeIngredient(index)"
              :disabled="ingredients.length <= 1">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn prepend-icon="mdi-plus" variant="text" class="mb-4" @click="addIngredient">
        {{ t('recipe.addIngredient') }}
      </v-btn>

      <h3 class="text-lg font-medium mb-2">{{ t('recipe.steps') }}</h3>
      <div v-for="(step, index) in steps" :key="index" class="mb-2">
        <v-row>
          <v-col cols="11">
            <v-textarea
              v-model="steps[index]"
              :label="t('recipe.step', { number: index + 1 })"
              variant="outlined"
              density="comfortable"
              rows="2"
              required></v-textarea>
          </v-col>
          <v-col cols="1" class="d-flex align-center">
            <v-btn
              icon
              variant="text"
              density="comfortable"
              color="error"
              @click="removeStep(index)"
              :disabled="steps.length <= 1">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-btn prepend-icon="mdi-plus" variant="text" class="mb-4" @click="addStep">
        {{ t('recipe.addStep') }}
      </v-btn>

      <v-btn color="primary" type="submit" block class="mt-4"> {{ t('recipe.saveRecipe') }} </v-btn>
    </v-form>
  </div>
</template>
