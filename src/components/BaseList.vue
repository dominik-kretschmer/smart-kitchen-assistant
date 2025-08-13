<script setup lang="ts">
const props = defineProps<{
  page: number;
  pageCount: number;
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'update:page', value: number): void;
}>();

function updatePage(val: number) {
  emit('update:page', val);
}
</script>
<template>
  <v-container fluid>
    <v-card>
      <v-card-title class="d-flex align-center justify-space-between" v-if="$slots.title || title">
        <slot name="title">
          <span>{{ title }}</span>
        </slot>
      </v-card-title>
      <v-card-text>
        <slot />
      </v-card-text>
      <v-divider />
      <v-card-actions class="justify-center">
        <v-pagination
          :model-value="page"
          :length="pageCount"
          :total-visible="7"
          @update:modelValue="updatePage"
        />
      </v-card-actions>
    </v-card>
  </v-container>
</template>
