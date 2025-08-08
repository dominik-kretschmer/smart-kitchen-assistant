<script setup lang="ts" generic="T extends { name: string }">
import { useI18n } from '@/i18n';
import LoadingIndicator from './LoadingIndicator.vue';

const props = defineProps<{
  items: T[];
  loading?: boolean;
  emptyMessage?: string;
  customClass?: string;
}>();

const emit = defineEmits<{
  edit: [item: T];
  delete: [item: T];
  view: [item: T];
}>();

const { t } = useI18n();

function editItem(item: T) {
  emit('edit', item);
}

function deleteItem(item: T) {
  emit('delete', item);
}

function viewItem(item: T) {
  emit('view', item);
}
</script>

<template>
  <div :class="['item-list', customClass]">
    <LoadingIndicator :loading="loading || false" />

    <div v-if="!loading">
      <v-list v-if="items.length > 0" class="bg-transparent">
        <v-list-item v-for="(item, index) in items" :key="index">
          <slot name="item" :item="item">
            <v-list-item-title>{{ item.name }}</v-list-item-title>
            <v-list-item-subtitle>
              <slot name="subtitle" :item="item"></slot>
            </v-list-item-subtitle>
          </slot>

          <div class="d-flex">
            <slot
              name="actions"
              :item="item"
              :edit="editItem"
              :delete="deleteItem"
              :view="viewItem">
              <v-btn variant="text" color="white" @click="editItem(item)">
                {{ t('common.edit') }}
              </v-btn>
              <v-btn variant="text" color="white" @click="deleteItem(item)">
                {{ t('common.delete') }}
              </v-btn>
            </slot>
          </div>
        </v-list-item>
      </v-list>
      <p v-else class="text-center py-4 text-gray-500">
        {{ emptyMessage || t('common.noItems') }}
      </p>
    </div>
  </div>
</template>
