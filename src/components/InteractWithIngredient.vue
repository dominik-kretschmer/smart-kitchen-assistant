<script setup lang="ts">
const { t } = useI18n();
const recipeName = ref('');
const description = ref('');
const ingredients = ref([{ name: '', quantity: 1, unit: t('units.piece') }]);
const steps = ref(['']);

const emit = defineEmits(['save-recipe']);

function addIngredient() {
  ingredients.value.push({ name: '', quantity: 1, unit: t('units.piece') });
}

function removeIngredient(index: number) {
  if (ingredients.value.length > 1) {
    ingredients.value.splice(index, 1);
  }
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
  <FormLayout
    :title="t('recipe.createNew')"
    :submitText="t('recipe.saveRecipe')"
    @submit="saveRecipe">
    <FormTextField
      v-model="recipeName"
      :label="t('recipe.recipeName')"
      :placeholder="t('recipe.recipeNamePlaceholder')"
      customClass="mb-3"
      required />

    <FormTextField
      v-model="description"
      :label="t('recipe.description')"
      :placeholder="t('recipe.descriptionPlaceholder')"
      :multiLine="true"
      :rows="2"
      customClass="mb-3" />

    <h3 class="text-lg font-medium mb-2">{{ t('recipe.ingredientsSection') }}</h3>
    <div v-for="(ingredient, index) in ingredients" :key="index" class="mb-2">
      <IngredientForm
        v-model="ingredients[index]"
        :showRemoveButton="ingredients.length > 1"
        @remove="removeIngredient(index)" />
    </div>

    <v-btn prepend-icon="mdi-plus" variant="text" class="mb-4" @click="addIngredient">
      {{ t('recipe.addIngredient') }}
    </v-btn>

    <h3 class="text-lg font-medium mb-2">{{ t('recipe.steps') }}</h3>
    <div v-for="(step, index) in steps" :key="index" class="mb-2">
      <v-row>
        <v-col cols="11">
          <FormTextField
            v-model="steps[index]"
            :label="t('recipe.step', { number: index + 1 })"
            :multiLine="true"
            :rows="2"
            required />
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

    <v-btn prepend-icon="mdi-plus" variant="text" class="mb-4" @click="steps.push('')">
      {{ t('recipe.addStep') }}
    </v-btn>
  </FormLayout>
</template>
