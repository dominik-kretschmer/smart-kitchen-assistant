<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useLanguageStore } from '../stores/languageStore';
import { useI18n } from '@/i18n';

const route = useRoute();
const router = useRouter();
const languageStore = useLanguageStore();
const { t } = useI18n();
const routes = ['/', '/recipe', '/shoppingList', '/stock', '/ingredients', '/login', '/register'];

const value = computed({
  get: () => routes.indexOf(route.path),
  set: (index: number) => {
    if (routes[index]) {
      router.replace(routes[index]);
    }
  },
});

const color = computed(() => {
  switch (route.path) {
    case '/':
      return 'blue-grey';
    case '/recipe':
      return 'teal';
    case '/shoppingList':
      return 'brown';
    case '/stock':
      return 'indigo';
    case '/ingredients':
      return 'green';
    case '/login':
      return 'purple';
    case '/register':
      return 'deep-orange';
    default:
      return 'blue-grey';
  }
});

const toggleLanguage = () => {
  languageStore.toggleLanguage();
};
</script>

<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation v-model="value" :bg-color="color" mode="shift">
      <v-btn>
        <v-icon>mdi-television-play</v-icon>
        <span>{{ t('navigation.home') }}</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-book</v-icon>
        <span>{{ t('navigation.recipe') }}</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-cart</v-icon>
        <span>{{ t('navigation.shopping') }}</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-warehouse</v-icon>
        <span>{{ t('navigation.stock') }}</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-food-apple</v-icon>
        <span>{{ t('navigation.ingredients') }}</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-login</v-icon>
        <span>{{ t('navigation.login') }}</span>
      </v-btn>
      <v-btn>
        <v-icon>mdi-account-plus</v-icon>
        <span>{{ t('navigation.register') }}</span>
      </v-btn>
      <v-btn @click="toggleLanguage">
        <v-icon>mdi-translate</v-icon>
        <span>{{ languageStore.isGerman ? 'EN' : 'DE' }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
