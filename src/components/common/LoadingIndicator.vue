<script setup lang="ts">
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const props = defineProps<{
  loading: boolean;
  color?: string;
  size?: number;
  width?: number;
  indeterminate?: boolean;
  customClass?: string;
}>();
</script>

<template>
  <div v-if="loading" :class="['loading-container', customClass]">
    <v-progress-circular
      :indeterminate="indeterminate !== false"
      :color="color || 'primary'"
      :size="size || 40"
      :width="width || 4"
      class="d-block mx-auto my-8">
    </v-progress-circular>
  </div>
</template>
