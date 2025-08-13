<script setup lang="ts">
import { defineModel } from 'vue';

const model = defineModel<string | null>({ default: null });
const units = ['g', 'kg', 'ml', 'l', 'piece', 'package', 'tbsp', 'tsp'];
</script>
<template>
  <v-select v-model="model" :items="units" label="Unit" clearable />
</template>
