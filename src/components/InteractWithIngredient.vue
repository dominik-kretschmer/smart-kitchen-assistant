<script setup lang="ts">

const props = defineProps({
  recipe: {
    type: Object as () => Recipe | null,
    default: null,
  },
  isEditing: {
    type: Boolean,
    default: false,
  },
});

const { t } = useI18n();
const recipeName = ref('');
const description = ref('');
const ingredients = ref([{ name: '', quantity: 1, unit: t('units.piece') }]);
const steps = ref(['']);
const emit = defineEmits(['save-recipe']);

watch(
  () => props.recipe,
  (newRecipe) => {
    if (newRecipe && props.isEditing) {
      recipeName.value = newRecipe.name;
      steps.value = newRecipe.steps.split('\n\n').filter((step) => step.trim());
      if (steps.value.length === 0) steps.value = [''];
      ingredients.value = newRecipe.recipeIngredients.map((ri) => {
        const amountParts = ri.amount.split(' ');
        const quantity = parseFloat(amountParts[0]) || 1;
        const unit = amountParts.slice(1).join(' ') || t('units.piece');
        return {
          name: ri.ingredient.name,
          quantity,
          unit,
        };
      });
      if (ingredients.value.length === 0) {
        ingredients.value = [{ name: '', quantity: 1, unit: t('units.piece') }];
      }
    }
  },
  { immediate: true },
);

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
    :title="props.isEditing ? t('recipe.editRecipe') : t('recipe.createNew')"
    :submitText="props.isEditing ? t('recipe.updateRecipe') : t('recipe.saveRecipe')"
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
    <v-btn
      prepend-icon="mdi-plus"
      variant="text"
      class="mb-4"
      @click="ingredients.push({ name: '', quantity: 1, unit: t('units.piece') })">
      {{ t('recipe.addIngredient') }}
    </v-btn>
    <h3 class="text-lg font-medium mb-2">{{ t('recipe.steps') }}</h3>
    <div v-for="(step, index) in steps" :key="index" class="mb-2">
      <v-row>
        <v-col cols="11">
          <FormTextField
            v-model="steps[index]"
            :label=" index+1 +'.'+ t('recipe.step')"
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
