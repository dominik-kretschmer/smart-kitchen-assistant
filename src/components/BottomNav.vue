<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const languageStore = useLanguageStore();
const { t } = useI18n();

const navigationItems = [
  { path: '/', icon: 'mdi-television-play', translationKey: 'navigation.home', color: 'blue-grey' },
  { path: '/recipe', icon: 'mdi-book', translationKey: 'navigation.recipe', color: 'teal' },
  {
    path: '/shoppingList',
    icon: 'mdi-cart',
    translationKey: 'navigation.shopping',
    color: 'brown',
  },
  { path: '/stock', icon: 'mdi-warehouse', translationKey: 'navigation.stock', color: 'indigo' },
  {
    path: '/ingredients',
    icon: 'mdi-food-apple',
    translationKey: 'navigation.ingredients',
    color: 'green',
  },
  { path: '/login', icon: 'mdi-login', translationKey: 'navigation.login', color: 'purple' },
  {
    path: '/register',
    icon: 'mdi-account-plus',
    translationKey: 'navigation.register',
    color: 'deep-orange',
  },
];

const routes = navigationItems.map((item) => item.path);
const activeIndex = computed({
  get: () => routes.indexOf(route.path),
  set: (index: number) => {
    const targetRoute = routes[index];
    if (targetRoute && targetRoute !== route.path) {
      router.replace(targetRoute);
    }
  },
});

const colorMap = new Map(navigationItems.map((item) => [item.path, item.color]));
const currentColor = computed(() => colorMap.get(route.path) ?? 'blue-grey');
</script>

<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation v-model="activeIndex" :bg-color="currentColor" mode="shift">
      <v-btn v-for="item in navigationItems" :key="item.path">
        <v-icon>{{ item.icon }}</v-icon>
        <span>{{ t(item.translationKey) }}</span>
      </v-btn>
      <v-btn @click="languageStore.toggleLanguage()">
        <v-icon>mdi-translate</v-icon>
        <span>{{ t('navigation.language') }}</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
