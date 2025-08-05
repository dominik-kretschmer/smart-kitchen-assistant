import './assets/main.css';

import { createPinia } from 'pinia';
import App from './App.vue';
import { router } from './router/router.ts';
import { createApp } from 'vue';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { i18n } from './i18n';
import { useLanguageStore } from './stores/languageStore';

const vuetify = createVuetify({
  components,
  directives,
});

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router);
app.use(vuetify);
app.use(i18n);

// Initialize language
const languageStore = useLanguageStore(pinia);
languageStore.initLanguage();

app.mount('#app');
